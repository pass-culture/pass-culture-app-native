import React from 'react'

import { useRoute } from '__mocks__/@react-navigation/native'
import { useHomepageData } from 'features/home/api/useHomepageData'
import { formattedVenuesModule } from 'features/home/fixtures/homepage.fixture'
import { ThematicHome } from 'features/home/pages/ThematicHome'
import { ThematicHeaderType } from 'features/home/types'
import { analytics } from 'libs/analytics'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { render, screen } from 'tests/utils'

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

  it('should render correctly', async () => {
    renderThematicHome()
    await screen.findByText('HeaderSubtitle')
    expect(screen).toMatchSnapshot()
  })

  it('should render default header when provided', async () => {
    renderThematicHome()
    expect(await screen.findAllByText('HeaderTitle')).toBeTruthy()
    expect(screen.getByText('HeaderSubtitle')).toBeTruthy()
  })

  it('should show highlight header when provided', async () => {
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

    renderThematicHome()
    expect(await screen.findAllByText('Bloc temps fort')).toBeTruthy()
    expect(screen.getByText('Un sous-titre')).toBeTruthy()
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
    expect(await screen.findAllByText('Catégorie cinéma')).toBeTruthy()
    expect(screen.getByText('Un sous-titre')).toBeTruthy()
  })

  it('should log ConsultHome', async () => {
    renderThematicHome()

    await screen.findByText('HeaderSubtitle')

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

    await screen.findByText('HeaderSubtitle')

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

    await screen.findByText('HeaderSubtitle')

    expect(analytics.logConsultHome).toHaveBeenNthCalledWith(1, {
      homeEntryId: 'fakeEntryId',
      from: 'highlight_thematic_block',
      moduleId: 'moduleId',
    })
  })
})

const renderThematicHome = () => {
  render(<ThematicHome />, {
    // eslint-disable-next-line local-rules/no-react-query-provider-hoc
    wrapper: ({ children }) => reactQueryProviderHOC(children),
  })
}
