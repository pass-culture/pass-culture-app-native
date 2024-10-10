import React, { useMemo } from 'react'
import { Platform } from 'react-native'
import styled from 'styled-components/native'

import { useHandleHover } from 'libs/hooks/useHandleHover'
import { ViewGap } from 'ui/components/ViewGap/ViewGap'
import { AccessibleIcon } from 'ui/svg/icons/types'
import { getSpacing, Spacer, TypoDS } from 'ui/theme'

import { TouchableTab } from './TouchableTab'

type InfoTabProps<TabKeyType extends string> = {
  tab: TabKeyType
  selectedTab: TabKeyType
  Icon?: React.FC<AccessibleIcon>
  onPress: () => void
}

export const InfoTab = <TabKeyType extends string>({
  tab,
  selectedTab,
  Icon,
  onPress,
}: InfoTabProps<TabKeyType>) => {
  const isSelected = selectedTab === tab
  const { isHover, ...webHoverProps } = useHandleHover()
  const hoverProps = Platform.OS === 'web' ? webHoverProps : {}

  const StyledIcon = useMemo(() => {
    return Icon
      ? styled(Icon).attrs(({ theme }) => ({
          color: isSelected ? theme.colors.primary : theme.colors.greyDark,
          size: theme.icons.sizes.extraSmall,
        }))``
      : null
  }, [Icon, isSelected])

  return (
    <StyledTouchableTab id={tab} onPress={onPress} selected={isSelected} {...hoverProps}>
      <TabTitleContainer gap={2}>
        {StyledIcon ? <StyledIcon testID="tabIcon" /> : null}
        <TabTitle isHover={isHover} isSelected={isSelected}>
          {tab}
        </TabTitle>
      </TabTitleContainer>
      <Spacer.Column numberOfSpaces={2} />
      <BarOfSelectedTab isSelected={isSelected} />
    </StyledTouchableTab>
  )
}

const StyledTouchableTab = styled(TouchableTab)({
  flex: 1,
  maxWidth: getSpacing(45),
})

const TabTitleContainer = styled(ViewGap)({
  flexGrow: 1,
  justifyContent: 'center',
  alignItems: 'center',
  flexDirection: 'row',
})

const TabTitle = styled(TypoDS.BodySemiBold)<{ isSelected: boolean; isHover: boolean }>(
  ({ isSelected, isHover, theme }) => ({
    textAlign: 'center',
    color: isSelected || isHover ? theme.colors.primary : theme.colors.greyDark,
  })
)

const BarOfSelectedTab = styled.View<{ isSelected: boolean }>(({ theme, isSelected }) => ({
  bottom: 0,
  height: getSpacing(1),
  width: '100%',
  backgroundColor: isSelected ? theme.colors.primary : 'transparent',
  borderRadius: getSpacing(1),
}))
