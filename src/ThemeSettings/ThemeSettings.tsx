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
          label: 'Logo info',
          fields: [
            {
              name: 'logoText',
              type: 'text',
              label: 'Main Logo Text (Name)',
              defaultValue: 'DAVID J. BARRIOS',
              required: true,
              admin: { description: 'The main name displayed in the top left.' },
            },
            {
              name: 'subText',
              type: 'text',
              label: 'Role Subtext',
              defaultValue: 'Audiovisual Producer',
              required: true,
              admin: { description: 'The text that appears next to or under the name.' },
            },
            {
              name: 'separatorChar',
              type: 'text',
              label:
                'Character used to separate the main logo text and the subtext. ' +
                'Only shows up when in mid size screen. ' +
                'Ex: David J. Barrios ◆ Audiovisual producer.',
              defaultValue: '◆',
            },
          ],
        },
        {
          label: 'Header Layout',
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
      ],
    },
  ],
}
