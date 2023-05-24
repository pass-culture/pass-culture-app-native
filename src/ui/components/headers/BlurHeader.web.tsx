import React from 'react'

// We need to define this unused empty component in order to compile web app correctly. Without it,
// the native component BlurHeader.tsx makes web compilation fail.
export const BlurHeader: React.FC = () => {
  return <React.Fragment />
}
