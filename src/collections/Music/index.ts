import type { CollectionConfig, Validate } from 'payload'

export interface MusicType {
  videoUrl: string;
  description: string;
  priority: number;
  useThumbnailUrl?: boolean;
  thumbnailUrl?: string;
}

const overrideThumbnailUrlValidator: Validate<string, MusicType> = (value, { data }) => {
  if (data.useThumbnailUrl === true && !value) {
    return 'Custom thumbnail Url is required when the override is enabled.';
  }
  return true;
};

export const Music: CollectionConfig = {
  slug: 'music',
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
  defaultSort: 'order',
  admin: {
    defaultColumns: ['videoUrl', 'description', 'thumbnailUrl', 'priority', 'updatedAt'],
    useAsTitle: 'description',
    // components: {
    //   views: {
    //     list: {
    //       Component: '../../components/DraggableMusicList'
    //     }
    //   },
    // },
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
        condition: (data: Partial<MusicType>) => data.useThumbnailUrl === true,
        description: 'Set a custom thumbnail URL. If disabled, youtube\'s thumbnail Url is used.'
      },
      validate: overrideThumbnailUrlValidator,
    }
  ],
  // hooks: {
  //   beforeChange: [
  //     async ({ data, req, operation }) => {
  //       if (operation === 'create') {
  //         if (!data.priority) {
  //           // Find the highest existing priority number in the 'music' collection
  //           const { docs } = await req.payload.find({
  //             collection: 'music',
  //             sort: 'priority',
  //             limit: 1,
  //           });
  //           const highestPriority = docs[0]?.priority || 0; // highest priority = least important
  //           data.priority = highestPriority + 1;
  //         }
  //       }
  //       return data;
  //     },
  //   ],
  // },
  timestamps: true,
}
