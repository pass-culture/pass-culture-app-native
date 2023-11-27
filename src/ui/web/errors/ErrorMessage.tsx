import React, { Fragment } from 'react'

interface Props {
  relatedInputId?: string // NOSONAR the prop is only used on the web
  children: React.ReactNode
}
export const ErrorMessage: React.FC<Props> = (props) => {
  return <Fragment>{props.children}</Fragment>
}
