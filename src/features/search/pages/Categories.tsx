import { useNavigation } from '@react-navigation/native'
import React, { FunctionComponent, useCallback } from 'react'
import { useTheme } from 'styled-components'
import { v4 as uuidv4 } from 'uuid'

import { SearchGroupNameEnumv2 } from 'api/gen'
import { UseNavigationType } from 'features/navigation/RootNavigator'
import { getTabNavConfig } from 'features/navigation/TabBar/helpers'
import { SearchCustomModalHeader } from 'features/search/components/SearchCustomModalHeader'
import { SearchFixedModalBottom } from 'features/search/components/SearchFixedModalBottom'
import { CATEGORY_CRITERIA } from 'features/search/enums'
import { useSearch } from 'features/search/pages/SearchWrapper'
import { useSafeState } from 'libs/hooks'
import { useSearchGroupLabelMapping } from 'libs/subcategories/mappings'
import { Li } from 'ui/components/Li'
import { AppModal } from 'ui/components/modals/AppModal'
import { ModalSpacing } from 'ui/components/modals/enum'
import { RadioButton } from 'ui/components/radioButtons/RadioButton'
import { VerticalUl } from 'ui/components/Ul'
import { Close } from 'ui/svg/icons/Close'
import { getSpacing } from 'ui/theme'

interface Props {
  title: string
  accessibilityLabel: string
  isVisible: boolean
  hideModal: () => void
}

export const Categories: FunctionComponent<Props> = ({
  title,
  accessibilityLabel,
  isVisible,
  hideModal,
}) => {
  const { navigate } = useNavigation<UseNavigationType>()
  const { searchState, dispatch } = useSearch()
  const [selectedCategory, setSelectedCategory] = useSafeState<SearchGroupNameEnumv2>(
    searchState?.offerCategories?.[0] || SearchGroupNameEnumv2.NONE
  )
  const { isDesktopViewport } = useTheme()

  const onSelectCategory = (category: SearchGroupNameEnumv2) => () => {
    setSelectedCategory(category)
  }

  const isCategorySelected = (category: SearchGroupNameEnumv2) => {
    return selectedCategory === category
  }

  const onResetPress = useCallback(() => {
    setSelectedCategory(SearchGroupNameEnumv2.NONE)
  }, [setSelectedCategory])

  const onSearchPress = useCallback(() => {
    hideModal()
    const payload = selectedCategory === SearchGroupNameEnumv2.NONE ? [] : [selectedCategory]
    dispatch({ type: 'SET_CATEGORY', payload })
    navigate(
      ...getTabNavConfig('Search', {
        ...searchState,
        offerCategories: payload,
      })
    )
  }, [dispatch, hideModal, navigate, searchState, selectedCategory])

  const titleId = uuidv4()
  const searchGroupLabelMapping = useSearchGroupLabelMapping()

  return (
    <AppModal
      visible={isVisible}
      customModalHeader={
        isDesktopViewport ? undefined : (
          <SearchCustomModalHeader titleId={titleId} title={title} onGoBack={hideModal} />
        )
      }
      title={title}
      isFullscreen={true}
      noPadding={true}
      modalSpacing={ModalSpacing.MD}
      rightIconAccessibilityLabel={accessibilityLabel}
      rightIcon={Close}
      onRightIconPress={hideModal}
      fixedModalBottom={
        <SearchFixedModalBottom onResetPress={onResetPress} onSearchPress={onSearchPress} />
      }>
      <VerticalUl>
        {Object.entries(CATEGORY_CRITERIA).map(([category, { icon: Icon }]) => {
          const searchGroup = category as SearchGroupNameEnumv2
          return (
            <Li key={searchGroup}>
              <RadioButton
                label={searchGroupLabelMapping[searchGroup]}
                isSelected={isCategorySelected(searchGroup)}
                onSelect={onSelectCategory(searchGroup)}
                testID={searchGroup}
                marginVertical={getSpacing(3)}
                icon={Icon}
              />
            </Li>
          )
        })}
      </VerticalUl>
    </AppModal>
  )
}
