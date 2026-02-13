import { formatToSlashedFrenchDate } from 'libs/dates'

type Props = { eligibilityEndDatetime?: string | null }

export const getEligibilityEndDatetime = ({ eligibilityEndDatetime }: Props) => {
  return eligibilityEndDatetime
    ? formatToSlashedFrenchDate(new Date(eligibilityEndDatetime).toISOString())
    : undefined
}
