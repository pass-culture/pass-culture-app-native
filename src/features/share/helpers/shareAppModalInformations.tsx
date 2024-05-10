import React from 'react'
import styled from 'styled-components/native'

import { ShareAppWordingVersion } from 'features/share/types'
import { Typo } from 'ui/theme'
import { LINE_BREAK } from 'ui/theme/constants'

export const shareAppModalInformations = (wordingVersion: ShareAppWordingVersion) => {
  switch (wordingVersion) {
    case 'statistics':
      return {
        title: 'Fais tourner le bon plan\u00a0!',
        subtitle: (
          <StyledBody>
            <Typo.ButtonText>
              35&nbsp;% des jeunes en France n’ont pas encore le pass Culture.
            </Typo.ButtonText>
            {LINE_BREAK}
            Fais découvrir le pass à tes amis&nbsp;!
          </StyledBody>
        ),
      }

    case 'short':
      return {
        title: 'Passe le bon plan\u00a0!',
        subtitle: (
          <StyledBody>
            Recommande l’app à tes amis pour qu’ils profitent du pass Culture&nbsp;!
          </StyledBody>
        ),
      }

    case 'default':
    default:
      return {
        title: 'La culture, ça se partage\u00a0!',
        subtitle: (
          <StyledBody>
            Recommande l’appli à tes amis pour qu’ils profitent eux aussi de tous les bons plans du
            pass Culture.
          </StyledBody>
        ),
      }
  }
}

const StyledBody = styled(Typo.Body)({
  textAlign: 'center',
})
