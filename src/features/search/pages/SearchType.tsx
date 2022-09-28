import React, { FunctionComponent, useCallback, useEffect, useState } from 'react'
import { useNavigation } from '@react-navigation/native'
import { useForm, Controller } from 'react-hook-form'
import { ScrollView, StyleProp, ViewStyle, View } from 'react-native'
import { useTheme } from 'styled-components'
import styled from 'styled-components/native'
import { v4 as uuidv4 } from 'uuid'

import { UseNavigationType } from 'features/navigation/RootNavigator'
import { getTabNavConfig } from 'features/navigation/TabBar/helpers'
import { FilterSwitchWithLabel } from 'features/search/components/FilterSwitchWithLabel'
import { SearchCustomModalHeader } from 'features/search/components/SearchCustomModalHeader'
import { SearchFixedModalBottom } from 'features/search/components/SearchFixedModalBottom'
import { useSearch } from 'features/search/pages/SearchWrapper'
import { SearchState, SearchView } from 'features/search/types'
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
  typeChoice: string
  isLimitDuoOfferSearch: boolean
}

type Props = {
  title: string
  accessibilityLabel: string
  isVisible: boolean
  hideModal: () => void
}

const titleId = uuidv4()
export const SearchType: FunctionComponent<Props> = ({
  title,
  accessibilityLabel,
  isVisible,
  hideModal,
}) => {
  const radioButtonItems = [
    { label: 'Tous les types', icon: BicolorLogo },
    { label: 'Numérique', icon: Numeric },
    { label: 'Sorties', icon: Show },
    { label: 'Bien physiques', icon: Thing },
  ]
  const [heightModal, setHeightModal] = useState(500)
  const { searchState, dispatch } = useSearch()
  const [radioButtonChoice, setRadioButtonChoice] = useState("Tous les types")
  const { navigate } = useNavigation<UseNavigationType>()
  const isLimitduoOfferSearchDefaultValue = searchState?.offerIsDuo
  const { isDesktopViewport } = useTheme()

  useEffect(() => {
    if (searchState.offerTypes.isDigital) {
      setRadioButtonChoice("Numérique")
    }
    else if (searchState.offerTypes.isEvent) {
      setRadioButtonChoice("Sorties")
    }
    else if (searchState.offerTypes.isThing) {
      setRadioButtonChoice("Bien physiques")
    }
  }, [])

  function search(values: SearchTypeFormData) {
    let additionalSearchState: SearchState = {
      ...searchState,
      offerIsDuo: values.isLimitDuoOfferSearch,
    }
    let offerType: SearchState['offerTypes'] = {
      isDigital: false,
      isEvent: false,
      isThing: false
    }
    switch (radioButtonChoice) {
      case 'Numérique':
        offerType.isDigital = true
        break;
      case 'Sorties':
        offerType.isEvent = true
        break;
      case 'Bien physiques':
        offerType.isThing = true
        break;
    }
    dispatch({ type: 'OFFER_TYPE', payload: offerType })
    if (values.isLimitDuoOfferSearch)
      dispatch({ type: 'TOGGLE_OFFER_DUO' })

    additionalSearchState = { ...additionalSearchState, offerIsDuo: values.isLimitDuoOfferSearch, offerTypes: offerType }
    hideModal()
    navigate(
      ...getTabNavConfig('Search', {
        ...additionalSearchState,
        view: SearchView.Results,
      })
    )
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
      typeChoice: 'tous les types',
      isLimitDuoOfferSearch: isLimitduoOfferSearchDefaultValue,
    },
  })

  const onSubmit = handleSubmit(search)

  const toggleLimitDuoOfferSearch = useCallback(() => {
    const toggleLimitDuoOffer = !getValues('isLimitDuoOfferSearch')
    setValue('isLimitDuoOfferSearch', toggleLimitDuoOffer)
  }, [setValue, getValues])

  const close = useCallback(() => {
    hideModal()
  }, [hideModal])

  const onResetPress = useCallback(() => { }, [])
  const getHeightContent = (h: number) => {
    isDesktopViewport && setHeightModal(h)
  }

  return (
    <AppModal
      visible={isVisible}
      customModalHeader={
        isDesktopViewport ? undefined : (
          <SearchCustomModalHeader titleId={titleId} title={title} onGoBack={close} />
        )
      }
      title={title}
      isFullscreen={true}
      noPadding={true}
      modalSpacing={ModalSpacing.MD}
      rightIconAccessibilityLabel={accessibilityLabel}
      rightIcon={Close}
      onRightIconPress={close}
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
        contentContainerStyle={getScrollViewContentContainerStyle()}
        onContentSizeChange={(w, h) => {
          getHeightContent(h)
        }}>
        <Form.MaxWidth>
          <React.Fragment>
            {radioButtonItems.map((item) => {
              return (
                <View key={item.label}>
                  <RadioButton
                    onSelect={() => setRadioButtonChoice(item.label)}
                    isSelected={radioButtonChoice === item.label}
                    {...item}
                  />
                  <Spacer.Column numberOfSpaces={3} />
                </View>
              )
            })}
          </React.Fragment>
          <Spacer.Column numberOfSpaces={6} />
          <Separator />
          <Spacer.Column numberOfSpaces={6} />
          <Controller
            control={control}
            name="isLimitDuoOfferSearch"
            render={({ field: { value } }) => (
              <React.Fragment>
                <FilterSwitchWithLabel
                  isActive={value}
                  toggle={toggleLimitDuoOfferSearch}
                  label="Uniquement les offres duo"
                  displayTextToRight={!!isDesktopViewport}
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

const getScrollViewContentContainerStyle = (): StyleProp<ViewStyle> => ({
  flexDirection: 'column',
  alignItems: 'center',
})

const StyledScrollView = styled(ScrollView)({
  flexGrow: 1,
})
