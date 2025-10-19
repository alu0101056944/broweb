// src/globals/ContactContent.tsx

import { GlobalConfig } from 'payload'

import { TextPage } from '../TextPage/TextPage'

export const ContactContent: GlobalConfig = {
  slug: 'contact-content',

  access: {
    read: () => true,
  },
  fields: [
    TextPage,
  ],
}
