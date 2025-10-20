import { Block, Field, Validate } from 'payload'

export interface TextWithVideo {
  videoUrl: string
  isShort: boolean
  shortScale: number
  videoWidth: number
  videoHeight: number
  videoAlignment: string
  description: string
}

import {
  BoldFeature,
  ItalicFeature,
  UnderlineFeature,
  StrikethroughFeature,
  UnorderedListFeature,
  OrderedListFeature,
  AlignFeature,
  FixedToolbarFeature,
  IndentFeature,
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
          AlignFeature(),
          FixedToolbarFeature(),
          IndentFeature(),
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
        description: 'Describe the image for screen readers and SEO.',
      },
    },
    {
      name: 'width',
      label: 'Width of the image. Leave at -1 not to specify.',
      type: 'number',
      required: false,
      defaultValue: -1,
      admin: {
        description: "If not specified the width will be as big as possible within it's container.",
        placeholder: 'ejemplo: 128, 200, 764...',
        step: 1,
        position: 'sidebar',
      },
    },
    {
      name: 'height',
      label: 'Height of the image. Leave at -1 not to specify.',
      type: 'number',
      required: false,
      defaultValue: -1,
      admin: {
        description:
          "If not specified the height will be as big as possible within it's container.",
        placeholder: 'ejemplo: 480, 501, 652...',
        step: 1,
        position: 'sidebar',
      },
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
      },
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
        description: 'Describe the image for screen readers and SEO.',
      },
    },
    {
      name: 'width',
      label: 'Width of the image',
      type: 'number',
      required: false,
      defaultValue: -1,
      admin: {
        description: "If not specified the width will be as big as possible within it's container.",
        placeholder: 'ejemplo: 128, 200, 764...',
        step: 1,
        position: 'sidebar',
      },
    },
    {
      name: 'height',
      label: 'Height of the image',
      type: 'number',
      required: false,
      defaultValue: -1,
      admin: {
        description:
          "If not specified the height will be as big as possible within it's container.",
        placeholder: 'ejemplo: 480, 501, 652...',
        step: 1,
        position: 'sidebar',
      },
    },
    {
      name: 'alignment',
      label: 'Image Alignment',
      type: 'select',
      defaultValue: 'right',
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
      },
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
          AlignFeature(),
          FixedToolbarFeature(),
          IndentFeature(),
        ],
      }),
    },
  ],
}

const TextWithVideo: Block = {
  slug: 'textWithVideo',
  interfaceName: 'textWithVideo',
  fields: [
    {
      name: 'videoUrl',
      type: 'text',
      label: 'Video URL',
      required: true,
    },
    {
      name: 'isShort',
      label: "It's a shorts video.",
      type: 'checkbox',
      defaultValue: false,
    },
    {
      name: 'shortScale',
      label: 'Display scale for the short. 100 is default.',
      type: 'number',
      defaultValue: 100,
      admin: {
        condition: (data, siblingData: Partial<TextWithVideo>) => siblingData.isShort === true,
        description: 'If not specified the scale will be 100% also known' + ' as default.',
        placeholder: 'ejemplo: 100, 200, 150...',
        step: 1,
        position: 'sidebar',
      },
    },
    {
      name: 'videoWidth',
      label: 'Width of the image',
      type: 'number',
      defaultValue: -1,
      admin: {
        condition: (data, siblingData: Partial<TextWithVideo>) => siblingData.isShort === false,
        description: "If not specified the width will be as big as possible within it's container.",
        placeholder: 'ejemplo: 128, 200, 764...',
        step: 1,
        position: 'sidebar',
      },
    },
    {
      name: 'videoHeight',
      label: 'Height of the image',
      type: 'number',
      defaultValue: -1,
      admin: {
        condition: (data, siblingData: Partial<TextWithVideo>) => siblingData.isShort === false,
        description:
          "If not specified the height will be as big as possible within it's container.",
        placeholder: 'ejemplo: 480, 501, 652...',
        step: 1,
        position: 'sidebar',
      },
    },
    {
      name: 'videoAlignment',
      label: 'Video Alignment',
      type: 'select',
      defaultValue: 'right',
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
        description: 'Choose how to align the video relative to the text.',
      },
    },
    {
      name: 'description',
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
          AlignFeature(),
          FixedToolbarFeature(),
          IndentFeature(),
        ],
      }),
    },
  ],
}

export const TextPage: Field = {
  name: 'content',
  label: 'Page Content',
  type: 'blocks',
  minRows: 1,
  blocks: [RichTextBlock, ImageBlock, TextWithImageBlock, TextWithVideo],
}
