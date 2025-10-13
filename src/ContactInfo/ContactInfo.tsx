// src/globals/ContactInfo.ts

import { GlobalConfig } from 'payload'

export const ContactInfo: GlobalConfig = {
  slug: 'contact-info',
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'email',
      label: 'Public Contact Email',
      type: 'email',
      required: true,
      admin: {
        description: 'This email address will be displayed on the contact page.',
      },
    },

  ],
}
