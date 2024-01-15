import React, { FunctionComponent, useCallback, useEffect } from 'react'
import { useForm, Controller, ControllerRenderProps } from 'react-hook-form'
import { useTheme } from 'styled-components'
import { v4 as uuidv4 } from 'uuid'

import { FilterSwitchWithLabel } from 'features/search/components/FilterSwitchWithLabel/FilterSwitchWithLabel'
import { SearchCustomModalHeader } from 'features/search/components/SearchCustomModalHeader'
import { SearchFixedModalBottom } from 'features/search/components/SearchFixedModalBottom'
import { initialSearchState } from 'features/search/context/reducer'
import { useSearch } from 'features/search/context/SearchWrapper'
import { FilterBehaviour } from 'features/search/enums'
import { SearchState, SearchView } from 'features/search/types'
import { Form } from 'ui/components/Form'
import { AppModal } from 'ui/components/modals/AppModal'
import { Close } from 'ui/svg/icons/Close'
import { Spacer } from 'ui/theme'

type SearchTypeFormData = {
  offerIsDuo: boolean
}

export type OfferDuoModalProps = {
  title: string
  accessibilityLabel: string
  isVisible: boolean
  hideModal: () => void
  filterBehaviour: FilterBehaviour
  onClose?: VoidFunction
}

const titleId = uuidv4()

export const OfferDuoModal: FunctionComponent<OfferDuoModalProps> = ({
  title,
  accessibilityLabel,
  isVisible,
  hideModal,
  filterBehaviour,
  onClose,
}) => {
  const { searchState, dispatch } = useSearch()
  const { modal } = useTheme()

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

  const ToggleOfferDuoController = useCallback<
    ({
      field,
    }: {
      field: ControllerRenderProps<SearchTypeFormData, 'offerIsDuo'>
    }) => React.ReactElement
  >(
    ({ field: { value } }) => (
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

  const closeModal = useCallback(() => {
    reset({
      offerIsDuo: searchState.offerIsDuo,
    })
    hideModal()
  }, [hideModal, reset, searchState.offerIsDuo])

  const close = useCallback(() => {
    closeModal()
    if (onClose) {
      onClose()
    }
  }, [closeModal, onClose])

  const search = useCallback(
    (values: SearchTypeFormData) => {
      const additionalSearchState: SearchState = {
        ...searchState,
        offerIsDuo: values.offerIsDuo,

        view: SearchView.Results,
      }

      dispatch({ type: 'SET_STATE', payload: additionalSearchState })
      hideModal()
    },
    [searchState, hideModal, dispatch]
  )

  const onSubmit = handleSubmit(search)
  const shouldDisplayBackButton = filterBehaviour === FilterBehaviour.APPLY_WITHOUT_SEARCHING

  return (
    <AppModal
      visible={isVisible}
      customModalHeader={
        <SearchCustomModalHeader
          titleId={titleId}
          title={title}
          onGoBack={closeModal}
          onClose={close}
          shouldDisplayBackButton={shouldDisplayBackButton}
          shouldDisplayCloseButton
        />
      }
      title={title}
      isUpToStatusBar
      noPadding
      modalSpacing={modal.spacing.MD}
      rightIconAccessibilityLabel={accessibilityLabel}
      rightIcon={Close}
      onRightIconPress={closeModal}
      fixedModalBottom={
        <SearchFixedModalBottom
          onSearchPress={onSubmit}
          onResetPress={onResetPress}
          isSearchDisabled={isSubmitting}
          filterBehaviour={filterBehaviour}
        />
      }>
      <Spacer.Column numberOfSpaces={6} />
      <Form.MaxWidth>
        <Controller control={control} name="offerIsDuo" render={ToggleOfferDuoController} />
      </Form.MaxWidth>
    </AppModal>
  )
}
