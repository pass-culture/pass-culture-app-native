import { StackScreenProps } from '@react-navigation/stack'
import colorAlpha from 'color-alpha'
import React, { FunctionComponent, useState } from 'react'
import { Animated } from 'react-native'
import { FlatList } from 'react-native-gesture-handler'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import styled, { useTheme } from 'styled-components/native'

import { OfferResponse } from 'api/gen'
import { useFavorite } from 'features/favorites/api'
import { BlackGradient } from 'features/home/components/BlackGradient'
import { navigateToHome } from 'features/navigation/helpers'
import { RootStackParamList } from 'features/navigation/RootNavigator/types'
import { homeNavConfig } from 'features/navigation/TabBar/helpers'
import { useGoBack } from 'features/navigation/useGoBack'
import { useOffer } from 'features/offer/api/useOffer'
import { useCategoryHomeLabelMapping } from 'libs/subcategories'
import { Offer } from 'shared/offer/types'
import { usePrePopulateOffer } from 'shared/offer/usePrePopulateOffer'
import { getAnimationState } from 'ui/animations/helpers/getAnimationState'
import { useOpacityTransition } from 'ui/animations/helpers/useOpacityTransition'
import { AnimatedIcon } from 'ui/components/AnimatedIcon'
import { ButtonSecondaryWhite } from 'ui/components/buttons/ButtonSecondaryWhite'
import { RoundedButton } from 'ui/components/buttons/RoundedButton'
import { AnimatedBlurHeader } from 'ui/components/headers/AnimatedBlurHeader'
import { BackButton } from 'ui/components/headers/BackButton'
import { CloseButton } from 'ui/components/headers/CloseButton'
import { Touchable } from 'ui/components/touchable/Touchable'
import { InternalTouchableLink } from 'ui/components/touchableLink/InternalTouchableLink'
import { TouchableOpacity } from 'ui/components/TouchableOpacity'
import { BackgroundBlueWithWhiteStatusBar } from 'ui/svg/BackgroundBlue'
import { PlainArrowNext } from 'ui/svg/icons/PlainArrowNext'
import { getSpacing, Spacer, Typo } from 'ui/theme'
import { getHeadingAttrs } from 'ui/theme/typographyAttrs/getHeadingAttrs'

type Props = StackScreenProps<RootStackParamList, 'MoodResults'>

const OFFER_HEIGHT = getSpacing(121)

