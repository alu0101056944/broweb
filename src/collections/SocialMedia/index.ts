import { CollectionConfig, CollectionBeforeChangeHook } from 'payload'
import { authenticated } from '../../access/authenticated'

import sharp from 'sharp'

export const addRemoteImageDimensions: CollectionBeforeChangeHook = async ({ data, req }) => {
  try {
    const response = await fetch(data.iconUrl)

    if (!response.ok) {
      throw new Error(`Failed to fetch image. Status: ${response.status}`)
    }

    const imageBuffer = Buffer.from(await response.arrayBuffer())
    const metadata = await sharp(imageBuffer).metadata()

    return {
      ...data,
      imageDimensions: {
        width: metadata.width,
        height: metadata.height,
      },
    }
  } catch (error) {
    if (error instanceof Error) {
      req.payload.logger.error(
        `[SocialMedia Hook] Error getting dimensions for ${data.iconUrl}: ${error.message}`,
      )
    }

    return {
      ...data,
      imageDimensions: {
        width: null,
        height: null,
      },
    }
  }
}

export const SocialMedia: CollectionConfig = {
  slug: 'socialmedia',
  access: {
    create: authenticated,
    delete: authenticated,
    read: () => true,
    update: authenticated,
  },
  defaultPopulate: {
    slug: true,
  },
  labels: {
    singular: 'Social Media',
    plural: 'Social Media',
  },
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'url', 'iconUrl', 'priority'],
    components: {
      Description: './components/SocialMediaInfo/SocialMediaInfo.tsx#default',
    },
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      label: 'Name',
      required: true,
      admin: {
        description:
          'Name to show up as the text that shows up when the mouse is on top of the icon.',
      },
    },
    {
      name: 'url',
      type: 'text',
      label: 'URL',
      required: true,
      admin: {
        description: 'URL to go to when clicking the icon.',
      },
    },
    {
      name: 'iconUrl',
      type: 'text',
      label: 'Icon URL',
      required: true,
      admin: {
        description: 'URL of the image to be used as icon.',
      },
    },
    {
      name: 'redimensionIcon',
      type: 'checkbox',
      label: 'Redimension Icon',
      defaultValue: false,
      admin: {
        description: 'To force a change in size of the image url used for the icon.',
      },
    },
    {
      name: 'redimensionWidth',
      type: 'number',
      label: 'Width (px)',
      min: 0,
      admin: {
        description: 'New width of the icon (in pixels).',
        condition: (_, sibilingData) => sibilingData.redimensionIcon === true,
      },
    },
    {
      name: 'redimensionHeight',
      type: 'number',
      label: 'Height (px)',
      min: 0,
      admin: {
        description: 'New height of the icon.',
        condition: (_, sibilingData) => sibilingData.redimensionIcon === true,
      },
    },
    {
      name: 'priority',
      label: 'Priority (Optional)',
      type: 'number',
      required: false,
      defaultValue: 9999, // Set a high default for "no priority"
      admin: {
        description: 'Lower numbers appear first. Leave blank to send to the end of the list.',
        placeholder: 'ejemplo: 1, 2, 3...',
        step: 1,
        position: 'sidebar',
      },
    },
    {
      name: 'imageDimensions',
      type: 'group',
      label: 'Icon Image Dimensions (auto-populated)',
      admin: {
        readOnly: true,
        description: 'Actual width and height are automatically detected and saved on publish.',
      },
      fields: [
        {
          name: 'width',
          type: 'number',
        },
        {
          name: 'height',
          type: 'number',
        },
      ],
    },
  ],
  hooks: {
    beforeChange: [addRemoteImageDimensions],
  },
}
