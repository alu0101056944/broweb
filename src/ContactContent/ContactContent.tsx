// src/globals/ContactContent.tsx

import { GlobalConfig, Block } from 'payload'

import {
  BoldFeature,
  ItalicFeature,
  UnderlineFeature,
  StrikethroughFeature,
  UnorderedListFeature,
  OrderedListFeature,
} from '@payloadcms/richtext-lexical'

import { lexicalEditor } from '@payloadcms/richtext-lexical'

const RichTextBlock: Block = {
  slug: 'richTextBlock',
  interfaceName: 'RichTextBlock',
  fields: [
    {
      name: 'richText',
      type: 'richText',
      editor: lexicalEditor({
        admin: {
          placeholder: 'Escribir aquí el contenido a mostrar...',
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
  ],
}

const ImageBlock: Block = {
  slug: 'imageBlock',
  interfaceName: 'ImageBlock',
  fields: [
    {
      name: 'imageUrl',
      label: 'Image URL',
      type: 'text',
      required: true,
    },
    {
      name: 'altText',
      label: 'Alt Text',
      type: 'text',
      required: true,
      admin: {
        description: 'Describe the image for screen readers and SEO.'
      }
    },
    {
      name: 'width',
      label: 'Width of the image. Leave at -1 not to specify.',
      type: 'number',
      required: false,
      defaultValue: -1,
      admin: {
        description: 'If not specified the width will be as big as possible within it\'s container.',
        placeholder: 'ejemplo: 128, 200, 764...',
        step: 1,
        position: 'sidebar',
      }
    },
    {
      name: 'height',
      label: 'Height of the image. Leave at -1 not to specify.',
      type: 'number',
      required: false,
      defaultValue: -1,
      admin: {
        description: 'If not specified the height will be as big as possible within it\'s container.',
        placeholder: 'ejemplo: 480, 501, 652...',
        step: 1,
        position: 'sidebar',
      }
    },
    {
      name: 'alignment',
      label: 'Image Alignment',
      type: 'select',
      defaultValue: 'center',
      options: [
        {
          label: 'Left',
          value: 'left',
        },
        {
          label: 'Center',
          value: 'center',
        },
        {
          label: 'Right',
          value: 'right',
        },
      ],
      admin: {
        position: 'sidebar',
        description: 'Choose how to align the image within the content column.',
      }
    },
  ],
}

const TextWithImageBlock: Block = {
  slug: 'textWithImageBlock',
  interfaceName: 'textWithImageBlock',
  fields: [
    {
      name: 'imageUrl',
      label: 'Image URL',
      type: 'text',
      required: true,
    },
    {
      name: 'altText',
      label: 'Alt Text',
      type: 'text',
      required: true,
      admin: {
        description: 'Describe the image for screen readers and SEO.'
      }
    },
    {
      name: 'width',
      label: 'Width of the image',
      type: 'number',
      required: false,
      defaultValue: -1,
      admin: {
        description: 'If not specified the width will be as big as possible within it\'s container.',
        placeholder: 'ejemplo: 128, 200, 764...',
        step: 1,
        position: 'sidebar',
      }
    },
    {
      name: 'height',
      label: 'Height of the image',
      type: 'number',
      required: false,
      defaultValue: -1,
      admin: {
        description: 'If not specified the height will be as big as possible within it\'s container.',
        placeholder: 'ejemplo: 480, 501, 652...',
        step: 1,
        position: 'sidebar',
      }
    },
    {
      name: 'alignment',
      label: 'Image Alignment',
      type: 'select',
      defaultValue: 'center',
      options: [
        {
          label: 'Left',
          value: 'left',
        },
        {
          label: 'Right',
          value: 'right',
        },
      ],
      admin: {
        position: 'sidebar',
        description: 'Choose how to align the image relative to the text.',
      }
    },
    {
      name: 'richText',
      type: 'richText',
      editor: lexicalEditor({
        admin: {
          placeholder: 'Escribir aquí el contenido a mostrar...',
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
  ],
}


export const ContactContent: GlobalConfig = {
  slug: 'contact-content',

  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'content',
      label: 'Page Content',
      type: 'blocks',
      minRows: 1,
      blocks: [
        RichTextBlock,
        ImageBlock,
        TextWithImageBlock,
      ],
    },
  ],
}
