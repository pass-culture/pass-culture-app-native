import React from 'react'

type Props = {
  children: React.ReactNode
  header?: React.ReactNode
}

/* On native VenueHeader is called after Body to implement the BlurView for iOS */
export const VenueHeaderWrapper = ({ children, header }: Props) => {
  return (
    <React.Fragment>
      {children}
      {header}
    </React.Fragment>
  )
}
