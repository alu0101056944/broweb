// src/components/admin/CustomHeaderActions.tsx

import React from 'react'

import { Logout } from '@payloadcms/ui'
import DeployButton from '../DeployButton/DeployButton'

const CustomHeaderActions: React.FC = () => {
  return (
    <div className="gap-10" style={{ display: 'flex', alignItems: 'center' }}>
      <DeployButton />
      <div>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</div>
      <Logout />
    </div>
  )
}

export default CustomHeaderActions
