import React, { useCallback, useEffect, useMemo } from 'react'
import { useForm } from 'react-hook-form'
import { useTheme } from 'styled-components/native'
import { v4 as uuidv4 } from 'uuid'

import { SearchCustomModalHeader } from 'features/search/components/SearchCustomModalHeader'
import { SearchFixedModalBottom } from 'features/search/components/SearchFixedModalBottom'
import { useSearch } from 'features/search/context/SearchWrapper'
import { FilterBehaviour } from 'features/search/enums'
import {
  getIcon,
  buildFormPayload as buildFormSearchData,
  sortCategoriesPredicate,
} from 'features/search/helpers/categoriesHelpers/categoriesHelpers'
import { BaseCategory, CategoryKey } from 'features/search/helpers/categoriesHelpers/mapping-tree'
import { SearchState } from 'features/search/types'
import { FacetData } from 'libs/algolia/types'
import { PLACEHOLDER_DATA } from 'libs/subcategories/placeholderData'
import { Form } from 'ui/components/Form'
import { AppModal } from 'ui/components/modals/AppModal'
import { ArrowPrevious } from 'ui/svg/icons/ArrowPrevious'
import { Close } from 'ui/svg/icons/Close'
import { Spacer } from 'ui/theme'
import { VerticalUl } from 'ui/components/Ul'
import { CategoriesSectionItem } from 'features/search/components/CategoriesSectionItem/CategoriesSectionItem'

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
  categoryStack: CategoryKey[]
  currentIndex: number
}

export const CategoriesModal = ({
  accessibilityLabel,
  filterBehaviour,
  isVisible = false,
  hideModal,
  onClose,
  facets,
}: CategoriesModalProps) => {
  const data = PLACEHOLDER_DATA
  const { modal } = useTheme()
  const { dispatch, searchState } = useSearch()

  const ROOT_ALL: BaseCategory = {
    children: [],
    label: 'Toutes les catégories',
    key: 'ROOT_ALL',
    position: 0,
  }
  const ALL: BaseCategory = {
    children: [],
    label: 'Tout',
    key: 'ALL',
    position: 0,
  }
  const THRILLER: BaseCategory = {
    children: [],
    label: 'Thriller',
    key: 'THRILLER',
    position: 1,
  }
  const SEANCE: BaseCategory = {
    children: [ALL, THRILLER],
    label: 'Séance de cinéma',
    key: 'SEANCE',
    position: 1,
  }
  const CINEMA: BaseCategory = {
    children: [ALL, SEANCE],
    label: 'Cinéma',
    key: 'CINEMA',
    position: 1,
  }
  const ROOT: BaseCategory = {
    children: [ROOT_ALL, CINEMA],
    label: 'Catégories',
    key: 'ROOT',
    position: 1,
  }
  const tree: Record<CategoryKey, BaseCategory> = {
    ALL: ALL,
    CINEMA: CINEMA,
    ROOT: ROOT,
    ROOT_ALL: ROOT_ALL,
    SEANCE: SEANCE,
    THRILLER: THRILLER,
  }

  const getDefaultFormValues = (searchState: SearchState): CategoriesModalFormProps => ({
    categoryStack: [ROOT.key, ...searchState.offerCategories.map((category) => category)],
    currentIndex: 0,
  })

  const {
    formState: { isSubmitting },
    handleSubmit,
    reset,
    setValue,
    watch,
  } = useForm<CategoriesModalFormProps>({
    defaultValues: getDefaultFormValues(searchState),
  })
  const { categoryStack, currentIndex } = watch()
  useEffect(() => {
    reset(getDefaultFormValues(searchState))
  }, [reset, searchState])

  const handleModalClose = useCallback(() => {
    reset(getDefaultFormValues(searchState))
    hideModal()
  }, [hideModal, reset, searchState])

  const handleClose = useCallback(() => {
    handleModalClose()
    if (onClose) {
      onClose()
    }
  }, [handleModalClose, onClose])

  const handleGoBack = useCallback(() => {
    const newIndex = currentIndex - 1
    console.log('GO BACK. Setting currentIndex to:', newIndex)
    setValue('currentIndex', newIndex)
  }, [currentIndex, setValue])

  const handleSearchPress = useCallback(
    (form: CategoriesModalFormProps) => {
      const formSearchData = buildFormSearchData(form, data)
      if (!formSearchData) {
        hideModal()
        return
      }

      const newSearchState: SearchState = {
        ...searchState,
        ...formSearchData.payload,
        isFullyDigitalOffersCategory: formSearchData.isFullyDigitalOffersCategory,
      }

      dispatch({ type: 'SET_STATE', payload: newSearchState })
      hideModal()
    },
    [data, dispatch, hideModal, searchState]
  )

  const handleSelect = useCallback(
    (category: BaseCategory) => {
      const hasChildren = category.children.length
      const newIndex = hasChildren ? currentIndex + 1 : currentIndex

      const previousSelection = categoryStack[currentIndex + 1]
      const newStack =
        category.key !== previousSelection
          ? [...categoryStack.slice(0, currentIndex + 1), category.key]
          : categoryStack

      setValue('currentIndex', newIndex)
      setValue('categoryStack', newStack)

      handleSubmit(handleSearchPress)
    },
    [categoryStack, currentIndex, setValue]
  )

  const handleReset = useCallback(() => {
    reset(getDefaultFormValues(searchState))
  }, [reset])

  const currentItem = useMemo(
    () => (categoryStack[currentIndex] && tree[categoryStack[currentIndex]]) || ROOT,
    [tree, categoryStack, currentIndex]
  )
  currentItem.children.sort((a, b) => sortCategoriesPredicate(a, b))

  const selectedChild = useMemo(() => {
    const next = currentIndex + 1
    return (categoryStack[next] && tree[categoryStack[next]]) || ALL
  }, [tree, categoryStack, currentIndex])

  const shouldDisplayBackButton =
    currentIndex > 0 || filterBehaviour === FilterBehaviour.APPLY_WITHOUT_SEARCHING

  return (
    <AppModal
      customModalHeader={
        <SearchCustomModalHeader
          titleId={titleId}
          title={currentItem.label}
          onGoBack={handleGoBack}
          onClose={handleClose}
          shouldDisplayBackButton={shouldDisplayBackButton}
          shouldDisplayCloseButton
        />
      }
      title={currentItem.label}
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
        <VerticalUl>
          {currentItem.children.map((item) => (
            <CategoriesSectionItem
              isSelected={selectedChild === item}
              item={item}
              key={item.key}
              handleSelect={handleSelect}
              handleGetIcon={getIcon}
            />
          ))}
        </VerticalUl>
      </Form.MaxWidth>
    </AppModal>
  )
}
