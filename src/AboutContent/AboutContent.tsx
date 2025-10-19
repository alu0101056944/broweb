// src/globals/AboutContent.tsx

import { GlobalConfig } from 'payload'

import { TextPage } from '../TextPage/TextPage'

export const AboutContent: GlobalConfig = {
  slug: 'about-content',
  access: {
    read: () => true,
  },
  fields: [
    TextPage,
  ],
}
