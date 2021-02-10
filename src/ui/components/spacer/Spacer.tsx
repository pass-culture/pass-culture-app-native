import React from 'react'
import styled from 'styled-components/native'

import { getSpacing } from 'ui/theme/spacing'
import { useCustomSafeInsets } from 'ui/theme/useCustomSafeInsets'

interface SpacerProps {
  numberOfSpaces: number
}

const RowSpacer = styled.View<SpacerProps>(({ numberOfSpaces }) => ({
  width: getSpacing(numberOfSpaces),
}))
const ColumnSpacer = styled.View<SpacerProps>(({ numberOfSpaces }) => ({
  height: getSpacing(numberOfSpaces),
}))

const TabBarSpacer: React.FC = () => {
  const { tabBarHeight } = useCustomSafeInsets()
  return <CustomHeightSpacer customHeight={tabBarHeight} />
}
const TopScreenSpacer: React.FC = () => {
  const { top } = useCustomSafeInsets()
  return <CustomHeightSpacer customHeight={top} />
}
const BottomScreenSpacer: React.FC = () => {
  const { bottom } = useCustomSafeInsets()
  return <CustomHeightSpacer customHeight={bottom} />
}
const CustomHeightSpacer = styled.View<{ customHeight: number }>(({ customHeight }) => ({
  height: customHeight,
}))

interface FlexSpacerProps {
  flex?: number
}
const FlexSpacer = styled.View<FlexSpacerProps>(({ flex }) => ({
  flex: flex ? flex : 1,
}))
/**
 * margin : `numberOfSpaces={6}`
 *
 * gutter : `numberOfSpaces={4}`
 */
export const Spacer = {
  Flex: FlexSpacer,
  Row: RowSpacer,
  Column: ColumnSpacer,
  TopScreen: TopScreenSpacer,
  TabBar: TabBarSpacer,
  BottomScreen: BottomScreenSpacer,
}
