import React, { useCallback, useMemo } from 'react'
import { useForm } from 'react-hook-form'
import { useTheme } from 'styled-components/native'
import { v4 as uuidv4 } from 'uuid'

import { SearchGroupNameEnumv2 } from 'api/gen'
import { BookCategoriesSection } from 'features/search/components/BookCategoriesSection/BookCategoriesSection'
import { CategoriesSection } from 'features/search/components/CategoriesSection/CategoriesSection'
import { SearchCustomModalHeader } from 'features/search/components/SearchCustomModalHeader'
import { SearchFixedModalBottom } from 'features/search/components/SearchFixedModalBottom'
import { useSearch } from 'features/search/context/SearchWrapper'
import { CategoriesModalView, FilterBehaviour } from 'features/search/enums'
import {
  getCategoriesModalTitle,
  getDefaultFormValues,
  getIcon,
  handleCategoriesSearchPress,
} from 'features/search/helpers/categoriesHelpers/categoriesHelpers'
import {
  MappedGenreTypes,
  MappedNativeCategories,
  createMappingTree,
} from 'features/search/helpers/categoriesHelpers/mapping-tree'
import { NativeCategoryEnum, SearchState } from 'features/search/types'
import { PLACEHOLDER_DATA } from 'libs/subcategories/placeholderData'
import { useSubcategoriesQuery } from 'queries/subcategories/useSubcategoriesQuery'
import { Form } from 'ui/components/Form'
import { AppModal } from 'ui/components/modals/AppModal'
import { ArrowPrevious } from 'ui/svg/icons/ArrowPrevious'
import { Close } from 'ui/svg/icons/Close'

const titleId = uuidv4()

export interface CategoriesModalProps {
  accessibilityLabel: string
  isVisible?: boolean
  hideModal: VoidFunction
  filterBehaviour: FilterBehaviour
  onClose?: VoidFunction
}

export type CategoriesModalFormProps = {
  category: SearchGroupNameEnumv2
  nativeCategory: NativeCategoryEnum | null
  currentView: CategoriesModalView
  genreType: string | null
}

