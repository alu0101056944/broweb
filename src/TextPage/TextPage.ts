import { Block, Field, GlobalBeforeChangeHook } from 'payload'

import sharp from 'sharp'

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

import type { SerializedEditorState } from '@payloadcms/richtext-lexical/lexical'

import { VideoType } from '../collections/Videos'
import { MusicType } from '../collections/Music'

export type MediaGridBlockType = {
  label: string
  blockType: 'mediaGrid'
  blockName?: string
  title?: string
  columns?: '2' | '3' | '4'
  mediaItems: Array<{
    relationTo: 'videos' | 'music'
    value: VideoType | MusicType | string
  }>
}

export type RichTextBlockType = {
  label: string
  blockType: 'richTextBlock'
  blockName?: string
  richText: SerializedEditorState
}

export type ImageBlockType = {
  label: string
  blockType: 'imageBlock'
  blockName?: string
  imageUrl: string
  altText: string
  width?: number
  height?: number
  imageDimensions?: {
    width: number | null
    height: number | null
  }
  alignment?: 'left' | 'center' | 'right'
}

export type TextWithImageBlockType = {
  label: string
  blockType: 'textWithImageBlock'
  blockName?: string
  imageUrl: string
  altText: string
  alignment?: 'left' | 'right'
  horizontalTextSpace?: number
  imagePadding?: 'left' | 'center' | 'right'
  usePercentageBasedPadding?: boolean
  percentageImagePadding?: number
  imageDimensions?: {
    width: number | null
    height: number | null
  }
  richText: SerializedEditorState
}

export type TextWithVideoType = {
  label: string
  blockType: 'textWithVideo'
  blockName?: string
  videoUrl: string
  videoAlignment?: 'left' | 'right'
  horizontalTextSpace?: number
  videoPadding?: 'left' | 'center' | 'right'
  usePercentageBasedPadding?: boolean
  percentageVideoPadding?: number
  description: SerializedEditorState
}

export type VideoBlockType = {
  label: string
  blockType: 'videoBlock'
  blockName?: string
  videoUrl: string
  caption?: string
  alignment?: 'left' | 'center' | 'right'
}

export type TextWithHTMLType = {
  label: string
  blockType: 'textWithHtml'
  blockName?: string
  htmlContent: string
  htmlAlignment?: 'left' | 'right'
  horizontalTextSpace?: number
  htmlPadding?: 'left' | 'center' | 'right'
  usePercentageBasedPadding?: boolean
  percentageHtmlPadding?: number
  description: SerializedEditorState
}

export type HtmlBlockType = {
  label: string
  blockType: 'htmlBlock'
  blockName?: string
  htmlContent: string
}

export type ContentBlockType =
  | RichTextBlockType
  | ImageBlockType
  | TextWithImageBlockType
  | TextWithVideoType
  | MediaGridBlockType
  | VideoBlockType
  | TextWithHTMLType
  | HtmlBlockType

