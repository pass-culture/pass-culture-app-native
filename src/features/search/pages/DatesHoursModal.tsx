import { yupResolver } from '@hookform/resolvers/yup'
import { useNavigation } from '@react-navigation/native'
import React, { FunctionComponent, useCallback, useMemo, useState } from 'react'
import { Controller, SetValueConfig, useForm } from 'react-hook-form'
import { View } from 'react-native'
import { useTheme } from 'styled-components'
import styled from 'styled-components/native'
import { v4 as uuidv4 } from 'uuid'

import { UseNavigationType } from 'features/navigation/RootNavigator/types'
import { getTabNavConfig } from 'features/navigation/TabBar/helpers'
import { CalendarPicker } from 'features/search/components'
import { FilterSwitchWithLabel } from 'features/search/components/FilterSwitchWithLabel'
import { SearchCustomModalHeader } from 'features/search/components/SearchCustomModalHeader'
import { SearchFixedModalBottom } from 'features/search/components/SearchFixedModalBottom'
import { DATE_FILTER_OPTIONS } from 'features/search/enums'
import { datesHoursSchema } from 'features/search/pages/schema/datesHoursSchema'
import { useSearch } from 'features/search/pages/SearchWrapper'
import { useGetFullscreenModalSliderLength } from 'features/search/pages/useGetFullscreenModalSliderLength'
import { SectionTitle } from 'features/search/components/sections/titles'
import { SearchState, SearchView } from 'features/search/types'
import { useLogFilterOnce } from 'features/search/utils/useLogFilterOnce'
import { formatToCompleteFrenchDate } from 'libs/parsers'
import { Range } from 'libs/typesUtils/typeHelpers'
import { Form } from 'ui/components/Form'
import { Slider } from 'ui/components/inputs/Slider'
import { Li } from 'ui/components/Li'
import { AppModal } from 'ui/components/modals/AppModal'
import { RadioButton } from 'ui/components/radioButtons/RadioButton'
import { Separator } from 'ui/components/Separator'
import { VerticalUl } from 'ui/components/Ul'
import { Close } from 'ui/svg/icons/Close'
import { Spacer, Typo } from 'ui/theme'

export enum RadioButtonDate {
  TODAY = 'Aujourd’hui',
  WEEK = 'Cette semaine',
  WEEK_END = 'Ce week-end',
  PRECISE_DATE = 'Date précise',
}

type DatesHoursModalFormData = {
  hasSelectedDate: boolean
  selectedDateChoice: DATE_FILTER_OPTIONS
  selectedDate?: Date
  hasSelectedHours: boolean
  selectedHours?: Range<number>
}

type Props = {
  title: string
  accessibilityLabel: string
  isVisible: boolean
  hideModal: () => void
}

export const DATE_TYPES: Array<{
  label: RadioButtonDate
  type: DATE_FILTER_OPTIONS
}> = [
  { label: RadioButtonDate.TODAY, type: DATE_FILTER_OPTIONS.TODAY },
  { label: RadioButtonDate.WEEK, type: DATE_FILTER_OPTIONS.CURRENT_WEEK },
  { label: RadioButtonDate.WEEK_END, type: DATE_FILTER_OPTIONS.CURRENT_WEEK_END },
  { label: RadioButtonDate.PRECISE_DATE, type: DATE_FILTER_OPTIONS.USER_PICK },
]

const MAX_HOUR = 24

const DEFAULT_TIME_RANGE: Range<number> = [8, 22]

const formatHour = (hour: number) => `${hour}h`

const titleId = uuidv4()

