import React from 'react'

import { useRoute } from '__mocks__/@react-navigation/native'
import { useHomepageData } from 'features/home/api/useHomepageData'
import { formattedVenuesModule } from 'features/home/fixtures/homepage.fixture'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { render, screen } from 'tests/utils'

import { Home } from './Home'

const mockShouldShowSkeleton = false
jest.mock('features/home/api/useShowSkeleton', () => ({
  useShowSkeleton: jest.fn(() => mockShouldShowSkeleton),
}))

jest.mock('features/home/api/useHomepageData')
const mockUseHomepageData = useHomepageData as jest.Mock

jest.mock('libs/geolocation')

describe('Home page', () => {
  useRoute.mockReturnValue({ params: undefined })

  mockUseHomepageData.mockReturnValue({
    modules: [formattedVenuesModule],
    homeEntryId: 'fakeEntryId',
  })

  it('should render correctly', async () => {
    useRoute.mockReturnValueOnce({ params: { entryId: 'fake-entry-id' } })
    mockUseHomepageData.mockReturnValueOnce({
      modules: [formattedVenuesModule],
      id: 'fakeEntryId',
    })
    renderHome()

    await screen.findByText('Bienvenue !')

    expect(screen).toMatchSnapshot()
  })

  // TODO(PC-20066): remove test for transitional home header split
  it('should render a thematic home header if available', async () => {
    useRoute.mockReturnValueOnce({ params: { entryId: 'fake-entry-id' } })
    mockUseHomepageData.mockReturnValueOnce({
      modules: [formattedVenuesModule],
      id: 'fakeEntryId',
      thematicHeader: {
        title: 'title',
      },
    })
    renderHome()

    expect(await screen.findByText('title')).toBeTruthy()
  })
})

function renderHome() {
  render(<Home />, {
    // eslint-disable-next-line local-rules/no-react-query-provider-hoc
    wrapper: ({ children }) => reactQueryProviderHOC(children),
  })
}
