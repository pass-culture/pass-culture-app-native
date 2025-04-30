import { format } from 'date-fns'
import { fr } from 'date-fns/locale'
import React, { useMemo } from 'react'

import { FilterRow } from 'features/search/components/FilterRow/FilterRow'
import { useSearch } from 'features/search/context/SearchWrapper'
import { FilterBehaviour } from 'features/search/enums'
import { CalendarModal } from 'features/search/pages/modals/CalendarModal/CalendarModal'
import { useModal } from 'ui/components/modals/useModal'
import { CalendarS } from 'ui/svg/icons/CalendarS'

type Props = {
  onClose?: VoidFunction
}

export const CalendarFilter = ({ onClose }: Props) => {
  const { searchState } = useSearch()
  const { beginningDatetime, endingDatetime } = searchState
  const { visible, showModal, hideModal } = useModal(false)

  const calendarString = useMemo(() => {
    if (!beginningDatetime) return undefined

    const formattedBeginningDate = format(new Date(beginningDatetime), 'EEEE d MMMM', {
      locale: fr,
    })

    if (!endingDatetime) {
      return `le ${formattedBeginningDate}`
    }

    const formattedEndingDate = format(new Date(endingDatetime), 'EEEE d MMMM', {
      locale: fr,
    })

    return `du ${formattedBeginningDate} au ${formattedEndingDate}`
  }, [beginningDatetime, endingDatetime])

  return (
    <React.Fragment>
      <FilterRow icon={CalendarS} title="Dates" description={calendarString} onPress={showModal} />

      <CalendarModal
        title="Dates"
        accessibilityLabel="Ne pas filtrer sur les dates puis retourner aux résultats"
        isVisible={visible}
        hideModal={hideModal}
        filterBehaviour={FilterBehaviour.APPLY_WITHOUT_SEARCHING}
        onClose={onClose}
      />
    </React.Fragment>
  )
}
