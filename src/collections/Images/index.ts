import type { CollectionConfig, CollectionBeforeChangeHook } from 'payload'

import sharp from 'sharp'

export interface ImageType {
  imageUrl: string
  description: string
  imageWidth: number
  imageHeight: number
  priority: number
}

export const addRemoteImageDimensions: CollectionBeforeChangeHook = async ({ data, req }) => {
  try {
    const response = await fetch(data.imageUrl)

    if (!response.ok) {
      throw new Error(`Failed to fetch image. Status: ${response.status}`)
    }

    const imageBuffer = Buffer.from(await response.arrayBuffer())
    const metadata = await sharp(imageBuffer).metadata()

    return {
      ...data,
      dimensions: {
        width: metadata.width,
        height: metadata.height,
      },
    }
  } catch (error) {
    if (error instanceof Error) {
      req.payload.logger.error(
        `[Images Collection Hook] Error getting dimensions for ${data.imageUrl}: ${error.message}`,
      )
    }

    return {
      ...data,
      dimensions: {
        width: null,
        height: null,
      },
    }
  }
}

export const Images: CollectionConfig = {
  slug: 'images',
  access: {
    read: () => true,
    create: ({ req: { user } }) => {
      if (user && user.role === 'admin') {
        return true
      }
      return false
    },
    update: ({ req: { user } }) => {
      if (user && user.role === 'admin') {
        return true
      }
      return false
    },
    delete: ({ req: { user } }) => {
      if (user && user.role === 'admin') {
        return true
      }
      return false
    },
  },
  defaultSort: 'order',
  admin: {
    defaultColumns: [
      'imageUrl',
      'description',
      'imageWidth',
      'imageHeight',
      'priority',
      'updatedAt',
    ],
    useAsTitle: 'description',
  },
  fields: [
    {
      name: 'imageUrl',
      label: 'Image URL',
      type: 'text',
      defaultValue: '',
    },
    {
      name: 'description',
      label: 'Description',
      type: 'textarea',
    },
    {
      name: 'changeImageDimensions',
      label: 'Change Image Dimensions',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        description:
          'When this is set the final image dimensions are changed to the' +
          ' new specified.' +
          'If left off the image dimensions are the original image dimensions extracted from the' +
          ' image URL.',
      },
    },
    {
      name: 'imageWidth',
      label: 'Image Width',
      type: 'number',
      min: 0,
      admin: {
        condition: (_, siblingData) => siblingData.changeImageDimensions === true,
      },
    },
    {
      name: 'imageHeight',
      label: 'Image Height',
      type: 'number',
      min: 0,
      admin: {
        condition: (_, siblingData) => siblingData.changeImageDimensions === true,
      },
    },
    {
      name: 'dimensions',
      label: 'Detected Image Dimensions',
      type: 'group',
      fields: [
        {
          name: 'width',
          label: 'Width',
          type: 'number',
          admin: {
            readOnly: true,
          },
        },
        {
          name: 'height',
          label: 'Height',
          type: 'number',
          admin: {
            readOnly: true,
          },
        },
      ],
    },
    {
      name: 'priority',
      label: 'Priority (Optional)',
      type: 'number',
      required: false,
      defaultValue: 9999, // Set a high default for "no priority"
      admin: {
        description: 'Lower numbers appear first. Leave blank to send to the end of the list.',
        placeholder: 'Examples: 1, 2, 3...',
        step: 1,
        position: 'sidebar',
      },
    },
  ],
  timestamps: true,
  hooks: {
    beforeChange: [addRemoteImageDimensions],
  },
}
