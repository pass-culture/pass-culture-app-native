import { EduConnectError } from 'features/identityCheck/pages/identification/errors/eduConnect/types'

// This component can be used to catch error when writing an ErrorBoundary wrapped component
export function ErrorTrigger({ error }: { error: EduConnectError | Error | null }) {
  if (error) {
    throw error
  }
  return null
}
