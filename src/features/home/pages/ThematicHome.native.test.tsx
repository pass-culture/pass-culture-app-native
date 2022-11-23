import React from 'react'

import { useRoute } from '__mocks__/@react-navigation/native'
import { useHomepageData } from 'features/home/api'
import { ThematicHome } from 'features/home/pages/ThematicHome'
import { render } from 'tests/utils'

jest.mock('features/home/api/useShowSkeleton', () => ({
  useShowSkeleton: jest.fn(() => false),
}))

jest.mock('features/home/api')
const mockUseHomepageData = useHomepageData as jest.Mock

const modules = [
  {
    search: [
      {
        categories: ['Livres'],
        hitsPerPage: 10,
        isDigital: false,
        isGeolocated: false,
        title: 'Playlist de livres',
      },
    ],
    display: {
      layout: 'two-items',
      minOffers: 1,
      subtitle: 'Un sous-titre',
      title: 'Playlist de livres',
    },
    moduleId: '1M8CiTNyeTxKsY3Gk9wePI',
  },
]

describe('ThematicHome', () => {
  useRoute.mockReturnValue({ params: { entryId: 'fakeEntryId' } })

  mockUseHomepageData.mockReturnValue({
    modules,
    homeEntryId: 'fakeEntryId',
    thematicHeader: { title: 'HeaderTitle', subtitle: 'HeaderSubtitle' },
  })

  it('should render correctly', () => {
    const thematicHome = render(<ThematicHome />)
    expect(thematicHome).toMatchSnapshot()
  })
})
