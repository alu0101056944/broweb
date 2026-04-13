import type { CollectionConfig } from 'payload'

export interface ImageType {
  imageUrl: string
  description: string
  imageWidth: number
  imageHeight: number
  priority: number
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
      label: 'Image Url',
      type: 'text',
      defaultValue: '',
    },
    {
      name: 'description',
      type: 'textarea',
    },
    {
      name: 'imageWidth',
      type: 'number',
      min: 0,
    },
    {
      name: 'imageHeight',
      type: 'number',
      min: 0,
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
}
