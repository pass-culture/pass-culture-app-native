import React from 'react'
import styled from 'styled-components/native'

import { ColorsEnum, getSpacing } from 'ui/theme'

interface SectionProps {
  visible: boolean
  children: JSX.Element | JSX.Element[]
  margin?: boolean
}

export const SectionWithDivider = ({ visible, children, margin = false }: SectionProps) => {
  if (!visible) return <React.Fragment></React.Fragment>

  return (
    <React.Fragment>
      <Divider />
      {margin ? <MarginContainer>{children}</MarginContainer> : children}
    </React.Fragment>
  )
}

const Divider = styled.View({
  height: getSpacing(2),
  backgroundColor: ColorsEnum.GREY_LIGHT,
})

const MarginContainer = styled.View({
  marginHorizontal: getSpacing(6),
})
