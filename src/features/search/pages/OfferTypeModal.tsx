import { useNavigation } from '@react-navigation/native'
import React, { FunctionComponent, useCallback, useMemo, useState } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { StyleProp, ViewStyle } from 'react-native'
import { useTheme } from 'styled-components'
import styled from 'styled-components/native'
import { v4 as uuidv4 } from 'uuid'

import { UseNavigationType } from 'features/navigation/RootNavigator/types'
import { getTabNavConfig } from 'features/navigation/TabBar/helpers'
import { useUserProfileInfo } from 'features/profile/api'
import { FilterSwitchWithLabel } from 'features/search/components/FilterSwitchWithLabel'
import { SearchCustomModalHeader } from 'features/search/components/SearchCustomModalHeader'
import { SearchFixedModalBottom } from 'features/search/components/SearchFixedModalBottom'
import { initialSearchState } from 'features/search/pages/reducer'
import { useSearch } from 'features/search/pages/SearchWrapper'
import { OFFER_TYPES } from 'features/search/sections/OfferType'
import { SectionTitle } from 'features/search/sections/titles'
import { SearchState, SearchView } from 'features/search/types'
import { useLogFilterOnce } from 'features/search/utils/useLogFilterOnce'
import { Form } from 'ui/components/Form'
import { Li } from 'ui/components/Li'
import { AppModal } from 'ui/components/modals/AppModal'
import { RadioButton } from 'ui/components/radioButtons/RadioButton'
import { Separator } from 'ui/components/Separator'
import { VerticalUl } from 'ui/components/Ul'
import { Close } from 'ui/svg/icons/Close'
import { Spacer } from 'ui/theme'

type SearchTypeFormData = {
  offerTypes: {
    isDigital: boolean
    isEvent: boolean
    isThing: boolean
  }
  offerIsDuo: boolean
}

type Props = {
  title: string
  accessibilityLabel: string
  isVisible: boolean
  hideModal: () => void
}

const titleId = uuidv4()

const DEFAULT_HEIGHT_MODAL = 500

