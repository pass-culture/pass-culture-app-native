import { useNavigation } from '@react-navigation/native'
import React, { FunctionComponent, useCallback, useEffect } from 'react'
import { useForm, Controller, ControllerRenderProps } from 'react-hook-form'
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
  shouldTriggerSearch?: boolean
}

const titleId = uuidv4()

const DEFAULT_HEIGHT_MODAL = 500

export const OfferDuoModal: FunctionComponent<Props> = ({
  title,
  accessibilityLabel,
  isVisible,
  hideModal,
  shouldTriggerSearch,
}) => {
  const { searchState, dispatch } = useSearch()
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

  useEffect(() => {
    reset({ offerIsDuo: searchState.offerIsDuo })
  }, [reset, searchState])

  const toggleLimitDuoOfferSearch = useCallback(() => {
    const toggleLimitDuoOffer = !getValues('offerIsDuo')
    setValue('offerIsDuo', toggleLimitDuoOffer)
  }, [getValues, setValue])

  const subtitleToggle = 'Seules les sorties seront affichées'

  const ToggleOfferDuoController = useCallback(
    ({ field: { value } }: { field: ControllerRenderProps<SearchTypeFormData, 'offerIsDuo'> }) => (
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
    ),
    [toggleLimitDuoOfferSearch]
  )

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
      if (shouldTriggerSearch) {
        navigate(...getTabNavConfig('Search', additionalSearchState))
      } else {
        dispatch({ type: 'SET_STATE', payload: additionalSearchState })
      }
      hideModal()
    },
    [hideModal, navigate, searchState, shouldTriggerSearch, dispatch]
  )

  const onSubmit = handleSubmit(search)

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
          willTriggerSearch={shouldTriggerSearch}
        />
      }>
      <Spacer.Column numberOfSpaces={6} />
      <Form.MaxWidth>
        <Controller control={control} name="offerIsDuo" render={ToggleOfferDuoController} />
      </Form.MaxWidth>
    </AppModal>
  )
}
