import { t } from '@lingui/macro'
import React, { useState, useEffect, ComponentProps } from 'react'
import { ListRenderItem, LogBox, Platform, View } from 'react-native'
import ReactNativeCountryPicker, {
  Country,
  CountryList,
  getAllCountries,
  Flag,
} from 'react-native-country-picker-modal'
import styled from 'styled-components/native'

import { accessibilityAndTestId } from 'libs/accessibilityAndTestId'
import { styledButton } from 'ui/components/buttons/styledButton'
import { AppModal } from 'ui/components/modals/AppModal'
import { useModal } from 'ui/components/modals/useModal'
import { Touchable } from 'ui/components/touchable/Touchable'
import { TouchableOpacity } from 'ui/components/TouchableOpacity'
import { ArrowDown as DefaultArrowDown } from 'ui/svg/icons/ArrowDown'
import { Close } from 'ui/svg/icons/Close'
import { Validate } from 'ui/svg/icons/Validate'
import { getSpacing, Typo } from 'ui/theme'
import { getHeadingAttrs } from 'ui/theme/typography'

import { ALLOWED_COUNTRY_CODES, FLAG_TYPE } from './constants'

type ReactNativeCountryPickerProps = ComponentProps<typeof ReactNativeCountryPicker>
type ReactNativeCountryListProps = ComponentProps<typeof CountryList>

const translation: ReactNativeCountryPickerProps['translation'] = 'fra'

interface Props {
  initialCountry: Country
  onSelect: (country: Country) => void
  width?: string
}

async function getAllowedCountries() {
  return getAllCountries(FLAG_TYPE, translation, undefined, undefined, ALLOWED_COUNTRY_CODES)
}

export const CountryPicker: React.FC<Props> = (props) => {
  const { visible, showModal, hideModal } = useModal(false)

  const [countries, setCountries] = useState<Country[]>([])
  const [country, setCountry] = useState<Country>(props.initialCountry)

  const formatCallingCode = (callingCode: string) => `+${callingCode}`
  const callingCode = formatCallingCode(country.callingCode[0])

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

  const renderItem: ListRenderItem<Country> = ({ item }: { item: Country }) => {
    const itemTitle = `${item.name} (${formatCallingCode(item.callingCode[0])})`
    const selected = item.cca2 === country.cca2
    return (
      <View {...getHeadingAttrs(2)}>
        <TouchableOpacity
          accessibilityRole="radio"
          accessibilityState={{ checked: selected }}
          key={item.cca2}
          testID={`country-selector-${item.cca2}`}
          onPress={() => onSelect(item)}>
          <CountryContainer>
            <Flag countryCode={item.cca2} withEmoji flagSize={30} />
            <Typo.Body>{itemTitle}</Typo.Body>
            {!!selected && (
              <IconContainer>
                <ValidateIcon />
              </IconContainer>
            )}
          </CountryContainer>
        </TouchableOpacity>
      </View>
    )
  }

  const countryListFlatListProps: ReactNativeCountryListProps['flatListProps'] = {
    style: { height: 350 },
    renderItem,
    data: countries,
  }

  return (
    <React.Fragment>
      <StyledTouchable
        onPress={showModal}
        buttonWidth={props.width}
        {...accessibilityAndTestId(t`Ouvrir la modale de choix de l'indicatif téléphonique`)}>
        <Flag countryCode={country.cca2} flagSize={25} />
        <CallingCodeText>{callingCode}</CallingCodeText>
        <ArrowDown />
      </StyledTouchable>
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
const StyledTouchable = styledButton(Touchable)<{ buttonWidth?: string; isFocus?: boolean }>(
  ({ buttonWidth }) => ({
    width: buttonWidth,
    flexDirection: 'row',
    alignItems: 'center',
    flexShrink: 0,
    ...focusStyle,
  })
)

const CallingCodeText = styled(Typo.ButtonText)({
  marginLeft: -getSpacing(1), // To compensate for the Flag component right margin
  marginRight: getSpacing(1),
})

const ArrowDown = styled(DefaultArrowDown).attrs(({ theme }) => ({
  size: theme.icons.sizes.extraSmall,
}))``
