import React, { Fragment } from 'react'

type Props = {
  // eslint-disable-next-line react/no-unused-prop-types
  relatedInputId?: string
  children: React.ReactNode
}
export const ErrorMessage: React.FC<Props> = (props) => {
  return <Fragment>{props.children}</Fragment>
}
