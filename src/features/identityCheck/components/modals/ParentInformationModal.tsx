import React, { FunctionComponent } from 'react'
import styled from 'styled-components/native'

import { analytics } from 'libs/analytics'
import { ButtonPrimary } from 'ui/components/buttons/ButtonPrimary'
import { ButtonTertiaryBlack } from 'ui/components/buttons/ButtonTertiaryBlack'
import { GenericColoredBanner } from 'ui/components/GenericColoredBanner'
import { InformationWithIcon } from 'ui/components/InformationWithIcon'
import { AppModal } from 'ui/components/modals/AppModal'
import { InternalTouchableLink } from 'ui/components/touchableLink/InternalTouchableLink'
import { BicolorIdCard } from 'ui/svg/icons/BicolorIdCard'
import { BicolorProfile } from 'ui/svg/icons/BicolorProfile'
import { Close } from 'ui/svg/icons/Close'
import { Info } from 'ui/svg/icons/Info'
import { PlainArrowNext } from 'ui/svg/icons/PlainArrowNext'
import { Spacer, Typo } from 'ui/theme'

interface Props {
  isVisible: boolean
  hideModal: () => void
}

export const ParentInformationModal: FunctionComponent<Props> = (props) => {
  const onNavigateToUbble = () => {
    props.hideModal()
  }

  const onComeBackLater = () => {
    props.hideModal()
  }

  return (
    <AppModal
      visible={props.isVisible}
      title="Comment inscrire mon enfant&nbsp;?"
      rightIcon={Close}
      rightIconAccessibilityLabel="Fermer la modale"
      onRightIconPress={props.hideModal}>
      <React.Fragment>
        <StyledBody>Pour que l’inscription de votre enfant se passe au mieux&nbsp;:</StyledBody>
        <Spacer.Column numberOfSpaces={6} />
        <InformationWithIcon
          Icon={BicolorProfile}
          text="Assurez-vous que votre enfant soit avec vous"
          subtitle="Il devra filmer son visage pour valider son identité et récupérer son crédit"
        />
        <Spacer.Column numberOfSpaces={6} />
        <InformationWithIcon
          Icon={BicolorIdCard}
          text="Munissez-vous de sa pièce d’identité."
          subtitle="Sa carte d’identité ou son passeport doivent être valides. Les copies ne sont pas acceptées."
        />
        <Spacer.Column numberOfSpaces={8} />
        <GenericColoredBanner
          message="Son compte est nominatif et réservé à son strict usage personnel."
          Icon={StyledInfo}
        />
        <Spacer.Column numberOfSpaces={8} />
        <InternalTouchableLink
          as={ButtonPrimary}
          wording="Vérifier l’identité avec mon enfant"
          navigateTo={{ screen: 'UbbleWebview' }}
          onBeforeNavigate={onNavigateToUbble}
        />
        <Spacer.Column numberOfSpaces={6} />
        <ButtonTertiaryBlack
          wording="Vérifier son identité plus tard"
          icon={PlainArrowNext}
          onPress={onComeBackLater}
        />
      </React.Fragment>
    </AppModal>
  )
}

const StyledInfo = styled(Info)(({ theme }) => ({
  color: theme.colors.greyDark,
}))

const StyledBody = styled(Typo.Body)(({ theme }) => ({
  color: theme.colors.greyDark,
}))
