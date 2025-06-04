import { yupResolver } from '@hookform/resolvers/yup'
import { addYears, format } from 'date-fns'
import React, { FunctionComponent, useCallback, useMemo } from 'react'
import { SetValueConfig, useForm } from 'react-hook-form'
import { CalendarList, DateData, LocaleConfig } from 'react-native-calendars'
import { useTheme } from 'styled-components/native'
import { v4 as uuidv4 } from 'uuid'

import { SearchCustomModalHeader } from 'features/search/components/SearchCustomModalHeader'
import { SearchFixedModalBottom } from 'features/search/components/SearchFixedModalBottom'
import { useSearch } from 'features/search/context/SearchWrapper'
import { FilterBehaviour } from 'features/search/enums'
import { getMarkedDates } from 'features/search/helpers/getMarkedDates/getMarkedDates'
import { getPastScrollRange } from 'features/search/helpers/getPastScrollRange/getPastScrollRange'
import { calendarSchema } from 'features/search/helpers/schema/calendarSchema/calendarSchema'
import { SearchState } from 'features/search/types'
import { DAYS, dayNamesShort } from 'shared/date/days'
import { CAPITALIZED_MONTHS, CAPITALIZED_SHORT_MONTHS } from 'shared/date/months'
import { AppModal } from 'ui/components/modals/AppModal'
import { Close } from 'ui/svg/icons/Close'

type CalendarModalFormData = {
  selectedStartDate?: Date
  selectedEndDate?: Date
}

export type CalendarModalProps = {
  title: string
  accessibilityLabel: string
  isVisible: boolean
  hideModal: () => void
  filterBehaviour: FilterBehaviour
  onClose?: VoidFunction
}

LocaleConfig.locales['fr'] = {
  monthNames: [...CAPITALIZED_MONTHS],
  monthNamesShort: [...CAPITALIZED_SHORT_MONTHS],
  dayNames: [...DAYS],
  dayNamesShort,
}
LocaleConfig.defaultLocale = 'fr'

const titleId = uuidv4()
const today = new Date()
const twoYearsLater = addYears(today, 2)

export const CalendarModal: FunctionComponent<CalendarModalProps> = ({
  title,
  accessibilityLabel,
  isVisible,
  hideModal,
  filterBehaviour,
  onClose,
}) => {
  const { modal, designSystem } = useTheme()
  const { searchState, dispatch } = useSearch()

  const defaultValues = useMemo(() => {
    return {
      selectedStartDate: searchState.beginningDatetime
        ? new Date(searchState.beginningDatetime)
        : undefined,
      selectedEndDate: searchState.endingDatetime
        ? new Date(searchState.endingDatetime)
        : undefined,
    }
  }, [searchState.beginningDatetime, searchState.endingDatetime])

  const {
    handleSubmit,
    reset,
    setValue,
    formState: { isSubmitting, isValid },
    watch,
  } = useForm<CalendarModalFormData>({
    mode: 'onChange',
    resolver: yupResolver(calendarSchema),
    defaultValues,
  })
  const { selectedStartDate, selectedEndDate } = watch()

  const markedDates = useMemo(
    () =>
      getMarkedDates(selectedStartDate, selectedEndDate, {
        backgroundColor: designSystem.color.background.brandPrimary,
        textColor: designSystem.color.text.lockedInverted,
      }),
    [
      designSystem.color.background.brandPrimary,
      designSystem.color.text.lockedInverted,
      selectedEndDate,
      selectedStartDate,
    ]
  )

  const closeModal = useCallback(() => {
    reset(defaultValues)
    hideModal()
  }, [defaultValues, hideModal, reset])

  const handleClose = useCallback(() => {
    closeModal()
    onClose?.()
  }, [closeModal, onClose])

  const onResetPress = useCallback(() => {
    reset(
      {
        selectedStartDate: undefined,
        selectedEndDate: undefined,
      },
      { keepDefaultValues: true }
    )

    dispatch({
      type: 'SET_STATE',
      payload: {
        ...searchState,
        beginningDatetime: undefined,
        endingDatetime: undefined,
      },
    })
  }, [dispatch, reset, searchState])

  const search = useCallback(
    ({ selectedStartDate, selectedEndDate }: CalendarModalFormData) => {
      const additionalSearchState: SearchState = {
        ...searchState,
        beginningDatetime: selectedStartDate ? selectedStartDate.toISOString() : undefined,
        endingDatetime: selectedEndDate ? selectedEndDate.toISOString() : undefined,
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
    <FieldName extends keyof CalendarModalFormData>(
      fieldName: FieldName,
      value: CalendarModalFormData[FieldName],
      options?: Omit<SetValueConfig, 'shouldValidate'>
    ) => {
      setValue(fieldName, value as never, { shouldValidate: true, ...options })
    },
    [setValue]
  )

  const onDayPress = (date: DateData) => {
    const selectedDate = new Date(date.dateString)

    if (!selectedStartDate || selectedEndDate || selectedDate < selectedStartDate) {
      setValueWithValidation('selectedStartDate', selectedDate)
      setValueWithValidation('selectedEndDate', undefined)
    } else {
      setValueWithValidation('selectedEndDate', selectedDate)
    }
  }

  const disabled = !isValid || isSubmitting
  const shouldDisplayBackButton = filterBehaviour === FilterBehaviour.APPLY_WITHOUT_SEARCHING
  const hasDefaultValues = !selectedStartDate && !selectedEndDate

  return (
    <AppModal
      visible={isVisible}
      customModalHeader={
        <SearchCustomModalHeader
          titleId={titleId}
          title={title}
          onGoBack={closeModal}
          onClose={handleClose}
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
          isResetDisabled={hasDefaultValues}
        />
      }
      scrollEnabled={false}>
      <CalendarList
        current={
          searchState.beginningDatetime
            ? format(new Date(searchState.beginningDatetime), 'yyyy-MM-dd')
            : format(today, 'yyyy-MM-dd')
        }
        minDate={format(today, 'yyyy-MM-dd')}
        maxDate={format(twoYearsLater, 'yyyy-MM-dd')}
        futureScrollRange={12} // 1 year to have scrolling
        pastScrollRange={
          searchState.beginningDatetime
            ? getPastScrollRange(new Date(searchState.beginningDatetime), today)
            : 0
        }
        markingType="period" // to have visible period
        onDayPress={onDayPress}
        markedDates={markedDates}
        testID="calendar"
        firstDay={1}
      />
    </AppModal>
  )
}
