import React, { useEffect } from 'react'
import styled from 'styled-components/native'

import { analytics } from 'libs/analytics/provider'
import { env } from 'libs/environment/env'
import { BatchEvent, BatchProfile } from 'libs/react-native-batch'
import { ViewGap } from 'ui/components/ViewGap/ViewGap'
import { GenericInfoPage } from 'ui/pages/GenericInfoPage'
import { IdCardError } from 'ui/svg/icons/IdCardError'
import { Typo } from 'ui/theme'

export const ExpiredOrLostID = (): React.JSX.Element => {
  useEffect(() => {
    void BatchProfile.trackEvent(BatchEvent.screenViewExpiredOrLostId)
  }, [])

  const onExitPress = () => {
    void analytics.logHasExitedActivationFlow({
      from: 'expiredorlostid',
      origin_detail: 'GoToDemarcheNumerique',
    })
  }

  return (
    <GenericInfoPage
      withGoBack
      illustration={IdCardError}
      title="Ta pièce d’identité expirée ou perdue"
      buttonPrimary={{
        wording: 'Aller sur demarche.numerique.gouv.fr',
        externalNav: { url: env.DMS_FRENCH_CITIZEN_URL },
        onBeforeNavigate: onExitPress,
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
          Tu peux tout de même déposer un dossier en passant par demarche.numerique.gouv.fr
        </StyledBody>
      </ViewGap>
    </GenericInfoPage>
  )
}

const StyledBody = styled(Typo.Body)({
  textAlign: 'center',
})