export const MoodResults: FunctionComponent<Props> = ({ route }) => {
  const theme = useTheme()
  const { icons } = useTheme()
  const { goBack } = useGoBack(...homeNavConfig)

  let ids: number[] = []
  if (route.params.emoji === 'Aventure' && route.params.moodboard === 'Insolite')
    ids = [19288, 19289, 19290, 19292, 19293]
  if (route.params.emoji === 'In love' && route.params.moodboard === 'Fun')
    ids = [19295, 19294, 19291, 19296, 19297]

  const offers: OfferResponse[] = []
  ids.forEach((id) => {
    const { data } = useOffer({ offerId: id })

    if (data) {
      offers.push(data)
      console.log({ data })
    }
  })

  const tmpOffer: Offer = {
    _geoloc: { lat: 5.16193, lng: -52.6398 },
    objectID: '19289',
    offer: {
      dates: [1689105600],
      isDigital: false,
      isDuo: true,
      isEducational: false,
      name: 'Ne t’en fais, je fais de la purée',
      prices: [4100],
      subcategoryId: 'EVENEMENT_MUSIQUE',
      thumbUrl:
        'https://storage.googleapis.com/passculture-metier-ehp-testing-assets-fine-grained/thumbs/mediations/EERQ_1',
    },
    venue: {
      address: '1 boulevard Poissonnière',
      city: 'Paris',
      departmentCode: '75',
      id: 6106,
      name: 'Cinéma de la fin',
      postalCode: '75000',
      publicName: 'Cinéma de la fin',
    },
  }

  // const pressFavorite = useCallback(async () => {
  //   if (!isLoggedIn) {
  //     showSignInModal()
  //   } else if (favorite) {
  //     removeFavorite(favorite.id)
  //   } else {
  //     animateIcon(scaleFavoriteIconAnimatedValueRef.current)
  //     addFavorite({ offerId })
  //     if (isFavListFakeDoorEnabled) {
  //       const hasSeenFavListFakeDoor = await storage.readObject('has_seen_fav_list_fake_door')
  //       if (!hasSeenFavListFakeDoor) {
  //         analytics.logFavoriteListDisplayed('offer')
  //         showFavoriteListOfferModal()
  //       }
  //     }
  //   }
  // }, [
  //   addFavorite,
  //   favorite,
  //   isFavListFakeDoorEnabled,
  //   isLoggedIn,
  //   offerId,
  //   removeFavorite,
  //   showFavoriteListOfferModal,
  //   showSignInModal,
  // ])

  function handlePressOffer() {
    // We pre-populate the query-cache with the data from the search result for a smooth transition
    if (!tmpOffer.objectID) return
    prePopulateOffer({
      ...tmpOffer,
      categoryId: labelMapping[tmpOffer.offer.subcategoryId],
      thumbUrl: tmpOffer.offer.thumbUrl,
      name: tmpOffer.offer.name,
      offerId: tmpOffer.objectID,
    })
  }

  const prePopulateOffer = usePrePopulateOffer()

  const [ariaHiddenTitle, setAriaHiddenTitle] = useState(true)
  const labelMapping = useCategoryHomeLabelMapping()

  const { headerTransition, onScroll } = useOpacityTransition()

  const { animationState, containerStyle, blurContainerNative } = getAnimationState(
    theme,
    headerTransition
  )
  headerTransition.addListener((opacity) => setAriaHiddenTitle(opacity.value !== 1))

  const { top } = useSafeAreaInsets()
  const headerHeight = theme.appBarHeight + top

  const title = 'Tadaaa\u00a0!'
  const restart = 'Changer de mood'

  return (
    <Container>
      <BackgroundBlueWithWhiteStatusBar />
      <HeaderContainer style={containerStyle} height={headerHeight}>
        <Spacer.TopScreen />
        <AnimatedBlurHeader height={headerHeight} style={blurContainerNative} />
        <Spacer.Column numberOfSpaces={2} />
        <Row>
          <Spacer.Row numberOfSpaces={6} />
          <Touchable activeOpacity={0.5} onPress={goBack}>
            <AnimatedIcon
              Icon={BackButton}
              initialColor={theme.colors.white}
              testID={`animated-icon-backButton`}
              transition={animationState.transition}
              finalColor={theme.colors.black}
              size={icons.sizes.small}
            />
          </Touchable>
          <Spacer.Flex />
          <Title
            testID="venueHeaderName"
            style={{ opacity: headerTransition }}
            accessibilityHidden={ariaHiddenTitle}>
            <Body>{title}</Body>
          </Title>
          <ButtonContainer>
            <Touchable activeOpacity={0.5} onPress={navigateToHome}>
              <AnimatedIcon
                Icon={CloseButton}
                initialColor={theme.colors.white}
                testID={`animated-icon-closeButton`}
                transition={animationState.transition}
                finalColor={theme.colors.black}
                size={icons.sizes.small}
              />
            </Touchable>
          </ButtonContainer>
          <Spacer.Row numberOfSpaces={6} />
        </Row>
        <Spacer.Column numberOfSpaces={2} />
      </HeaderContainer>

      <ScrollContainer
        testID="survey-mood-container"
        scrollEventThrottle={20}
        bounces={false}
        onScroll={onScroll}>
        <Spacer.Column numberOfSpaces={8} />
        <CtaContainer activeOpacity={0.5}>
          <MoodRestart>{restart}</MoodRestart>
          <Spacer.Row numberOfSpaces={1} />
          <PlainArrowNext color={theme.colors.white} />
        </CtaContainer>
        <Spacer.Column numberOfSpaces={8} />
        <MoodSurveyTitle
          testID="MoodSurveyTitle"
          numberOfLines={2}
          adjustsFontSizeToFit
          allowFontScaling={false}>
          {title}
        </MoodSurveyTitle>
        <Spacer.Column numberOfSpaces={2} />
        <OfferContainer source={{ uri: tmpOffer.offer.thumbUrl }}>
          <CategoryContainer>
            <Category>{labelMapping[tmpOffer.offer.subcategoryId]}</Category>
          </CategoryContainer>
          <OfferTextContainer>
            <BlackGradient height={getSpacing(17.5)} />
            <BlackBackground>
              <OfferTitle numberOfLines={2}>{tmpOffer.offer.name}</OfferTitle>
              <RowOffer>
                <RoundedButton
                  iconName={'trash'}
                  // onPress={pressFavorite}
                />
                <Spacer.Row numberOfSpaces={5} />
                <StyledTouchableLink
                  navigateTo={
                    tmpOffer.objectID
                      ? { screen: 'Offer', params: { id: tmpOffer.objectID } }
                      : undefined
                  }
                  onBeforeNavigate={handlePressOffer}
                  accessibilityLabel={'to offer from survey'}>
                  <ButtonSecondaryWhite
                    wording={"Voir l'offre"}
                    accessibilityLabel="Aller vers la section Survey Questions"
                  />
                </StyledTouchableLink>
                <Spacer.Row numberOfSpaces={5} />
                <RoundedButton
                  // scaleAnimatedValue={scaleFavoriteIconAnimatedValueRef.current}
                  // initialColor={favorite ? theme.colors.primary : undefined}
                  // finalColor={favorite ? theme.colors.primary : theme.colors.black}
                  // iconName={favorite ? 'favorite-filled' : 'favorite'}
                  iconName={'favorite'}
                  // onPress={pressFavorite}
                  // disabled={removeFavoriteIsLoading || addFavoriteIsLoading}
                  // {...accessibleCheckboxProps({ checked: !!favorite, label: 'Mettre en favoris' })}
                />
              </RowOffer>
            </BlackBackground>
          </OfferTextContainer>
        </OfferContainer>
        <Spacer.Column numberOfSpaces={200} />
        <Typo.CaptionNeutralInfo>{route.params.emoji}</Typo.CaptionNeutralInfo>
        <Typo.CaptionNeutralInfo>{route.params.terms}</Typo.CaptionNeutralInfo>
        <Typo.CaptionNeutralInfo>{route.params.moodboard}</Typo.CaptionNeutralInfo>
      </ScrollContainer>
    </Container>
  )
}

