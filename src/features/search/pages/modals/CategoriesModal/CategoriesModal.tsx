import { useNavigation } from '@react-navigation/native'
import React, { useCallback, useEffect, useMemo } from 'react'
import { Controller, ControllerRenderProps, useForm } from 'react-hook-form'
import { useTheme } from 'styled-components/native'
import { v4 as uuidv4 } from 'uuid'

import { NativeCategoryResponseModelv2, SearchGroupResponseModelv2 } from 'api/gen'
import { UseNavigationType } from 'features/navigation/RootNavigator/types'
import { getTabNavConfig } from 'features/navigation/TabBar/helpers'
import { SearchCustomModalHeader } from 'features/search/components/SearchCustomModalHeader'
import { SearchFixedModalBottom } from 'features/search/components/SearchFixedModalBottom'
import { useSearch } from 'features/search/context/SearchWrapper'
import { CategoriesModalView, CATEGORY_CRITERIA, FilterBehaviour } from 'features/search/enums'
import {
  buildSearchPayloadValues,
  categoryAllValue,
  getCategoriesModalTitle,
  getDefaultFormValues,
  getGenreTypes,
  getIcon,
  getNativeCategories,
  getSearchGroupsByAlphabeticalSorting,
  isOnlyOnline,
} from 'features/search/helpers/categoriesHelpers/categoriesHelpers'
import { CategoriesModalFormProps, SearchState } from 'features/search/types'
import { analytics } from 'libs/firebase/analytics'
import { useSubcategories } from 'libs/subcategories/useSubcategories'
import { Form } from 'ui/components/Form'
import { AppModal } from 'ui/components/modals/AppModal'
import { ArrowPrevious } from 'ui/svg/icons/ArrowPrevious'
import { Close } from 'ui/svg/icons/Close'
import { Spacer } from 'ui/theme'

import { CategoriesSection } from './CategoriesSection'

export interface CategoriesModalProps {
  accessibilityLabel: string
  isVisible?: boolean
  hideModal: VoidFunction
  filterBehaviour: FilterBehaviour
  onClose?: VoidFunction
}

const titleId = uuidv4()

