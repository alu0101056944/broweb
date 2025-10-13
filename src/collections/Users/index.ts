import type { CollectionConfig } from 'payload'

import { authenticated } from '../../access/authenticated'

const ROLES = {
  ADMIN: 'admin',
  USER: 'user',
} as const;

export const Users: CollectionConfig = {
  slug: 'users',
  access: {
    admin: ({ req: { user } }) => user?.role === ROLES.ADMIN,
    create: authenticated,
    delete: ({ req: { user } }) => user?.role === ROLES.ADMIN,
    read: authenticated,
    update: authenticated,
  },
  admin: {
    defaultColumns: ['name', 'email', 'role'],
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
        { label: 'Admin', value: ROLES.ADMIN },
        { label: 'User', value: ROLES.USER },
      ],
      defaultValue: ROLES.USER,
      required: true,
      access: {
        create: ({ req }) => req.user?.role === ROLES.ADMIN,
        update: ({ req }) => req.user?.role === ROLES.ADMIN,
        read: () => true,
      },

      admin: {
        condition: ({ user }) => user.role === ROLES.ADMIN,
        position: 'sidebar',
      },
    },
  ],
  timestamps: true,
}
