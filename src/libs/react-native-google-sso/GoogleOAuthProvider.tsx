import React from 'react'

type Props = {
  clientId: string
  children: React.ReactNode
}

export const GoogleOAuthProvider = ({ children }: Props) => (
  <React.Fragment>{children}</React.Fragment>
)
