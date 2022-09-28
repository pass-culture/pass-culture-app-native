import React, { FunctionComponent } from 'react'
import styled from 'styled-components/native'

import { ButtonPrimary } from 'ui/components/buttons/ButtonPrimary'
import { AppModal } from 'ui/components/modals/AppModal'
import { ArrowPrevious } from 'ui/svg/icons/ArrowPrevious'
import { BicolorSignal } from 'ui/svg/icons/BicolorSignal'
import { BicolorSmartphone } from 'ui/svg/icons/BicolorSmartphone'
import { BicolorIconInterface } from 'ui/svg/icons/types'
import { Spacer, Typo } from 'ui/theme'

interface Props {
  isVisible: boolean
  dismissModal: () => void
  onGoBack: () => void
}

export const PhoneValidationTipsModal: FunctionComponent<Props> = (props) => {
  return (
    <AppModal
      visible={props.isVisible}
      title="Quelques conseils"
      onLeftIconPress={props.onGoBack}
      leftIcon={ArrowPrevious}
      leftIconAccessibilityLabel="Revenir à l’étape précédente">
      <React.Fragment>
        <StyledBody>
          Pour que la validation de ton numéro de téléphone se passe au mieux&nbsp;:
        </StyledBody>
        <Spacer.Column numberOfSpaces={8} />
        <InformationComponent
          Icon={BicolorSignal}
          text="Vérifie que tu as un bon réseau"
          subtitle="Tu vas recevoir un code de validation par SMS"
        />
        <Spacer.Column numberOfSpaces={8} />
        <InformationComponent
          Icon={BicolorSmartphone}
          text="Assure-toi d'indiquer ton numéro de téléphone personnel"
          subtitle="Il ne peut être associé qu’à un seul compte"
        />
        <Spacer.Column numberOfSpaces={13} />
        <ButtonPrimary
          wording="J'ai compris"
          onPress={props.dismissModal}
          testID="dismiss-phone-validation-tips-modal"
        />
      </React.Fragment>
    </AppModal>
  )
}

const InformationComponent: FunctionComponent<{
  Icon: React.FC<BicolorIconInterface>
  text: string
  subtitle: string
}> = ({ Icon, text, subtitle }) => {
  const StyledIcon = styled(Icon).attrs(({ theme }) => ({
    size: theme.icons.sizes.small,
  }))``

  return (
    <InfoContainer>
      <StyledIcon />
      <Spacer.Row numberOfSpaces={3.75} />
      <TextContainer>
        <Info>{text}</Info>
        <Subtitle>{subtitle}</Subtitle>
      </TextContainer>
    </InfoContainer>
  )
}

const StyledBody = styled(Typo.Body)(({ theme }) => ({
  color: theme.colors.greyDark,
  textAlign: 'center',
}))

const InfoContainer = styled.View({
  flexDirection: 'row',
  alignItems: 'center',
})

const TextContainer = styled.View({
  flexDirection: 'column',
  flexShrink: 1,
})

const Info = styled(Typo.Body)({
  flex: 1,
})

const Subtitle = styled(Typo.CaptionNeutralInfo)({
  flex: 1,
})
