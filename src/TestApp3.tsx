// TestApp3.tsx - 添加 DialogProvider
import React from 'react';
import { ClerkProvider } from "@clerk/clerk-react";
import { DialogProvider } from './contexts/DialogContext';
import { AppContent } from './App';
import { AuthProvider } from './contexts/AuthContext';

function TestApp3() {
  const clerkPubKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;
  
  return (
    <div className="test-wrapper" style={{padding: '20px'}}>
      <ClerkProvider publishableKey={clerkPubKey || 'test_key'}>
        <AuthProvider>           {/* 添加 AuthProvider */}
            <DialogProvider>
              <AppContent />
            </DialogProvider>
          </AuthProvider>
      </ClerkProvider>
    </div>
  );
}

export default TestApp3;