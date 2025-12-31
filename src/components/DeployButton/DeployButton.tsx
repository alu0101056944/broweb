'use client'

import React, { useState, useCallback, useEffect, useRef } from 'react'
import { useAuth, Button } from '@payloadcms/ui'

type Status = 'IDLE' | 'TRIGGERING' | 'BUILDING' | 'READY' | 'ERROR'

export default function DeployButton() {
  const { user } = useAuth()
  const [status, setStatus] = useState<Status>('IDLE')
  const [message, setMessage] = useState('')
  const pollTimer = useRef<NodeJS.Timeout | null>(null)

  const stopPolling = () => {
    if (pollTimer.current) {
      clearInterval(pollTimer.current)
      pollTimer.current = null
    }
  }

  const checkStatus = useCallback(async (triggerTime: number, hookId: string) => {
    try {
      const response = await fetch(`/api/deploy-status?from=${triggerTime}&hookId=${hookId}`)
      const data = await response.json()

      if (data.status === 'READY') {
        setStatus('READY')
        setMessage('✅ Site is Live!')
        stopPolling()
      } else if (['ERROR', 'CANCELED', 'FAILED'].includes(data.status)) {
        setStatus('ERROR')
        setMessage('❌ Deployment failed.')
        stopPolling()
      } else {
        setStatus('BUILDING')
        setMessage('🏗️ Astro is building...')
      }
    } catch (err) {
      console.error(err)
    }
  }, [])

  const handleClick = useCallback(async () => {
    stopPolling()
    setStatus('TRIGGERING')
    setMessage('Connecting to Vercel...')

    try {
      const response = await fetch('/api/deploy-frontend', { method: 'POST' })
      const data = await response.json()

      if (!response.ok) throw new Error(data.error)

      pollTimer.current = setInterval(() => {
        checkStatus(data.createdAt, data.hookId)
      }, 5000)
    } catch (_) {
      setStatus('ERROR')
      setMessage('Failed to start deployment.')
    }
  }, [checkStatus])

  useEffect(() => {
    return () => stopPolling()
  }, [])

  if (!user) return null

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-4">
        <Button
          onClick={handleClick}
          disabled={status === 'TRIGGERING' || status === 'BUILDING'}
          size="small"
          buttonStyle="secondary"
        >
          {status === 'IDLE' && 'Deploy Site'}
          {status === 'TRIGGERING' && 'Starting...'}
          {status === 'BUILDING' && 'Building...'}
          {status === 'READY' && 'Deploy Again'}
          {status === 'ERROR' && 'Retry Deploy'}
        </Button>
        {message && (
          <span
            className={`text-xs font-medium whitespace-nowrap ${
              status === 'ERROR' ? 'text-red-500' : 'text-green-500'
            }`}
          >
            {message}
          </span>
        )}
      </div>
    </div>
  )
}
