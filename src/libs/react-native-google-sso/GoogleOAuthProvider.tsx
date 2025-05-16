import React from 'react'

type Props = {
  // eslint-disable-next-line react/no-unused-prop-types
  clientId: string
  children: React.ReactNode
}

export const GoogleOAuthProvider: React.FC<Props> = ({ children }) => (
  <React.Fragment>{children}</React.Fragment>
)
