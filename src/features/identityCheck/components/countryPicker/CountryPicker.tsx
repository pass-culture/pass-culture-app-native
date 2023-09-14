import React, { useRef } from 'react'
import { Platform, View } from 'react-native'
import styled from 'styled-components/native'

import { COUNTRIES } from 'features/identityCheck/components/countryPicker/constants'
import { Country } from 'features/identityCheck/components/countryPicker/types'
import { AccessibilityRole } from 'libs/accessibilityRole/accessibilityRole'
import { useHandleFocus } from 'libs/hooks/useHandleFocus'
import { accessibleRadioProps } from 'shared/accessibilityProps/accessibleRadioProps'
import { styledButton } from 'ui/components/buttons/styledButton'
import { AppModal } from 'ui/components/modals/AppModal'
import { useModal } from 'ui/components/modals/useModal'
import { Touchable } from 'ui/components/touchable/Touchable'
import { TouchableOpacity } from 'ui/components/TouchableOpacity'
import { useArrowNavigationForRadioButton } from 'ui/hooks/useArrowNavigationForRadioButton'
import { useSpaceBarAction } from 'ui/hooks/useSpaceBarAction'
import { ArrowDown as DefaultArrowDown } from 'ui/svg/icons/ArrowDown'
import { Close } from 'ui/svg/icons/Close'
import { Validate } from 'ui/svg/icons/Validate'
import { ValidateOff } from 'ui/svg/icons/ValidateOff'
import { getSpacing, Spacer, Typo } from 'ui/theme'

interface Props {
  selectedCountry: Country
  onSelect: (country: Country) => void
}

const formatCallingCode = (code: string) => `+${code}`

export const CountryPicker: React.FC<Props> = ({ selectedCountry, onSelect }) => {
  const { visible, showModal, hideModal } = useModal(false)

  const callingCode = formatCallingCode(selectedCountry.callingCode)

  function onCountrySelect(country: Country) {
    onSelect(country)
    hideModal()
  }

  const Item = ({ item }: { item: Country }) => {
    const itemTitle = item.name
    const countryCallingCode = formatCallingCode(item.callingCode)
    const selected = item.id === selectedCountry.id
    const onPress = () => onCountrySelect(item)
    const { onFocus, onBlur, isFocus } = useHandleFocus()
    const containerRef = useRef(null)
    useArrowNavigationForRadioButton(containerRef)
    useSpaceBarAction(isFocus ? onPress : undefined)
    return (
      <TouchableOpacity
        {...accessibleRadioProps({ checked: selected, label: itemTitle })}
        key={item.id}
        onFocus={onFocus}
        onBlur={onBlur}
        onPress={onPress}>
        <CountryContainer ref={containerRef}>
          <IconContainer>{selected ? <ValidateIcon /> : <ValidateOffIcon />}</IconContainer>
          <CountryName>{itemTitle}</CountryName>
          <CountryCallingCode>{countryCallingCode}</CountryCallingCode>
        </CountryContainer>
      </TouchableOpacity>
    )
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
        <View accessibilityRole={AccessibilityRole.RADIOGROUP}>
          {COUNTRIES.map((country) => (
            <Item key={country.id} item={country} />
          ))}
        </View>
      </AppModal>
    </React.Fragment>
  )
}

const CountryContainer = styled.View({
  flexDirection: 'row',
  alignItems: 'center',
  paddingVertical: getSpacing(3),
  paddingHorizontal: getSpacing(1),
})

const IconContainer = styled.View({
  marginRight: getSpacing(2),
})

const CountryName = styled(Typo.ButtonText)({
  marginRight: getSpacing(1),
})
const CountryCallingCode = styled(Typo.ButtonText)(({ theme }) => ({
  fontFamily: theme.fontFamily.medium,
}))

const ValidateIcon = styled(Validate).attrs(({ theme }) => ({
  color: theme.colors.primary,
  size: theme.icons.sizes.smaller,
}))``

const ValidateOffIcon = styled(ValidateOff).attrs(({ theme }) => ({
  color: theme.colors.greySemiDark,
  size: theme.icons.sizes.smaller,
}))``

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