export const DatesHoursModal: FunctionComponent<Props> = ({
  title,
  accessibilityLabel,
  isVisible,
  hideModal,
}) => {
  const { navigate } = useNavigation<UseNavigationType>()
  const { isDesktopViewport, modal } = useTheme()
  const { searchState } = useSearch()
  const logToggleDate = useLogFilterOnce(SectionTitle.Date, searchState.searchId)
  const logToggleHour = useLogFilterOnce(SectionTitle.Hour, searchState.searchId)
  const logSelectedDateChoice = useLogFilterOnce(SectionTitle.OfferDate, searchState.searchId)
  const logChangeSelectedHours = useLogFilterOnce(SectionTitle.TimeSlot, searchState.searchId)
  const [showCalendarPicker, setShowCalendarPicker] = useState<boolean>(false)
  const { sliderLength } = useGetFullscreenModalSliderLength()

  const TODAY = useMemo(() => new Date(), [])

  const defaultValues = useMemo(() => {
    return {
      hasSelectedDate: !!searchState.date,
      selectedDateChoice: searchState.date?.option ?? undefined,
      selectedDate: searchState.date?.selectedDate
        ? new Date(searchState.date?.selectedDate)
        : undefined,
      hasSelectedHours: !!searchState.timeRange,
      selectedHours: searchState.timeRange ?? undefined,
    }
  }, [searchState.date, searchState.timeRange])

  const {
    handleSubmit,
    reset,
    setValue,
    getValues,
    formState: { isSubmitting, isValid, isValidating },
    control,
    watch,
  } = useForm<DatesHoursModalFormData>({
    mode: 'onChange',
    resolver: yupResolver(datesHoursSchema),
    defaultValues,
  })
  const { hasSelectedDate, selectedDate, hasSelectedHours } = watch()

  const close = useCallback(() => {
    reset(defaultValues)
    hideModal()
  }, [defaultValues, hideModal, reset])

  const onResetPress = useCallback(() => {
    reset({
      hasSelectedDate: false,
      selectedDateChoice: undefined,
      selectedDate: undefined,
      hasSelectedHours: false,
      selectedHours: undefined,
    })
  }, [reset])

  const search = useCallback(
    ({
      hasSelectedDate,
      selectedDateChoice,
      selectedDate,
      hasSelectedHours,
      selectedHours,
    }: DatesHoursModalFormData) => {
      const additionalSearchState: SearchState = {
        ...searchState,
        date:
          hasSelectedDate && selectedDate
            ? { selectedDate: selectedDate.toISOString(), option: selectedDateChoice }
            : null,
        timeRange: hasSelectedHours && selectedHours ? selectedHours : null,
      }

      navigate(
        ...getTabNavConfig('Search', {
          ...additionalSearchState,
          beginningDatetime: null,
          endingDatetime: null,
          view: SearchView.Results,
        })
      )
      hideModal()
    },
    [hideModal, navigate, searchState]
  )

  const onSubmit = handleSubmit(search)

  /**
   * Helper to avoid using `setValue(x, y, { shouldValidate: true })`
   * since it's repetitive.
   */
  const setValueWithValidation = useCallback(
    <FieldName extends keyof DatesHoursModalFormData>(
      fieldName: FieldName,
      value: DatesHoursModalFormData[FieldName],
      options?: Omit<SetValueConfig, 'shouldValidate'>
    ) => {
      setValue(fieldName, value as never, { shouldValidate: true, ...options })
    },
    [setValue]
  )

  const toggleDate = useCallback(() => {
    const toggleDateValue = !getValues('hasSelectedDate')
    setValueWithValidation('hasSelectedDate', toggleDateValue)
    setValueWithValidation('selectedDateChoice', DATE_FILTER_OPTIONS.TODAY)
    setValueWithValidation('selectedDate', toggleDateValue ? TODAY : undefined)

    logToggleDate()
  }, [getValues, setValueWithValidation, logToggleDate, TODAY])

  const toggleHours = useCallback(() => {
    const toggleHoursValue = !getValues('hasSelectedHours')
    setValueWithValidation('hasSelectedHours', toggleHoursValue)
    setValueWithValidation('selectedHours', toggleHoursValue ? DEFAULT_TIME_RANGE : undefined)

    logToggleHour()
  }, [getValues, setValueWithValidation, logToggleHour])

  const selectDateFilterOption = useCallback(
    (payload: DATE_FILTER_OPTIONS) => () => {
      setValueWithValidation('selectedDateChoice', payload)
      logSelectedDateChoice()
      if (payload === DATE_FILTER_OPTIONS.USER_PICK) {
        setShowCalendarPicker(true)
      }
    },
    [logSelectedDateChoice, setValueWithValidation]
  )

  const setSelectedDate = useCallback(
    (payload: Date) => {
      setValueWithValidation('selectedDate', payload)
      setShowCalendarPicker(false)
    },
    [setValueWithValidation]
  )

  const onSelectedHoursValuesChange = useCallback(
    (newValues: number[]) => {
      if (isVisible) {
        setValue('selectedHours', newValues as Range<number>)
        logChangeSelectedHours()
      }
    },
    [isVisible, logChangeSelectedHours, setValue]
  )

  const disabled = !isValid || (!isValidating && isSubmitting)

  const subtitleToggle = 'Seules les sorties seront affichées'

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
      fixedModalBottom={
        <SearchFixedModalBottom
          onSearchPress={onSubmit}
          onResetPress={onResetPress}
          isSearchDisabled={disabled}
        />
      }>
      <FormWrapper>
        <Form.MaxWidth>
          <Controller
            control={control}
            name="hasSelectedDate"
            render={({ field: { value } }) => (
              <React.Fragment>
                <Spacer.Column numberOfSpaces={6} />
                <FilterSwitchWithLabel
                  label={SectionTitle.Date}
                  isActive={!!hasSelectedDate}
                  toggle={toggleDate}
                  subtitle={subtitleToggle}
                  testID="date"
                />
                {!!value && (
                  <Controller
                    control={control}
                    name="selectedDateChoice"
                    render={({ field: { value } }) => (
                      <StyledVerticalUl>
                        {DATE_TYPES.map((item) => (
                          <Li key={item.label}>
                            <Spacer.Column numberOfSpaces={4} />
                            <RadioButton
                              testID={item.type}
                              label={item.label}
                              isSelected={value === item.type}
                              onSelect={selectDateFilterOption(item.type)}
                              description={
                                value === DATE_FILTER_OPTIONS.USER_PICK &&
                                item.label === RadioButtonDate.PRECISE_DATE &&
                                selectedDate
                                  ? formatToCompleteFrenchDate(selectedDate)
                                  : undefined
                              }
                            />
                          </Li>
                        ))}
                      </StyledVerticalUl>
                    )}
                  />
                )}
                <Spacer.Column numberOfSpaces={6} />
                <Separator />
                <Spacer.Column numberOfSpaces={6} />
              </React.Fragment>
            )}
          />
          <Controller
            control={control}
            name="hasSelectedHours"
            render={({ field: { value } }) => (
              <React.Fragment>
                <FilterSwitchWithLabel
                  label={SectionTitle.Hour}
                  isActive={hasSelectedHours}
                  toggle={toggleHours}
                  subtitle={subtitleToggle}
                  testID="hour"
                />
                {!!value && (
                  <Controller
                    control={control}
                    name="selectedHours"
                    render={({ field: { value } }) => (
                      <View>
                        <Spacer.Column numberOfSpaces={4} />
                        <LabelHoursContainer>
                          <Typo.Body>{`Sortir entre`}</Typo.Body>
                          <Typo.ButtonText>{`${value?.[0]}\u00a0h et ${value?.[1]}\u00a0h`}</Typo.ButtonText>
                        </LabelHoursContainer>
                        <Spacer.Column numberOfSpaces={2} />
                        <Slider
                          showValues={false}
                          values={value}
                          max={MAX_HOUR}
                          formatValues={formatHour}
                          onValuesChangeFinish={onSelectedHoursValuesChange}
                          minLabel="Horaire minimum&nbsp;:"
                          maxLabel="Horaire maximum&nbsp;:"
                          shouldShowMinMaxValues
                          minMaxValuesComplement="h"
                          sliderLength={sliderLength}
                        />
                      </View>
                    )}
                  />
                )}
              </React.Fragment>
            )}
          />
          <CalendarPicker
            selectedDate={selectedDate ?? TODAY}
            setSelectedDate={setSelectedDate}
            visible={!!showCalendarPicker}
            hideCalendar={() => setShowCalendarPicker(false)}
          />
        </Form.MaxWidth>
      </FormWrapper>
    </AppModal>
  )
}

const FormWrapper = styled.View({
  alignItems: 'center',
})

const StyledVerticalUl = styled(VerticalUl)({
  overflow: 'hidden',
})

const LabelHoursContainer = styled.View({
  flexDirection: 'row',
  justifyContent: 'space-between',
})
