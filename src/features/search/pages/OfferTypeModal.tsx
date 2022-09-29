import { useNavigation } from '@react-navigation/native'
import React, { FunctionComponent, useCallback, useMemo, useState } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { StyleProp, ViewStyle, View } from 'react-native'
import { useTheme } from 'styled-components'
import styled from 'styled-components/native'
import { v4 as uuidv4 } from 'uuid'

import { UseNavigationType } from 'features/navigation/RootNavigator'
import { getTabNavConfig } from 'features/navigation/TabBar/helpers'
import { FilterSwitchWithLabel } from 'features/search/components/FilterSwitchWithLabel'
import { SearchCustomModalHeader } from 'features/search/components/SearchCustomModalHeader'
import { SearchFixedModalBottom } from 'features/search/components/SearchFixedModalBottom'
import { OfferType } from 'features/search/enums'
import { initialSearchState } from 'features/search/pages/reducer'
import { useSearch } from 'features/search/pages/SearchWrapper'
import { OFFER_TYPES } from 'features/search/sections/OfferType'
import { SectionTitle } from 'features/search/sections/titles'
import { SearchState, SearchView } from 'features/search/types'
import { useLogFilterOnce } from 'features/search/utils/useLogFilterOnce'
import { Form } from 'ui/components/Form'
import { AppModal } from 'ui/components/modals/AppModal'
import { ModalSpacing } from 'ui/components/modals/enum'
import { RadioButton } from 'ui/components/radioButtons/RadioButton'
import { Separator } from 'ui/components/Separator'
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

const DEFAULT_HEIGHT_MODAL = 500

export const OfferTypeModal: FunctionComponent<Props> = ({
  title,
  accessibilityLabel,
  isVisible,
  hideModal,
}) => {
  const logUseFilter = useLogFilterOnce(SectionTitle.OfferType)
  const [heightModal, setHeightModal] = useState(DEFAULT_HEIGHT_MODAL)
  const { searchState } = useSearch()
  const [offerTypes, setOfferTypes] = useState(searchState.offerTypes)
  const { isDesktopViewport } = useTheme()
  const { navigate } = useNavigation<UseNavigationType>()

  const search = useCallback(
    (values: SearchTypeFormData) => {
      hideModal()
      const additionalSearchState: SearchState = {
        ...searchState,
        offerIsDuo: values.offerIsDuo,
        offerTypes,
      }
      navigate(
        ...getTabNavConfig('Search', {
          ...additionalSearchState,
          view: SearchView.Results,
        })
      )
    },
    [hideModal, navigate, offerTypes, searchState]
  )

  const {
    handleSubmit,
    control,
    getValues,
    setValue,
    formState: { isSubmitting },
  } = useForm<SearchTypeFormData>({
    mode: 'onChange',
    defaultValues: {
      offerTypeChoice: OfferType.ALL_TYPE,
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

  const selectedOfferType = useMemo(() => {
    const entry = Object.entries(offerTypes).find(([, value]) => value)
    return entry ? entry[0] : undefined
  }, [offerTypes])

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
            {OFFER_TYPES.map(({ type, label, icon }) => (
              <View key={label}>
                <RadioButton
                  onSelect={() => {
                    logUseFilter()
                    setOfferTypes({
                      ...initialSearchState.offerTypes,
                      ...(type !== undefined
                        ? {
                            [type]: true,
                          }
                        : {}),
                    })
                  }}
                  isSelected={selectedOfferType === type}
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
