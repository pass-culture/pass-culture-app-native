import mockdate from 'mockdate'
import React from 'react'

import { YoungerBadge } from 'features/profile/components/Badges/YoungerBadge'
import { render } from 'tests/utils'

jest.mock('features/auth/api')

mockdate.set(new Date('2021-12-15T00:00:00.000Z'))
const eligibilityStartDatetime = new Date('2021-12-17T00:00:00.000Z')

describe('YoungerBadge', () => {
  it('should display correct message with eligibility date', () => {
    const { queryByText } = render(
      <YoungerBadge eligibilityStartDatetime={eligibilityStartDatetime} />
    )
    queryByText(
      'Patience\u00a0! Reviens à partir du 17/12/2021 pour continuer ton inscription et bénéficier du crédit pass Culture.'
    )
  })
})
