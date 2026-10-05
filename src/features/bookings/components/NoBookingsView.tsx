import React, { FunctionComponent } from 'react'

import { useFeatureFlag } from 'libs/firebase/firestore/featureFlags/useFeatureFlag'
import { RemoteStoreFeatureFlags } from 'libs/firebase/firestore/types'
import { useNetInfoContext } from 'libs/network/NetInfoWrapper'
import { remoteIllustrationUrls } from 'shared/illustrations/remoteIllustrations'
import { NoResultsView } from 'ui/components/NoResultsView'
import { RemoteIllustration } from 'ui/components/RemoteIllustration'
import { NoBookings } from 'ui/svg/icons/NoBookings'
import { AccessibleIcon } from 'ui/svg/icons/types'
import { DOUBLE_LINE_BREAK } from 'ui/theme/constants'

const NoBookingsIcon: FunctionComponent<AccessibleIcon> = (props) => (
  <NoBookings testID="no-bookings-icon" {...props} />
)

export function NoBookingsView({ ...props }) {
  const netInfo = useNetInfoContext()
  const enableNewVisionUi = useFeatureFlag(RemoteStoreFeatureFlags.WIP_NEW_VISION_UI)

  const explanationsOffline =
    'Aucune réservations en cours.' +
    DOUBLE_LINE_BREAK +
    'Il est possible que certaines réservations ne s’affichent pas hors connexion. Connecte-toi à internet pour vérifier.'

  return netInfo.isConnected ? (
    <NoResultsView
      explanations="Tu n’as pas de réservation en cours. Explore le catalogue pour trouver ton bonheur&nbsp;!"
      icon={enableNewVisionUi ? undefined : NoBookingsIcon}
      remoteIllustration={
        enableNewVisionUi ? (
          <RemoteIllustration
            url={remoteIllustrationUrls.emptyWalletLarge}
            backgroundColor="information03"
            testID="remote-illustration"
          />
        ) : undefined
      }
      trackingExplorerOffersFrom="bookings"
      {...props}
    />
  ) : (
    <NoResultsView
      offline
      explanations={explanationsOffline}
      icon={enableNewVisionUi ? undefined : NoBookingsIcon}
      remoteIllustration={
        enableNewVisionUi ? (
          <RemoteIllustration
            url={remoteIllustrationUrls.emptyWalletSmall}
            backgroundColor="information03"
            testID="remote-illustration"
          />
        ) : undefined
      }
      trackingExplorerOffersFrom="bookings"
      {...props}
    />
  )
}
