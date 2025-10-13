// src/globals/ContactContent.tsx

import { GlobalConfig } from 'payload'

import {
  BoldFeature,
  ItalicFeature,
  UnderlineFeature,
  StrikethroughFeature,
  UnorderedListFeature,
  OrderedListFeature,
} from '@payloadcms/richtext-lexical'

import { lexicalEditor } from '@payloadcms/richtext-lexical'

export const ContactContent: GlobalConfig = {
  slug: 'contact-content',

  access: {
    read: () => true,
  },
  fields:  [
    {
      name: 'content',
      label: 'Formated text, images, other content for the "Contact" Page',
      type: 'richText',
      editor: lexicalEditor({
        admin: {
          placeholder: 'Escribir aquí el contenido a mostrar...'
        },
        features: ({ defaultFeatures }) => [
          ...defaultFeatures,
          BoldFeature(),
          ItalicFeature(),
          UnderlineFeature(),
          StrikethroughFeature(),
          UnorderedListFeature(),
          OrderedListFeature(),
        ],
      }),
    },
  ]
}
