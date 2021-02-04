import React from 'react'

import { CenteredSection } from 'features/search/atoms'
import { DEFAULT_TIME_RANGE } from 'features/search/pages/reducer.helpers'
import { useSearch } from 'features/search/pages/SearchWrapper'
import { SectionTitle } from 'features/search/sections/titles'
import { useLogFilterOnce } from 'features/search/utils/useLogFilterOnce'
import { Range } from 'libs/typesUtils/typeHelpers'
import { Slider } from 'ui/components/inputs/Slider'

const MAX_HOUR = 24

const formatHour = (hour: number) => `${hour}h`

export const TimeSlot: React.FC = () => {
  const logUseFilter = useLogFilterOnce(SectionTitle.TimeSlot)
  const { searchState, dispatch } = useSearch()
  const values = searchState.timeRange ?? DEFAULT_TIME_RANGE

  const onValuesChange = (newValues: number[]) => {
    dispatch({ type: 'TIME_RANGE', payload: newValues as Range<number> })
    logUseFilter()
  }

  return (
    <CenteredSection title={SectionTitle.TimeSlot}>
      <Slider
        showValues={true}
        values={values}
        max={MAX_HOUR}
        formatValues={formatHour}
        onValuesChange={onValuesChange}
      />
    </CenteredSection>
  )
}