const RichTextBlock: Block = {
  slug: 'richTextBlock',
  interfaceName: 'RichTextBlock',
  fields: [
    {
      name: 'richText',
      type: 'richText',
      editor: lexicalEditor({
        admin: {
          placeholder: 'Write here the content to show...',
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
      label: 'Final width of the image. Leave at -1 not to specify.',
      type: 'number',
      required: false,
      defaultValue: -1,
      admin: {
        description: 'If not specified the width will be that of the original image.',
        placeholder: 'ejemplo: 128, 200, 764...',
        step: 1,
        position: 'sidebar',
      },
    },
    {
      name: 'height',
      label: 'Final height of the image. Leave at -1 not to specify.',
      type: 'number',
      required: false,
      defaultValue: -1,
      admin: {
        description: 'If not specified the height will be that of the original image.',
        placeholder: 'ejemplo: 480, 501, 652...',
        step: 1,
        position: 'sidebar',
      },
    },
    {
      name: 'imageDimensions',
      type: 'group',
      label: 'Image Dimensions (auto-populated)',
      admin: {
        readOnly: true,
        description: 'Actual width and height are automatically detected and saved on publish.',
      },
      fields: [
        {
          name: 'width',
          type: 'number',
        },
        {
          name: 'height',
          type: 'number',
        },
      ],
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
      name: 'horizontalTextSpace',
      label: 'Horizontal text spacing.',
      type: 'number',
      defaultValue: 75,
      max: 100,
      min: 0,
      required: false,
      admin: {
        description: '% of horizontal space that the text takes relative to the video.',
        placeholder: 'ejemplo: 25, 50, 100...',
        step: 1,
        position: 'sidebar',
      },
    },
    {
      name: 'usePercentageBasedPadding',
      label: 'Use percentage based padding instead of left/center/right padding',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'imagePadding',
      label: "Left/Center/Right image padding in it's own cell",
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
          value: 'Right',
        },
      ],
      admin: {
        condition: (_, siblingData) => siblingData.usePercentageBasedPadding === false,
        position: 'sidebar',
      },
    },
    {
      name: 'percentageImagePadding',
      label: 'Image left/right padding (right alignment/left alignment).',
      type: 'number',
      defaultValue: 50,
      max: 100,
      min: 0,
      required: false,
      admin: {
        condition: (_, siblingData) => siblingData.usePercentageBasedPadding === true,
        description: '% of empty margin space of the image to leave relative to the text.',
        placeholder: 'ejemplo: 25, 50, 100...',
        step: 1,
        position: 'sidebar',
      },
    },
    {
      name: 'imageDimensions',
      type: 'group',
      label: 'Image Dimensions (auto-populated)',
      admin: {
        readOnly: true,
        description: 'Actual width and height are automatically detected and saved on publish.',
      },
      fields: [
        {
          name: 'width',
          type: 'number',
        },
        {
          name: 'height',
          type: 'number',
        },
      ],
    },
    {
      name: 'richText',
      type: 'richText',
      editor: lexicalEditor({
        admin: {
          placeholder: 'Write here the content to show...',
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
      name: 'horizontalTextSpace',
      label: 'Horizontal text spacing.',
      type: 'number',
      defaultValue: 75,
      max: 100,
      min: 0,
      required: false,
      admin: {
        description: '% of horizontal space that the text takes relative to the video.',
        placeholder: 'ejemplo: 25, 50, 100...',
        step: 1,
        position: 'sidebar',
      },
    },
    {
      name: 'usePercentageBasedPadding',
      label: 'Use percentage based padding instead of left/center/right padding',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'videoPadding',
      label: "Left/Center/Right video padding in it's own cell",
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
          value: 'Right',
        },
      ],
      admin: {
        condition: (_, siblingData) => siblingData.usePercentageBasedPadding === false,
        position: 'sidebar',
      },
    },
    {
      name: 'percentageVideoPadding',
      label: 'Video left/right padding (right alignment/left alignment).',
      type: 'number',
      defaultValue: 50,
      max: 100,
      min: 0,
      required: false,
      admin: {
        condition: (_, siblingData) => siblingData.usePercentageBasedPadding === true,
        description: '% of empty margin space of the video to leave relative to the text.',
        placeholder: 'ejemplo: 25, 50, 100...',
        step: 1,
        position: 'sidebar',
      },
    },
    {
      name: 'description',
      type: 'richText',
      editor: lexicalEditor({
        admin: {
          placeholder: 'Write here the content to show...',
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

const MediaGridBlock: Block = {
  slug: 'mediaGrid',
  interfaceName: 'MediaGridBlock',
  fields: [
    {
      name: 'title',
      label: 'Grid title (Optional)',
      type: 'text',
    },
    {
      name: 'columns',
      label: 'Column number',
      type: 'select',
      defaultValue: '3',
      options: [
        { label: 'Two', value: '2' },
        { label: 'Three', value: '3' },
        { label: 'Four', value: '4' },
      ],
      admin: {
        position: 'sidebar',
        description: 'Select how many videos per row.',
      },
    },
    {
      name: 'mediaItems',
      label: 'Select Videos or Music',
      type: 'relationship',
      relationTo: ['videos', 'music'],
      hasMany: true,
      required: true,
      admin: {
        description: 'Select videos to display.',
      },
    },
  ],
}

const VideoBlock: Block = {
  slug: 'videoBlock',
  interfaceName: 'VideoBlock',
  fields: [
    {
      name: 'videoUrl',
      label: 'Video URL',
      type: 'text',
      required: true,
      admin: {
        description: 'e.g., https://www.youtube.com/watch?v=...',
      },
    },
    {
      name: 'caption',
      label: 'Caption (Optional)',
      type: 'text',
    },
    {
      name: 'alignment',
      label: 'Video Alignment',
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
        description: 'Choose how to align the video within the content column.',
      },
    },
  ],
}

const TextWithHTML: Block = {
  slug: 'textWithHTML',
  interfaceName: 'textWithHTML',
  fields: [
    {
      name: 'htmlContent',
      label: 'HTML Content',
      type: 'code',
      required: true,
      admin: {
        description:
          'Paste a HTML snippet here. Be cautious as this will be embedded directly on the page.',
        language: 'html',
      },
    },
    {
      name: 'htmlAlignment',
      label: 'HTML Alignment',
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
        description: 'Choose how to align the html relative to the text.',
      },
    },
    {
      name: 'horizontalTextSpace',
      label: 'Horizontal text spacing.',
      type: 'number',
      defaultValue: 75,
      max: 100,
      min: 0,
      required: false,
      admin: {
        description: '% of horizontal space that the text takes relative to the video.',
        placeholder: 'ejemplo: 25, 50, 100...',
        step: 1,
        position: 'sidebar',
      },
    },
    {
      name: 'usePercentageBasedPadding',
      label: 'Use percentage based padding instead of left/center/right padding',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'htmlPadding',
      label: "Left/Center/Right html padding in it's own cell",
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
          value: 'Right',
        },
      ],
      admin: {
        condition: (_, siblingData) => siblingData.usePercentageBasedPadding === false,
        position: 'sidebar',
      },
    },
    {
      name: 'percentageVideoPadding',
      label: 'Video left/right padding (right alignment/left alignment).',
      type: 'number',
      defaultValue: 50,
      max: 100,
      min: 0,
      required: false,
      admin: {
        condition: (_, siblingData) => siblingData.usePercentageBasedPadding === true,
        description: '% of empty margin space of the video to leave relative to the text.',
        placeholder: 'ejemplo: 25, 50, 100...',
        step: 1,
        position: 'sidebar',
      },
    },
    {
      name: 'description',
      type: 'richText',
      editor: lexicalEditor({
        admin: {
          placeholder: 'Write here the content to show...',
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

const HtmlBlock: Block = {
  slug: 'htmlBlock',
  interfaceName: 'HtmlBlock',
  fields: [
    {
      name: 'htmlContent',
      label: 'HTML Content',
      type: 'code',
      required: true,
      admin: {
        description:
          'Paste a HTML snippet here. Be cautious as this will be rendered directly on the page.',
        language: 'html',
      },
    },
  ],
}

export const TextPage: Field = {
  name: 'textpageContent',
  label: 'Content',
  type: 'blocks',
  minRows: 1,
  blocks: [
    RichTextBlock,
    ImageBlock,
    TextWithImageBlock,
    TextWithVideo,
    MediaGridBlock,
    VideoBlock,
    HtmlBlock,
    TextWithHTML,
  ],
}

export const addRemoteImageDimensions: GlobalBeforeChangeHook = async ({ data, req }) => {
  if (!data.content) {
    return data
  }

  const updated_data = await Promise.all(
    data.content.map(async (block: ContentBlockType) => {
      if (
        (block.blockType === 'textWithImageBlock' || block.blockType === 'imageBlock') &&
        block.imageUrl
      ) {
        try {
          const response = await fetch(block.imageUrl)

          if (!response.ok) {
            throw new Error(`Failed to fetch image. Status: ${response.status}`)
          }

          const imageBuffer = Buffer.from(await response.arrayBuffer())
          const metadata = await sharp(imageBuffer).metadata()

          return {
            ...block,
            imageDimensions: {
              width: metadata.width,
              height: metadata.height,
            },
          }
        } catch (error) {
          if (error instanceof Error) {
            req.payload.logger.error(
              `[TextWithImage Hook] Error getting dimensions for ${data.imageUrl}: ${error.message}`,
            )
          }

          return {
            ...block,
            imageDimensions: {
              width: null,
              height: null,
            },
          }
        }
      }
      return block
    }),
  )

  return {
    ...data,
    content: updated_data,
  }
}
