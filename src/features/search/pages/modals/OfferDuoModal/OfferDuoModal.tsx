import { useNavigation } from '@react-navigation/native'
import React, { FunctionComponent, useCallback } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { useTheme } from 'styled-components'
import { v4 as uuidv4 } from 'uuid'

import { UseNavigationType } from 'features/navigation/RootNavigator/types'
import { getTabNavConfig } from 'features/navigation/TabBar/helpers'
import { FilterSwitchWithLabel } from 'features/search/components/FilterSwitchWithLabel/FilterSwitchWithLabel'
import { SearchCustomModalHeader } from 'features/search/components/SearchCustomModalHeader'
import { SearchFixedModalBottom } from 'features/search/components/SearchFixedModalBottom'
import { initialSearchState } from 'features/search/context/reducer'
import { useSearch } from 'features/search/context/SearchWrapper'
import { SearchState, SearchView } from 'features/search/types'
import { analytics } from 'libs/firebase/analytics'
import { Form } from 'ui/components/Form'
import { AppModal } from 'ui/components/modals/AppModal'
import { Close } from 'ui/svg/icons/Close'
import { Spacer } from 'ui/theme'

type SearchTypeFormData = {
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

export const OfferDuoModal: FunctionComponent<Props> = ({
  title,
  accessibilityLabel,
  isVisible,
  hideModal,
}) => {
  const { searchState } = useSearch()
  const { isDesktopViewport, modal } = useTheme()
  const { navigate } = useNavigation<UseNavigationType>()

  const {
    handleSubmit,
    control,
    reset,
    getValues,
    setValue,
    formState: { isSubmitting },
  } = useForm<SearchTypeFormData>({
    mode: 'onChange',
    defaultValues: {
      offerIsDuo: searchState.offerIsDuo,
    },
  })

  const toggleLimitDuoOfferSearch = useCallback(() => {
    const toggleLimitDuoOffer = !getValues('offerIsDuo')
    setValue('offerIsDuo', toggleLimitDuoOffer)
  }, [getValues, setValue])

  const onResetPress = useCallback(() => {
    reset({
      offerIsDuo: initialSearchState.offerIsDuo,
    })
  }, [reset])

  const close = useCallback(() => {
    reset({
      offerIsDuo: searchState.offerIsDuo,
    })
    hideModal()
  }, [hideModal, reset, searchState?.offerIsDuo])

  const search = useCallback(
    (values: SearchTypeFormData) => {
      const additionalSearchState: SearchState = {
        ...searchState,
        offerIsDuo: values.offerIsDuo,

        view: SearchView.Results,
      }
      analytics.logPerformSearch(additionalSearchState)
      navigate(...getTabNavConfig('Search', additionalSearchState))
      hideModal()
    },
    [hideModal, navigate, searchState]
  )

  const onSubmit = handleSubmit(search)

  const subtitleToggle = 'Seules les sorties seront affichées'

  return (
    <AppModal
      visible={isVisible}
      customModalHeader={
        isDesktopViewport ? undefined : (
          <SearchCustomModalHeader titleId={titleId} title={title} onGoBack={close} />
        )
      }
      title={title}
      isFullscreen
      noPadding
      modalSpacing={modal.spacing.MD}
      rightIconAccessibilityLabel={accessibilityLabel}
      rightIcon={Close}
      onRightIconPress={close}
      maxHeight={isDesktopViewport ? DEFAULT_HEIGHT_MODAL : undefined}
      fixedModalBottom={
        <SearchFixedModalBottom
          onSearchPress={onSubmit}
          onResetPress={onResetPress}
          isSearchDisabled={isSubmitting}
        />
      }>
      <Spacer.Column numberOfSpaces={6} />
      <Form.MaxWidth>
        <Controller
          control={control}
          name="offerIsDuo"
          render={({ field: { value } }) => (
            <React.Fragment>
              <FilterSwitchWithLabel
                isActive={value}
                toggle={toggleLimitDuoOfferSearch}
                label="Uniquement les offres duo"
                subtitle={subtitleToggle}
                testID="limitDuoOfferSearch"
              />
              <Spacer.Column numberOfSpaces={6} />
            </React.Fragment>
          )}
        />
      </Form.MaxWidth>
    </AppModal>
  )
}
