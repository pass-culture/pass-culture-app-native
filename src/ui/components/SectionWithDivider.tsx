import React from 'react'
import { LayoutChangeEvent, View } from 'react-native'
import styled from 'styled-components/native'

import { getSpacing } from 'ui/theme'
interface SectionProps {
  visible: boolean
  children: JSX.Element | JSX.Element[]
  margin?: boolean
  onLayout?: (event: LayoutChangeEvent) => void
}

export const SectionWithDivider = ({
  visible,
  children,
  margin = false,
  onLayout,
}: SectionProps) => {
  if (!visible) return <React.Fragment></React.Fragment>

  return (
    <View onLayout={onLayout}>
      <Divider />
      {margin ? <MarginContainer>{children}</MarginContainer> : children}
    </View>
  )
}

const Divider = styled.View(({ theme }) => ({
  height: getSpacing(2),
  backgroundColor: theme.colors.greyLight,
}))

const MarginContainer = styled.View({
  marginHorizontal: getSpacing(6),
})
