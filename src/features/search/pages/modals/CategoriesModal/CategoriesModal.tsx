import React, { useCallback, useEffect, useMemo } from 'react'
import { useForm } from 'react-hook-form'
import { useTheme } from 'styled-components/native'
import { v4 as uuidv4 } from 'uuid'

import { NativeCategoryIdEnumv2, SearchGroupNameEnumv2 } from 'api/gen'
import { SearchCustomModalHeader } from 'features/search/components/SearchCustomModalHeader'
import { SearchFixedModalBottom } from 'features/search/components/SearchFixedModalBottom'
import { useSearch } from 'features/search/context/SearchWrapper'
import { CategoriesModalView, FilterBehaviour } from 'features/search/enums'
import {
  buildSearchPayloadValues,
  getCategoriesModalTitle,
  getDefaultFormValues,
  getIcon,
  isOnlyOnline,
} from 'features/search/helpers/categoriesHelpers/categoriesHelpers'
import {
  createMappingTree,
  MappedGenreTypes,
  MappedNativeCategories,
} from 'features/search/helpers/categoriesHelpers/mapping-tree'
import { CategoriesSection } from 'features/search/pages/modals/CategoriesModal/CategoriesSection'
import { SearchState } from 'features/search/types'
import { FacetData } from 'libs/algolia'
import { useFeatureFlag } from 'libs/firebase/firestore/featureFlags/useFeatureFlag'
import { RemoteStoreFeatureFlags } from 'libs/firebase/firestore/types'
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
  nativeCategory: NativeCategoryIdEnumv2 | null
  currentView: CategoriesModalView
  genreType: string | null
}

export const CategoriesModal = ({
  accessibilityLabel,
  filterBehaviour,
  isVisible = false,
  hideModal,
  onClose,
  facets,
}: CategoriesModalProps) => {
  const { data } = useSubcategories()
  const { modal } = useTheme()
  const { dispatch, searchState } = useSearch()
  const enableNewMapping = useFeatureFlag(RemoteStoreFeatureFlags.WIP_NEW_MAPPING_BOOKS)

  const tree = useMemo(() => {
    return createMappingTree(data, facets, enableNewMapping)
  }, [data, facets, enableNewMapping])

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
    return (category &&
      category !== SearchGroupNameEnumv2.NONE &&
      tree[category].children) as MappedNativeCategories
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
    (nativeCategoryKey: NativeCategoryIdEnumv2 | null) => {
      if (!nativeCategories) return

      setValue('nativeCategory', nativeCategoryKey)

      if (nativeCategoryKey !== nativeCategory) {
        setValue('genreType', null)
      }

      // @ts-expect-error: because of noUncheckedIndexedAccess
      if (nativeCategoryKey && nativeCategories[nativeCategoryKey].children) {
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
    hideModal()
  }, [hideModal])

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
      if (!data) {
        return
      }

      const payload = buildSearchPayloadValues(data, form)
      if (!payload) return

      let additionalSearchState: SearchState = { ...searchState, ...payload }
      let isFullyDigitalOffersCategory = false
      if (payload.offerNativeCategories.length > 0) {
        isFullyDigitalOffersCategory = isOnlyOnline(
          data,
          undefined,
          payload.offerNativeCategories[0]
        )
      } else if (payload.offerCategories.length > 0) {
        isFullyDigitalOffersCategory = isOnlyOnline(data, payload.offerCategories[0])
      }
      additionalSearchState = {
        ...additionalSearchState,
        isFullyDigitalOffersCategory: isFullyDigitalOffersCategory || undefined,
      }

      dispatch({ type: 'SET_STATE', payload: additionalSearchState })
      hideModal()
    },
    [data, dispatch, hideModal, searchState]
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
    return getCategoriesModalTitle(data, currentView, category, nativeCategory)
  }, [category, currentView, data, nativeCategory])

  const shouldDisplayBackButton = useMemo(
    () =>
      currentView !== CategoriesModalView.CATEGORIES ||
      filterBehaviour === FilterBehaviour.APPLY_WITHOUT_SEARCHING,
    [currentView, filterBehaviour]
  )

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
        {currentView === CategoriesModalView.CATEGORIES && (
          <CategoriesSection
            data={tree}
            onSelect={handleCategorySelect}
            allValue={SearchGroupNameEnumv2.NONE}
            allLabel="Toutes les catégories"
            value={category}
            descriptionContext={descriptionContext}
            getIcon={getIcon}
          />
        )}
        {currentView === CategoriesModalView.NATIVE_CATEGORIES && (
          <CategoriesSection
            data={nativeCategories}
            onSelect={handleNativeCategorySelect}
            allValue={null}
            allLabel="Tout"
            value={nativeCategory}
            descriptionContext={descriptionContext}
          />
        )}
        {currentView === CategoriesModalView.GENRES && (
          <CategoriesSection
            data={genreTypes}
            onSelect={handleGenreTypeSelect}
            allValue={null}
            allLabel="Tout"
            value={genreType}
            descriptionContext={descriptionContext}
            onSubmit={handleSubmit(handleSearchPress)}
          />
        )}
      </Form.MaxWidth>
    </AppModal>
  )
}
