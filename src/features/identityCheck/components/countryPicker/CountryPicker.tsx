import React from 'react'
import { Platform, View } from 'react-native'
import styled from 'styled-components/native'

import { COUNTRIES } from 'features/identityCheck/components/countryPicker/constants'
import { CountryButton } from 'features/identityCheck/components/countryPicker/CountryButton'
import { formatCallingCode } from 'features/identityCheck/components/countryPicker/formatCallingCode'
import { Country } from 'features/identityCheck/components/countryPicker/types'
import { AccessibilityRole } from 'libs/accessibilityRole/accessibilityRole'
import { styledButton } from 'ui/components/buttons/styledButton'
import { AppModal } from 'ui/components/modals/AppModal'
import { useModal } from 'ui/components/modals/useModal'
import { Touchable } from 'ui/components/touchable/Touchable'
import { ArrowDown as DefaultArrowDown } from 'ui/svg/icons/ArrowDown'
import { Close } from 'ui/svg/icons/Close'
import { getSpacing, Spacer, Typo } from 'ui/theme'

interface Props {
  selectedCountry: Country
  onSelect: (country: Country) => void
}

export const CountryPicker: React.FC<Props> = ({ selectedCountry, onSelect }) => {
  const { visible, showModal, hideModal } = useModal(false)

  const callingCode = formatCallingCode(selectedCountry.callingCode)

  function onCountrySelect(country: Country) {
    onSelect(country)
    hideModal()
  }

  return (
    <React.Fragment>
      <StyledTouchable
        onPress={showModal}
        hoverUnderlineColor={null}
        accessibilityLabel="Ouvrir la modale de choix de l’indicatif téléphonique">
        <CallingCodeText>{callingCode}</CallingCodeText>
        <ArrowDown />
        <Spacer.Row numberOfSpaces={2} />
        <VerticalSeparator />
      </StyledTouchable>
      <AppModal
        title="Choix de l’indicatif téléphonique"
        visible={visible}
        rightIconAccessibilityLabel="Fermer la modale de choix de l’indicatif téléphonique"
        rightIcon={Close}
        onRightIconPress={hideModal}>
        {COUNTRIES.length > 0 && (
          <View accessibilityRole={AccessibilityRole.RADIOGROUP}>
            {COUNTRIES.map((country) => (
              <CountryButton
                key={country.id}
                country={country}
                selectedCountry={selectedCountry}
                onCountrySelect={onCountrySelect}
              />
            ))}
          </View>
        )}
      </AppModal>
    </React.Fragment>
  )
}

const focusStyle =
  Platform.OS === 'web'
    ? {
        '&:focus': { outline: 'none' },
        '&:focus-visible': { outline: 'auto' },
      }
    : {}

const StyledTouchable = styledButton(Touchable)({
  flexDirection: 'row',
  alignItems: 'center',
  flexShrink: 0,
  ...focusStyle,
})

const VerticalSeparator = styled.View(({ theme }) => ({
  paddingVertical: getSpacing(2.5),
  borderRightWidth: getSpacing(0.25),
  borderRightColor: theme.colors.greyDark,
}))

const CallingCodeText = styled(Typo.Body)({
  marginLeft: -getSpacing(1), // To compensate for the Flag component right margin
  marginRight: getSpacing(1),
})

const ArrowDown = styled(DefaultArrowDown).attrs(({ theme }) => ({
  size: theme.icons.sizes.extraSmall,
}))``
