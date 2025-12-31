// storage-adapter-import-placeholder
import { postgresAdapter } from '@payloadcms/db-postgres'

import sharp from 'sharp' // sharp-import
import path from 'path'
import { buildConfig, PayloadRequest } from 'payload'
import { fileURLToPath } from 'url'

import { HomeContent } from './HomeContent/HomeContent'
import { Music } from './collections/Music'
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
      beforeNavLinks: [],
      actions: ['./components/CustomHeader/CustomHeader'],
    },
    importMap: {
      baseDir: path.resolve(dirname),
    },
    user: Users.slug,
    dependencies: {
      homeInfoComponent: {
        path: './components/HomeInfo/HomeInfo.tsx#default',
        type: 'component',
      },
    },
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
  globals: [HomeContent, ThemeSettings],
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
          return Response.json({ error: 'Not configured' }, { status: 500 })
        }

        try {
          const response = await fetch(deployHookUrl, { method: 'POST' })
          const result = await response.json()

          const hookId = deployHookUrl.split('/').pop()

          return Response.json({
            message: 'Deployment triggered',
            createdAt: result.job.createdAt,
            hookId: hookId,
          })
        } catch (_) {
          return Response.json({ error: 'Failed to trigger' }, { status: 500 })
        }
      },
    },
    {
      path: '/deploy-status',
      method: 'get',
      handler: async (req) => {
        const urlObj = new URL(
          req.url as string,
          `http://${req.headers.get('host') || 'localhost'}`,
        )
        const triggerTime = parseInt(urlObj.searchParams.get('from') || '0')
        const hookId = urlObj.searchParams.get('hookId')

        const { VERCEL_PROJECT_ID_MANUAL, VERCEL_TOKEN, VERCEL_TEAM_ID } = process.env

        try {
          const since = triggerTime - 300000
          const url = `https://api.vercel.com/v6/deployments?projectId=${VERCEL_PROJECT_ID_MANUAL}&since=${since}&limit=10${
            VERCEL_TEAM_ID ? `&teamId=${VERCEL_TEAM_ID}` : ''
          }`

          console.log(`Url:${url}`)

          const res = await fetch(url, {
            headers: { Authorization: `Bearer ${VERCEL_TOKEN}` },
          })

          if (!res.ok) {
            const errorText = await res.text()
            console.error('VERCEL API ERROR:', res.status, errorText)
            return Response.json({ status: 'ERROR' })
          }

          const data = await res.json()

          console.info(
            `Checking builds for hook: ${hookId}. Found ${data.deployments?.length || 0} recent builds.`,
          )

          const deployment = data.deployments
            ?.filter((d: any) => {
              const match = d.meta?.deployHookId === hookId
              const isRecent = d.createdAt >= triggerTime - 60000 // 1 min grace
              return match && isRecent
            })
            .sort((a: any, b: any) => b.createdAt - a.createdAt)[0]

          if (deployment) {
            console.info(`Found match! Status: ${deployment.readyState}`)
            return Response.json({ status: deployment.readyState })
          }

          if (data.deployments?.length > 0) {
            console.warn('Deployments found but Hook ID or Timestamp did not match.', {
              expectedHook: hookId,
              firstFoundHook: data.deployments[0]?.meta?.deployHookId,
              triggerTime: triggerTime,
              firstFoundTime: data.deployments[0]?.createdAt,
            })
          }

          return Response.json({ status: 'NOT_FOUND' })
        } catch (e) {
          console.error('DEPLOY STATUS FETCH FAILED:', e)
          return Response.json({ status: 'ERROR' })
        }
      },
    },
  ],
})
