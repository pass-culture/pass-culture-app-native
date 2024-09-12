import React, { useCallback, useEffect, useMemo } from 'react'
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
import { createCategoryTree } from 'features/search/helpers/categoriesHelpers/categoryTree'
import {
  MappedGenreTypes,
  MappedNativeCategories,
} from 'features/search/helpers/categoriesHelpers/mapping-tree'
import { NativeCategoryEnum, SearchState } from 'features/search/types'
import { FacetData } from 'libs/algolia/types'
import { useCategories } from 'libs/subcategories/useCategories'
import { useSubcategories } from 'libs/subcategories/useSubcategories'
import { Form } from 'ui/components/Form'
import { AppModal } from 'ui/components/modals/AppModal'
import { ArrowPrevious } from 'ui/svg/icons/ArrowPrevious'
import { Close } from 'ui/svg/icons/Close'
import { Spacer } from 'ui/theme'

const titleId = uuidv4()

export interface CategoriesModalProps {
  accessibilityLabel: string
  isVisible?: boolean
  hideModal: VoidFunction
  filterBehaviour: FilterBehaviour
  onClose?: VoidFunction
  facets?: FacetData
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
  const { data: categoryList } = useCategories()
  const { data: subcategoriesData } = useSubcategories()
  const { modal } = useTheme()
  const { dispatch, searchState } = useSearch()

  const tree = useMemo(() => {
    return createCategoryTree(categoryList)
  }, [categoryList])

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

  useEffect(() => {
    reset(getDefaultFormValues(tree, searchState))
  }, [reset, searchState, tree])

  const nativeCategories = useMemo(() => {
    return ((category && category !== SearchGroupNameEnumv2.NONE && tree[category]?.children) ||
      {}) as MappedNativeCategories
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

  const handleSearchPress = useCallback(
    (form: CategoriesModalFormProps) => {
      if (!subcategoriesData) {
        return
      }

      const searchPressData = handleCategoriesSearchPress(form, subcategoriesData)

      let additionalSearchState: SearchState = { ...searchState, ...searchPressData?.payload }
      additionalSearchState = {
        ...additionalSearchState,
        isFullyDigitalOffersCategory: searchPressData?.isFullyDigitalOffersCategory || undefined,
      }

      dispatch({ type: 'SET_STATE', payload: additionalSearchState })
      hideModal()
    },
    [subcategoriesData, dispatch, hideModal, searchState]
  )

  const handleReset = useCallback(() => {
    reset({
      category: SearchGroupNameEnumv2.NONE,
      nativeCategory: null,
      genreType: null,
      currentView: CategoriesModalView.CATEGORIES,
    })
  }, [reset])

  const descriptionContext = useMemo(
    () => ({
      category,
      nativeCategory,
      genreType,
    }),
    [category, genreType, nativeCategory]
  )

  const modalTitle = useMemo(() => {
    return getCategoriesModalTitle(subcategoriesData, currentView, category, nativeCategory)
  }, [category, currentView, subcategoriesData, nativeCategory])

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
          data={nativeCategories}
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
        data={nativeCategories}
        onSelect={handleNativeCategorySelect}
        allValue={null}
        allLabel="Tout"
        value={nativeCategory}
        descriptionContext={descriptionContext}
      />
    )
  }

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
        />
      }>
      <Spacer.Column numberOfSpaces={3} />
      <Form.MaxWidth>
        {currentView === CategoriesModalView.CATEGORIES ? (
          <CategoriesSection
            data={tree}
            onSelect={handleCategorySelect}
            allValue={SearchGroupNameEnumv2.NONE}
            allLabel="Toutes les catégories"
            value={category}
            descriptionContext={descriptionContext}
            getIcon={getIcon}
          />
        ) : null}
        {currentView === CategoriesModalView.NATIVE_CATEGORIES && getNativeCategoriesSection()}
        {currentView === CategoriesModalView.GENRES ? (
          <CategoriesSection
            data={genreTypes}
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
