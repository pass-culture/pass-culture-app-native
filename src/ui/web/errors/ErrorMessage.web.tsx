import React from 'react'

export const ErrorMessage: React.FC = (props) => {
  return <div role="alert">{props.children}</div>
}
