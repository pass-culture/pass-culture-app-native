import colorAlpha from 'color-alpha'
import React from 'react'
import { StyleProp, View, ViewStyle } from 'react-native'
import styled from 'styled-components/native'

import { ButtonWithCaption } from 'features/home/components/modules/video/ButtonWithCaption'
import { triggerConsultOfferLog } from 'libs/analytics/helpers/triggerLogConsultOffer/triggerConsultOfferLog'
import { useCategoryIdMapping } from 'libs/subcategories'
import { Offer } from 'shared/offer/types'
import { usePrePopulateOffer } from 'shared/offer/usePrePopulateOffer'
import { ArrowAgain } from 'ui/svg/icons/ArrowAgain'
import { Offers } from 'ui/svg/icons/Offers'
import { getSpacing } from 'ui/theme'

export const VideoEndView: React.FC<{
  onPressReplay: () => void
  onPressSeeOffer: () => void
  offer?: Offer
  style: StyleProp<ViewStyle>
  moduleId: string
  moduleName: string
  homeEntryId: string
}> = ({ onPressReplay, offer, onPressSeeOffer, style, moduleId, moduleName, homeEntryId }) => {
  const prePopulateOffer = usePrePopulateOffer()
  const mapping = useCategoryIdMapping()

  return (
    <VideoEndViewContainer style={style}>
      <BlackView>
        <ButtonsContainer>
          <ButtonWithCaption
            onPress={onPressReplay}
            accessibilityLabel="Revoir la vidéo"
            wording="Revoir"
            icon={StyledReplayIcon}
          />
          {offer ? (
            <SeeOfferButtonContainer>
              <ButtonWithCaption
                onPress={() => {
                  onPressSeeOffer()
                  prePopulateOffer({
                    ...offer.offer,
                    offerId: +offer.objectID,
                    categoryId: mapping[offer.offer.subcategoryId],
                  })
                  triggerConsultOfferLog({
                    offerId: +offer.objectID,
                    from: 'video',
                    moduleId,
                    moduleName,
                    homeEntryId,
                  })
                }}
                navigateTo={{
                  screen: 'Offer',
                  params: { id: +offer.objectID },
                }}
                accessibilityLabel="Voir l’offre"
                wording="Voir l’offre"
                icon={StyledOffersIcon}
              />
            </SeeOfferButtonContainer>
          ) : null}
        </ButtonsContainer>
      </BlackView>
    </VideoEndViewContainer>
  )
}

const VideoEndViewContainer = styled(View)({
  position: 'absolute',
})

const ButtonsContainer = styled.View({
  flexDirection: 'row',
  justifyContent: 'center',
})

const StyledReplayIcon = styled(ArrowAgain).attrs(({ theme }) => ({
  size: theme.icons.sizes.smaller,
}))``

const StyledOffersIcon = styled(Offers).attrs(({ theme }) => ({
  size: theme.icons.sizes.smaller,
}))``

const BlackView = styled.View(({ theme }) => ({
  backgroundColor: colorAlpha(theme.designSystem.color.background.lockedInverted, 0.7),
  height: '100%',
  justifyContent: 'center',
  borderTopLeftRadius: theme.designSystem.size.borderRadius.l,
  borderTopRightRadius: theme.designSystem.size.borderRadius.l,
}))

const SeeOfferButtonContainer = styled.View({
  flexDirection: 'row',
  paddingLeft: getSpacing(9),
})
