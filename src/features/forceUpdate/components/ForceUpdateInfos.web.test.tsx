import React from 'react'

import { setFeatureFlags } from 'libs/firebase/firestore/featureFlags/tests/setFeatureFlags'
import { render, screen } from 'tests/utils/web'

import { ForceUpdateInfos } from './ForceUpdateInfos'

jest.mock('libs/firebase/analytics/analytics')

jest.mock('features/forceUpdate/queries/useMinimalBuildNumberQuery')

describe('<ForceUpdateInfos/>', () => {
  beforeEach(() => setFeatureFlags())

  it('should not display the web app button', () => {
    render(<ForceUpdateInfos />)

    const goToWebappButton = screen.queryByText('Utiliser la version web')

    expect(goToWebappButton).not.toBeInTheDocument()
  })
})
