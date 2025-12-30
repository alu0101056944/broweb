import { GlobalConfig } from 'payload'

export const ThemeSettings: GlobalConfig = {
  slug: 'theme-settings',
  access: {
    read: () => true,
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
          ],
        },
        {
          label: 'Header',
          fields: [
            {
              type: 'group',
              label: 'Logo',
              fields: [
                {
                  name: 'logoText',
                  type: 'text',
                  label: 'Main Logo Text (Name)',
                  defaultValue: 'DAVID J. BARRIOS',
                  required: false,
                  admin: { description: 'The main name displayed in the top left.' },
                },
                {
                  name: 'subText',
                  type: 'text',
                  label: 'Role Subtext',
                  defaultValue: 'Audiovisual Producer',
                  required: false,
                  admin: { description: 'The text that appears next to or under the name.' },
                },
                {
                  name: 'separatorChar',
                  type: 'text',
                  required: false,
                  label: 'Logo text and subtext separator on medium size screen.',
                  defaultValue: '◆',
                  admin: {
                    description:
                      'Character used to separate the main logo text and the subtext. ' +
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
                          'The space between each menu item. ' +
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
      ],
    },
  ],
}
