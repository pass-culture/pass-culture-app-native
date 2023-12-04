import React, { useCallback } from 'react'
import { Social } from 'react-native-share'
import styled from 'styled-components/native'

import { InstalledMessagingApps } from 'features/share/components/MessagingApps/InstalledMessagingApps'
import { MessagingAppContainer } from 'features/share/components/MessagingApps/MessagingAppContainer'
import { WebShareModal } from 'features/share/pages/WebShareModalBest'
import { ShareContent } from 'libs/share/types'
import { useModal } from 'ui/components/modals/useModal'
import { ShareMessagingAppOther } from 'ui/components/ShareMessagingAppOther'
import { Ul } from 'ui/components/Ul'
import { Spacer, Typo, getSpacing } from 'ui/theme'
import { getHeadingAttrs } from 'ui/theme/typographyAttrs/getHeadingAttrs'

type Props = {
  shareContent: ShareContent
  share: () => void
  messagingAppAnalytics: (social: Social | 'Other') => void
}

export const MessagingApps = ({ shareContent, share, messagingAppAnalytics }: Props) => {
  const {
    visible: shareOfferModalVisible,
    showModal: showShareOfferModal,
    hideModal: hideShareOfferModal,
  } = useModal()

  const onOtherPress = useCallback(() => {
    messagingAppAnalytics('Other')
    share()
    showShareOfferModal()
  }, [messagingAppAnalytics, share, showShareOfferModal])

  if (!shareContent.url) return null

  return (
    <React.Fragment>
      <StyledTitle3>{'Passe le bon plan\u00a0!'}</StyledTitle3>
      <IconsWrapper>
        <StyledUl>
          <InstalledMessagingApps
            shareContent={shareContent}
            messagingAppAnalytics={messagingAppAnalytics}
          />
          <MessagingAppContainer>
            <ShareMessagingAppOther onPress={onOtherPress} />
          </MessagingAppContainer>
        </StyledUl>
      </IconsWrapper>
      <Spacer.Column numberOfSpaces={4} />
      {!!shareContent && (
        <WebShareModal
          visible={shareOfferModalVisible}
          headerTitle="Partager l’offre"
          shareContent={shareContent}
          dismissModal={hideShareOfferModal}
        />
      )}
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

const StyledTitle3 = styled(Typo.Title3).attrs(getHeadingAttrs(2))({
  paddingTop: getSpacing(6),
  paddingBottom: getSpacing(4),
})
