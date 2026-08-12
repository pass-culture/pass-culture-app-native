import React from 'react'
import styled from 'styled-components/native'

import { useFeatureFlag } from 'libs/firebase/firestore/featureFlags/useFeatureFlag'
import { RemoteStoreFeatureFlags } from 'libs/firebase/firestore/types'
import { remoteIllustrationUrls } from 'shared/illustrations/remoteIllustrations'
import { RemoteIllustration } from 'ui/components/RemoteIllustration'
import { ViewGap } from 'ui/components/ViewGap/ViewGap'
import { Typo } from 'ui/theme'
import { DOUBLE_LINE_BREAK as LINE_BREAK } from 'ui/theme/constants'

export function ExpiredOrExhaustedCreditModalContent() {
  const enableNewVisionUi = useFeatureFlag(RemoteStoreFeatureFlags.WIP_NEW_VISION_UI)

  return (
    <ModalChildrenContainer gap={6}>
      {enableNewVisionUi ? (
        <RemoteIllustration
          url={remoteIllustrationUrls.questioningKnightSmall}
          backgroundColor="information03"
          size="s"
        />
      ) : null}
      <Typo.Body>
        {`Pas de panique, l’aventure continue\u00a0!`}
        {LINE_BREAK}
        {`Tu peux toujours bénéficier des offres gratuites et exclusives sur le pass Culture.`}
      </Typo.Body>
    </ModalChildrenContainer>
  )
}

const ModalChildrenContainer = styled(ViewGap)({
  alignItems: 'center',
})
