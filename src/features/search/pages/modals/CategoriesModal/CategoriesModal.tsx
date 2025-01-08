import React, { useCallback, useEffect } from 'react'
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
  ROOT_ALL,
} from 'features/search/helpers/categoriesHelpers/categoriesHelpers'
import { SearchState } from 'features/search/types'
import { FacetData } from 'libs/algolia/types'
import { Form } from 'ui/components/Form'
import { AppModal } from 'ui/components/modals/AppModal'
import { VerticalUl } from 'ui/components/Ul'
import { ArrowPrevious } from 'ui/svg/icons/ArrowPrevious'
import { Close } from 'ui/svg/icons/Close'
import { Spacer } from 'ui/theme'
import { CategoriesSectionBlock } from 'features/search/components/CategoriesSectionBlock/CategoriesSectionBlock'

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
  const { modal } = useTheme()
  const { dispatch, searchState } = useSearch()

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

  const getIcon = (categoryKey: CategoryKey) => {
    return hasIcon(categoryKey) ? CATEGORY_ICONS[categoryKey] : undefined
  }

  const getPreselectionLabel = () => {
    const preselections = categoryStack.slice(currentIndex + 2) // we want to start at currently selected child's child
    if (preselections.length >= 2 && preselections.at(-1) == ALL.key) preselections.pop() // we don't the label to be '`child` - Tout', just 'child'

    return preselections.map((categoryKey) => getCategory(categoryKey)?.label).join(' - ')
  }

  const isRootLevel = currentIndex === 0

  const currentItem =
    (categoryStack[currentIndex] && getCategory(categoryStack[currentIndex])) || ROOT
  const children = getCategoryChildren(currentItem.key).toSorted(sortCategoriesPredicate)

  const next = currentIndex + 1 // helps typing on next line
  const selectedChild = (categoryStack[next] && getCategory(categoryStack[next])) || ALL

  const preselectionLabel = getPreselectionLabel()

  const shouldRenderBlocks = children.some((child) => child.showChildren)

  const isSelected = (item: BaseCategory) => item.key === selectedChild.key

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
    const newIndex = Math.max(currentIndex - 1, 0)
    setValue('currentIndex', newIndex)
  }, [currentIndex, setValue])

  const handleSearchPress = useCallback(
    (form: CategoriesModalFormProps) => {
      const categories = form.categoryStack
        .map((categoryKey) => getCategory(categoryKey))
        .filter((category) => !!category)
      const searchPayload = buildSearchPayloadValues(categories)
      if (searchPayload) {
        const newSearchState = { ...searchState, ...searchPayload }
        dispatch({ type: 'SET_STATE', payload: newSearchState })
      }

      hideModal()
    },
    [dispatch, hideModal, searchState]
  )

  const handleSelect = useCallback(
    (category: BaseCategory) => {
      const hasChildren = category.children.length
      if (!hasChildren) {
        const newStack = [...categoryStack.slice(0, currentIndex + 1), category.key]
        setValue('categoryStack', newStack)
        handleSubmit(handleSearchPress)
      } else {
        const previousSelection = categoryStack[currentIndex + 1]
        if (category.key !== previousSelection) {
          const newStack = [...categoryStack.slice(0, currentIndex + 1), category.key, ALL.key]
          setValue('categoryStack', newStack)
        }
        const newIndex = currentIndex + 1
        setValue('currentIndex', newIndex)
      }
    },
    [categoryStack, currentIndex, setValue]
  )

  const handleReset = useCallback(() => {
    reset(getDefaultFormValues(searchState))
  }, [reset])

  const renderDefaultItem = () => {
    const defaultItem = isRootLevel ? ROOT_ALL : ALL
    return (
      <CategoriesSectionItem
        isSelected={isSelected(defaultItem)}
        item={defaultItem}
        key={defaultItem.key}
        onSelect={() => handleSelect(defaultItem)}
        icon={getIcon(defaultItem.key)}
        subtitle={isSelected(defaultItem) ? preselectionLabel : undefined}
      />
    )
  }

  const renderItems = () => {
    const items = children.map((item) => (
      <CategoriesSectionItem
        isSelected={isSelected(item)}
        item={item}
        key={item.key}
        onSelect={() => handleSelect(item)}
        icon={getIcon(item.key)}
        subtitle={isSelected(item) ? preselectionLabel : undefined}
      />
    ))
    return [renderDefaultItem(), ...items]
  }

  const renderBlocks = () => {
    const blocks = children
      .filter((child) => child.children.length && child.showChildren)
      .map((item) => (
        <CategoriesSectionBlock
          key={item.key}
          items={getCategoryChildren(item.key).toSorted(sortCategoriesPredicate)}
          onSelect={handleSelect}
          getIcon={getIcon}
          selectionKey={selectedChild.key}
          selectionSubtitle={preselectionLabel}
          title={item.label}
        />
      ))
    const otherItems = children.filter(
      (child) => (!child.children.length || !child.showChildren) && child.key !== ALL.key
    )
    const otherItemsBlock = (
      <CategoriesSectionBlock
        key={currentItem.key}
        items={otherItems}
        onSelect={handleSelect}
        getIcon={getIcon}
        selectionKey={selectedChild.key}
        selectionSubtitle={preselectionLabel}
        title={'Autres'}
      />
    )
    return [renderDefaultItem(), ...blocks, otherItemsBlock]
  }

  console.log(categoryStack, currentIndex)

  return (
    <AppModal
      customModalHeader={
        <SearchCustomModalHeader
          titleId={titleId}
          title={currentItem.label}
          onGoBack={handleGoBack}
          onClose={handleClose}
          shouldDisplayBackButton={!isRootLevel && filterBehaviour === FilterBehaviour.SEARCH}
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
        <VerticalUl>{shouldRenderBlocks ? renderBlocks() : renderItems()}</VerticalUl>
      </Form.MaxWidth>
    </AppModal>
  )
}
