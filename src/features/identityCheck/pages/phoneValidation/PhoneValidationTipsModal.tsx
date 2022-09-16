import { t } from '@lingui/macro'
import React, { FunctionComponent } from 'react'
import styled from 'styled-components/native'

import { ButtonPrimary } from 'ui/components/buttons/ButtonPrimary'
import { GreyDarkCaption } from 'ui/components/GreyDarkCaption'
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
      title={t`Quelques conseils`}
      onLeftIconPress={props.onGoBack}
      leftIcon={ArrowPrevious}
      leftIconAccessibilityLabel={t`Revenir à l'étape précédente`}>
      <React.Fragment>
        <Introduction>{t`Pour que la validation de ton numéro de téléphone se passe au mieux\u00a0:`}</Introduction>
        <Spacer.Column numberOfSpaces={8} />
        <InformationComponent
          Icon={BicolorSignal}
          text={t`Vérifie que tu as un bon réseau`}
          subtitle={t`Tu vas recevoir un code de validation par SMS`}
        />
        <Spacer.Column numberOfSpaces={8} />
        <InformationComponent
          Icon={BicolorSmartphone}
          text={t`Assure-toi d'indiquer ton numéro de téléphone personnel`}
          subtitle={t`Il ne peut être associé qu’à un seul compte`}
        />
        <Spacer.Column numberOfSpaces={13} />
        <ButtonPrimary
          wording={t`J'ai compris`}
          onPress={props.dismissModal}
          testID={'dismiss-phone-validation-tips-modal'}
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

const Introduction = styled(Typo.Body)(({ theme }) => ({
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

const Subtitle = styled(GreyDarkCaption)({
  flex: 1,
})
