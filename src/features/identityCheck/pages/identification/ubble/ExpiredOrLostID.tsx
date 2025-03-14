import React, { useEffect } from 'react'
import styled from 'styled-components/native'

import { env } from 'libs/environment/env'
import { BatchEvent, BatchProfile } from 'libs/react-native-batch'
import { ViewGap } from 'ui/components/ViewGap/ViewGap'
import { GenericInfoPageWhite } from 'ui/pages/GenericInfoPageWhite'
import { BicolorIdCardError } from 'ui/svg/icons/BicolorIdCardError'
import { TypoDS } from 'ui/theme'

export const ExpiredOrLostID = (): React.JSX.Element => {
  useEffect(() => {
    BatchProfile.trackEvent(BatchEvent.screenViewExpiredOrLostId)
  }, [])

  return (
    <GenericInfoPageWhite
      withGoBack
      illustration={BicolorIdCardError}
      title="Ta pièce d’identité expirée ou perdue"
      buttonPrimary={{
        wording: 'Aller sur demarches-simplifiees.fr',
        externalNav: { url: env.DMS_FRENCH_CITIZEN_URL },
      }}>
      <ViewGap gap={6}>
        <StyledBody>
          Pour profiter du pass Culture tu as besoin de ta carte d’identité ou de ton passeport en
          cours de validité.
        </StyledBody>
        <StyledBody>
          Si ta pièce d’identité est expirée, elle sera refusée pour débloquer ton crédit.
        </StyledBody>
        <StyledBody>
          Tu peux tout de même déposer un dossier en passant par demarches-simplifiees.fr
        </StyledBody>
      </ViewGap>
    </GenericInfoPageWhite>
  )
}

const StyledBody = styled(TypoDS.Body)({
  textAlign: 'center',
})
