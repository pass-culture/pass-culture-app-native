import React, { useRef } from 'react'
import { View } from 'react-native'
import styled from 'styled-components/native'

import { formatCallingCode } from 'features/identityCheck/components/countryPicker/formatCallingCode'
import { Country } from 'features/identityCheck/components/countryPicker/types'
import { useHandleFocus } from 'libs/hooks/useHandleFocus'
import { accessibleRadioProps } from 'shared/accessibilityProps/accessibleRadioProps'
import { TouchableOpacity } from 'ui/components/TouchableOpacity'
import { useArrowNavigationForRadioButton } from 'ui/hooks/useArrowNavigationForRadioButton'
import { useSpaceBarAction } from 'ui/hooks/useSpaceBarAction'
import { Validate } from 'ui/svg/icons/Validate'
import { ValidateOff } from 'ui/svg/icons/ValidateOff'
import { getSpacing, Typo } from 'ui/theme'

type Props = {
  country: Country
  selectedCountry: Country
  onCountrySelect: (country: Country) => void
}

export const CountryButton = ({ country, selectedCountry, onCountrySelect }: Props) => {
  const countryCallingCode = formatCallingCode(country.callingCode)
  const selected = country.id === selectedCountry.id
  const onPress = () => onCountrySelect(country)
  const { onFocus, onBlur, isFocus } = useHandleFocus()
  const containerRef = useRef(null)
  useArrowNavigationForRadioButton(containerRef)
  useSpaceBarAction(isFocus ? onPress : undefined)

  const a11yLabel = `${country.name} ${formatCallingCode(country.callingCode)}`

  return (
    <TouchableOpacity
      {...accessibleRadioProps({ checked: selected, label: a11yLabel })}
      onFocus={onFocus}
      onBlur={onBlur}
      onPress={onPress}>
      <CountryContainer ref={containerRef}>
        {selected ? <ValidateIcon /> : <ValidateOffIcon />}
        <CountryName>{country.name}</CountryName>
        <CountryCallingCode>{countryCallingCode}</CountryCallingCode>
      </CountryContainer>
    </TouchableOpacity>
  )
}

const CountryContainer = styled(View)({
  flexDirection: 'row',
  alignItems: 'center',
  paddingVertical: getSpacing(3),
  paddingHorizontal: getSpacing(1),
})

const CountryName = styled(Typo.BodyAccent)(({ theme }) => ({
  marginLeft: theme.designSystem.size.spacing.s,
  marginRight: getSpacing(1),
}))

const CountryCallingCode = styled(Typo.BodyAccent)(({ theme }) => ({
  fontFamily: theme.fontFamily.medium,
}))

const ValidateIcon = styled(Validate).attrs(({ theme }) => ({
  color: theme.designSystem.color.icon.brandPrimary,
  size: theme.icons.sizes.smaller,
}))``

const ValidateOffIcon = styled(ValidateOff).attrs(({ theme }) => ({
  color: theme.designSystem.color.icon.disabled,
  size: theme.icons.sizes.smaller,
}))``
