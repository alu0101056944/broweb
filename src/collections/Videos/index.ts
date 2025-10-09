import type { CollectionConfig } from 'payload'

// import { authenticated } from '../../access/authenticated'

export const Videos: CollectionConfig = {
  slug: 'videos',
  access: {
    read: () => true,
    create: ({ req: { user }}) => {
      if (user && user.role === 'admin') {
        return true
      }
      return false
    },
    update: ({ req: { user }}) => {
      if (user && user.role === 'admin') {
        return true
      }
      return false
    },
    delete: ({ req: { user }}) => {
      if (user && user.role === 'admin') {
        return true
      }
      return false
    },
  },
  admin: {
    defaultColumns: ['videoId', 'description', 'thumbnailUrl', 'updatedAt'],
    useAsTitle: 'description',
  },
  fields: [
    {
      name: 'videoId',
      type: 'text',
      required: true,
      unique: true,
    },
    {
      name: 'thumbnailUrl',
      type: 'text',
    },
    {
      name: 'description',
      type: 'textarea',
    },
  ],
  timestamps: true,
}
