import type { CollectionConfig, Validate } from 'payload'

export interface VideoType {
  videoUrl: string;
  description: string;
  priority: number;
  useThumbnailUrl?: boolean;
  thumbnailUrl?: string;
}

const overrideThumbnailUrlValidator: Validate<string, VideoType> = (value, { data }) => {
  if (data.useThumbnailUrl === true && !value) {
    return 'Custom thumbnail Url is required when the override is enabled.';
  }
  return true;
};

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
    defaultColumns: ['videoUrl', 'description', 'thumbnailUrl', 'priority', 'updatedAt'],
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
        placeholder: 'ejemplo: 1, 2, 3...',
        step: 1,
        position: 'sidebar',
      },
    },
    {
      name: 'useThumbnailUrl',
      label: 'Use custom thumbnail URL',
      type: 'checkbox',
      defaultValue: false,
    },
    {
      name: 'thumbnailUrl',
      label: 'Custom thumbnail Url',
      type: 'text',
      defaultValue: '',
      admin: {
        condition: (data: Partial<VideoType>) => data.useThumbnailUrl === true,
        description: 'Set a custom thumbnail URL. If disabled, youtube\'s thumbnail Url is used.'
      },
      validate: overrideThumbnailUrlValidator,
    }
  ],
  timestamps: true,
}
