import React, { ReactNode } from 'react'

export const Main = ({ children }: { id: string; children: ReactNode }) => (
  <React.Fragment>{children}</React.Fragment>
)
