import React from 'react'

import { NextBeneficiaryStep } from 'features/auth/signup/NextBeneficiaryStep'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { render, superFlushWithAct } from 'tests/utils'

describe('<NextBeneficiaryStep />', () => {
  it('should show a loading page on init', async () => {
    const renderAPI = render(reactQueryProviderHOC(<NextBeneficiaryStep />))
    await superFlushWithAct()
    expect(renderAPI.getByTestId('Loading-Animation')).toBeTruthy()
  })
})
