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
    defaultColumns: ['videoUrl', 'description', 'priority', 'updatedAt'],
    useAsTitle: 'description',
  },
  fields: [
    {
      name: 'videoUrl',
      type: 'text',
      required: true,
      unique: true,
    },
    {
      name: 'description',
      type: 'textarea',
    },
    {
      name: 'priority',
      label: 'Priority (Optional)',
      type: 'number',
      required: false, 
      defaultValue: 9999, // Set a high default for "no priority"
      admin: {
        description: 'Lower numbers appear first. Leave blank to send to the end of the list.',
        // HIGHLIGHT: A placeholder guides the user to leave it empty
        placeholder: 'ejemplo: 1, 2, 3...',
        step: 1,
        position: 'sidebar',
      },
    }
  ],
  timestamps: true,
}
