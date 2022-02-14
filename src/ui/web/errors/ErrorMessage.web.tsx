import React from 'react'
interface Props {
  relatedInputId?: string
}
export const ErrorMessage: React.FC<Props> = (props) => {
  return (
    <div role="alert" id={props.relatedInputId || ''}>
      {props.children}
    </div>
  )
}
