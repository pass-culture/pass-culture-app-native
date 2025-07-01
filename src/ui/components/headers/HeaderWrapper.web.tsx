import React from 'react'

type Props = {
  children: React.ReactNode
  header?: React.ReactNode
}

/* On web Header is called before Body for accessibility navigate order */
export const HeaderWrapper = ({ children, header }: Props) => {
  return (
    <React.Fragment>
      {header}
      {children}
    </React.Fragment>
  )
}
