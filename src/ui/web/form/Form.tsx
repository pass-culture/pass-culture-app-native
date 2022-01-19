import React from 'react'
import { ReactNode } from 'react'

type Props = {
  children: ReactNode
}

function FormFragment(props: Props) {
  return <React.Fragment>{props.children}</React.Fragment>
}

export const Form = {
  Flex: FormFragment,
  MaxWidth: FormFragment,
}
