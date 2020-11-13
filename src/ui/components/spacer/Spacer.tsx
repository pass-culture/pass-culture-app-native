import React from 'react'
import styled from 'styled-components/native'

import { useTabBarHeight } from 'features/navigation/TabBar/useTabBarHeight'
import { getSpacing } from 'ui/theme/spacing'

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
  const tabBarHeight = useTabBarHeight()
  return <TabBarPlaceholder tabBarHeight={tabBarHeight} />
}
const TabBarPlaceholder = styled.View<{ tabBarHeight: number }>(({ tabBarHeight }) => ({
  height: tabBarHeight,
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
  TabBar: TabBarSpacer,
}
