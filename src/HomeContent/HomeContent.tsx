import { GlobalConfig } from 'payload'

import { TextPage, addRemoteImageDimensions } from '../TextPage/TextPage'

export const HomeContent: GlobalConfig = {
  slug: 'home',
  access: {
    read: () => true,
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
