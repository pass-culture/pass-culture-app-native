import React, { ComponentProps, FunctionComponent, PropsWithChildren } from 'react'

import { Typo } from 'ui/theme'

type InputLabelProps = PropsWithChildren<
  ComponentProps<typeof Typo.Body> & {
    htmlFor: string
  }
>

export const InputLabel: FunctionComponent<InputLabelProps> = ({ children, ...props }) => {
  return <Typo.Body {...props}>{children}</Typo.Body>
}
