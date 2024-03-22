import { yupResolver } from '@hookform/resolvers/yup'
import React, { FunctionComponent, useCallback, useEffect, useMemo, useState } from 'react'
import { Controller, SetValueConfig, useForm } from 'react-hook-form'
import { useTheme } from 'styled-components'
import styled from 'styled-components/native'
import { v4 as uuidv4 } from 'uuid'

import { CalendarPicker } from 'features/search/components/CalendarPicker/CalendarPicker'
import { FilterSwitchWithLabel } from 'features/search/components/FilterSwitchWithLabel/FilterSwitchWithLabel'
import { HoursSlider } from 'features/search/components/HoursSlider/HoursSlider'
import { SearchCustomModalHeader } from 'features/search/components/SearchCustomModalHeader'
import { SearchFixedModalBottom } from 'features/search/components/SearchFixedModalBottom'
import { useSearch } from 'features/search/context/SearchWrapper'
import { DATE_FILTER_OPTIONS, FilterBehaviour } from 'features/search/enums'
import {
  datesHoursSchema,
  Hour,
  hoursSchema,
} from 'features/search/helpers/schema/datesHoursSchema/datesHoursSchema'
import { SearchState, SearchView } from 'features/search/types'
import { formatToCompleteFrenchDate } from 'libs/parsers/formatDates'
import { Form } from 'ui/components/Form'
import { Li } from 'ui/components/Li'
import { AppModal } from 'ui/components/modals/AppModal'
import { RadioButton } from 'ui/components/radioButtons/RadioButton'
import { Separator } from 'ui/components/Separator'
import { VerticalUl } from 'ui/components/Ul'
import { Close } from 'ui/svg/icons/Close'
import { Spacer } from 'ui/theme'

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
  selectedHours: [Hour, Hour]
}

export type DatesHoursModalProps = {
  title: string
  accessibilityLabel: string
  isVisible: boolean
  hideModal: () => void
  filterBehaviour: FilterBehaviour
  onClose?: VoidFunction
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

const DEFAULT_TIME_SELECTED_VALUE: [Hour, Hour] = [8, 22]
export const DEFAULT_TIME_VALUE: [Hour, Hour] = [0, 24]

const titleId = uuidv4()

export const DatesHoursModal: FunctionComponent<DatesHoursModalProps> = ({
  title,
  accessibilityLabel,
  isVisible,
  hideModal,
  filterBehaviour,
  onClose,
}) => {
  const { modal } = useTheme()
  const { searchState, dispatch } = useSearch()
  const [showCalendarPicker, setShowCalendarPicker] = useState<boolean>(false)

  const TODAY = useMemo(() => new Date(), [])

  const defaultValues = useMemo(() => {
    return {
      hasSelectedDate: !!searchState.date,
      selectedDateChoice: searchState.date?.option ?? undefined,
      selectedDate: searchState.date?.selectedDate
        ? new Date(searchState.date?.selectedDate)
        : undefined,
      hasSelectedHours: !!searchState.timeRange,
      selectedHours: hoursSchema.isValidSync(searchState.timeRange)
        ? searchState.timeRange
        : DEFAULT_TIME_VALUE,
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

  useEffect(() => {
    reset(defaultValues)
  }, [defaultValues, reset])

  const closeModal = useCallback(() => {
    reset(defaultValues)
    hideModal()
  }, [defaultValues, hideModal, reset])

  const close = useCallback(() => {
    closeModal()
    if (onClose) {
      onClose()
    }
  }, [closeModal, onClose])

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
        beginningDatetime: undefined,
        endingDatetime: undefined,
        view: SearchView.Results,
      }

      dispatch({ type: 'SET_STATE', payload: additionalSearchState })
      hideModal()
    },
    [hideModal, searchState, dispatch]
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
  }, [getValues, setValueWithValidation, TODAY])

  const toggleHours = useCallback(() => {
    const toggleHoursValue = !getValues('hasSelectedHours')
    setValueWithValidation('hasSelectedHours', toggleHoursValue)
    setValueWithValidation(
      'selectedHours',
      toggleHoursValue ? DEFAULT_TIME_SELECTED_VALUE : DEFAULT_TIME_VALUE
    )
  }, [getValues, setValueWithValidation])

  const selectDateFilterOption = useCallback(
    (payload: DATE_FILTER_OPTIONS) => () => {
      setValueWithValidation('selectedDateChoice', payload)
      if (payload === DATE_FILTER_OPTIONS.USER_PICK) {
        setShowCalendarPicker(true)
      }
    },
    [setValueWithValidation]
  )

  const setSelectedDate = useCallback(
    (payload: Date) => {
      setValueWithValidation('selectedDate', payload)
      setShowCalendarPicker(false)
    },
    [setValueWithValidation]
  )

  const disabled = !isValid || (!isValidating && isSubmitting)

  const subtitleToggle = 'Seules les sorties seront affichées'
  const shouldDisplayBackButton = filterBehaviour === FilterBehaviour.APPLY_WITHOUT_SEARCHING

  return (
    <AppModal
      visible={isVisible}
      customModalHeader={
        <SearchCustomModalHeader
          titleId={titleId}
          title={title}
          onGoBack={closeModal}
          onClose={close}
          shouldDisplayBackButton={shouldDisplayBackButton}
          shouldDisplayCloseButton
        />
      }
      title={title}
      isUpToStatusBar
      noPadding
      modalSpacing={modal.spacing.MD}
      rightIconAccessibilityLabel={accessibilityLabel}
      rightIcon={Close}
      onRightIconPress={closeModal}
      fixedModalBottom={
        <SearchFixedModalBottom
          onSearchPress={onSubmit}
          onResetPress={onResetPress}
          isSearchDisabled={disabled}
          filterBehaviour={filterBehaviour}
        />
      }>
      <Spacer.Column numberOfSpaces={6} />
      <FormWrapper>
        <Form.MaxWidth>
          <Controller
            control={control}
            name="hasSelectedDate"
            render={({ field: { value } }) => (
              <React.Fragment>
                <FilterSwitchWithLabel
                  label="Date"
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
                <Separator.Horizontal />
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
                  label="Heure"
                  isActive={hasSelectedHours}
                  toggle={toggleHours}
                  subtitle={subtitleToggle}
                  testID="hour"
                />
                {!!value && (
                  <Controller control={control} name="selectedHours" render={HoursSlider} />
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
