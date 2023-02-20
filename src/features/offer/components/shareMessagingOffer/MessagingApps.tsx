import React, { useCallback } from 'react'
import styled from 'styled-components/native'

import { InstalledMessagingApps } from 'features/offer/components/shareMessagingOffer/InstalledMessagingApps'
import { MessagingAppContainer } from 'features/offer/components/shareMessagingOffer/MessagingAppContainer'
import { useShareOffer } from 'features/share/helpers/useShareOffer'
import { WebShareModal } from 'features/share/pages/WebShareModal'
import { useModal } from 'ui/components/modals/useModal'
import { ShareMessagingAppOther } from 'ui/components/ShareMessagingAppOther'
import { Ul } from 'ui/components/Ul'
import { getSpacing, Spacer, Typo } from 'ui/theme'
import { getHeadingAttrs } from 'ui/theme/typographyAttrs/getHeadingAttrs'

type MessagingAppsProps = {
  isEvent: boolean
  offerId: number
}

export const MessagingApps = ({ isEvent, offerId }: MessagingAppsProps) => {
  const title = isEvent ? 'Vas-y en bande organisée\u00a0!' : 'Partage ce bon plan\u00a0!'
  const { share, shareContent } = useShareOffer(offerId)
  const {
    visible: shareOfferModalVisible,
    showModal: showShareOfferModal,
    hideModal: hideShareOfferModal,
  } = useModal()

  const onOtherPress = useCallback(() => {
    share()
    showShareOfferModal()
  }, [share, showShareOfferModal])

  return (
    <React.Fragment>
      <StyledTitle4>{title}</StyledTitle4>
      <IconsWrapper>
        <StyledUl>
          <InstalledMessagingApps offerId={offerId} />
          <MessagingAppContainer>
            <ShareMessagingAppOther onPress={onOtherPress} />
          </MessagingAppContainer>
        </StyledUl>
      </IconsWrapper>
      <Spacer.Column numberOfSpaces={4} />
      {shareContent ? (
        <WebShareModal
          visible={shareOfferModalVisible}
          headerTitle="Partager l’offre"
          shareContent={shareContent}
          dismissModal={hideShareOfferModal}
        />
      ) : null}
    </React.Fragment>
  )
}

const IconsWrapper = styled.View(({ theme }) => ({
  flexDirection: 'row',
  width: '100%',
  maxWidth: theme.contentPage.maxWidth,
}))

const StyledUl = styled(Ul)({
  flex: 1,
  justifyContent: 'flex-start',
  flexWrap: 'wrap',
})

const StyledTitle4 = styled(Typo.Title4).attrs(getHeadingAttrs(2))({
  paddingTop: getSpacing(6),
  paddingBottom: getSpacing(4),
})