const Container = styled.View(({ theme }) => ({
  flex: 1,
  backgroundColor: theme.colors.white,
}))

const ScrollContainer = styled.ScrollView(({ theme }) => ({
  overflow: 'visible',
  marginHorizontal: theme.contentPage.marginHorizontal,
}))

const MoodSurveyTitle = styled(Typo.Title3).attrs(getHeadingAttrs(1))(({ theme }) => ({
  color: theme.colors.white,
}))

const MoodRestart = styled(Typo.Hint).attrs(getHeadingAttrs(1))(({ theme }) => ({
  textAlign: 'center',
  color: theme.colors.white,
}))

const Body = styled(Typo.Body)(({ theme }) => ({
  color: theme.colors.black,
}))

const HeaderContainer = styled(Animated.View)<{ height: number }>(({ theme, height }) => ({
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  height,
  zIndex: theme.zIndex.header,
  borderBottomColor: theme.colors.greyLight,
  borderBottomWidth: 1,
}))

const ButtonContainer = styled.View({
  alignItems: 'center',
  flex: 1,
  flexDirection: 'row',
  justifyContent: 'flex-end',
  paddingLeft: getSpacing(3),
  paddingRight: getSpacing(3),
})

const OfferContainer = styled.ImageBackground(({ theme }) => ({
  // the overflow: hidden allow to add border radius to the image
  // https://stackoverflow.com/questions/49442165/how-do-you-add-borderradius-to-imagebackground/57616397
  height: OFFER_HEIGHT,
  overflow: 'hidden',
  borderRadius: theme.borderRadius.radius,
  width: '100%',
  border: 1,
  borderColor: theme.colors.greyMedium,
}))

const Row = styled.View({
  flex: 1,
  flexDirection: 'row',
  alignItems: 'center',
})

const RowOffer = styled.View({
  flex: 1,
  flexDirection: 'row',
  justifyContent: 'space-around',
  alignItems: 'center',
})

const CtaContainer = styled(TouchableOpacity)({
  flexDirection: 'row',
  justifyContent: 'center',
  alignItems: 'center',
  right: 0,
})

const CategoryContainer = styled.View(({ theme }) => ({
  position: 'absolute',
  top: getSpacing(4),
  right: getSpacing(4),
  backgroundColor: theme.colors.black,
  borderRadius: getSpacing(1),
  padding: getSpacing(1),
}))

const Category = styled(Typo.Caption)(({ theme }) => ({
  color: theme.colors.white,
}))

const OfferTextContainer = styled.View({ position: 'absolute', bottom: 0, left: 0, right: 0 })

const BlackBackground = styled.View(({ theme }) => ({
  height: 160,
  padding: getSpacing(4),
  paddingTop: getSpacing(8),
  backgroundColor: colorAlpha(theme.colors.black, 0.9),
}))

const OfferTitle = styled(Typo.Title4)(({ theme }) => ({
  color: theme.colors.white,
  textAlign: 'center',
}))

const Title = styled(Animated.Text).attrs({
  numberOfLines: 2,
})({
  flexShrink: 1,
  textAlign: 'center',
})

const StyledTouchableLink = styled(InternalTouchableLink)(({ theme }) => ({
  marginHorizontal: theme.contentPage.marginHorizontal,
}))
