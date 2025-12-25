import { BeforeSync } from '@payloadcms/plugin-search/types'

export const beforeSyncWithSearch: BeforeSync = async ({ originalDoc, searchDoc }) => {
  const { slug, title, meta } = originalDoc

  return {
    ...searchDoc,
    slug,
    meta: {
      ...meta,
      title: meta?.title || title,
      description: meta?.description,
    },
  }
}
