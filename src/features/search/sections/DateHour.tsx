import React, { useMemo } from 'react'

import { FilterRow } from 'features/search/atoms/FilterRow'
import { DatesHoursModal } from 'features/search/pages/DatesHoursModal'
import { useSearch } from 'features/search/pages/SearchWrapper'
import { formatToCompleteFrenchDate } from 'libs/parsers'
import { useModal } from 'ui/components/modals/useModal'
import { All } from 'ui/svg/icons/bicolor/All'

export const DateHour = () => {
  const { searchState } = useSearch()
  const { date, timeRange } = searchState
  const { visible, showModal, hideModal } = useModal(false)

  const dateHourString = useMemo(() => {
    const dateStr = date && `le ${formatToCompleteFrenchDate(new Date(date.selectedDate))}`
    const hoursStr = timeRange && `entre ${timeRange[0]}h et ${timeRange[1]}h`
    return [dateStr, hoursStr].filter(Boolean).join(' ')
  }, [date, timeRange])

  return (
    <React.Fragment>
      <FilterRow
        icon={All}
        title="Dates & heures"
        description={dateHourString}
        onPress={showModal}
      />
      <DatesHoursModal
        title="Dates & heures"
        accessibilityLabel="Ne pas filtrer sur les dates et heures puis retourner aux résultats"
        isVisible={visible}
        hideModal={hideModal}
      />
    </React.Fragment>
  )
}
