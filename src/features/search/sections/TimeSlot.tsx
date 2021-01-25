import { t } from '@lingui/macro'
import React from 'react'

import { CenteredSection } from 'features/search/atoms'
import { _ } from 'libs/i18n'
import { Range } from 'libs/typesUtils/typeHelpers'
import { Slider } from 'ui/components/inputs/Slider'

import { DEFAULT_TIME_RANGE } from '../pages/reducer'
import { useSearch } from '../pages/SearchWrapper'

const MAX_HOUR = 24

const formatHour = (hour: number) => `${hour}h`

export const TimeSlot: React.FC = () => {
  const { searchState, dispatch } = useSearch()

  const values = searchState.timeRange ?? DEFAULT_TIME_RANGE

  const onValuesChange = (newValues: number[]) => {
    dispatch({ type: 'TIME_RANGE', payload: newValues as Range<number> })
  }

  return (
    <CenteredSection title={_(t`Créneau horaire`)}>
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
