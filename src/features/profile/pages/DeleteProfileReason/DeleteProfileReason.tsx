import colorAlpha from 'color-alpha'
import React, { useRef } from 'react'
import { FlatList, Platform, ViewStyle } from 'react-native'
import LinearGradient from 'react-native-linear-gradient'
import styled from 'styled-components/native'

import { useAuthContext } from 'features/auth/context/AuthContext'
import { getProfileNavConfig } from 'features/navigation/ProfileStackNavigator/getProfileNavConfig'
import { getTabNavConfig } from 'features/navigation/TabBar/helpers'
import { useGoBack } from 'features/navigation/useGoBack'
import { useOnViewableItemsChanged } from 'features/subscription/helpers/useOnViewableItemsChanged'
import { analytics } from 'libs/analytics/provider'
import { AnimatedViewRefType, createAnimatableComponent } from 'libs/react-native-animatable'
import { getAge } from 'shared/user/getAge'
import { theme } from 'theme'
import { HeroButtonList } from 'ui/components/buttons/HeroButtonList'
import { BlurHeader } from 'ui/components/headers/BlurHeader'
import {
  PageHeaderWithoutPlaceholder,
  useGetHeaderHeight,
} from 'ui/components/headers/PageHeaderWithoutPlaceholder'
import { InternalNavigationProps } from 'ui/components/touchableLink/types'
import { BicolorSadFace } from 'ui/svg/icons/BicolorSadFace'
import { getSpacing, Spacer, Typo } from 'ui/theme'
import { getHeadingAttrs } from 'ui/theme/typographyAttrs/getHeadingAttrs'

const GRADIENT_HEIGHT = getSpacing(30)
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
    navigateTo: { ...getProfileNavConfig('ChangeEmail', { showModal: true }) },
    analyticsReason: 'changeEmail',
  },
  {
    wording: 'Je n’utilise plus l’application',
    navigateTo: {
      ...getProfileNavConfig(
        canDelete ? 'DeleteProfileConfirmation' : 'DeleteProfileAccountNotDeletable'
      ),
    },
    analyticsReason: 'noLongerUsed',
  },
  {
    wording: 'Je n’ai plus de crédit ou très peu de crédit restant',
    navigateTo: {
      ...getProfileNavConfig(
        canDelete ? 'DeleteProfileConfirmation' : 'DeleteProfileAccountNotDeletable'
      ),
    },
    analyticsReason: 'noMoreCredit',
  },
  {
    wording: 'Je souhaite supprimer mes données personnelles',
    navigateTo: {
      ...getProfileNavConfig(
        canDelete ? 'DeleteProfileConfirmation' : 'DeleteProfileAccountNotDeletable'
      ),
    },
    analyticsReason: 'dataDeletion',
  },
  {
    wording: 'Je pense que quelqu’un d’autre a accès à mon compte',
    navigateTo: {
      ...getProfileNavConfig('DeleteProfileAccountHacked'),
    },
    analyticsReason: 'hackedAccount',
  },
  {
    wording: 'Autre',
    navigateTo: {
      ...getProfileNavConfig('DeleteProfileContactSupport'),
    },
    analyticsReason: 'other',
  },
]

export function DeleteProfileReason() {
  const headerHeight = useGetHeaderHeight()
  const gradientRef = useRef<AnimatedViewRefType>(null)
  const { user } = useAuthContext()
  const userIsDefinedAndAbove21 = user?.birthDate && getAge(user?.birthDate) >= 21
  const canDeleteProfile = !user?.isBeneficiary || userIsDefinedAndAbove21
  const reasons = reasonButtons(!!canDeleteProfile)
  const { onViewableItemsChanged } = useOnViewableItemsChanged(gradientRef, reasons)
  const { goBack } = useGoBack(...getTabNavConfig('Profile'))

  return (
    <React.Fragment>
      <PageHeaderWithoutPlaceholder onGoBack={goBack} />
      <FlatList
        onViewableItemsChanged={isWeb ? null : onViewableItemsChanged}
        viewabilityConfig={VIEWABILITY_CONFIG}
        ListHeaderComponent={
          <HeaderContainer>
            <HeaderHeightSpacer headerHeight={headerHeight} />
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
      <Gradient ref={gradientRef} />
      <BlurHeader height={headerHeight} />
    </React.Fragment>
  )
}

const ItemContainer = styled.View({
  paddingBottom: isWeb ? getSpacing(4) : 0,
})

const HeaderHeightSpacer = styled.View.attrs<{ headerHeight: number }>({})<{
  headerHeight: number
}>(({ headerHeight }) => ({
  paddingTop: headerHeight,
}))

const HeaderContainer = styled.View({
  alignItems: 'center',
  paddingBottom: getSpacing(2),
})

const TitlesContainer = styled.View({
  alignItems: 'flex-start',
  gap: getSpacing(4),
  width: '100%',
})

const flatListStyles: ViewStyle = {
  paddingHorizontal: theme.contentPage.marginHorizontal,
  paddingBottom: getSpacing(8),
  maxWidth: theme.contentPage.maxWidth,
  width: '100%',
  alignSelf: 'center',
  gap: getSpacing(4), //works only on mobile
}

const StyledIcon = styled(BicolorSadFace).attrs(({ theme }) => ({
  size: theme.illustrations.sizes.medium,
}))({ width: '100%' })

const AnimatedGradient = createAnimatableComponent(LinearGradient)
const Gradient = styled(AnimatedGradient).attrs(({ theme }) => ({
  colors: [colorAlpha(theme.colors.white, 0), theme.colors.white],
  locations: [0, 1],
  pointerEvents: 'none',
}))({
  position: 'absolute',
  height: GRADIENT_HEIGHT,
  left: 0,
  right: 0,
  bottom: 0,
})