export const CategoriesModal = ({
  accessibilityLabel,
  filterBehaviour,
  isVisible = false,
  hideModal,
  onClose,
}: CategoriesModalProps) => {
  const { data = PLACEHOLDER_DATA } = useSubcategoriesQuery()
  const { modal, designSystem } = useTheme()
  const { dispatch, searchState } = useSearch()

  const tree = useMemo(() => {
    return createMappingTree(data)
  }, [data])

  const {
    formState: { isSubmitting },
    handleSubmit,
    reset,
    setValue,
    watch,
  } = useForm<CategoriesModalFormProps>({
    defaultValues: getDefaultFormValues(tree, searchState),
  })
  const { category, currentView, nativeCategory, genreType } = watch()

  const nativeCategories = useMemo(() => {
    return (category &&
      category !== SearchGroupNameEnumv2.NONE &&
      tree[category]?.children) as MappedNativeCategories
  }, [category, tree])

  const genreTypes = useMemo(() => {
    return (nativeCategory && nativeCategories?.[nativeCategory]?.children) as MappedGenreTypes
  }, [nativeCategory, nativeCategories])

  const handleCategorySelect = useCallback(
    (categoryKey: SearchGroupNameEnumv2) => {
      setValue('category', categoryKey)

      if (categoryKey !== category) {
        setValue('nativeCategory', null)
        setValue('genreType', null)
      }

      if (tree[categoryKey]?.children) {
        setValue('currentView', CategoriesModalView.NATIVE_CATEGORIES)
      }
    },
    [category, setValue, tree]
  )

  const handleNativeCategorySelect = useCallback(
    (nativeCategoryKey: NativeCategoryEnum | null) => {
      if (!nativeCategories) return

      setValue('nativeCategory', nativeCategoryKey)

      if (nativeCategoryKey !== nativeCategory) {
        setValue('genreType', null)
      }

      if (nativeCategoryKey && nativeCategories[nativeCategoryKey]?.children) {
        setValue('currentView', CategoriesModalView.GENRES)
      }
    },
    [nativeCategories, nativeCategory, setValue]
  )

  const handleGenreTypeSelect = useCallback(
    (genreTypeKey: string | null) => {
      setValue('genreType', genreTypeKey)
    },
    [setValue]
  )

  const handleModalClose = useCallback(() => {
    reset(getDefaultFormValues(tree, searchState))
    hideModal()
  }, [hideModal, reset, searchState, tree])

  const handleClose = useCallback(() => {
    handleModalClose()
    if (onClose) {
      onClose()
    }
  }, [handleModalClose, onClose])

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

  const triggerDispatch = useCallback(
    (form: CategoriesModalFormProps) => {
      const searchPressData = handleCategoriesSearchPress(form, data)

      let additionalSearchState: SearchState = { ...searchState, ...searchPressData?.payload }
      additionalSearchState = {
        ...additionalSearchState,
        isFullyDigitalOffersCategory: searchPressData?.isFullyDigitalOffersCategory || undefined,
      }

      dispatch({ type: 'SET_STATE', payload: additionalSearchState })
    },
    [data, dispatch, searchState]
  )

  const handleSearchPress = useCallback(
    (form: CategoriesModalFormProps) => {
      triggerDispatch(form)
      hideModal()
    },
    [hideModal, triggerDispatch]
  )

  const handleReset = useCallback(() => {
    const resetForm: CategoriesModalFormProps = {
      category: SearchGroupNameEnumv2.NONE,
      nativeCategory: null,
      genreType: null,
      currentView: CategoriesModalView.CATEGORIES,
    }
    reset(resetForm)

    triggerDispatch(resetForm)
  }, [reset, triggerDispatch])

  const descriptionContext = useMemo(
    () => ({
      category,
      nativeCategory,
      genreType,
    }),
    [category, genreType, nativeCategory]
  )

  const modalTitle = useMemo(() => {
    return getCategoriesModalTitle(data, currentView, category, nativeCategory)
  }, [category, currentView, data, nativeCategory])

  const shouldDisplayBackButton = useMemo(
    () =>
      currentView !== CategoriesModalView.CATEGORIES ||
      filterBehaviour === FilterBehaviour.APPLY_WITHOUT_SEARCHING,
    [currentView, filterBehaviour]
  )

  const getNativeCategoriesSection = () => {
    if (category === SearchGroupNameEnumv2.LIVRES) {
      return (
        <BookCategoriesSection
          itemsMapping={nativeCategories}
          onSelect={handleNativeCategorySelect}
          allValue={null}
          allLabel="Tout"
          value={nativeCategory}
          descriptionContext={descriptionContext}
        />
      )
    }
    return (
      <CategoriesSection
        itemsMapping={nativeCategories}
        onSelect={handleNativeCategorySelect}
        allValue={null}
        allLabel="Tout"
        value={nativeCategory}
        descriptionContext={descriptionContext}
      />
    )
  }

  const hasDefaultValue = category === SearchGroupNameEnumv2.NONE

  return (
    <AppModal
      customModalHeader={
        <SearchCustomModalHeader
          titleId={titleId}
          title={modalTitle}
          onGoBack={handleGoBack}
          onClose={handleClose}
          shouldDisplayBackButton={shouldDisplayBackButton}
          shouldDisplayCloseButton
        />
      }
      title={modalTitle}
      visible={isVisible}
      isUpToStatusBar
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
          onSearchPress={handleSubmit(handleSearchPress)}
          isSearchDisabled={isSubmitting}
          filterBehaviour={filterBehaviour}
          isResetDisabled={hasDefaultValue}
        />
      }>
      <Form.MaxWidth marginTop={designSystem.size.spacing.m}>
        {currentView === CategoriesModalView.CATEGORIES ? (
          <CategoriesSection
            itemsMapping={tree}
            onSelect={handleCategorySelect}
            allValue={SearchGroupNameEnumv2.NONE}
            allLabel="Toutes les catégories"
            value={category}
            descriptionContext={descriptionContext}
            getIcon={getIcon}
            shouldSortItems={false} // sorting on positions is not supported yet for search groups, but they're already sorted in `createMappingTree`
          />
        ) : null}
        {currentView === CategoriesModalView.NATIVE_CATEGORIES && getNativeCategoriesSection()}
        {currentView === CategoriesModalView.GENRES && genreTypes ? (
          <CategoriesSection
            itemsMapping={genreTypes}
            onSelect={handleGenreTypeSelect}
            allValue={null}
            allLabel="Tout"
            value={genreType}
            descriptionContext={descriptionContext}
            onSubmit={handleSubmit(handleSearchPress)}
          />
        ) : null}
      </Form.MaxWidth>
    </AppModal>
  )
}
