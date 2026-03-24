import React from 'react'

import { formatDateToLastUpdatedAtMessage } from 'features/profile/helpers/formatDateToLastUpdatedAtMessage'
import { getEligibilityEndDatetime } from 'features/profile/helpers/getEligibilityEndDatetime'
import { render, screen } from 'tests/utils'

import { EligibleMessage } from './EligibleMessage'

jest.mock('libs/firebase/analytics/analytics')
jest.mock('features/profile/helpers/formatDateToLastUpdatedAtMessage')
jest.mock('features/profile/helpers/getEligibilityEndDatetime')

const mockFormatDate = formatDateToLastUpdatedAtMessage as jest.Mock
const mockEligibilityDate = getEligibilityEndDatetime as jest.Mock

const defaultFeatureFlags = {
  enablePassForAll: true,
  enableProfileV2: true,
  disableActivation: false,
}

describe('EligibleMessage', () => {
  it('should render nothing when disableActivation is true', () => {
    render(<EligibleMessage featureFlags={{ ...defaultFeatureFlags, disableActivation: true }} />)

    expect(screen.queryByText(/Dossier mis à jour le/)).not.toBeOnTheScreen()
  })

  it('should display updated message when updatedAt is provided', () => {
    mockFormatDate.mockReturnValueOnce('01/01/2026')

    render(<EligibleMessage updatedAt="2026-01-01" featureFlags={defaultFeatureFlags} />)

    expect(screen.getByText(/Dossier mis à jour le/)).toBeOnTheScreen()
    expect(screen.getByText('01/01/2026')).toBeOnTheScreen()
  })

  it('should display eligibility message when eligibilityEndDatetime is provided', () => {
    mockEligibilityDate.mockReturnValueOnce('31/12/2026')

    render(
      <EligibleMessage eligibilityEndDatetime="2026-12-31" featureFlags={defaultFeatureFlags} />
    )

    expect(screen.getByText(/Tu es éligible jusqu’au/)).toBeOnTheScreen()
    expect(screen.getByText('31/12/2026')).toBeOnTheScreen()
  })

  it('should render nothing when no dates are provided', () => {
    render(<EligibleMessage featureFlags={defaultFeatureFlags} />)

    expect(screen.queryByText(/Dossier mis à jour le/)).not.toBeOnTheScreen()
  })
})
