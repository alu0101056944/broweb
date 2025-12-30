// storage-adapter-import-placeholder
import { postgresAdapter } from '@payloadcms/db-postgres'

import sharp from 'sharp' // sharp-import
import path from 'path'
import { buildConfig, PayloadRequest } from 'payload'
import { fileURLToPath } from 'url'

import { HomeContent } from './HomeContent/HomeContent'
import { Music } from './collections/Music'
import { ContactInfo } from './ContactInfo/ContactInfo'
import { ContactContent } from './ContactContent/ContactContent'
import { AboutContent } from './AboutContent/AboutContent'
import { ThemeSettings } from './ThemeSettings/ThemeSettings'
import { Videos } from './collections/Videos'
import { Pages } from './collections/Pages'
import { Users } from './collections/Users'
import { plugins } from './plugins'
import { defaultLexical } from '@/fields/defaultLexical'
import { getServerSideURL } from './utilities/getURL'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  admin: {
    components: {
      // The `BeforeLogin` component renders a message that you see while logging into your admin panel.
      // Feel free to delete this at any time. Simply remove the line below.
      beforeLogin: ['@/components/BeforeLogin'],
      // The `BeforeDashboard` component renders the 'welcome' block that you see after logging into your admin panel.
      // Feel free to delete this at any time. Simply remove the line below.
      beforeDashboard: ['@/components/BeforeDashboard'],
      afterNavLinks: ['./components/DeployButton/DeployButton'],
      actions: ['./components/CustomHeader/CustomHeader'],
    },
    importMap: {
      baseDir: path.resolve(dirname),
    },
    user: Users.slug,
  },
  // This config helps us configure global or default features that the other editors can inherit
  editor: defaultLexical,
  db: postgresAdapter({
    pool: {
      host: process.env.POSTGRES_HOST,
      port: parseInt(process.env.POSTGRES_PORT || '5432', 10), // Ensure port is a number
      user: process.env.POSTGRES_USER,
      password: process.env.POSTGRES_PASSWORD,
      database: process.env.POSTGRES_DATABASE,
      ssl: {
        rejectUnauthorized: true,
        ca: process.env.POSTGRES_CA,
      },
    },
  }),
  collections: [Pages, Videos, Music, Users],
  cors: [getServerSideURL()].filter(Boolean),
  globals: [HomeContent, AboutContent, ContactContent, ContactInfo, ThemeSettings],
  plugins: [
    ...plugins,
    // storage-adapter-placeholder
  ],
  secret: process.env.PAYLOAD_SECRET,
  sharp,
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  jobs: {
    access: {
      run: ({ req }: { req: PayloadRequest }): boolean => {
        // Allow logged in users to execute this endpoint (default)
        if (req.user) return true

        // If there is no logged in user, then check
        // for the Vercel Cron secret to be present as an
        // Authorization header:
        const authHeader = req.headers.get('authorization')
        return authHeader === `Bearer ${process.env.CRON_SECRET}`
      },
    },
    tasks: [],
  },
  endpoints: [
    {
      path: '/deploy-frontend',
      method: 'post',
      handler: async (req) => {
        if (!req.user || req.user.collection !== 'users') {
          return Response.json({ error: 'You are not authorized to perform this action.' })
        }

        const deployHookUrl = process.env.VERCEL_DEPLOY_HOOK_URL
        if (!deployHookUrl) {
          return Response.json({ error: 'Deploy hook URL is not configured.' })
        }

        try {
          const response = await fetch(deployHookUrl, { method: 'POST' })
          if (!response.ok) {
            throw new Error(`Vercel API responded with status ${response.status}`)
          }
          const result = await response.json()

          // 4. Send a success response back to the admin panel
          return Response.json({
            message: 'Deployment triggered successfully!',
            vercelResponse: result,
          })
        } catch (error) {
          let errorMessage = 'Failed to trigger deployment.'

          if (error instanceof Error) {
            errorMessage = error.message
          }

          return Response.json({ error: error, details: errorMessage })
        }
      },
    },
  ],
})
