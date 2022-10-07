import React from 'react'

import { useNetInfoContext } from 'libs/network/NetInfoWrapper'
import { NoResults } from 'ui/components/NoResults'
import { NoBookings } from 'ui/svg/icons/NoBookings'
import { DOUBLE_LINE_BREAK, LINE_BREAK } from 'ui/theme/constants'

export function NoBookingsView() {
  const netInfo = useNetInfoContext()

  const title = 'Retrouve tes réservations en un clin d’oeil'

  const explanationsOffline =
    'Aucune réservations en cours.' +
    DOUBLE_LINE_BREAK +
    'Il est possible que certaines réservations ne s’affichent pas hors connexion. Connecte-toi à internet pour vérifier.'

  const explanations =
    'Tu n’as pas encore trouvé ton bonheur\u00a0?' +
    LINE_BREAK +
    'Explore le catalogue pass Culture pour effectuer ta première réservation\u00a0!'

  return !netInfo.isConnected ? (
    <NoResults title={title} offline explanations={explanationsOffline} icon={NoBookings} />
  ) : (
    <NoResults title={title} explanations={explanations} icon={NoBookings} />
  )
}
