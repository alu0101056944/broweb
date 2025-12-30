'use client'

import React from 'react'
import { Banner } from '@payloadcms/ui'

export default function HomeInfo() {
  return (
    <Banner>
      <h3 style={{ marginTop: 0, color: 'var(--theme-success-500)' }}>
        🏠 Static Home Page Configuration
      </h3>
      <p style={{ margin: '0.5rem 0' }}>
        <strong>Why is this separate from other Pages?</strong>
      </p>
      <p style={{ fontSize: '0.9rem', lineHeight: '1.5' }}>
        The Astro frontend treats the <strong>Home Page (/)</strong> as a fixed static route for
        maximum performance. On the other hand, the <em>Pages</em> collection handles all dynamic
        routes (For example <code>/about</code> or <code>/services</code>). In this case,{' '}
        <strong>Home Global</strong> is specifically reserved for the root website content.
      </p>
      <ul style={{ fontSize: '0.85rem', marginTop: '0.5rem' }}>
        <li>
          <strong>Home Global:</strong> Specific content for{' '}
          <code>https://www.davidjbarrios.com/</code>
        </li>
        <li>
          <strong>Pages Collection:</strong> Meant for subroutes like{' '}
          <code>https://www.davidjbarrios.com/about/</code>
        </li>
      </ul>
    </Banner>
  )
}
