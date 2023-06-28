import React, { FunctionComponent } from 'react'

import { CardSelector } from 'features/moodSurvey/components/CardSelector'
import { MoodboardOption as MoodboardOptionType } from 'features/moodSurvey/types'

type Props = {
  type: MoodboardOptionType
  onPress: () => void
}

export const MoodboardOption: FunctionComponent<Props> = ({ type, onPress }) => {
  return <CardSelector title={type} onPress={onPress} />
}
