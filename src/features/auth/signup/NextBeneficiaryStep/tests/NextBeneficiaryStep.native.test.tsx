import React from 'react'

import { NextBeneficiaryStep } from 'features/auth/signup/NextBeneficiaryStep'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { render, superFlushWithAct } from 'tests/utils'

describe('<NextBeneficiaryStep />', () => {
  it('should show a loading page on init', async () => {
    // eslint-disable-next-line local-rules/no-react-query-provider-hoc
    const renderAPI = render(reactQueryProviderHOC(<NextBeneficiaryStep />))
    await superFlushWithAct()
    expect(renderAPI.getByTestId('Loading-Animation')).toBeTruthy()
  })
})
