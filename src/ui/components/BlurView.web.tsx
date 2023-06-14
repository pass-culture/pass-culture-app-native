import React from 'react'

// We need to define this unused empty component in order to compile web app correctly. Without it,
// the native component BlurView.tsx makes web compilation fail.
export const BlurView: React.FC = () => {
  return <React.Fragment />
}
