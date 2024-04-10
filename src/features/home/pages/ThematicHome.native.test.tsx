import React from 'react'
import { Platform } from 'react-native'

import { useRoute } from '__mocks__/@react-navigation/native'
import { SubcategoriesResponseModelv2 } from 'api/gen'
import { useAuthContext } from 'features/auth/context/AuthContext'
import { useHomepageData } from 'features/home/api/useHomepageData'
import { formattedVenuesModule } from 'features/home/fixtures/homepage.fixture'
import { ThematicHome } from 'features/home/pages/ThematicHome'
import { ThematicHeaderType } from 'features/home/types'
import * as useMapSubscriptionHomeIdsToThematic from 'features/subscription/helpers/useMapSubscriptionHomeIdsToThematic'
import { SubscriptionTheme } from 'features/subscription/types'
import { beneficiaryUser } from 'fixtures/user'
import { analytics } from 'libs/analytics'
import { useLocation } from 'libs/location'
import { storage } from 'libs/storage'
import { placeholderData } from 'libs/subcategories/placeholderData'
import { mockServer } from 'tests/mswServer'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { act, fireEvent, render, screen } from 'tests/utils'
import { SNACK_BAR_TIME_OUT } from 'ui/components/snackBar/SnackBarContext'

jest.mock('features/home/api/useShowSkeleton', () => ({
  useShowSkeleton: jest.fn(() => false),
}))

jest.mock('features/home/api/useHomepageData')
const mockUseHomepageData = useHomepageData as jest.Mock

jest.mock('libs/location/LocationWrapper')
const mockUserLocation = useLocation as jest.Mock
mockUserLocation.mockReturnValue({
  userLocation: {
    latitude: 2,
    longitude: 2,
  },
})

const baseAuthContext = {
  isLoggedIn: true,
  setIsLoggedIn: jest.fn(),
  user: beneficiaryUser,
  refetchUser: jest.fn(),
  isUserLoading: false,
}
jest.mock('features/auth/context/AuthContext')
const mockUseAuthContext = useAuthContext as jest.MockedFunction<typeof useAuthContext>
mockUseAuthContext.mockReturnValue(baseAuthContext)

jest
  .spyOn(useMapSubscriptionHomeIdsToThematic, 'useMapSubscriptionHomeIdsToThematic')
  .mockReturnValue(SubscriptionTheme.CINEMA)

jest.mock('features/profile/pages/NotificationSettings/usePushPermission', () => ({
  usePushPermission: jest.fn(() => ({
    pushPermission: 'granted',
  })),
}))

const mockShowSuccessSnackBar = jest.fn()
jest.mock('ui/components/snackBar/SnackBarContext', () => ({
  useSnackBarContext: () => ({
    showSuccessSnackBar: mockShowSuccessSnackBar,
  }),
}))

const modules = [formattedVenuesModule]

const mockedHighlightHeaderData = {
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
}

