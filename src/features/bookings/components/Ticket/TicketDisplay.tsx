import React from 'react'
import { View } from 'react-native'
import styled, { useTheme } from 'styled-components/native'

import { CutoutHorizontal } from 'ui/svg/CutoutHorizontal'
import { Stroke } from 'ui/svg/Stroke'
import { getSpacing } from 'ui/theme'

export const TICKET_PUNCHED_MIDDLE_HEIGHT = getSpacing(10)

type TicketContentProps = {
  bottomContent: React.JSX.Element
  topContent: React.JSX.Element
  infoBanner?: React.JSX.Element
  display: 'punched' | 'full'
  onTopBlockLayout?: (height: number) => void
}

export const TicketDisplay = ({
  infoBanner,
  bottomContent,
  topContent,
  display,
  onTopBlockLayout,
}: TicketContentProps) => {
  const { designSystem } = useTheme()

  const backgroundColor = designSystem.color.background.default
  const borderColor = designSystem.color.border.subtle

  return display === 'punched' ? (
    <View testID="ticket-punched">
      <TopBlock
        onLayout={(e) => {
          const { height } = e.nativeEvent.layout
          onTopBlockLayout?.(height)
        }}>
        {topContent}
      </TopBlock>
      <MiddleBlock>
        <CutoutHorizontal
          orientation="left"
          backgroundColor={backgroundColor}
          color={borderColor}
        />
        <ContainerStrokedLine>
          <Stroke color={borderColor} size="100%" />
        </ContainerStrokedLine>
        <CutoutHorizontal
          orientation="right"
          backgroundColor={backgroundColor}
          color={borderColor}
        />
      </MiddleBlock>

      <BottomBlock>
        {infoBanner}
        {bottomContent}
      </BottomBlock>
    </View>
  ) : (
    <FullBlock testID="ticket-full">
      <View
        onLayout={(e) => {
          const { height } = e.nativeEvent.layout
          onTopBlockLayout?.(height)
        }}>
        {topContent}
      </View>
      <FullContainerStrokedLine>
        <Stroke color={borderColor} size="100%" />
      </FullContainerStrokedLine>
      {infoBanner}
      {bottomContent}
    </FullBlock>
  )
}

const FullContainerStrokedLine = styled.View(({ theme }) => ({
  height: theme.designSystem.size.spacing.xxl,
  backgroundColor: theme.designSystem.color.background.default,
  justifyContent: 'center',
}))

const ContainerStrokedLine = styled.View(({ theme }) => ({
  flex: 1,
  backgroundColor: theme.designSystem.color.background.default,
  justifyContent: 'center',
  alignContent: 'center',
  paddingHorizontal: theme.designSystem.size.spacing.l,
}))

const ContentBlock = styled.View(({ theme }) => ({
  backgroundColor: theme.designSystem.color.background.default,
  gap: theme.designSystem.size.spacing.xl,
  paddingHorizontal: theme.designSystem.size.spacing.xxl,
  borderColor: theme.designSystem.color.border.subtle,
  borderLeftWidth: 1,
  borderRightWidth: 1,
  paddingVertical: theme.designSystem.size.spacing.xl,
}))

const FullBlock = styled(ContentBlock)(({ theme }) => ({
  borderRadius: theme.designSystem.size.borderRadius.xl,
  borderWidth: 1,
}))

const BottomBlock = styled(ContentBlock)(({ theme }) => ({
  justifyContent: 'center',
  borderBottomWidth: 1,
  borderBottomLeftRadius: theme.designSystem.size.spacing.xl,
  borderBottomRightRadius: theme.designSystem.size.spacing.xl,
}))

const TopBlock = styled(ContentBlock)(({ theme }) => ({
  borderTopWidth: 1,
  borderTopLeftRadius: theme.designSystem.size.spacing.xl,
  borderTopRightRadius: theme.designSystem.size.spacing.xl,
}))
const MiddleBlock = styled.View({
  flexDirection: 'row',
  height: TICKET_PUNCHED_MIDDLE_HEIGHT,
})
