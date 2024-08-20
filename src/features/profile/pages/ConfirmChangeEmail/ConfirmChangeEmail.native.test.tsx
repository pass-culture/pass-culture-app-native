import React from 'react'

import { ConfirmChangeEmail } from 'features/profile/pages/ConfirmChangeEmail/ConfirmChangeEmail'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { render, screen } from 'tests/utils'

jest.mock('features/identityCheck/context/SubscriptionContextProvider')

jest.mock('features/search/context/SearchWrapper', () => ({
  useSearch: () => ({
    resetSearch: jest.fn(),
  }),
}))

jest.mock('libs/firebase/analytics/analytics')

describe('<ConfirmChangeEmail />', () => {
  it('should render correctly', async () => {
    render(reactQueryProviderHOC(<ConfirmChangeEmail />))

    await screen.findByText('Confirmer la demande')

    expect(screen).toMatchSnapshot()
  })
})
