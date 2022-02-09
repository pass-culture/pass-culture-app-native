import { t } from '@lingui/macro'
import React, { useState, useEffect, ComponentProps } from 'react'
import { ViewStyle, LogBox } from 'react-native'
import ReactNativeCountryPicker, {
  Country,
  CountryList,
  getAllCountries,
  Flag,
} from 'react-native-country-picker-modal'
import styled from 'styled-components/native'

import { accessibilityAndTestId } from 'libs/accessibilityAndTestId'
import { AppModal } from 'ui/components/modals/AppModal'
import { useModal } from 'ui/components/modals/useModal'
import { ArrowDown as DefaultArrowDown } from 'ui/svg/icons/ArrowDown'
import { Close } from 'ui/svg/icons/Close'
import { getSpacing, Typo } from 'ui/theme'

import { ALLOWED_COUNTRY_CODES, FLAG_TYPE } from './constants'

type ReactNativeCountryPickerProps = ComponentProps<typeof ReactNativeCountryPicker>
type ReactNativeCountryListProps = ComponentProps<typeof CountryList>

const translation: ReactNativeCountryPickerProps['translation'] = 'fra'

// @ts-expect-error: missing flatlist props data and renderItem, but that does not affect the behaviour
const countryListFlatListProps: ReactNativeCountryListProps['flatListProps'] = {
  style: { height: 350 },
}

interface Props {
  initialCountry: Country
  onSelect: (country: Country) => void
  style?: ViewStyle
}

async function getAllowedCountries() {
  return getAllCountries(FLAG_TYPE, translation, undefined, undefined, ALLOWED_COUNTRY_CODES)
}

export const CountryPicker: React.FC<Props> = (props) => {
  const { visible, showModal, hideModal } = useModal(false)

  const [countries, setCountries] = useState<Country[]>([])
  const [country, setCountry] = useState<Country>(props.initialCountry)
  const callingCode = `+${country.callingCode[0]}`

  useEffect(() => {
    getAllowedCountries().then(setCountries)
    // We disabled the scroll of the ScrollView (`scrollEnabled=false`) of AppModal,
    // since CountryList is a FlatList, so we should be ok to ignore the log :
    // 'VirtualizedLists should never be nested inside plain ScrollViews'
    LogBox.ignoreLogs(['VirtualizedLists should'])
  }, [])

  function onSelect(country: Country) {
    setCountry(country)
    props.onSelect(country)
    hideModal()
  }

  return (
    <React.Fragment>
      <StyledTouchableOpacity
        onPress={showModal}
        style={props.style}
        {...accessibilityAndTestId(t`Ouvrir la modale de choix de l'indicatif téléphonique`)}>
        <Flag countryCode={country.cca2} flagSize={25} />
        <CallingCodeText>{callingCode}</CallingCodeText>
        <ArrowDown />
      </StyledTouchableOpacity>
      <AppModal
        title={t`Choix de l'indicatif téléphonique`}
        visible={visible}
        scrollEnabled={false}
        leftIconAccessibilityLabel={undefined}
        leftIcon={undefined}
        onLeftIconPress={undefined}
        rightIconAccessibilityLabel={t`Fermer la modale de choix de l'indicatif téléphonique`}
        rightIcon={Close}
        onRightIconPress={hideModal}>
        <CountryList
          data={countries}
          onSelect={onSelect}
          withCallingCode={true}
          flatListProps={countryListFlatListProps}
        />
      </AppModal>
    </React.Fragment>
  )
}

const StyledTouchableOpacity = styled.TouchableOpacity({
  flexDirection: 'row',
  alignItems: 'center',
})

const CallingCodeText = styled(Typo.ButtonText)({
  marginLeft: -getSpacing(1), // To compensate for the Flag component right margin
  marginRight: getSpacing(1),
})

const ArrowDown = styled(DefaultArrowDown).attrs(({ theme }) => ({
  size: theme.icons.sizes.extraSmall,
}))``
