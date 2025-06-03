import React from 'react'

import { render, screen } from 'tests/utils/web'

import { ForceUpdateInfos } from './ForceUpdateInfos'

jest.mock('libs/firebase/analytics/analytics')

jest.mock('features/forceUpdate/helpers/useMinimalBuildNumber')

describe('<ForceUpdateInfos/>', () => {
  it('should not display the web app button', () => {
    render(<ForceUpdateInfos />)

    const goToWebappButton = screen.queryByText('Utiliser la version web')

    expect(goToWebappButton).not.toBeInTheDocument()
  })
})
