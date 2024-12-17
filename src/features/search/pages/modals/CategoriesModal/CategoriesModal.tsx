import React, { useCallback, useEffect, useMemo } from 'react'
import { useForm } from 'react-hook-form'
import { useTheme } from 'styled-components/native'
import { v4 as uuidv4 } from 'uuid'

import { CategoriesSection } from 'features/search/components/CategoriesSection/CategoriesSection'
import { SearchCustomModalHeader } from 'features/search/components/SearchCustomModalHeader'
import { SearchFixedModalBottom } from 'features/search/components/SearchFixedModalBottom'
import { useSearch } from 'features/search/context/SearchWrapper'
import { FilterBehaviour } from 'features/search/enums'
import {
  getDefaultFormValues,
  getIcon,
  handleCategoriesSearchPress,
} from 'features/search/helpers/categoriesHelpers/categoriesHelpers'
import { createMappingTree } from 'features/search/helpers/categoriesHelpers/mapping-tree'
import { SearchState } from 'features/search/types'
import { FacetData } from 'libs/algolia/types'
import { PLACEHOLDER_DATA } from 'libs/subcategories/placeholderData'
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
  categories: string[]
  currentView: number // index of category to show in `categories`
}

export const CategoriesModal = ({
  accessibilityLabel,
  filterBehaviour,
  isVisible = false,
  hideModal,
  onClose,
  facets,
}: CategoriesModalProps) => {
  const { data = PLACEHOLDER_DATA } = useSubcategories()
  const { modal } = useTheme()
  const { dispatch, searchState } = useSearch()

  const tree = useMemo(() => {
    return createMappingTree(data, facets)
  }, [data, facets])

  const {
    formState: { isSubmitting },
    handleSubmit,
    reset,
    setValue,
    watch,
  } = useForm<CategoriesModalFormProps>({
    defaultValues: getDefaultFormValues(tree, searchState),
  })
  const { categories, currentView } = watch()

  useEffect(() => {
    reset(getDefaultFormValues(tree, searchState))
  }, [reset, searchState, tree])

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

  const handleGoBack = useCallback(
    () => setValue('currentView', currentView - 1),
    [currentView, setValue]
  )

  const handleSearchPress = useCallback(
    (form: CategoriesModalFormProps) => {
      const searchPressData = handleCategoriesSearchPress(form, data)

      let additionalSearchState: SearchState = { ...searchState, ...searchPressData?.payload }
      additionalSearchState = {
        ...additionalSearchState,
        isFullyDigitalOffersCategory: searchPressData?.isFullyDigitalOffersCategory || undefined,
      }

      dispatch({ type: 'SET_STATE', payload: additionalSearchState })
      hideModal()
    },
    [data, dispatch, hideModal, searchState]
  )

  const handleCategorySelect = useCallback(
    (category: string) => {
      setValue('categories', [...categories, category])
      setValue('currentView', currentView + 1)
    },
    [categories, currentView, setValue]
  )

  const handleReset = useCallback(() => {
    reset({
      categories: [],
      currentView: -1,
    })
  }, [reset])

  const modalTitle = categories[currentView] ?? 'Catégories'
  const shouldDisplayBackButton =
    currentView > 0 || filterBehaviour === FilterBehaviour.APPLY_WITHOUT_SEARCHING

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
        {categories[currentView] ? (
          <CategoriesSection
            itemsMapping={tree}
            onSelect={handleCategorySelect}
            allLabel="Toutes les catégories"
            allValue="Tout"
            value={categories[currentView]}
            getIcon={getIcon}
            shouldSortItems={false} // sorting on positions is not supported yet for search groups, but they're already sorted in `createMappingTree`
          />
        ) : null}
      </Form.MaxWidth>
    </AppModal>
  )
}