describe('ThematicHome', () => {
  useRoute.mockReturnValue({ params: { entryId: 'fakeEntryId' } })

  mockUseHomepageData.mockReturnValue({
    modules,
    id: 'fakeEntryId',
    thematicHeader: { title: 'HeaderTitle', subtitle: 'HeaderSubtitle' },
  })

  beforeEach(() => {
    mockServer.getApi<SubcategoriesResponseModelv2>('/v1/subcategories/v2', placeholderData)
  })

  it('should render correctly', async () => {
    renderThematicHome()
    await act(async () => {})

    expect(screen).toMatchSnapshot()
  })

  describe('header', () => {
    it('should show highlight header when provided', async () => {
      mockUseHomepageData.mockReturnValueOnce(mockedHighlightHeaderData)

      renderThematicHome()
      await act(async () => {})

      expect(screen.getAllByText('Bloc temps fort')).not.toHaveLength(0)
      expect(screen.getByText('Un sous-titre')).toBeOnTheScreen()
    })

    it('should show highlight animated header when provided and platform is iOS', async () => {
      Platform.OS = 'ios'

      mockUseHomepageData.mockReturnValueOnce(mockedHighlightHeaderData)

      renderThematicHome()
      await act(async () => {})

      expect(await screen.findAllByText('Bloc temps fort')).not.toHaveLength(0)
      expect(screen.getByTestId('animated-thematic-header')).toBeOnTheScreen()
    })

    it('should show highlight thematic introduction when provided and platform is iOS', async () => {
      Platform.OS = 'ios'

      const mockedHighlightHeaderDataWithIntroduction = {
        ...mockedHighlightHeaderData,
        thematicHeader: {
          ...mockedHighlightHeaderData.thematicHeader,
          introductionTitle: 'IntroductionTitle',
          introductionParagraph: 'IntroductionParagraph',
        },
      }
      mockUseHomepageData.mockReturnValueOnce(mockedHighlightHeaderDataWithIntroduction)

      renderThematicHome()
      await act(async () => {})

      expect(screen.getByText('IntroductionTitle')).toBeOnTheScreen()
      expect(screen.getByText('IntroductionParagraph')).toBeOnTheScreen()
    })

    it('should not show highlight animated header when provided and platform is Android', async () => {
      Platform.OS = 'android'

      mockUseHomepageData.mockReturnValueOnce(mockedHighlightHeaderData)

      renderThematicHome()
      await act(async () => {})

      expect(await screen.findAllByText('Bloc temps fort')).not.toHaveLength(0)
      expect(screen.queryByTestId('animated-thematic-header')).not.toBeOnTheScreen()
    })

    it('should show category header when provided', async () => {
      mockUseHomepageData.mockReturnValueOnce({
        modules,
        id: 'fakeEntryId',
        thematicHeader: {
          type: ThematicHeaderType.Category,
          imageUrl:
            'https://images.ctfassets.net/2bg01iqy0isv/5PmtxKY77rq0nYpkCFCbrg/4daa8767efa35827f22bb86e5fc65094/photo-lion_noir-et-blanc_laurent-breillat-610x610.jpeg',
          subtitle: 'Un sous-titre',
          title: 'Catégorie cinéma',
        },
      })

      renderThematicHome()
      await act(async () => {})

      expect(await screen.findAllByText('Catégorie cinéma')).not.toHaveLength(0)
      expect(screen.getByText('Un sous-titre')).toBeOnTheScreen()
    })
  })

  describe('SubscribeButton', () => {
    it('should open logged out modal when user is not logged in', async () => {
      mockUseAuthContext.mockReturnValueOnce({
        ...baseAuthContext,
        isLoggedIn: false,
        user: undefined,
      })

      renderThematicHome()

      await act(async () => fireEvent.press(screen.getByText('Suivre')))

      expect(screen.getByText('Identifie-toi pour t’abonner à un thème')).toBeOnTheScreen()
    })

    it('should show inactive SubscribeButton when user is logged in and not subscribed yet', async () => {
      renderThematicHome()
      await act(async () => {})

      expect(screen.getByText('Suivre')).toBeOnTheScreen()
    })

    it('should show active SubscribeButton when user is logged in and already subscribed', async () => {
      mockUseAuthContext.mockReturnValueOnce({
        ...baseAuthContext,
        isLoggedIn: true,
        user: {
          ...beneficiaryUser,
          subscriptions: {
            marketingEmail: true,
            marketingPush: true,
            subscribedThemes: [SubscriptionTheme.CINEMA],
          },
        },
      })

      renderThematicHome()
      await act(async () => {})

      expect(screen.getByText('Déjà suivi')).toBeOnTheScreen()
    })

    it('should show notifications settings modal when user has no notifications activated and click on subscribe button', async () => {
      mockUseAuthContext.mockReturnValueOnce({
        ...baseAuthContext,
        isLoggedIn: true,
        user: {
          ...beneficiaryUser,
          subscriptions: {
            marketingEmail: false,
            marketingPush: false,
            subscribedThemes: [],
          },
        },
      })

      renderThematicHome()

      await act(async () => fireEvent.press(screen.getByText('Suivre')))

      expect(screen.getByText('Autoriser l’envoi d’e-mails')).toBeOnTheScreen()
    })

    it('should show unsubscribe modal when user is already subscribed and click on subscribe button', async () => {
      mockUseAuthContext.mockReturnValueOnce({
        ...baseAuthContext,
        isLoggedIn: true,
        user: {
          ...beneficiaryUser,
          subscriptions: {
            marketingEmail: true,
            marketingPush: true,
            subscribedThemes: [SubscriptionTheme.CINEMA],
          },
        },
      })

      renderThematicHome()

      await act(async () => fireEvent.press(screen.getByText('Déjà suivi')))

      expect(
        screen.getByText('Es-tu sûr de ne plus vouloir suivre ce thème\u00a0?')
      ).toBeOnTheScreen()
    })

    it('should show subscription success modal when user subscribe to a thematic for the second time', async () => {
      mockServer.postApi('/v1/profile', {})

      await storage.saveObject('times_user_subscribed_to_a_theme', 1)
      renderThematicHome()

      await act(async () => fireEvent.press(screen.getByText('Suivre')))

      expect(screen.getByText('Tu suis le thème "Cinéma"')).toBeOnTheScreen()
      expect(screen.getByText('Voir mes préférences')).toBeOnTheScreen()
    })

    it('should show snackbar when user subscribe to a thematic home for more than 3 times', async () => {
      mockServer.postApi('/v1/profile', {})

      await storage.saveObject('times_user_subscribed_to_a_theme', 3)
      renderThematicHome()

      await act(async () => fireEvent.press(screen.getByText('Suivre')))

      expect(mockShowSuccessSnackBar).toHaveBeenCalledWith({
        message: 'Tu suis le thème “Cinéma”\u00a0! Tu peux gérer tes alertes depuis ton profil.',
        timeout: SNACK_BAR_TIME_OUT,
      })
    })
  })

  describe('analytics', () => {
    it('should log ConsultHome', async () => {
      renderThematicHome()
      await act(async () => {})

      expect(analytics.logConsultHome).toHaveBeenNthCalledWith(1, { homeEntryId: 'fakeEntryId' })
    })

    it('should log ConsultHome when coming from category block', async () => {
      useRoute.mockReturnValueOnce({
        params: {
          entryId: 'fakeEntryId',
          from: 'category_block',
          moduleId: 'moduleId',
          moduleListId: 'moduleListId',
        },
      })
      renderThematicHome()
      await act(async () => {})

      expect(analytics.logConsultHome).toHaveBeenNthCalledWith(1, {
        homeEntryId: 'fakeEntryId',
        from: 'category_block',
        moduleId: 'moduleId',
        moduleListId: 'moduleListId',
      })
    })

    it('should log ConsultHome when coming from highlight thematic block', async () => {
      useRoute.mockReturnValueOnce({
        params: {
          entryId: 'fakeEntryId',
          from: 'highlight_thematic_block',
          moduleId: 'moduleId',
        },
      })
      renderThematicHome()
      await act(async () => {})

      expect(analytics.logConsultHome).toHaveBeenNthCalledWith(1, {
        homeEntryId: 'fakeEntryId',
        from: 'highlight_thematic_block',
        moduleId: 'moduleId',
      })
    })
  })

  describe('geolocation banner', () => {
    it('should show geolocation banner when user is not geolocated or located', async () => {
      mockUserLocation.mockReturnValueOnce({
        userLocation: undefined,
      })
      renderThematicHome()

      await act(async () => {})

      expect(screen.getByText('Géolocalise-toi')).toBeOnTheScreen()
    })

    it('should not show geolocation banner when user is geolocated or located', async () => {
      mockUserLocation.mockReturnValueOnce({
        userLocation: {
          latitude: 2,
          longitude: 2,
        },
      })
      renderThematicHome()

      await act(async () => {})

      expect(screen.queryByText('Géolocalise-toi')).not.toBeOnTheScreen()
    })
  })
})

const renderThematicHome = () => {
  render(<ThematicHome />, {
    wrapper: ({ children }) => reactQueryProviderHOC(children),
  })
}
