import React, { useMemo } from 'react'
import { Platform } from 'react-native'
import styled from 'styled-components/native'

import { PastilleType } from 'features/venue/types'
import { AccessibilityRole } from 'libs/accessibilityRole/accessibilityRole'
import { useHandleHover } from 'libs/hooks/useHandleHover'
import { getComputedAccessibilityLabel } from 'shared/accessibility/getComputedAccessibilityLabel'
import { ViewGap } from 'ui/components/ViewGap/ViewGap'
import { AccessibleIcon } from 'ui/svg/icons/types'
import { getSpacing, Typo } from 'ui/theme'

import { TouchableTab } from './TouchableTab'

type InfoTabProps<TabKeyType extends string> = {
  tab: TabKeyType
  tabIndex: number
  totalTabs: number
  selectedTab: TabKeyType
  onPress: () => void
  Icon?: React.FC<AccessibleIcon>
  pastille?: PastilleType
}

const isWeb = Platform.OS === 'web'

export const InfoTab = <TabKeyType extends string>({
  tab,
  tabIndex,
  totalTabs,
  selectedTab,
  onPress,
  Icon,
  pastille,
}: InfoTabProps<TabKeyType>) => {
  const isSelected = selectedTab === tab
  const { isHover, ...webHoverProps } = useHandleHover()
  const hoverProps = Platform.OS === 'web' ? webHoverProps : {}

  const StyledIcon = useMemo(() => {
    return Icon
      ? styled(Icon).attrs(({ theme }) => ({
          color: isSelected
            ? theme.designSystem.color.icon.brandPrimary
            : theme.designSystem.color.icon.disabled,
          size: theme.icons.sizes.extraSmall,
        }))``
      : null
  }, [Icon, isSelected])

  // In web AccessibilityRole.TAB return none for screen readers, so we use BUTTON instead
  const accessibilityRole = isWeb ? AccessibilityRole.TAB : AccessibilityRole.BUTTON

  const selectedLabel = isSelected ? 'sélectionné' : 'non sélectionné'

  // We recompute the accessibility label here to include the role in mobile
  const accessibilityLabel = isWeb
    ? tab
    : getComputedAccessibilityLabel(`Onglet ${tabIndex}/${totalTabs}`, tab, selectedLabel)

  return (
    <StyledTouchableTab
      accessibilityRole={accessibilityRole}
      accessibilityLabel={accessibilityLabel}
      id={tab}
      onPress={onPress}
      selected={isSelected}
      {...hoverProps}>
      <TabTitleContainer gap={2}>
        {StyledIcon ? <StyledIcon testID="tabIcon" /> : null}
        <TabTitle isHover={isHover} isSelected={isSelected}>
          {tab}
        </TabTitle>
        {pastille ? (
          <PastilleContainer accessibilityLabel={pastille.accessibilityLabel} testID="pastille">
            <Counter>{pastille.label}</Counter>
          </PastilleContainer>
        ) : null}
      </TabTitleContainer>
      <BarOfSelectedTab isSelected={isSelected} />
    </StyledTouchableTab>
  )
}

const StyledTouchableTab = styled(TouchableTab)({
  flex: 1,
  maxWidth: getSpacing(45),
})

const TabTitleContainer = styled(ViewGap)(({ theme }) => ({
  flexGrow: 1,
  justifyContent: 'center',
  alignItems: 'center',
  flexDirection: 'row',
  marginBottom: theme.designSystem.size.spacing.s,
}))

const TabTitle = styled(Typo.BodyAccent)<{ isSelected: boolean; isHover: boolean }>(
  ({ isSelected, isHover, theme }) => ({
    textAlign: 'center',
    color:
      isSelected || isHover
        ? theme.designSystem.color.text.brandPrimary
        : theme.designSystem.color.text.disabled,
  })
)

const BarOfSelectedTab = styled.View<{ isSelected: boolean }>(({ theme, isSelected }) => ({
  bottom: 0,
  height: theme.designSystem.size.spacing.xs,
  width: '100%',
  backgroundColor: isSelected ? theme.designSystem.color.background.brandPrimary : 'transparent',
  borderRadius: theme.designSystem.size.borderRadius.s,
}))

const PastilleContainer = styled.View(({ theme }) => ({
  backgroundColor: theme.designSystem.color.background.brandPrimary,
  paddingHorizontal: theme.designSystem.size.spacing.xs,
  borderRadius: theme.designSystem.size.borderRadius.l,
}))

const Counter = styled(Typo.BodyAccentXs)(({ theme }) => ({
  color: theme.designSystem.color.text.lockedInverted,
}))
