import React, { FunctionComponent, useCallback, useState } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { StyleProp, ViewStyle, View } from 'react-native'
import { useTheme } from 'styled-components'
import styled from 'styled-components/native'
import { v4 as uuidv4 } from 'uuid'

import { FilterSwitchWithLabel } from 'features/search/components/FilterSwitchWithLabel'
import { SearchCustomModalHeader } from 'features/search/components/SearchCustomModalHeader'
import { SearchFixedModalBottom } from 'features/search/components/SearchFixedModalBottom'
import { useSearch } from 'features/search/pages/SearchWrapper'
import { Form } from 'ui/components/Form'
import { AppModal } from 'ui/components/modals/AppModal'
import { ModalSpacing } from 'ui/components/modals/enum'
import { RadioButton } from 'ui/components/radioButtons/RadioButton'
import { Separator } from 'ui/components/Separator'
import { Numeric } from 'ui/svg/icons/bicolor/Numeric'
import { Show } from 'ui/svg/icons/bicolor/Show'
import { Thing } from 'ui/svg/icons/bicolor/Thing'
import { BicolorLogo } from 'ui/svg/icons/BicolorLogo'
import { Close } from 'ui/svg/icons/Close'
import { Spacer } from 'ui/theme'

type SearchTypeFormData = {
  offerTypeChoice: string
  offerIsDuo: boolean
}

type Props = {
  title: string
  accessibilityLabel: string
  isVisible: boolean
  hideModal: () => void
}

const titleId = uuidv4()

// TODO(alexis1993): rename to OFFER_TYPES when PC-17489 is merged
export const RADIO_BUTTON_ITEMS = [
  { label: 'Tous les types', icon: BicolorLogo },
  { label: 'Numérique', icon: Numeric },
  { label: 'Sorties', icon: Show },
  { label: 'Bien physiques', icon: Thing },
]

const DEFAULT_HEIGHT_MODAL = 500

export const OfferTypeModal: FunctionComponent<Props> = ({
  title,
  accessibilityLabel,
  isVisible,
  hideModal,
}) => {
  const [heightModal, setHeightModal] = useState(DEFAULT_HEIGHT_MODAL)
  const [radioButtonChoice, setRadioButtonChoice] = useState('Tous les types')
  const { searchState } = useSearch()
  const { isDesktopViewport } = useTheme()

  function search() {
    return
  }

  const {
    handleSubmit,
    control,
    getValues,
    setValue,
    formState: { isSubmitting },
  } = useForm<SearchTypeFormData>({
    mode: 'onChange',
    defaultValues: {
      offerTypeChoice: 'tous les types',
      offerIsDuo: searchState?.offerIsDuo,
    },
  })

  const onSubmit = handleSubmit(search)

  const toggleLimitDuoOfferSearch = useCallback(() => {
    const toggleLimitDuoOffer = !getValues('offerIsDuo')
    setValue('offerIsDuo', toggleLimitDuoOffer)
  }, [setValue, getValues])

  const onResetPress = useCallback(() => {
    return
  }, [])

  const onContentSizeChange = useCallback(
    (width: number, height: number) => {
      if (isDesktopViewport) {
        setHeightModal(height)
      }
    },
    [isDesktopViewport]
  )

  return (
    <AppModal
      visible={isVisible}
      customModalHeader={
        isDesktopViewport ? undefined : (
          <SearchCustomModalHeader titleId={titleId} title={title} onGoBack={hideModal} />
        )
      }
      title={title}
      isFullscreen
      noPadding
      modalSpacing={ModalSpacing.MD}
      rightIconAccessibilityLabel={accessibilityLabel}
      rightIcon={Close}
      onRightIconPress={hideModal}
      maxHeight={isDesktopViewport ? heightModal : undefined}
      fixedModalBottom={
        <SearchFixedModalBottom
          onSearchPress={onSubmit}
          onResetPress={onResetPress}
          isSearchDisabled={isSubmitting}
        />
      }>
      <Spacer.Column numberOfSpaces={6} />
      <StyledScrollView
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={scrollViewContentContainerStyle}
        onContentSizeChange={onContentSizeChange}>
        <Form.MaxWidth>
          <React.Fragment>
            {RADIO_BUTTON_ITEMS.map(({ label, icon }) => (
              <View key={label}>
                <RadioButton
                  onSelect={() => setRadioButtonChoice(label)}
                  isSelected={radioButtonChoice === label}
                  label={label}
                  icon={icon}
                  testID={label}
                />
                <Spacer.Column numberOfSpaces={6} />
              </View>
            ))}
          </React.Fragment>
          <Spacer.Column numberOfSpaces={6} />
          <Separator />
          <Spacer.Column numberOfSpaces={6} />
          <Controller
            control={control}
            name="offerIsDuo"
            render={({ field: { value } }) => (
              <React.Fragment>
                <FilterSwitchWithLabel
                  isActive={value}
                  toggle={toggleLimitDuoOfferSearch}
                  label="Uniquement les offres duo"
                  testID="limitDuoOfferSearch"
                />
                <Spacer.Column numberOfSpaces={6} />
              </React.Fragment>
            )}
          />
        </Form.MaxWidth>
      </StyledScrollView>
    </AppModal>
  )
}

const scrollViewContentContainerStyle: StyleProp<ViewStyle> = {
  flexDirection: 'column',
  alignItems: 'center',
}

const StyledScrollView = styled.ScrollView({
  flexGrow: 1,
})
