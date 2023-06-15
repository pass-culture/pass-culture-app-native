import React from 'react'
import styled from 'styled-components/native'

import { ButtonWithCaption } from 'features/home/components/modules/video/ButtonWithCaption'
import { ArrowAgain } from 'ui/svg/icons/ArrowAgain'
import { Offers } from 'ui/svg/icons/Offers'
import { Spacer, getSpacing } from 'ui/theme'

export const VideoEndView: React.FC<{ onPressReplay: () => void; onPressSeeOffer: () => void }> = ({
  onPressReplay,
  onPressSeeOffer,
}) => {
  return (
    <VideoEndViewContainer>
      <ButtonsContainer>
        <ButtonWithCaption
          onPress={onPressReplay}
          accessibilityLabel="Revoir la vidéo"
          wording={'Revoir'}
          icon={StyledReplayIcon}
        />
        <Spacer.Row numberOfSpaces={9} />
        <ButtonWithCaption
          onPress={onPressSeeOffer}
          accessibilityLabel="Revoir la vidéo"
          wording="Voir l’offre"
          icon={StyledOffersIcon}
        />
      </ButtonsContainer>
    </VideoEndViewContainer>
  )
}

const VideoEndViewContainer = styled.View({
  position: 'absolute',
  width: '100%',
  height: 210,
  backgroundColor: 'black',
  justifyContent: 'center',
  borderTopLeftRadius: getSpacing(4),
  borderTopRightRadius: getSpacing(4),
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
