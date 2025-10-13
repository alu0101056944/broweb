// src/components/admin/CustomHeaderActions.tsx

import React from 'react';

import { Account, Logout } from '@payloadcms/ui';

const CustomHeaderActions: React.FC = () => {
  return (
    <div style={{ display: 'flex', alignItems: 'center' }}>
      <Account />
      <Logout />
    </div>
  );
};

export default CustomHeaderActions;