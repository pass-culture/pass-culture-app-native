import React from 'react'
import { LayoutChangeEvent } from 'react-native'
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
}

export const SectionWithDivider = ({
  visible,
  children,
  margin = false,
  onLayout,
  testID,
  gap,
}: SectionProps) => {
  if (!visible) return null

  return (
    <ViewGap onLayout={onLayout} testID={testID} gap={gap}>
      <Divider />
      {margin ? <MarginContainer>{children}</MarginContainer> : children}
    </ViewGap>
  )
}

const Divider = styled.View(({ theme }) => ({
  height: getSpacing(2),
  backgroundColor: theme.colors.greyLight,
}))

const MarginContainer = styled.View({
  marginHorizontal: getSpacing(6),
})
