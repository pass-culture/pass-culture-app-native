import React, { Fragment } from 'react'

type Props = {
  relatedInputId?: string
  children: React.ReactNode
}
export const ErrorMessage: React.FC<Props> = ({ children, relatedInputId: _relatedInputId }) => {
  return <Fragment>{children}</Fragment>
}
