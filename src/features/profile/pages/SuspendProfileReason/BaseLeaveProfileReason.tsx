import React, { useMemo } from 'react'
import { FlatList, Platform, ViewStyle } from 'react-native'
import styled, { useTheme } from 'styled-components/native'

import { getTabHookConfig } from 'features/navigation/TabBar/getTabHookConfig'
import { useGoBack } from 'features/navigation/useGoBack'
import { analytics } from 'libs/analytics/provider'
import { HeroButtonList } from 'ui/components/buttons/HeroButtonList'
import { InternalNavigationProps } from 'ui/components/touchableLink/types'
import { PageWithHeader } from 'ui/pages/PageWithHeader'
import { SadFace } from 'ui/svg/icons/SadFace'
import { Spacer, Typo } from 'ui/theme'
import { setTextSemantic } from 'ui/theme/typographyAttrs/setTextSemantic'

const VIEWABILITY_CONFIG = { itemVisiblePercentThreshold: 100 }

const isWeb = Platform.OS === 'web'

export type ReasonButton = {
  wording: string
  navigateTo: InternalNavigationProps['navigateTo']
  analyticsReason: string
}

interface BaseLeaveProfileReasonProps {
  pageTitle: string
  title: string
  subtitle: string
  reasonsButtons: ReasonButton[]
  onAnalyticsLog?: (reason: string) => void
}

export const BaseLeaveProfileReason = ({
  pageTitle,
  title,
  subtitle,
  reasonsButtons,
  onAnalyticsLog,
}: BaseLeaveProfileReasonProps) => {
  const { goBack } = useGoBack(...getTabHookConfig('Profile'))
  const theme = useTheme()
  const flatListStyles: ViewStyle = useMemo(
    () => ({
      paddingHorizontal: theme.contentPage.marginHorizontal,
      paddingBottom: theme.designSystem.size.spacing.xxl,
      maxWidth: theme.contentPage.maxWidth,
      width: '100%',
      alignSelf: 'center',
      gap: theme.designSystem.size.spacing.l, //works only on mobile
    }),
    [theme]
  )

  return (
    <PageWithHeader
      shouldLimitWidth
      onGoBack={goBack}
      title={pageTitle}
      scrollChildren={
        <FlatList
          viewabilityConfig={VIEWABILITY_CONFIG}
          ListHeaderComponent={
            <HeaderContainer>
              <StyledIcon />
              <TitlesContainer>
                <Typo.Title3 {...setTextSemantic('h1')}>{title}</Typo.Title3>
                <Typo.Body>{subtitle}</Typo.Body>
              </TitlesContainer>
            </HeaderContainer>
          }
          ListFooterComponent={Spacer.BottomScreen}
          contentContainerStyle={flatListStyles}
          data={reasonsButtons}
          renderItem={({ item }) => {
            const { wording, navigateTo, analyticsReason } = item
            return (
              <ItemContainer>
                <HeroButtonList
                  Title={<Typo.BodyAccent>{wording}</Typo.BodyAccent>}
                  navigateTo={navigateTo}
                  onBeforeNavigate={() =>
                    onAnalyticsLog
                      ? onAnalyticsLog(analyticsReason)
                      : analytics.logSelectSuspensionReason(analyticsReason)
                  }
                  accessibilityLabel={wording}
                />
              </ItemContainer>
            )
          }}
        />
      }
    />
  )
}

const ItemContainer = styled.View(({ theme }) => ({
  paddingBottom: isWeb ? theme.designSystem.size.spacing.l : 0,
}))

const HeaderContainer = styled.View(({ theme }) => ({
  alignItems: 'center',
  paddingBottom: theme.designSystem.size.spacing.s,
}))

const TitlesContainer = styled.View(({ theme }) => ({
  alignItems: 'flex-start',
  gap: theme.designSystem.size.spacing.l,
  width: '100%',
}))

const StyledIcon = styled(SadFace).attrs(({ theme }) => ({
  size: theme.illustrations.sizes.medium,
  color: theme.designSystem.color.icon.brandPrimary,
}))({ width: '100%' })
