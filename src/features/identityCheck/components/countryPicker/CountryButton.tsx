import React, { useRef } from 'react'
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
import { getSpacing, Spacer, Typo } from 'ui/theme'

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
        <Spacer.Row numberOfSpaces={2} />
        <Typo.ButtonText>{country.name}</Typo.ButtonText>
        <Spacer.Row numberOfSpaces={1} />
        <CountryCallingCode>{countryCallingCode}</CountryCallingCode>
      </CountryContainer>
    </TouchableOpacity>
  )
}

const CountryContainer = styled.View({
  flexDirection: 'row',
  alignItems: 'center',
  paddingVertical: getSpacing(3),
  paddingHorizontal: getSpacing(1),
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
