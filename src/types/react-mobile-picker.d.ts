declare module 'react-mobile-picker' {
  import React, { ReactElement } from 'react'

  interface Props {
    optionGroups: { [name: string]: Array<string | number> }
    valueGroups: { [name: string]: string | number }
    onChange: (name: string, value: string | number) => void
    onClick?: () => void
    itemHeight?: number
    height?: number
    accessibilityDescribedBy?: string
  }

  const Component: React.FC<Props> = () => ReactElement
  export default Component
}
