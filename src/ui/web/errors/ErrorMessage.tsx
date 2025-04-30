import React, { Fragment } from 'react'

interface Props {
  relatedInputId?: string
  children: React.ReactNode
}
export const ErrorMessage: React.FC<Props> = ({ children, relatedInputId: _relatedInputId }) => {
  return <Fragment>{children}</Fragment>
}
