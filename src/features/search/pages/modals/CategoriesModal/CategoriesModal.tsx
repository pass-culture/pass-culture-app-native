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

export type CategoryKey = string

export type BaseCategory = {
  children: CategoryKey[]
  label: string
  key: CategoryKey
  position?: number
  searchFilter?: string
  searchValue?: string
  nbResultsFacet?: number
}
export type CategoriesMapping = Record<CategoryKey, BaseCategory>

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
    position: -Infinity,
  }
  const ALL: BaseCategory = {
    children: [],
    label: 'Tout',
    key: 'ALL',
    position: -Infinity,
  }
  const ROOT: BaseCategory = {
    children: [ROOT_ALL.key],
    label: 'Catégories',
    key: 'ROOT',
    position: -Infinity,
  }
  const createMapping = () => {
    const categories = [
      { key: 'CINEMA', label: 'Cinéma', position: 2, children: ['SEANCE'] },
      { key: 'LIVRES', label: 'Livres', position: 1, children: [] },
      { key: 'MUSIQUE', label: 'Musique', position: 3, children: ['SEANCE'] },
      { key: 'SEANCE', label: 'Séance de cinéma', position: 1, children: ['THRILLER'] },
      { key: 'THRILLER', label: 'Thriller', position: 1, children: [] },
    ]

    const mapping = categories.reduce<CategoriesMapping>((mapping, category) => {
      mapping[category.key] = category
      mapping[category.key]?.children.push(ALL.key)
      return mapping
    }, {} as CategoriesMapping)
    mapping[ROOT.key] = ROOT

    const childrenCategories = categories.map((category) => category.children).flat()
    const rootCategories = categories
      .filter((category) => !childrenCategories.includes(category.key))
      .map((category) => category.key)
    mapping[ROOT.key]?.children.push(...rootCategories)
    return mapping
  }

  const tree = useMemo(createMapping, [])

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
  const children = currentItem.children
    .map((categoryKey) => tree[categoryKey])
    .filter((category) => !!category)
    .toSorted((a, b) => sortCategoriesPredicate(a, b))

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
          {children.map((item) => (
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
