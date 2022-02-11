import { t } from '@lingui/macro'
import React, { FunctionComponent } from 'react'
import styled from 'styled-components/native'

import { ButtonPrimary } from 'ui/components/buttons/ButtonPrimary'
import { BicolorConfidentiality } from 'ui/svg/icons/BicolorConfidentiality'
import { BicolorLock } from 'ui/svg/icons/BicolorLock'
import { BicolorIconInterface } from 'ui/svg/icons/types'
import { Spacer, Typo } from 'ui/theme'

interface Props {
  onPressReportOffer: () => void
}

export const ReportOfferDescription: FunctionComponent<Props> = ({ onPressReportOffer }) => {
  return (
    <React.Fragment>
      <Introduction>
        {t`Bien que l'ensemble du catalogue soit vérifié par nos soins, il n'est pas impossible que certaines offres ne respectent pas les CGU.`}
      </Introduction>
      <Spacer.Column numberOfSpaces={8} />
      <InformationComponent
        Icon={BicolorLock}
        text={t`Il est interdit pour un acteur culturel de proposer des offres qui ne correspondent pas à nos valeurs.`}
      />
      <Spacer.Column numberOfSpaces={8} />
      <InformationComponent
        Icon={BicolorConfidentiality}
        text={t`Ton identité restera anonyme auprès des acteurs culturels.`}
      />
      <Spacer.Column numberOfSpaces={13} />
      <ButtonPrimary
        wording={t`Signaler l'offre`}
        onPress={onPressReportOffer}
        testID={'go-to-reason-report-button'}
      />
    </React.Fragment>
  )
}

const InformationComponent: FunctionComponent<{
  Icon: React.FC<BicolorIconInterface>
  text: string
}> = ({ Icon, text }) => {
  const StyledIcon = styled(Icon).attrs(({ theme }) => ({
    size: theme.icons.sizes.small,
  }))``

  return (
    <InfoContainer>
      <StyledIcon />
      <Spacer.Row numberOfSpaces={3.75} />
      <Info>{text}</Info>
    </InfoContainer>
  )
}

const Introduction = styled(Typo.Body)({
  textAlign: 'center',
})

const InfoContainer = styled.View({
  flexDirection: 'row',
  alignItems: 'center',
})

const Info = styled(Typo.Body)({
  flex: 1,
})
