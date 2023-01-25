import React, { FunctionComponent, useMemo } from 'react'

import { FilterRow } from 'features/search/components/FilterRow/FilterRow'
import { useSearch } from 'features/search/context/SearchWrapper'
import { DATE_FILTER_OPTIONS, FilterBehaviour } from 'features/search/enums'
import { DatesHoursModal } from 'features/search/pages/modals/DatesHoursModal/DatesHoursModal'
import { SearchState } from 'features/search/types'
import { formatToCompleteFrenchDate } from 'libs/parsers'
import { useModal } from 'ui/components/modals/useModal'
import { Calendar } from 'ui/svg/icons/Calendar'

const buildDateString = (date: SearchState['date']) => {
  if (!date) return null

  switch (date.option) {
    case DATE_FILTER_OPTIONS.CURRENT_WEEK:
      return 'cette semaine'
    case DATE_FILTER_OPTIONS.CURRENT_WEEK_END:
      return 'ce week-end'
    default:
      return `le ${formatToCompleteFrenchDate(new Date(date.selectedDate))}`
  }
}

type Props = {
  onClose?: VoidFunction
}

export const DateHour: FunctionComponent<Props> = ({ onClose }) => {
  const { searchState } = useSearch()
  const { date, timeRange } = searchState
  const { visible, showModal, hideModal } = useModal(false)

  const dateHourString = useMemo(() => {
    const dateStr = buildDateString(date)
    const hoursStr = timeRange && `entre ${timeRange[0]}h et ${timeRange[1]}h`
    return [dateStr, hoursStr].filter(Boolean).join(' ')
  }, [date, timeRange])

  return (
    <React.Fragment>
      <FilterRow
        icon={Calendar}
        title="Dates & heures"
        description={dateHourString}
        onPress={showModal}
      />
      <DatesHoursModal
        title="Dates & heures"
        accessibilityLabel="Ne pas filtrer sur les dates et heures puis retourner aux résultats"
        isVisible={visible}
        hideModal={hideModal}
        filterBehaviour={FilterBehaviour.APPLY_WITHOUT_SEARCHING}
        onClose={onClose}
      />
    </React.Fragment>
  )
}
