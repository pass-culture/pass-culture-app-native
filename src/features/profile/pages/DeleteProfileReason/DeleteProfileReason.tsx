import React from 'react'
import { FlatList, Platform, ViewStyle } from 'react-native'
import styled from 'styled-components/native'

import { useAuthContext } from 'features/auth/context/AuthContext'
import { getProfilePropConfig } from 'features/navigation/ProfileStackNavigator/getProfilePropConfig'
import { getTabHookConfig } from 'features/navigation/TabBar/getTabHookConfig'
import { useGoBack } from 'features/navigation/useGoBack'
import { analytics } from 'libs/analytics/provider'
import { getAge } from 'shared/user/getAge'
// eslint-disable-next-line local-rules/no-theme-from-theme
import { theme } from 'theme'
import { HeroButtonList } from 'ui/components/buttons/HeroButtonList'
import { InternalNavigationProps } from 'ui/components/touchableLink/types'
import { SecondaryPageWithBlurHeader } from 'ui/pages/SecondaryPageWithBlurHeader'
import { SadFace } from 'ui/svg/icons/SadFace'
import { getSpacing, Spacer, Typo } from 'ui/theme'
import { getHeadingAttrs } from 'ui/theme/typographyAttrs/getHeadingAttrs'

const VIEWABILITY_CONFIG = { itemVisiblePercentThreshold: 100 }

const isWeb = Platform.OS === 'web'

type ReasonButton = {
  wording: string
  navigateTo: InternalNavigationProps['navigateTo']
  analyticsReason: string
}

const reasonButtons = (canDelete: boolean): ReasonButton[] => [
  {
    wording: 'J’aimerais créer un compte avec une adresse e-mail différente',
    navigateTo: { ...getProfilePropConfig('ChangeEmail', { showModal: true }) },
    analyticsReason: 'changeEmail',
  },
  {
    wording: 'Je n’utilise plus l’application',
    navigateTo: {
      ...getProfilePropConfig(
        canDelete ? 'DeleteProfileConfirmation' : 'DeleteProfileAccountNotDeletable'
      ),
    },
    analyticsReason: 'noLongerUsed',
  },
  {
    wording: 'Je n’ai plus de crédit ou très peu de crédit restant',
    navigateTo: {
      ...getProfilePropConfig(
        canDelete ? 'DeleteProfileConfirmation' : 'DeleteProfileAccountNotDeletable'
      ),
    },
    analyticsReason: 'noMoreCredit',
  },
  {
    wording: 'Je souhaite supprimer mes données personnelles',
    navigateTo: {
      ...getProfilePropConfig(
        canDelete ? 'DeleteProfileConfirmation' : 'DeleteProfileAccountNotDeletable'
      ),
    },
    analyticsReason: 'dataDeletion',
  },
  {
    wording: 'Je pense que quelqu’un d’autre a accès à mon compte',
    navigateTo: {
      ...getProfilePropConfig('DeleteProfileAccountHacked'),
    },
    analyticsReason: 'hackedAccount',
  },
  {
    wording: 'Autre',
    navigateTo: {
      ...getProfilePropConfig('DeleteProfileContactSupport'),
    },
    analyticsReason: 'other',
  },
]

export function DeleteProfileReason() {
  const { user } = useAuthContext()
  const userIsDefinedAndAbove21 = user?.birthDate && getAge(user?.birthDate) >= 21
  const canDeleteProfile = !user?.isBeneficiary || userIsDefinedAndAbove21
  const reasons = reasonButtons(!!canDeleteProfile)
  const { goBack } = useGoBack(...getTabHookConfig('Profile'))

  return (
    <SecondaryPageWithBlurHeader onGoBack={goBack} title="Suppression de compte">
      <FlatList
        viewabilityConfig={VIEWABILITY_CONFIG}
        ListHeaderComponent={
          <HeaderContainer>
            <StyledIcon />
            <TitlesContainer>
              <Typo.Title3 {...getHeadingAttrs(1)}>
                Pourquoi souhaites-tu supprimer ton compte&nbsp;?
              </Typo.Title3>
              <Typo.Body>
                Triste de te voir partir&nbsp;! Dis-nous pourquoi pour nous aider à améliorer
                l’application.
              </Typo.Body>
            </TitlesContainer>
          </HeaderContainer>
        }
        ListFooterComponent={Spacer.BottomScreen}
        contentContainerStyle={flatListStyles}
        data={reasons}
        renderItem={({ item }) => {
          const { wording, navigateTo, analyticsReason } = item
          return (
            <ItemContainer>
              <HeroButtonList
                Title={<Typo.BodyAccent>{wording}</Typo.BodyAccent>}
                navigateTo={navigateTo}
                onBeforeNavigate={() => analytics.logSelectDeletionReason(analyticsReason)}
                accessibilityLabel={wording}
              />
            </ItemContainer>
          )
        }}
      />
    </SecondaryPageWithBlurHeader>
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

const flatListStyles: ViewStyle = {
  paddingHorizontal: theme.contentPage.marginHorizontal,
  paddingBottom: getSpacing(8),
  maxWidth: theme.contentPage.maxWidth,
  width: '100%',
  alignSelf: 'center',
  gap: theme.designSystem.size.spacing.l, //works only on mobile
}

const StyledIcon = styled(SadFace).attrs(({ theme }) => ({
  size: theme.illustrations.sizes.medium,
  color: theme.designSystem.color.icon.brandPrimary,
}))({ width: '100%' })
