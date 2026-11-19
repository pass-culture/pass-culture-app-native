import { SubscriptionStepperResponseV3 } from 'api/gen'
import { UserProfile } from 'features/share/types'
import { eventMonitoring } from 'libs/monitoring/services'

type Props = {
  source: 'SelectIDStatus' | 'Stepper' | string
  error?: unknown
  user?: UserProfile | null
  subscription?: SubscriptionStepperResponseV3 | null
  params?: Record<string, unknown>
}

export const logIdentityCheckUnavailable = ({
  source,
  error,
  user,
  subscription,
  params,
}: Props) => {
  eventMonitoring.captureException(`IdentityCheckUnavailable - redirected from ${source}`, {
    level: 'info',
    extra: { source, params, error, user, subscription },
  })
}
