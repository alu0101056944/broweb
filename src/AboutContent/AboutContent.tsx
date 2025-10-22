// src/globals/AboutContent.tsx

import { GlobalConfig } from 'payload'

import { TextPage, addRemoteImageDimensions } from '../TextPage/TextPage'

export const AboutContent: GlobalConfig = {
  slug: 'about-content',
  access: {
    read: () => true,
  },
  hooks: {
    beforeChange: [addRemoteImageDimensions],
  },
  fields: [TextPage],
}
