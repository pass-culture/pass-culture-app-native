import { t } from '@lingui/macro'
import React, { FunctionComponent } from 'react'
import styled from 'styled-components/native'

import { ButtonPrimary } from 'ui/components/buttons/ButtonPrimary'
import { AppModal } from 'ui/components/modals/AppModal'
import { BicolorConfidentiality } from 'ui/svg/icons/BicolorConfidentiality'
import { BicolorLock } from 'ui/svg/icons/BicolorLock'
import { Close } from 'ui/svg/icons/Close'
import { BicolorIconInterface } from 'ui/svg/icons/types'
import { Spacer, Typo } from 'ui/theme'

interface Props {
  isVisible: boolean
  dismissModal: () => void
}

export const ReportOfferDescriptionModal: FunctionComponent<Props> = ({
  isVisible,
  dismissModal,
}) => {
  return (
    <AppModal
      visible={isVisible}
      title={t`Signaler une offre`}
      rightIcon={Close}
      onRightIconPress={dismissModal}>
      <ModalContent>
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
        <ButtonPrimary title={t`Signaler l'offre`} />
      </ModalContent>
    </AppModal>
  )
}

const InformationComponent: FunctionComponent<{
  Icon: React.FC<BicolorIconInterface>
  text: string
}> = ({ Icon, text }) => {
  return (
    <InfoContainer>
      <Icon size={36} />
      <Spacer.Row numberOfSpaces={3.75} />
      <Info>{text}</Info>
    </InfoContainer>
  )
}

const ModalContent = styled.View({
  width: '100%',
})

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
