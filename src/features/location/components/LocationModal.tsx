import React from 'react'
import styled from 'styled-components/native'

import { LocationModalButton } from 'features/location/components/LocationModalButton'
import { LocationOption } from 'features/location/enums'
import { theme } from 'theme'
import { ButtonPrimary } from 'ui/components/buttons/ButtonPrimary'
import { AppModal } from 'ui/components/modals/AppModal'
import { Separator } from 'ui/components/Separator'
import { Spacer } from 'ui/components/spacer/Spacer'
import { Close } from 'ui/svg/icons/Close'
import { MagnifyingGlassFilled } from 'ui/svg/icons/MagnifyingGlassFilled'
import { PositionFilled } from 'ui/svg/icons/PositionFilled'

interface LocationModalProps {
  visible: boolean
  dismissModal: () => void
}

export const LocationModal = ({ visible, dismissModal }: LocationModalProps) => {
  const [selectedOption, setSelectedOption] = React.useState<LocationOption>(LocationOption.NONE)

  const onClose = () => {
    setSelectedOption(LocationOption.NONE)
    dismissModal()
  }

  const onButtonPressed = (option: LocationOption) => {
    setSelectedOption(option)
  }

  return (
    <AppModal
      visible={visible}
      title={'Localisation'}
      rightIconAccessibilityLabel="Fermer la modale"
      rightIcon={Close}
      onRightIconPress={onClose}
      isUpToStatusBar
      scrollEnabled={false}>
      <LocationModalButton
        onPress={() => onButtonPressed(LocationOption.GEOLOCATION)}
        icon={PositionFilled}
        color={
          selectedOption === LocationOption.GEOLOCATION ? theme.colors.primary : theme.colors.black
        }
        title={'Utiliser ma position actuelle'}
        subtitle={'Géolocalisation désactivée'}
      />
      <Separator />
      <LocationModalButton
        onPress={() => onButtonPressed(LocationOption.CUSTOM_POSITION)}
        icon={MagnifyingGlassFilled}
        color={
          selectedOption === LocationOption.CUSTOM_POSITION
            ? theme.colors.primary
            : theme.colors.black
        }
        title={'Choisir une localisation'}
        subtitle={'Ville, adresse, code postal'}
      />
      <Spacer.Column numberOfSpaces={2} />
      <ButtonContainer>
        <ButtonPrimary
          wording={'Valider la localisation'}
          disabled={selectedOption === LocationOption.NONE}
        />
      </ButtonContainer>
    </AppModal>
  )
}

const ButtonContainer = styled.View({
  alignItems: 'center',
})
