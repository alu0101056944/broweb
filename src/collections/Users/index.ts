import type { CollectionConfig } from 'payload'

import { authenticated } from '../../access/authenticated'

export const Users: CollectionConfig = {
  slug: 'users',
  access: {
    admin: authenticated,
    create: authenticated,
    delete: authenticated,
    read: authenticated,
    update: authenticated,
  },
  admin: {
    defaultColumns: ['name', 'email'],
    useAsTitle: 'email',
  },
  auth: {
    cookies: {
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'None': 'Lax',
    }
  },
  fields: [
    {
      name: 'name',
      type: 'text',
    },
    {
      name: 'role',
      type: 'select',
      options: [
        { label: 'Admin', value: 'admin' },
        { label: 'User', value: 'user' },
      ],
      defaultValue: 'user',
      required: true,
      // TODO remove comments after all admins have account
      // access: {
      //   create: ({ req }) => req.user?.role === 'admin',
      //   read: () => true,
      //   update: ({ req }) => req.user?.role === 'admin'
      // },
      // admin: {
      //   condition: ({ user }) => user.role === 'admin'
      // }
    }
  ],
  timestamps: true,
}
