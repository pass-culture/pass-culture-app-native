import React, { Fragment } from 'react'
interface Props {
  relatedInputId?: string
}
export const ErrorMessage: React.FC<Props> = (props) => {
  return <Fragment>{props.children}</Fragment>
}
