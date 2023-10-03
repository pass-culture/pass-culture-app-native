import React from 'react'
import { Platform } from 'react-native'

import { useRoute } from '__mocks__/@react-navigation/native'
import { useHomepageData } from 'features/home/api/useHomepageData'
import { formattedVenuesModule } from 'features/home/fixtures/homepage.fixture'
import { useHomePosition } from 'features/home/helpers/useHomePosition'
import { ThematicHome } from 'features/home/pages/ThematicHome'
import { ThematicHeaderType } from 'features/home/types'
import { analytics } from 'libs/analytics'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { act, render, screen } from 'tests/utils'

jest.mock('features/home/api/useShowSkeleton', () => ({
  useShowSkeleton: jest.fn(() => false),
}))

jest.mock('features/home/api/useHomepageData')
const mockUseHomepageData = useHomepageData as jest.Mock

jest.mock('features/home/helpers/useHomePosition')
const mockUseHomeposition = useHomePosition as jest.Mock
mockUseHomeposition.mockReturnValue({
  position: {
    latitude: 2,
    longitude: 2,
  },
})

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

  it('should render correctly', async () => {
    renderThematicHome()
    await act(async () => {})

    expect(screen).toMatchSnapshot()
  })

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

  it('should show geolocation banner when user is not geolocated or located', async () => {
    mockUseHomeposition.mockReturnValueOnce({
      position: undefined,
    })
    renderThematicHome()

    await act(async () => {})
    expect(screen.getByText('Géolocalise-toi')).toBeOnTheScreen()
  })

  it('should not show geolocation banner when user is geolocated or located', async () => {
    renderThematicHome()

    await act(async () => {})
    expect(screen.queryByText('Géolocalise-toi')).not.toBeOnTheScreen()
  })
})

const renderThematicHome = () => {
  render(<ThematicHome />, {
    // eslint-disable-next-line local-rules/no-react-query-provider-hoc
    wrapper: ({ children }) => reactQueryProviderHOC(children),
  })
}
