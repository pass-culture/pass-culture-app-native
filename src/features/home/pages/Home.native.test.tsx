import React from 'react'

import { useRoute } from '__mocks__/@react-navigation/native'
import { useHomepageData } from 'features/home/api'
import { GeolocPermissionState } from 'libs/geolocation'
import { render } from 'tests/utils'

import { Home } from './Home'

const mockShouldShowSkeleton = false
jest.mock('features/home/api/useShowSkeleton', () => ({
  useShowSkeleton: jest.fn(() => mockShouldShowSkeleton),
}))

jest.mock('features/profile/api', () => ({
  useUserProfileInfo: jest.fn(() => ({
    data: {
      email: 'email@domain.ext',
      firstName: 'Jean',
      isBeneficiary: true,
      depositExpirationDate: '2023-02-16T17:16:04.735235',
      domainsCredit: {
        all: { initial: 50000, remaining: 49600 },
        physical: { initial: 20000, remaining: 0 },
        digital: { initial: 20000, remaining: 19600 },
      },
    },
  })),
}))

jest.mock('features/home/api')
const mockUseHomepageData = useHomepageData as jest.Mock

jest.mock('features/auth/AuthContext', () => ({
  useAuthContext: jest.fn(() => ({ isLoggedIn: true })),
}))

const mockPermissionState = GeolocPermissionState.DENIED
jest.mock('libs/geolocation/GeolocationWrapper', () => ({
  useGeolocation: () => ({
    permissionState: mockPermissionState,
  }),
}))

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

describe('Home page', () => {
  useRoute.mockReturnValue({ params: undefined })

  mockUseHomepageData.mockReturnValue({
    modules,
    homeEntryId: 'fakeEntryId',
  })

  it('should render correctly', () => {
    const home = render(<Home />)
    expect(home).toMatchSnapshot()
  })
})
