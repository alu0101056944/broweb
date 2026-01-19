import { GlobalConfig } from 'payload'

import { authenticated } from '../access/authenticated'

import { TextPage, addRemoteImageDimensions } from '../TextPage/TextPage'

export const HomeContent: GlobalConfig = {
  slug: 'home',
  access: {
    read: () => true,
    update: authenticated,
  },
  admin: {
    group: 'Static Pages',
    components: {
      elements: {
        Description: './components/HomeInfo/HomeInfo.tsx#default',
      },
    },
  },
  hooks: {
    beforeChange: [addRemoteImageDimensions],
  },
  fields: [TextPage],
}
