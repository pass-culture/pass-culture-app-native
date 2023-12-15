import React from 'react'
import { LayoutChangeEvent, View } from 'react-native'
import styled from 'styled-components/native'

import { getSpacing } from 'ui/theme'
interface SectionProps {
  visible: boolean
  children: React.JSX.Element | (React.JSX.Element | null)[]
  margin?: boolean
  onLayout?: (event: LayoutChangeEvent) => void
  testID?: string
}

export const SectionWithDivider = ({
  visible,
  children,
  margin = false,
  onLayout,
  testID,
}: SectionProps) => {
  if (!visible) return null

  return (
    <View onLayout={onLayout} testID={testID}>
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
