import React, { useCallback, useEffect, useMemo } from 'react'
import { useForm } from 'react-hook-form'
import { useTheme } from 'styled-components/native'
import { v4 as uuidv4 } from 'uuid'

import { CategoriesSectionItem } from 'features/search/components/CategoriesSectionItem/CategoriesSectionItem'
import { SearchCustomModalHeader } from 'features/search/components/SearchCustomModalHeader'
import { SearchFixedModalBottom } from 'features/search/components/SearchFixedModalBottom'
import { useSearch } from 'features/search/context/SearchWrapper'
import { CATEGORY_ICONS, FilterBehaviour, hasIcon } from 'features/search/enums'
import {
  ALL,
  buildSearchPayloadValues,
  getCategoryChildren,
  getCategory,
  ROOT,
  sortCategoriesPredicate,
  CategoryKey,
  BaseCategory,
} from 'features/search/helpers/categoriesHelpers/categoriesHelpers'
import { SearchState } from 'features/search/types'
import { FacetData } from 'libs/algolia/types'
import { PLACEHOLDER_DATA } from 'libs/subcategories/placeholderData'
import { Form } from 'ui/components/Form'
import { AppModal } from 'ui/components/modals/AppModal'
import { VerticalUl } from 'ui/components/Ul'
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

  function getIcon(categoryKey: CategoryKey) {
    return hasIcon(categoryKey) ? CATEGORY_ICONS[categoryKey] : undefined
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
    setValue('currentIndex', newIndex)
  }, [currentIndex, setValue])

  const handleSearchPress = useCallback(
    (form: CategoriesModalFormProps) => {
      const categories = form.categoryStack
        .map((categoryKey) => getCategory(categoryKey))
        .filter((category) => !!category)
      const searchPayload = buildSearchPayloadValues(categories)
      if (!searchPayload) {
        hideModal()
        return
      }

      const newSearchState: SearchState = { ...searchState, ...searchPayload }
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
      if (category.key !== previousSelection && hasChildren)
        // we want to preselect 'Tout' if possible
        newStack.push(ALL.key)

      setValue('currentIndex', newIndex)
      setValue('categoryStack', newStack)

      handleSubmit(handleSearchPress)
    },
    [categoryStack, currentIndex, setValue]
  )

  const handleReset = useCallback(() => {
    reset(getDefaultFormValues(searchState))
  }, [reset])

  const currentItem =
    (categoryStack[currentIndex] && getCategory(categoryStack[currentIndex])) || ROOT
  const children = getCategoryChildren(currentItem.key).toSorted(sortCategoriesPredicate)

  const selectedChild = useMemo(() => {
    const next = currentIndex + 1
    return (categoryStack[next] && getCategory(categoryStack[next])) || ALL
  }, [categoryStack, currentIndex])

  const preselections = categoryStack.slice(currentIndex + 2) // we want to start at currently selected child's child
  if (preselections.length >= 2 && preselections.at(-1) == ALL.key) preselections.pop() // we don't the label to be '`child` - Tout', just 'child'

  const preselectionLabel = preselections
    .map((categoryKey) => getCategory(categoryKey)?.label)
    .join(' - ')

  const shouldDisplayBackButton =
    currentIndex > 0 || filterBehaviour === FilterBehaviour.APPLY_WITHOUT_SEARCHING

  console.log(categoryStack, currentIndex)

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
              isSelected={selectedChild.key === item.key}
              item={item}
              key={item.key}
              onSelect={() => handleSelect(item)}
              icon={getIcon(item.key)}
              subtitle={selectedChild.key === item.key ? preselectionLabel : undefined}
            />
          ))}
        </VerticalUl>
      </Form.MaxWidth>
    </AppModal>
  )
}
