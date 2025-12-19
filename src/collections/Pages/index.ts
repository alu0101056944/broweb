import type { CollectionConfig, CollectionBeforeChangeHook } from 'payload'

import sharp from 'sharp'

import { authenticated } from '../../access/authenticated'
import { authenticatedOrPublished } from '../../access/authenticatedOrPublished'
import { slugField } from '@/fields/slug'
import { populatePublishedAt } from '../../hooks/populatePublishedAt'

// Import your custom definitions from the previous step
// Make sure this path points to where you saved the block definitions
import { TextPage, ContentBlockType } from '../../TextPage/TextPage'

export const addRemoteImageDimensions: CollectionBeforeChangeHook = async ({ data, req }) => {
  if (!data.content) {
    return data
  }

  const updated_data = await Promise.all(
    data.content.map(async (block: ContentBlockType) => {
      if (
        (block.blockType === 'textWithImageBlock' || block.blockType === 'imageBlock') &&
        block.imageUrl
      ) {
        try {
          const response = await fetch(block.imageUrl)

          if (!response.ok) {
            throw new Error(`Failed to fetch image. Status: ${response.status}`)
          }

          const imageBuffer = Buffer.from(await response.arrayBuffer())
          const metadata = await sharp(imageBuffer).metadata()

          return {
            ...block,
            imageDimensions: {
              width: metadata.width,
              height: metadata.height,
            },
          }
        } catch (error) {
          if (error instanceof Error) {
            req.payload.logger.error(
              `[TextWithImage Hook] Error getting dimensions for ${data.imageUrl}: ${error.message}`,
            )
          }

          return {
            ...block,
            imageDimensions: {
              width: null,
              height: null,
            },
          }
        }
      }
      return block
    }),
  )

  return {
    ...data,
    content: updated_data,
  }
}

export const Pages: CollectionConfig<'pages'> = {
  slug: 'pages',
  access: {
    create: authenticated,
    delete: authenticated,
    read: authenticatedOrPublished,
    update: authenticated,
  },
  defaultPopulate: {
    slug: true,
  },
  admin: {
    defaultColumns: ['pageTitle', 'updatedAt'],
    useAsTitle: 'pageName',
    hidden: false,
  },
  fields: [
    {
      name: 'pageName',
      type: 'text',
      required: true,
      admin: {
        description:
          'Es el nombre de la ruta usada para entrar a la página. ' +
          'Si es "shop-royalties entonces se accedería por "https://davidjbarrios.com/shop-royalties/". ' +
          'En inglés para mantener consistencia. Todo en minúsculas, sin tildes y separar espacios con -.' +
          'Ejemplos: "shop-royalties", "blog", "3d-animations".',
      },
    },
    {
      name: 'pageTitle',
      type: 'text',
      required: true,
      admin: {
        description:
          'Nombre a mostrar en el menú de la página y como parte del título en la pestaña ' +
          'del navegador.',
      },
    },
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Content',
          fields: [TextPage],
        },
      ],
    },
    {
      name: 'publishedAt',
      type: 'date',
      admin: {
        position: 'sidebar',
      },
    },
    ...slugField(),
  ],
  hooks: {
    beforeChange: [populatePublishedAt, addRemoteImageDimensions],
  },
  versions: {
    drafts: {
      autosave: {
        interval: 100,
      },
      schedulePublish: true,
    },
    maxPerDoc: 50,
  },
}
