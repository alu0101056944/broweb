// src/globals/ContactContent.tsx

import { GlobalConfig } from 'payload'

import { TextPage } from '../TextPage/TextPage'

export const HomeContent: GlobalConfig = {
  slug: 'home',
  access: {
    read: () => true,
  },
  fields: [
    TextPage,
  ],
}
