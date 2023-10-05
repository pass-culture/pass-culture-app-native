import React from 'react'
import styled, { useTheme } from 'styled-components/native'

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
  const { showTabBar } = useTheme()
  return <CustomHeightSpacer customHeight={tabBarHeight} enable={showTabBar} />
}

const TopScreenSpacer: React.FC = () => {
  const { top } = useCustomSafeInsets()
  return <CustomHeightSpacer customHeight={top} enable />
}

const BottomScreenSpacer: React.FC = () => {
  const { bottom } = useCustomSafeInsets()
  return <CustomHeightSpacer customHeight={bottom} enable />
}

const CustomHeightSpacer = styled.View<{ customHeight: number; enable?: boolean }>(
  ({ customHeight, enable }) => ({
    height: enable ? customHeight : 0,
  })
)

interface FlexSpacerProps {
  flex?: number
}

const FlexSpacer = styled.View<FlexSpacerProps>(({ flex }) => ({
  flex: flex || 1,
}))

export const Spacer = {
  Flex: FlexSpacer,
  Row: RowSpacer,
  Column: ColumnSpacer,
  TopScreen: TopScreenSpacer,
  TabBar: TabBarSpacer,
  BottomScreen: BottomScreenSpacer,
}
