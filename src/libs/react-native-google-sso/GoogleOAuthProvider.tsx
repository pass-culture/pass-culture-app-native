import React from 'react'

type Props = {
  clientId: string
  children: React.ReactNode
}

export const GoogleOAuthProvider: React.FC<Props> = ({ children, clientId: _clientId }) => (
  <React.Fragment>{children}</React.Fragment>
)
