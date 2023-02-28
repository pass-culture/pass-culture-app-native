import React from 'react'

import { useRoute } from '__mocks__/@react-navigation/native'
import { useHomepageData } from 'features/home/api/useHomepageData'
import { formattedVenuesModule } from 'features/home/fixtures/homepage.fixture'
import { ThematicHome } from 'features/home/pages/ThematicHome'
import { ThematicHeaderType } from 'features/home/types'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { render } from 'tests/utils'

jest.mock('features/home/api/useShowSkeleton', () => ({
  useShowSkeleton: jest.fn(() => false),
}))

jest.mock('features/home/api/useHomepageData')
const mockUseHomepageData = useHomepageData as jest.Mock

const modules = [formattedVenuesModule]

describe('ThematicHome', () => {
  useRoute.mockReturnValue({ params: { entryId: 'fakeEntryId' } })

  mockUseHomepageData.mockReturnValue({
    modules,
    id: 'fakeEntryId',
    thematicHeader: { title: 'HeaderTitle', subtitle: 'HeaderSubtitle' },
  })

  it('should render correctly', () => {
    // eslint-disable-next-line local-rules/no-react-query-provider-hoc
    const thematicHome = render(reactQueryProviderHOC(<ThematicHome />))
    expect(thematicHome).toMatchSnapshot()
  })

  it('should render default header when provided', () => {
    // eslint-disable-next-line local-rules/no-react-query-provider-hoc
    const { getByText } = render(reactQueryProviderHOC(<ThematicHome />))
    expect(getByText('HeaderTitle')).toBeTruthy()
    expect(getByText('HeaderSubtitle')).toBeTruthy()
  })

  it('should show highlight header when provided', () => {
    mockUseHomepageData.mockReturnValueOnce({
      modules,
      id: 'fakeEntryId',
      thematicHeader: {
        type: ThematicHeaderType.Highlight,
        imageUrl:
          'https://images.ctfassets.net/2bg01iqy0isv/5PmtxKY77rq0nYpkCFCbrg/4daa8767efa35827f22bb86e5fc65094/photo-lion_noir-et-blanc_laurent-breillat-610x610.jpeg',
        subtitle: 'Un sous-titre',
        title: 'Bloc temps fort',
        beginningDate: new Date('2022-12-21T23:00:00.000Z'),
        endingDate: new Date('2023-01-14T23:00:00.000Z'),
      },
    })

    // eslint-disable-next-line local-rules/no-react-query-provider-hoc
    const { getByText } = render(reactQueryProviderHOC(<ThematicHome />))
    expect(getByText('Bloc temps fort')).toBeTruthy()
    expect(getByText('Un sous-titre')).toBeTruthy()
  })
})
