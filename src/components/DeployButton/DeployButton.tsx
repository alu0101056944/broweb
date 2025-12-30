'use client'

import React, { useState, useCallback } from 'react'
import { useAuth } from '@payloadcms/ui'
import { Button } from '@payloadcms/ui'

export default function DeployButton() {
  const { user } = useAuth()

  const [isDeploying, setIsDeploying] = useState(false)
  const [message, setMessage] = useState('')
  const [isError, setIsError] = useState(false)

  const handleClick = useCallback(async () => {
    setIsDeploying(true)
    setMessage('')
    setIsError(false)

    try {
      const res = await fetch('/api/deploy-frontend', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      const data = await res.json()
      if (!res.ok) {
        throw new Error(data.error || 'Something went wrong.')
      }

      setMessage('🚀 Deployment started.')
    } catch (err) {
      if (err instanceof Error) {
        setMessage(`Error: ${err.message}`)
        setIsError(true)
      }
    } finally {
      setTimeout(() => setMessage(''), 10000)
      setIsDeploying(false)
    }
  }, [])

  if (!user) {
    return null
  }

  return (
    <div>
      <div className="flex items-center mr-15 gap-5 h-full">
        <Button onClick={handleClick} disabled={isDeploying} size="small" buttonStyle="secondary">
          {isDeploying ? 'Deploying...' : 'Deploy'}
        </Button>
      </div>
      {message && (
        <span
          className={`text-xs font-medium whitespace-nowrap ${
            isError ? 'text-red-500' : 'text-green-500'
          }`}
        >
          {message}
        </span>
      )}
    </div>
  )
}
