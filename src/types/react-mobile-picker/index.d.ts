declare module 'react-mobile-picker' {
  import React, { ReactElement } from 'react'

  interface Props {
    optionGroups: { [name: string]: any }
    valueGroups: { [name: string]: any }
    onChange: (name: string, value: any) => void
    onClick?: () => void
    itemHeight?: number
    height?: number
  }

  const Component: React.FC<Props> = () => ReactElement
  export default Component
}
