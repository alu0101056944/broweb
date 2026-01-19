import { GlobalConfig, GlobalBeforeChangeHook } from 'payload'

import { authenticated } from '../access/authenticated'

import { TextPage, ContentBlockType } from '../TextPage/TextPage'

import sharp from 'sharp'

export const addRemoteImageDimensions: GlobalBeforeChangeHook = async ({ data, req }) => {
  if (!data.textpageContent) {
    return data
  }

  const updated_data = await Promise.all(
    data.textpageContent.map(async (block: ContentBlockType) => {
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
    content: { textpageContent: updated_data },
  }
}

export const HomeContent: GlobalConfig = {
  slug: 'home',
  access: {
    read: () => true,
    update: authenticated,
  },
  admin: {
    group: 'Static Pages',
    components: {
      elements: {
        Description: './components/HomeInfo/HomeInfo.tsx#default',
      },
    },
  },
  hooks: {
    beforeChange: [addRemoteImageDimensions],
  },
  fields: [TextPage],
}
