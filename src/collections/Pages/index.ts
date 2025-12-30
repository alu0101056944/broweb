import type { CollectionConfig, CollectionBeforeChangeHook } from 'payload'

import sharp from 'sharp'

import { authenticated } from '../../access/authenticated'
import { authenticatedOrPublished } from '../../access/authenticatedOrPublished'
import { slugField } from '@/fields/slug'
import { populatePublishedAt } from '../../hooks/populatePublishedAt'

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
    defaultColumns: ['pageTitle', 'pageName', 'updatedAt'],
    useAsTitle: 'pageTitle',
    hidden: false,
  },
  fields: [
    {
      name: 'pageTitle',
      type: 'text',
      required: true,
      admin: {
        description:
          "Name to show in the menu of the webpage and also as part of the browser's tab text. ",
      },
    },
    {
      name: 'pageName',
      type: 'text',
      required: true,
      admin: {
        description:
          'Name of the web path to enter the page. ' +
          'For "shop-royalties" it would be accessed via "https://davidjbarrios.com/shop-royalties/". ' +
          'All in lowercase, no accents, use "-" instead of whitespace.' +
          'Examples: "shop-royalties", "blog", "3d-animations".',
      },
    },
    {
      name: 'pageType',
      type: 'select',
      required: true,
      defaultValue: 'blockPage',
      options: [
        {
          label: 'BlockPage',
          value: 'blockPage',
        },
        {
          label: 'VideoGridPage',
          value: 'videoGridPage',
        },
      ],
      admin: {
        description:
          'Either block based made up of a sequence of blocks like textWithVideo or textWithHtml ' +
          'or a video grid selected from the music or video collections.',
      },
    },
    {
      name: 'priority',
      label: 'Priority (Optional)',
      type: 'number',
      required: false,
      defaultValue: 9999, // Set a high default for "no priority"
      admin: {
        description: 'Lower numbers appear first in the menu.',
        placeholder: 'ejemplo: 1, 2, 3...',
        step: 1,
        position: 'sidebar',
      },
    },
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Content',
          fields: [TextPage],
          admin: {
            condition: (_, siblingData) => siblingData?.pageType === 'blockPage',
          },
        },
        {
          label: 'Media to include',
          fields: [
            {
              name: 'mediaItems',
              label: 'Select Videos or Music',
              type: 'relationship',
              relationTo: ['videos', 'music'],
              hasMany: true,
              required: true,
              admin: {
                description: 'Select the videos to display.',
              },
            },
          ],
          admin: {
            condition: (_, siblingData) => siblingData?.pageType === 'videoGridPage',
          },
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
