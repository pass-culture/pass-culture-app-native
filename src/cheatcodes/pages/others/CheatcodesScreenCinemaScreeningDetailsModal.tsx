import { useNavigation } from '@react-navigation/native'
import React from 'react'

import { ScreeningFeatures } from 'api/gen'
import { CinemaScreeningDetailsModal } from 'features/bookings/components/CinemaScreeningDetailsModal/CinemaScreeningDetailsModal'
import { selectCinemaScreeningDetails } from 'features/bookings/queries/selectors/selectCinemaScreeningDetails'
import { UseNavigationType } from 'features/navigation/navigators/RootNavigator/types'

const screeningFeatures: ScreeningFeatures = {
  language: 'VF',
  video: 'IMAX',
  audio: 'DOLBY_ATMOS',
  accessibility: {
    visual: ['GRETA'],
    audio: ['CCAP'],
    mental: [],
    motor: ['PMR'],
  },
  specialEventType: 'PREVIEW_SCREENING_WITH_CREW',
}

export const CheatcodesScreenCinemaScreeningDetailsModal = () => {
  const { goBack } = useNavigation<UseNavigationType>()
  const details = selectCinemaScreeningDetails(screeningFeatures)

  return <CinemaScreeningDetailsModal details={details} onClose={goBack} />
}
