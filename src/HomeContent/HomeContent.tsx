// src/globals/ContactContent.tsx

import { GlobalConfig } from 'payload'

import { TextPage, addRemoteImageDimensions } from '../TextPage/TextPage'

export const HomeContent: GlobalConfig = {
  slug: 'home',
  access: {
    read: () => true,
  },
  hooks: {
    beforeChange: [addRemoteImageDimensions],
  },
  fields: [TextPage],
}
