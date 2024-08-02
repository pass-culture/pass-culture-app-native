import colorAlpha from 'color-alpha'
import React, { useRef } from 'react'
import { FlatList, ViewStyle } from 'react-native'
import LinearGradient from 'react-native-linear-gradient'
import styled from 'styled-components/native'

import { RootScreenNames } from 'features/navigation/RootNavigator/types'
import { useOnViewableItemsChanged } from 'features/subscription/helpers/useOnViewableItemsChanged'
import { AgeButton as ReasonButton } from 'features/tutorial/components/AgeButton'
import { AnimatedViewRefType, createAnimatableComponent } from 'libs/react-native-animatable'
import { theme } from 'theme'
import { BlurHeader } from 'ui/components/headers/BlurHeader'
import {
  PageHeaderWithoutPlaceholder,
  useGetHeaderHeight,
} from 'ui/components/headers/PageHeaderWithoutPlaceholder'
import { Li } from 'ui/components/Li'
import { BicolorSadFace } from 'ui/svg/icons/BicolorSadFace'
import { getSpacing, Spacer, Typo } from 'ui/theme'
import { getHeadingAttrs } from 'ui/theme/typographyAttrs/getHeadingAttrs'

const GRADIENT_HEIGHT = getSpacing(30)
const VIEWABILITY_CONFIG = { itemVisiblePercentThreshold: 100 }

type ReasonButton = {
  wording: string
  navigateTo: RootScreenNames
}

const reasonButtons: ReasonButton[] = [
  {
    wording: 'J’aimerais créer un compte avec une adresse e-mail différente',
    navigateTo: 'ConfirmDeleteProfile',
  },
  {
    wording: 'Je n’utilise plus l’application',
    navigateTo: 'ConfirmDeleteProfile',
  },
  {
    wording: 'Je n’ai plus de crédit ou très peu de crédit restant',
    navigateTo: 'ConfirmDeleteProfile',
  },
  {
    wording: 'Je souhaite supprimer mes données personnelles',
    navigateTo: 'ConfirmDeleteProfile',
  },
  {
    wording: 'Ma boite mail a été piratée',
    navigateTo: 'ConfirmDeleteProfile',
  },
  {
    wording: 'Je pense que quelqu’un d’autre a accès à mon compte',
    navigateTo: 'ConfirmDeleteProfile',
  },
  {
    wording: 'Autre',
    navigateTo: 'ConfirmDeleteProfile',
  },
]

export function DeleteProfileReason() {
  const headerHeight = useGetHeaderHeight()
  const gradientRef = useRef<AnimatedViewRefType>(null)
  const { onViewableItemsChanged } = useOnViewableItemsChanged(gradientRef, reasonButtons)

  return (
    <React.Fragment>
      <PageHeaderWithoutPlaceholder />
      <Content>
        <FlatList
          listAs="ul"
          onViewableItemsChanged={onViewableItemsChanged}
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
          ListFooterComponent={
            <React.Fragment>
              <Spacer.BottomScreen />
            </React.Fragment>
          }
          contentContainerStyle={flatListStyles}
          data={reasonButtons}
          renderItem={({ item }) => {
            const { wording, navigateTo } = item
            return (
              <Li>
                <ReasonButton navigateTo={{ screen: navigateTo }} accessibilityLabel={wording}>
                  <Typo.ButtonText>{wording}</Typo.ButtonText>
                </ReasonButton>
              </Li>
            )
          }}
        />
        <Gradient ref={gradientRef} bottomViewHeight={0} />
      </Content>
      <BlurHeader height={headerHeight} />
    </React.Fragment>
  )
}

const HeaderHeightSpacer = styled.View.attrs<{ headerHeight: number }>({})<{
  headerHeight: number
}>(({ headerHeight }) => ({
  paddingTop: headerHeight,
}))

const HeaderContainer = styled.View(() => ({
  alignItems: 'center',
  paddingBottom: getSpacing(2),
}))

const TitlesContainer = styled.View(() => ({
  alignItems: 'flex-start',
  gap: getSpacing(4),
  width: '100%',
}))

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

const Content = styled.View({
  marginTop: getSpacing(2),
  flex: 1,
  alignContent: 'center',
})

const AnimatedGradient = createAnimatableComponent(LinearGradient)
const Gradient = styled(AnimatedGradient).attrs<{ bottomViewHeight: number }>(({ theme }) => ({
  colors: [colorAlpha(theme.colors.white, 0), theme.colors.white],
  locations: [0, 1],
  pointerEvents: 'none',
}))<{ bottomViewHeight: number }>(({ bottomViewHeight }) => ({
  position: 'absolute',
  height: GRADIENT_HEIGHT,
  left: 0,
  right: 0,
  bottom: bottomViewHeight,
}))