export const CategoriesModal = ({
  isVisible = false,
  hideModal,
  accessibilityLabel,
  filterBehaviour,
  onClose,
}: CategoriesModalProps) => {
  const { data } = useSubcategories()
  const { navigate } = useNavigation<UseNavigationType>()
  const { searchState, dispatch } = useSearch()
  const { isDesktopViewport, modal } = useTheme()

  const {
    control,
    formState: { isSubmitting },
    handleSubmit,
    setValue,
    watch,
    reset,
  } = useForm<CategoriesModalFormProps>({
    defaultValues: getDefaultFormValues(data, searchState, CategoriesModalView.CATEGORIES),
  })

  useEffect(() => {
    reset(getDefaultFormValues(data, searchState, CategoriesModalView.CATEGORIES))
  }, [data, reset, searchState])

  const { nativeCategory, category, genreType, currentView } = watch()

  const categories = useMemo(() => {
    const availableCategories =
      data?.searchGroups.filter((category) =>
        Object.keys(CATEGORY_CRITERIA).includes(category.name)
      ) || []
    if (availableCategories.length > 0) {
      return getSearchGroupsByAlphabeticalSorting(availableCategories)
    }

    return availableCategories
  }, [data?.searchGroups])

  const nativeCategories = useMemo(
    () => getNativeCategories(data, category.name),
    [category.name, data]
  )
  const genreTypes = useMemo(() => getGenreTypes(data, nativeCategory), [data, nativeCategory])

  const handleModalClose = useCallback(() => {
    reset()
    hideModal()
  }, [hideModal, reset])

  const handleClose = useCallback(() => {
    handleModalClose()
    if (onClose) {
      onClose()
    }
  }, [handleModalClose, onClose])

  const modalTitle = useMemo(() => {
    return getCategoriesModalTitle(currentView, category, nativeCategory)
  }, [category, currentView, nativeCategory])

  const handleCategorySelect = useCallback(
    (selectedCategory: SearchGroupResponseModelv2) => {
      setValue('category', selectedCategory)
      if (selectedCategory.name !== category?.name) {
        setValue('nativeCategory', null)
        setValue('genreType', null)
      }
      if (selectedCategory !== categoryAllValue)
        setValue('currentView', CategoriesModalView.NATIVE_CATEGORIES)
    },
    [category, setValue]
  )

  const handleNativeCategorySelect = useCallback(
    (selectedNativeCategory: NativeCategoryResponseModelv2 | null) => {
      setValue('nativeCategory', selectedNativeCategory)
      if (nativeCategory?.name !== selectedNativeCategory?.name) {
        setValue('genreType', null)
      }

      if (!selectedNativeCategory) return
      if (!selectedNativeCategory.genreType) return
      setValue('currentView', CategoriesModalView.GENRES)
    },
    [nativeCategory?.name, setValue]
  )

  const handleGoBack = useCallback(() => {
    switch (currentView) {
      case CategoriesModalView.CATEGORIES:
        handleModalClose()
        break
      case CategoriesModalView.NATIVE_CATEGORIES:
        setValue('currentView', CategoriesModalView.CATEGORIES)
        break
      case CategoriesModalView.GENRES:
        setValue('currentView', CategoriesModalView.NATIVE_CATEGORIES)
        break
      default:
        throw new Error('Unknown current view')
    }
  }, [currentView, handleModalClose, setValue])

  const descriptionContext = useMemo(
    () => ({
      selectedCategory: category,
      selectedNativeCategory: nativeCategory,
      selectedGenreType: genreType,
    }),
    [category, genreType, nativeCategory]
  )

  const handleReset = useCallback(() => {
    reset({
      category: categoryAllValue,
      nativeCategory: null,
      genreType: null,
      currentView: CategoriesModalView.CATEGORIES,
    })
  }, [reset])

  const handleSearch = useCallback(
    (form: CategoriesModalFormProps) => {
      if (!data) {
        return
      }
      setValue('currentView', CategoriesModalView.CATEGORIES)

      const payload = buildSearchPayloadValues(form)
      let additionalSearchState: SearchState = { ...searchState, ...payload }
      let isOnline = false
      if (payload.offerNativeCategories.length > 0) {
        isOnline = isOnlyOnline(data, undefined, payload.offerNativeCategories[0])
      } else if (payload.offerCategories.length > 0) {
        isOnline = isOnlyOnline(data, payload.offerCategories[0])
      }
      additionalSearchState = {
        ...additionalSearchState,
        isOnline: isOnline || undefined,
      }

      switch (filterBehaviour) {
        case FilterBehaviour.SEARCH: {
          analytics.logPerformSearch(additionalSearchState)
          navigate(...getTabNavConfig('Search', additionalSearchState))
          break
        }
        case FilterBehaviour.APPLY_WITHOUT_SEARCHING: {
          dispatch({ type: 'SET_STATE', payload: additionalSearchState })
          break
        }
      }
      hideModal()
    },
    [data, setValue, searchState, filterBehaviour, hideModal, navigate, dispatch]
  )

  const onSubmit = handleSubmit(handleSearch)

  const CategoriesController = useCallback(
    ({
      field: { value },
    }: {
      field: ControllerRenderProps<CategoriesModalFormProps, 'category'>
    }) => (
      <CategoriesSection
        items={categories as SearchGroupResponseModelv2[]}
        value={value}
        onChange={handleCategorySelect}
        context={descriptionContext}
        allValue={categoryAllValue}
        allLabel="Toutes les catégories"
        view={CategoriesModalView.CATEGORIES}
        getIcon={getIcon}
      />
    ),
    [categories, descriptionContext, handleCategorySelect]
  )

  const NativeCategoriesController = useCallback(
    ({
      field: { value },
    }: {
      field: ControllerRenderProps<CategoriesModalFormProps, 'nativeCategory'>
    }) => (
      <CategoriesSection
        items={nativeCategories as NativeCategoryResponseModelv2[]}
        value={value}
        onChange={handleNativeCategorySelect}
        context={descriptionContext}
        allValue={null}
        allLabel="Tout"
        view={CategoriesModalView.NATIVE_CATEGORIES}
      />
    ),
    [descriptionContext, handleNativeCategorySelect, nativeCategories]
  )

  const GenresController = useCallback(
    ({
      field: { value, onChange },
    }: {
      field: ControllerRenderProps<CategoriesModalFormProps, 'genreType'>
    }) => (
      <CategoriesSection
        items={genreTypes}
        value={value}
        onChange={onChange}
        context={descriptionContext}
        allValue={null}
        allLabel="Tout"
        view={CategoriesModalView.GENRES}
      />
    ),
    [descriptionContext, genreTypes]
  )

  const shouldDisplayBackButton = useMemo(
    () =>
      currentView !== CategoriesModalView.CATEGORIES ||
      (currentView === CategoriesModalView.CATEGORIES &&
        filterBehaviour === FilterBehaviour.APPLY_WITHOUT_SEARCHING),
    [currentView, filterBehaviour]
  )

  return (
    <AppModal
      customModalHeader={
        isDesktopViewport ? undefined : (
          <SearchCustomModalHeader
            titleId={titleId}
            title={modalTitle}
            onGoBack={handleGoBack}
            onClose={handleClose}
            shouldDisplayBackButton={shouldDisplayBackButton}
            shouldDisplayCloseButton
          />
        )
      }
      title={modalTitle}
      visible={isVisible}
      isFullscreen
      noPadding
      modalSpacing={modal.spacing.MD}
      rightIconAccessibilityLabel={accessibilityLabel}
      rightIcon={Close}
      onLeftIconPress={handleGoBack}
      leftIcon={ArrowPrevious}
      leftIconAccessibilityLabel="Revenir en arrière"
      onRightIconPress={handleModalClose}
      fixedModalBottom={
        <SearchFixedModalBottom
          onResetPress={handleReset}
          onSearchPress={onSubmit}
          isSearchDisabled={isSubmitting}
          filterBehaviour={filterBehaviour}
        />
      }>
      <Form.MaxWidth>
        <Spacer.Column numberOfSpaces={3} />

        {currentView === CategoriesModalView.CATEGORIES && (
          <Controller name="category" control={control} render={CategoriesController} />
        )}

        {currentView === CategoriesModalView.NATIVE_CATEGORIES && (
          <Controller name="nativeCategory" control={control} render={NativeCategoriesController} />
        )}

        {currentView === CategoriesModalView.GENRES && (
          <Controller name="genreType" control={control} render={GenresController} />
        )}
      </Form.MaxWidth>
    </AppModal>
  )
}
