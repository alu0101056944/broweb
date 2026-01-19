import { GlobalConfig, GlobalBeforeChangeHook } from 'payload'

import sharp from 'sharp'

import { TextPage } from '../TextPage/TextPage'

export const addRemoteImageDimensions: GlobalBeforeChangeHook = async ({ data, req }) => {
  if (!data.useImageAsLogo) {
    return data
  }

  try {
    const response = await fetch(data.logoImageUrl)

    if (!response.ok) {
      throw new Error(`Failed to fetch image. Status: ${response.status}`)
    }

    const imageBuffer = Buffer.from(await response.arrayBuffer())
    const metadata = await sharp(imageBuffer).metadata()

    return {
      ...data,
      logoImageDimensions: {
        logoImageWidth: metadata.width,
        logoImageHeight: metadata.height,
      },
    }
  } catch (error) {
    if (error instanceof Error) {
      req.payload.logger.error(
        `[TextWithImage Hook] Error getting dimensions for ${data.imageUrl}: ${error.message}`,
      )
    }

    return {
      ...data,
      logoImageDimensions: {
        logoImagewidth: null,
        logoImageheight: null,
      },
    }
  }
}

export const ThemeSettings: GlobalConfig = {
  slug: 'theme-settings',
  access: {
    read: () => true,
  },
  admin: {
    group: 'Settings',
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'General',
          fields: [
            {
              type: 'group',
              label: 'Browser Tab',
              fields: [
                {
                  name: 'postfixText',
                  type: 'text',
                  defaultValue: ' — David J. Barrios',
                  admin: {
                    description:
                      'Text to add right after page specific title on the brower tab. ' +
                      'Example: Home — David J. Barrios.',
                  },
                },
              ],
            },
            {
              type: 'group',
              label: 'SEO',
              fields: [
                {
                  name: 'homePageDescription',
                  label: 'Home Page Description',
                  type: 'text',
                  defaultValue: 'David J. Barrios Latest Released Instrumental Metal Music',
                  required: true,
                  admin: {
                    description:
                      'Description of the home page. For SEO purposes. Also used as social media ' +
                      'link description (OpenGraph).',
                  },
                },
                {
                  name: 'openGraphTitle',
                  label: 'Open Graph Title',
                  type: 'text',
                  defaultValue: 'David J. Barrios Audiovisual Producer Portfolio',
                  required: true,
                  admin: {
                    description:
                      'Title for the card that appears when the site is linked in social media sites.',
                  },
                },
                {
                  name: 'openGraphImageURL',
                  label: 'Open Graph ImageURL',
                  type: 'text',
                  required: true,
                  defaultValue:
                    'https://media.licdn.com/dms/image/v2/D4E2DAQEkSQSkTb8EGg/profile-treasury-image-shrink_1280_1280/B4EZtcsFLbHMAQ-/0/1766786618992?e=1768568400&v=beta&t=5Udkke3JpvnCLRFo0q5KWHlm41lIN77mhha4rBos45A',
                  admin: {
                    description:
                      'Image that shows on the card that apperas when the site is linked in social media sites.',
                  },
                },
              ],
            },
          ],
        },
        {
          label: 'Header',
          fields: [
            {
              label: 'Segment Spacing',
              type: 'group',
              fields: [
                {
                  name: 'logoWidthPercent',
                  type: 'number',
                  label: 'Logo Header Segment Width %',
                  required: true,
                  min: 0,
                  max: 100,
                  defaultValue: 40,
                  admin: {
                    description:
                      'Width % of the available space of the header to be dedicated to the logo',
                  },
                },
                {
                  name: 'menuWidthPercent',
                  type: 'number',
                  label: 'Menu Header Segment Width %',
                  defaultValue: 60,
                  admin: {
                    readOnly: true,
                    description:
                      'Automatically given the remaining header' +
                      ' space after logo width % is calculated.',
                  },
                  hooks: {
                    beforeValidate: [
                      ({ siblingData }) => {
                        if (typeof siblingData.logoWidthPercent === 'number') {
                          return 100 - siblingData.logoWidthPercent
                        }
                      },
                    ],
                  },
                },
              ],
            },
            {
              type: 'group',
              label: 'Logo',
              fields: [
                {
                  name: 'useImageAsLogo',
                  type: 'checkbox',
                  label: 'Use Image As Logo',
                  defaultValue: false,
                  admin: {
                    description:
                      'When active, an image url and description are asked and the actual' +
                      ' image dimensions of image specified can be seen after saving.',
                  },
                },
                {
                  name: 'logoText',
                  type: 'text',
                  label: 'Logo Text',
                  defaultValue: 'DAVID J. BARRIOS',
                  required: true,
                  admin: {
                    description: 'The main text displayed in the top left.',
                    condition: (_, siblingData) => siblingData?.useImageAsLogo === false,
                  },
                },
                {
                  label: 'Logo Image Configuration',
                  type: 'group',
                  admin: {
                    condition: (_, siblingData) => siblingData?.useImageAsLogo === true,
                  },
                  fields: [
                    {
                      name: 'logoImageUrl',
                      type: 'text',
                      label: 'Logo Image URL',
                      required: true,
                      admin: {
                        description: 'The URL of the image to be used as logo.',
                        condition: (_, siblingData) => siblingData?.useImageAsLogo === true,
                      },
                    },
                    {
                      name: 'logoImageDescription',
                      type: 'text',
                      label: 'Logo Image Description',
                      required: true,
                      defaultValue: 'Go to home',
                      admin: {
                        description: 'The text to show when the mouse hovers over the image.',
                        condition: (_, siblingData) => siblingData?.useImageAsLogo === true,
                      },
                    },
                    {
                      name: 'logoImageDimensions',
                      type: 'group',
                      label: 'Detected Image Dimensions (auto-populated)',
                      admin: {
                        readOnly: true,
                        description:
                          'Actual width and height are automatically detected on settings save.',
                        condition: (_, siblingData) => siblingData?.useImageAsLogo === true,
                      },
                      fields: [
                        {
                          name: 'logoImageWidth',
                          type: 'number',
                        },
                        {
                          name: 'logoImageHeight',
                          type: 'number',
                        },
                      ],
                    },
                    {
                      name: 'redimensionLogoImage',
                      type: 'checkbox',
                      label: 'Chance Logo Image Dimensions',
                      defaultValue: true,
                      admin: {
                        description:
                          'Whether to modify the image size to the following dimensions.',
                        condition: (_, siblingData) => siblingData?.useImageAsLogo === true,
                      },
                    },
                    {
                      name: 'newLogoImageDimensions',
                      type: 'group',
                      label: 'New Image Dimensions',
                      admin: {
                        description: 'New width and height of the icon image.',
                        condition: (_, siblingData) => {
                          return (
                            siblingData?.useImageAsLogo === true &&
                            siblingData?.redimensionLogoImage === true
                          )
                        },
                      },
                      fields: [
                        {
                          name: 'newLogoImageWidth',
                          type: 'number',
                          label: 'New Logo Image Width',
                          required: true,
                          defaultValue: 200,
                          min: 0,
                          admin: {
                            description:
                              'Whether to modify the image size to the following dimensions.',
                            condition: (data, _) => {
                              return (
                                data?.useImageAsLogo === true && data?.redimensionLogoImage === true
                              )
                            },
                          },
                        },
                        {
                          name: 'newLogoImageHeight',
                          type: 'number',
                          label: 'New Logo Image Height',
                          defaultValue: 120,
                          required: true,
                          min: 0,
                          admin: {
                            description:
                              'Whether to modify the image size to the following dimensions.',
                            condition: (data, _) => {
                              return (
                                data?.useImageAsLogo === true && data?.redimensionLogoImage === true
                              )
                            },
                          },
                        },
                      ],
                    },
                  ],
                },
                {
                  name: 'subText',
                  type: 'text',
                  label: 'Role Subtext',
                  defaultValue: 'Audiovisual Producer',
                  required: false,
                  admin: { description: 'The text that appears next to or under the main logo.' },
                },
                {
                  name: 'separatorChar',
                  type: 'text',
                  required: false,
                  label: 'Logo text and subtext separator on medium size screen.',
                  defaultValue: '◆',
                  admin: {
                    description:
                      'Character used to separate the main logo and the subtext. ' +
                      'Only shows up when in mid size screen. ' +
                      'Ex: David J. Barrios ◆ Audiovisual producer.',
                  },
                },
              ],
            },
            {
              type: 'group',
              label: 'Menu',
              fields: [
                {
                  type: 'group',
                  label: 'Layout',
                  fields: [
                    {
                      name: 'minColumnWidthPx',
                      type: 'number',
                      label: 'Column Wrap Trigger (px)',
                      min: 50,
                      max: 400,
                      defaultValue: 140,
                      admin: {
                        description:
                          'When columns get smaller than this, they wrap to a new row. ' +
                          'Note: only applies when screen size is at least medium size.',
                      },
                    },
                    {
                      name: 'gap',
                      type: 'number',
                      label: 'Link Spacing (Gap)',
                      min: 0,
                      max: 50,
                      defaultValue: 0,
                      admin: {
                        description:
                          'Extra space between each menu item. ' +
                          'Note: only applies when screen size is at least medium size.',
                      },
                    },
                  ],
                },
                {
                  type: 'group',
                  label: 'Content Specific',
                  fields: [
                    {
                      name: 'homePageTitle',
                      type: 'text',
                      label: 'Home Page Title',
                      required: true,
                      defaultValue: 'Home',
                      admin: {
                        description:
                          'Text to show in the menu for the home link (which is always first in the menu).',
                      },
                    },
                  ],
                },
              ],
            },
          ],
        },
        {
          label: 'Footer',
          fields: [
            {
              name: 'bottomPadding',
              type: 'number',
              label: 'Bottom Padding',
              min: 0,
              defaultValue: 30,
              admin: {
                description: 'How much extra space is present under the social media icons.',
              },
            },
            TextPage,
          ],
        },
      ],
    },
  ],
  hooks: {
    beforeChange: [addRemoteImageDimensions],
  },
}
