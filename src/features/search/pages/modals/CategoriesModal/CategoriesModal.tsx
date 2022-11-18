import { useNavigation } from '@react-navigation/native'
import React, { FunctionComponent, useCallback, useEffect } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { useTheme } from 'styled-components'
import { v4 as uuidv4 } from 'uuid'

import { SearchGroupNameEnumv2 } from 'api/gen'
import { UseNavigationType } from 'features/navigation/RootNavigator/types'
import { getTabNavConfig } from 'features/navigation/TabBar/helpers'
import { SearchCustomModalHeader } from 'features/search/components/SearchCustomModalHeader'
import { SearchFixedModalBottom } from 'features/search/components/SearchFixedModalBottom'
import { CATEGORY_CRITERIA } from 'features/search/enums'
import { useSearch } from 'features/search/context/SearchWrapper/SearchWrapper'
import { SectionTitle } from 'features/search/utils/titles'
import { useLogFilterOnce } from 'features/search/utils/useLogFilterOnce'
import { useSearchGroupLabelMapping } from 'libs/subcategories/mappings'
import { Form } from 'ui/components/Form'
import { Li } from 'ui/components/Li'
import { AppModal } from 'ui/components/modals/AppModal'
import { RadioButton } from 'ui/components/radioButtons/RadioButton'
import { VerticalUl } from 'ui/components/Ul'
import { Close } from 'ui/svg/icons/Close'
import { getSpacing, Spacer } from 'ui/theme'

interface Props {
  title: string
  accessibilityLabel: string
  isVisible: boolean
  hideModal: () => void
}

interface SearchCategoriesFormData {
  offerCategories: SearchGroupNameEnumv2
}

const titleId = uuidv4()

export const CategoriesModal: FunctionComponent<Props> = ({
  title,
  accessibilityLabel,
  isVisible,
  hideModal,
}) => {
  const { navigate } = useNavigation<UseNavigationType>()
  const { searchState } = useSearch()
  const { isDesktopViewport, modal } = useTheme()
  const logUseCategoryFilter = useLogFilterOnce(SectionTitle.Category, searchState.searchId)

  const {
    handleSubmit,
    control,
    reset,
    getValues,
    setValue,
    formState: { isSubmitting },
  } = useForm<SearchCategoriesFormData>({
    mode: 'onChange',
    defaultValues: {
      offerCategories: searchState?.offerCategories?.[0] || SearchGroupNameEnumv2.NONE,
    },
  })

  useEffect(() => {
    if (!isVisible) return
    setValue('offerCategories', searchState?.offerCategories?.[0] || SearchGroupNameEnumv2.NONE)
    // Update the category only when display the modal
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isVisible])

  const onResetPress = useCallback(() => {
    reset({
      offerCategories: SearchGroupNameEnumv2.NONE,
    })
  }, [reset])

  const onSearchPress = useCallback(() => {
    const offerCategories = getValues('offerCategories')
    const payload = offerCategories === SearchGroupNameEnumv2.NONE ? [] : [offerCategories]
    navigate(
      ...getTabNavConfig('Search', {
        ...searchState,
        offerCategories: payload,
      })
    )
    logUseCategoryFilter()
    hideModal()
  }, [hideModal, getValues, navigate, searchState, logUseCategoryFilter])

  const searchGroupLabelMapping = useSearchGroupLabelMapping()
  const onSubmit = handleSubmit(onSearchPress)

  return (
    <AppModal
      visible={isVisible}
      customModalHeader={
        isDesktopViewport ? undefined : (
          <SearchCustomModalHeader titleId={titleId} title={title} onGoBack={hideModal} />
        )
      }
      title={title}
      isFullscreen
      noPadding
      modalSpacing={modal.spacing.MD}
      rightIconAccessibilityLabel={accessibilityLabel}
      rightIcon={Close}
      onRightIconPress={hideModal}
      fixedModalBottom={
        <SearchFixedModalBottom
          onResetPress={onResetPress}
          onSearchPress={onSubmit}
          isSearchDisabled={isSubmitting}
        />
      }>
      <Form.MaxWidth>
        <Controller
          control={control}
          name="offerCategories"
          render={({ field: { onChange, value } }) => (
            <VerticalUl>
              {!isDesktopViewport && <Spacer.Column numberOfSpaces={3} />}
              {Object.entries(CATEGORY_CRITERIA).map(([category, { icon: Icon }]) => (
                <Li key={category}>
                  <RadioButton
                    label={searchGroupLabelMapping[category as SearchGroupNameEnumv2]}
                    isSelected={value === category}
                    onSelect={() => onChange(category)}
                    testID={category}
                    marginVertical={getSpacing(3)}
                    icon={Icon}
                  />
                </Li>
              ))}
            </VerticalUl>
          )}
        />
      </Form.MaxWidth>
    </AppModal>
  )
}
