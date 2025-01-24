import React from 'react'
import { LayoutChangeEvent, StyleProp, ViewStyle } from 'react-native'
import styled from 'styled-components/native'

import { ViewGap } from 'ui/components/ViewGap/ViewGap'
import { getSpacing } from 'ui/theme'
interface SectionProps {
  visible: boolean
  children?: React.JSX.Element | (React.JSX.Element | null)[]
  margin?: boolean
  onLayout?: (event: LayoutChangeEvent) => void
  testID?: string
  gap: number
  style?: StyleProp<ViewStyle>
}

export const SectionWithDivider = ({
  visible,
  children,
  margin = false,
  onLayout,
  testID,
  style,
  gap,
}: SectionProps) => {
  if (!visible) return null

  return (
    <ViewGap onLayout={onLayout} testID={testID} gap={gap} style={style}>
      <Divider />
      {margin ? <Wrapper>{children}</Wrapper> : children}
    </ViewGap>
  )
}

const Divider = styled.View(({ theme }) => ({
  height: getSpacing(2),
  backgroundColor: theme.colors.greyLight,
}))

const Wrapper = styled.View({
  paddingHorizontal: getSpacing(6),
})
