import React from 'react'

import { setFeatureFlags } from 'libs/firebase/firestore/featureFlags/tests/setFeatureFlags'
import { render, screen } from 'tests/utils'

import { LoadingPage } from './LoadingPage'

describe('<LoadingPage />', () => {
  beforeEach(() => {
    setFeatureFlags()
  })

  it('should render correctly', () => {
    render(<LoadingPage />)

    expect(screen).toMatchSnapshot()
  })
})
