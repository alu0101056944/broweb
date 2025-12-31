'use client'

import React, { useState, useCallback, useEffect, useRef } from 'react'
import { useAuth, Button } from '@payloadcms/ui'

export default function DeployButton() {
  const { user } = useAuth()
  const [status, setStatus] = useState<'IDLE' | 'BUILDING' | 'READY' | 'ERROR'>('IDLE')
  const [message, setMessage] = useState('')
  const pollTimer = useRef<NodeJS.Timeout | null>(null)
  const startTime = useRef<number>(0)

  const stopPolling = () => {
    if (pollTimer.current) clearInterval(pollTimer.current)
    pollTimer.current = null
  }

  const checkStatus = useCallback(async (triggerTime: number, hookId: string) => {
    // Safety: Stop polling if it's been more than 5 minutes
    if (Date.now() - startTime.current > 300000) {
      stopPolling()
      setStatus('ERROR')
      setMessage('⌛ Polling timed out. Check Vercel dashboard.')
      return
    }

    try {
      const response = await fetch(`/api/deploy-status?from=${triggerTime}&hookId=${hookId}`)
      const data = await response.json()

      if (data.status === 'READY') {
        setStatus('READY')
        setMessage('✅ Site is Live!')
        stopPolling()
      } else if (['ERROR', 'CANCELED', 'FAILED'].includes(data.status)) {
        setStatus('ERROR')
        setMessage(`❌ Build ${data.status.toLowerCase()}`)
        stopPolling()
      } else {
        setStatus('BUILDING')
        setMessage(
          data.status === 'NOT_FOUND' ? '⏳ Waiting for Vercel...' : '🏗️ Astro is building...',
        )
      }
    } catch (err) {
      console.error('Polling error:', err)
    }
  }, [])

  const handleClick = useCallback(async () => {
    stopPolling()
    setStatus('BUILDING')
    setMessage('🚀 Triggering...')
    startTime.current = Date.now()

    try {
      const response = await fetch('/api/deploy-frontend', { method: 'POST' })
      const data = await response.json()

      if (!response.ok) throw new Error(data.error)

      // Start polling every 5 seconds
      pollTimer.current = setInterval(() => {
        checkStatus(data.createdAt, data.hookId)
      }, 5000)
    } catch (err) {
      setStatus('ERROR')
      setMessage('❌ Failed to trigger')
    }
  }, [checkStatus])

  useEffect(() => () => stopPolling(), [])

  if (!user) return null

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
      <Button
        onClick={handleClick}
        disabled={status === 'BUILDING'}
        size="small"
        buttonStyle="secondary"
      >
        {status === 'BUILDING' ? 'Deploying...' : 'Deploy Site'}
      </Button>
      {message && (
        <span
          className={`text-xs font-medium ${status === 'ERROR' ? 'text-red-500' : 'text-green-500'}`}
        >
          {message}
        </span>
      )}
    </div>
  )
}
