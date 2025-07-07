import React from 'react'

type Props = {
  children: React.ReactNode
  header?: React.ReactNode
}

/* On native Header is called after Body to implement the BlurView for iOS */
export const HeaderWrapper = ({ children, header }: Props) => {
  return (
    <React.Fragment>
      {children}
      {header}
    </React.Fragment>
  )
}
