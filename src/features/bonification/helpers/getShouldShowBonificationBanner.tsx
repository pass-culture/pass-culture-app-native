import { QFBonificationStatus } from 'api/gen/api'

export const getShouldShowBonificationBanner = ({
  enableBonification,
  hasClosedBonificationBanner,
  qfBonificationStatus,
}: {
  enableBonification: boolean
  hasClosedBonificationBanner: boolean
  qfBonificationStatus: QFBonificationStatus | null | undefined
}): boolean => {
  if (!qfBonificationStatus) return false

  const isEligibleToBonification = qfBonificationStatus !== QFBonificationStatus.not_eligible
  const hasUserReceivedBonification = qfBonificationStatus === QFBonificationStatus.granted

  return (
    !!enableBonification &&
    isEligibleToBonification &&
    !hasUserReceivedBonification &&
    !hasClosedBonificationBanner
  )
}
