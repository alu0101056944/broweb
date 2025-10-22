// src/globals/ContactContent.tsx

import { GlobalConfig } from 'payload'

import { TextPage, addRemoteImageDimensions } from '../TextPage/TextPage'

export const ContactContent: GlobalConfig = {
  slug: 'contact-content',
  access: {
    read: () => true,
  },
  hooks: {
    beforeChange: [addRemoteImageDimensions],
  },
  fields: [TextPage],
}
