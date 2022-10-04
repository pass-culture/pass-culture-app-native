import React, { FunctionComponent } from 'react'
import styled from 'styled-components/native'

import { ButtonPrimary } from 'ui/components/buttons/ButtonPrimary'
import { InformationWithIcon } from 'ui/components/InformationWithIcon'
import { BicolorConfidentiality } from 'ui/svg/icons/BicolorConfidentiality'
import { BicolorLock } from 'ui/svg/icons/BicolorLock'
import { Spacer, Typo } from 'ui/theme'

interface Props {
  onPressReportOffer: () => void
}

export const ReportOfferDescription: FunctionComponent<Props> = ({ onPressReportOffer }) => {
  return (
    <React.Fragment>
      <StyledBody>
        Bien que l’ensemble du catalogue soit vérifié par nos soins, il n’est pas impossible que
        certaines offres ne respectent pas les CGU.
      </StyledBody>
      <Spacer.Column numberOfSpaces={8} />
      <InformationWithIcon
        Icon={BicolorLock}
        text="Il est interdit pour un acteur culturel de proposer des offres qui ne correspondent pas à nos valeurs."
      />
      <Spacer.Column numberOfSpaces={8} />
      <InformationWithIcon
        Icon={BicolorConfidentiality}
        text="Ton identité restera anonyme auprès des acteurs culturels."
      />
      <Spacer.Column numberOfSpaces={13} />
      <ButtonPrimary
        wording="Signaler l'offre"
        onPress={onPressReportOffer}
        testID="go-to-reason-report-button"
      />
    </React.Fragment>
  )
}

const StyledBody = styled(Typo.Body)({
  textAlign: 'center',
})
