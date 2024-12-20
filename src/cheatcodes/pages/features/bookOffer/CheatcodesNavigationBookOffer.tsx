import { useNavigation } from '@react-navigation/native'
import React from 'react'

import { CheatcodesTemplateScreen } from 'cheatcodes/components/CheatcodesTemplateScreen'
import { LinkToComponent } from 'cheatcodes/components/LinkToComponent'
import { UseNavigationType } from 'features/navigation/RootNavigator/types'

export function CheatcodesNavigationBookOffer(): React.JSX.Element {
  const { navigate } = useNavigation<UseNavigationType>()

  return (
    <CheatcodesTemplateScreen title="Internal (Maketing) 🎯">
      <LinkToComponent
        title="Booking Confirmation"
        onPress={() => navigate('BookingConfirmation', { offerId: 11224, bookingId: 1240 })}
      />
    </CheatcodesTemplateScreen>
  )
}
