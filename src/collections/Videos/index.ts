import type { CollectionConfig } from 'payload'

import { authenticated } from '../../access/authenticated'

export const Videos: CollectionConfig = {
  slug: 'videos',
  access: {
    create: authenticated,
    delete: authenticated,
    read: authenticated,
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