export const OfferTypeModal: FunctionComponent<Props> = ({
  title,
  accessibilityLabel,
  isVisible,
  hideModal,
}) => {
  const logUseFilter = useLogFilterOnce(SectionTitle.OfferType)
  const logDuoOfferFilter = useLogFilterOnce(SectionTitle.Duo)
  const [heightModal, setHeightModal] = useState(DEFAULT_HEIGHT_MODAL)
  const { searchState } = useSearch()
  const { data: user } = useUserProfileInfo()
  const { isDesktopViewport, modal } = useTheme()
  const { navigate } = useNavigation<UseNavigationType>()

  const {
    watch,
    handleSubmit,
    control,
    reset,
    getValues,
    setValue,
    formState: { isSubmitting },
  } = useForm<SearchTypeFormData>({
    mode: 'onChange',
    defaultValues: {
      offerTypes: searchState.offerTypes,
      offerIsDuo: searchState.offerIsDuo,
    },
  })

  const offerTypes = watch('offerTypes')

  const toggleLimitDuoOfferSearch = useCallback(() => {
    logDuoOfferFilter()
    const toggleLimitDuoOffer = !getValues('offerIsDuo')
    setValue('offerIsDuo', toggleLimitDuoOffer)
  }, [logDuoOfferFilter, getValues, setValue])

  const onResetPress = useCallback(() => {
    reset({
      offerTypes: initialSearchState.offerTypes,
      offerIsDuo: initialSearchState.offerIsDuo,
    })
  }, [reset])

  const onContentSizeChange = useCallback(
    (width: number, height: number) => {
      if (isDesktopViewport) {
        setHeightModal(height)
      }
    },
    [isDesktopViewport]
  )

  const close = useCallback(() => {
    reset({
      offerTypes: searchState.offerTypes,
      offerIsDuo: searchState.offerIsDuo,
    })
    hideModal()
  }, [hideModal, reset, searchState?.offerIsDuo, searchState?.offerTypes])

  const getSelectedOfferType = useCallback(() => {
    const offerTypes = getValues('offerTypes')
    const entry = Object.entries(offerTypes).find(([, value]) => value)
    return entry ? entry[0] : undefined
  }, [getValues])

  const hasDuoOfferToggle = useMemo(() => {
    const entry = Object.entries(offerTypes).find(([, value]) => value)
    return (
      !!user?.isBeneficiary &&
      !!user?.domainsCredit?.all?.remaining &&
      (!entry || (entry && entry[0] == 'isEvent'))
    )
  }, [user?.isBeneficiary, user?.domainsCredit?.all?.remaining, offerTypes])

  const search = useCallback(
    (values: SearchTypeFormData) => {
      hideModal()
      const additionalSearchState: SearchState = {
        ...searchState,
        offerIsDuo: hasDuoOfferToggle && values.offerIsDuo,
        offerTypes: values.offerTypes,
      }
      navigate(
        ...getTabNavConfig('Search', {
          ...additionalSearchState,
          view: SearchView.Results,
        })
      )
    },
    [hideModal, navigate, searchState, hasDuoOfferToggle]
  )

  const onSubmit = handleSubmit(search)

  const selectOfferType = useCallback(
    (type: string | undefined) => {
      logUseFilter()
      setValue('offerTypes', {
        ...initialSearchState.offerTypes,
        ...(type !== undefined
          ? {
              [type]: true,
            }
          : {}),
      })
    },
    [logUseFilter, setValue]
  )

  return (
    <AppModal
      visible={isVisible}
      customModalHeader={
        isDesktopViewport ? undefined : (
          <SearchCustomModalHeader titleId={titleId} title={title} onGoBack={close} />
        )
      }
      title={title}
      isFullscreen
      noPadding
      modalSpacing={modal.spacing.MD}
      rightIconAccessibilityLabel={accessibilityLabel}
      rightIcon={Close}
      onRightIconPress={close}
      maxHeight={isDesktopViewport ? heightModal : undefined}
      fixedModalBottom={
        <SearchFixedModalBottom
          onSearchPress={onSubmit}
          onResetPress={onResetPress}
          isSearchDisabled={isSubmitting}
        />
      }>
      <Spacer.Column numberOfSpaces={6} />
      <StyledScrollView
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={scrollViewContentContainerStyle}
        onContentSizeChange={onContentSizeChange}>
        <Form.MaxWidth>
          <Controller
            control={control}
            name="offerTypes"
            render={() => (
              <VerticalUl>
                {OFFER_TYPES.map(({ type, label, icon }) => (
                  <Li key={label}>
                    <RadioButton
                      onSelect={() => selectOfferType(type)}
                      isSelected={getSelectedOfferType() === type}
                      label={label}
                      icon={icon}
                      testID={label}
                    />
                    <Spacer.Column numberOfSpaces={6} />
                  </Li>
                ))}
              </VerticalUl>
            )}
          />
          <Spacer.Column numberOfSpaces={6} />
          <Separator />
          <Spacer.Column numberOfSpaces={6} />
          {!!hasDuoOfferToggle && (
            <Controller
              control={control}
              name="offerIsDuo"
              render={({ field: { value } }) => (
                <React.Fragment>
                  <FilterSwitchWithLabel
                    isActive={value}
                    toggle={toggleLimitDuoOfferSearch}
                    label="Uniquement les offres duo"
                    testID="limitDuoOfferSearch"
                  />
                  <Spacer.Column numberOfSpaces={6} />
                </React.Fragment>
              )}
            />
          )}
        </Form.MaxWidth>
      </StyledScrollView>
    </AppModal>
  )
}

const scrollViewContentContainerStyle: StyleProp<ViewStyle> = {
  flexDirection: 'column',
  alignItems: 'center',
}

const StyledScrollView = styled.ScrollView({
  flexGrow: 1,
})
