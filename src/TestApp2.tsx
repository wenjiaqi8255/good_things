// TestApp2.tsx - 添加 ClerkProvider
import React from 'react';
import { ClerkProvider } from "@clerk/clerk-react";

function TestApp2() {
  const clerkPubKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;
  
  return (
    <ClerkProvider publishableKey={clerkPubKey || 'test_key'}>
      <div className="min-h-screen">
        <h1>Hello World</h1>
      </div>
    </ClerkProvider>
  );
}

export default TestApp2;