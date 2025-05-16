import React from 'react'

type Props = {
  clientId: string
  children: React.ReactNode
}

export const GoogleOAuthProvider = ({ clientId: _clientId, children }: Props) => (
  <React.Fragment>{children}</React.Fragment>
)
