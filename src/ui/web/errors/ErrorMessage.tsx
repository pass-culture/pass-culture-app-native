import React, { Fragment } from 'react'

interface Props {
  relatedInputId?: string
  children: React.ReactNode
}
export const ErrorMessage: React.FC<Props> = (props) => {
  return <Fragment>{props.children}</Fragment>
}
