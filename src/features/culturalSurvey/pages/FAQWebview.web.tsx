import React from 'react'

// We need to define this unused empty component in order to compile web app correctly. Without it,
// the native component FAQWebview.tsx which uses a Webview makes web compilation fail.
export const FAQWebview: React.FC = () => {
  return <React.Fragment />
}
