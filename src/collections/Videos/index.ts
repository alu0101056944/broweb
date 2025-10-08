import type { CollectionConfig } from 'payload'

import { authenticated } from '../../access/authenticated'

export const Videos: CollectionConfig = {
  slug: 'videos',
  access: {
    read: () => true,
    create: authenticated,
    delete: authenticated,
    update: authenticated,
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
