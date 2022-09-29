import React, { useState, useEffect, useRef, ComponentProps } from 'react'
import { ListRenderItem, LogBox, Platform } from 'react-native'
import ReactNativeCountryPicker, {
  Country,
  CountryList,
  getAllCountries,
  Flag,
} from 'react-native-country-picker-modal'
import styled from 'styled-components/native'

import {
  ALLOWED_COUNTRY_CODES,
  FLAG_TYPE,
} from 'features/identityCheck/components/countryPicker/constants'
import { accessibilityAndTestId } from 'libs/accessibilityAndTestId'
import { AccessibilityRole } from 'libs/accessibilityRole/accessibilityRole'
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
import { getSpacing, Spacer, Typo } from 'ui/theme'

type ReactNativeCountryPickerProps = ComponentProps<typeof ReactNativeCountryPicker>
type ReactNativeCountryListProps = ComponentProps<typeof CountryList>

const translation: ReactNativeCountryPickerProps['translation'] = 'fra'

interface Props {
  initialCountry: Country
  onSelect: (country: Country) => void
}

async function getAllowedCountries() {
  return getAllCountries(FLAG_TYPE, translation, undefined, undefined, ALLOWED_COUNTRY_CODES)
}

export const CountryPicker: React.FC<Props> = (props) => {
  const { visible, showModal, hideModal } = useModal(false)

  const [countries, setCountries] = useState<Country[]>([])
  const [country, setCountry] = useState<Country>(props.initialCountry)

  const formatCallingCode = (code: string) => `+${code}`
  const callingCode = formatCallingCode(country.callingCode[0])

  useEffect(() => {
    getAllowedCountries().then(setCountries)
    // We disabled the scroll of the ScrollView (`scrollEnabled=false`) of AppModal,
    // since CountryList is a FlatList, so we should be ok to ignore the log :
    // 'VirtualizedLists should never be nested inside plain ScrollViews'
    LogBox.ignoreLogs(['VirtualizedLists should'])
  }, [])

  function onSelect(selectedCountry: Country) {
    setCountry(selectedCountry)
    props.onSelect(selectedCountry)
    hideModal()
  }

  const Item = ({ item }: { item: Country }) => {
    const itemTitle = `${item.name} (${formatCallingCode(item.callingCode[0])})`
    const selected = item.cca2 === country.cca2
    const onPress = () => onSelect(item)
    const [isFocus, setIsFocus] = useState(false)
    const containerRef = useRef(null)
    useArrowNavigationForRadioButton(containerRef)
    useSpaceBarAction(isFocus ? onPress : undefined)
    return (
      <TouchableOpacity
        accessibilityRole={AccessibilityRole.RADIO}
        accessibilityState={{ checked: selected }}
        key={item.cca2}
        testID={`country-selector-${item.cca2}`}
        onFocus={() => setIsFocus(true)}
        onBlur={() => setIsFocus(false)}
        onPress={onPress}>
        <CountryContainer ref={containerRef}>
          <Flag countryCode={item.cca2} withEmoji flagSize={25} />
          <Typo.Body>{itemTitle}</Typo.Body>
          {!!selected && (
            <IconContainer>
              <ValidateIcon />
            </IconContainer>
          )}
        </CountryContainer>
      </TouchableOpacity>
    )
  }

  const renderItem: ListRenderItem<Country> = ({ item }: { item: Country }) => {
    return <Item item={item} />
  }

  const countryListFlatListProps: ReactNativeCountryListProps['flatListProps'] = {
    style: { height: 350 },
    renderItem,
    data: countries,
    accessibilityRole: AccessibilityRole.RADIOGROUP,
  }

  return (
    <React.Fragment>
      <StyledTouchable
        onPress={showModal}
        hoverUnderlineColor={null}
        {...accessibilityAndTestId('Ouvrir la modale de choix de l’indicatif téléphonique')}>
        <Flag countryCode={country.cca2} flagSize={25} />
        <CallingCodeText>{callingCode}</CallingCodeText>
        <ArrowDown />
        <Spacer.Row numberOfSpaces={2} />
        <VerticalSeparator />
      </StyledTouchable>
      <AppModal
        title="Choix de l’indicatif téléphonique"
        visible={visible}
        scrollEnabled={false}
        rightIconAccessibilityLabel="Fermer la modale de choix de l’indicatif téléphonique"
        rightIcon={Close}
        onRightIconPress={hideModal}>
        <CountryList
          data={countries}
          onSelect={onSelect}
          flatListProps={countryListFlatListProps}
        />
      </AppModal>
    </React.Fragment>
  )
}

const CountryContainer = styled.View({
  flexDirection: 'row',
  alignItems: 'center',
  paddingVertical: getSpacing(2),
  paddingHorizontal: getSpacing(1),
})

const IconContainer = styled.View({
  flex: 1,
  alignItems: 'flex-end',
  paddingHorizontal: getSpacing(2),
})

const ValidateIcon = styled(Validate).attrs(({ theme }) => ({
  color: theme.colors.primary,
  size: theme.icons.sizes.small,
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
