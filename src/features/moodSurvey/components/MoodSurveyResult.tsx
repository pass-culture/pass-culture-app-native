import React, { FunctionComponent } from 'react'
import { Animated } from 'react-native'
import styled from 'styled-components/native'

import { BlackGradient } from 'features/home/components/BlackGradient'
import { useOffer } from 'features/offer/api/useOffer'
import { useCategoryHomeLabelMapping } from 'libs/subcategories'
import { Offer } from 'shared/offer/types'
import { usePrePopulateOffer } from 'shared/offer/usePrePopulateOffer'
import { ButtonSecondaryWhite } from 'ui/components/buttons/ButtonSecondaryWhite'
import { RoundedButton } from 'ui/components/buttons/RoundedButton'
import { InternalTouchableLink } from 'ui/components/touchableLink/InternalTouchableLink'
import { Spacer, getSpacing, Typo } from 'ui/theme'

type Props = {
  offerId: number
}

const OFFER_HEIGHT = getSpacing(121)

export const MoodSurveyResult: FunctionComponent<Props> = ({ offerId }) => {
  const prePopulateOffer = usePrePopulateOffer()
  const labelMapping = useCategoryHomeLabelMapping()

  const { data: offer } = useOffer({ offerId })

  function handlePressOffer() {
    // We pre-populate the query-cache with the data from the search result for a smooth transition
    if (!offer) return
    prePopulateOffer({
      ...offer,
      categoryId: labelMapping[offer.subcategoryId],
      thumbUrl: offer.image?.url,
      name: offer.name,
      offerId: offer.objectID,
    })
  }

  return (
    <OfferContainer source={{ uri: offer?.image?.url }}>
      <CategoryContainer>
        <Category>{labelMapping[offer?.subcategoryId]}</Category>
      </CategoryContainer>
      <OfferTextContainer>
        <BlackGradient height={getSpacing(17.5)} />
        <BlackBackground>
          <OfferTitle numberOfLines={2}>{offer?.name}</OfferTitle>
          <RowOffer>
            <RoundedButton
              iconName={'trash'}
              // onPress={pressFavorite}
            />
            <Spacer.Row numberOfSpaces={5} />
            <StyledTouchableLink
              navigateTo={
                tmpOffer.objectID
                  ? { screen: 'Offer', params: { id: offer?.objectID } }
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
  )
}

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

const RowOffer = styled.View({
  flex: 1,
  flexDirection: 'row',
  justifyContent: 'space-around',
  alignItems: 'center',
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
  backgroundColor: theme.colors.black,
  opacity: '90%',
}))

const OfferTitle = styled(Typo.Title4)(({ theme }) => ({
  color: theme.colors.white,
  textAlign: 'center',
}))

const StyledTouchableLink = styled(InternalTouchableLink)(({ theme }) => ({
  marginHorizontal: theme.contentPage.marginHorizontal,
}))
