import React from 'react'
import { v4 as uuidv4 } from 'uuid'

import { navigate } from '__mocks__/@react-navigation/native'
import { GenreType, NativeCategoryIdEnumv2, SearchGroupNameEnumv2 } from 'api/gen'
import { getTabNavConfig } from 'features/navigation/TabBar/helpers'
import { AutocompleteOfferItem } from 'features/search/components/AutocompleteOfferItem/AutocompleteOfferItem'
import { initialSearchState } from 'features/search/context/reducer'
import {
  mockHit,
  mockHitSeveralCategoriesWithAssociationToNativeCategory,
  mockHitSeveralCategoriesWithoutAssociationToNativeCategory,
  mockHitUnknownCategory,
  mockHitUnknownNativeCategory,
  mockHitUnknownNativeCategoryAndCategory,
  mockHitWithOnlyCategory,
  mockHitWithoutCategoryAndNativeCategory,
} from 'features/search/fixtures/autocompleteHits'
import { SearchState, SearchView } from 'features/search/types'
import { Venue } from 'features/venue/types'
import { placeholderData as mockData } from 'libs/subcategories/placeholderData'
import { mockedSuggestedVenues } from 'libs/venue/fixtures/mockedSuggestedVenues'
import { fireEvent, render, screen } from 'tests/utils'

const venue: Venue = mockedSuggestedVenues[0]

let mockSearchState: SearchState = {
  ...initialSearchState,
  venue,
  priceRange: [0, 20],
}

const mockDispatch = jest.fn()
jest.mock('features/search/context/SearchWrapper', () => ({
  useSearch: () => ({ searchState: mockSearchState, dispatch: mockDispatch }),
}))

jest.mock('libs/subcategories/useSubcategories', () => ({
  useSubcategories: () => ({
    data: mockData,
  }),
}))

const mockSendEvent = jest.fn()

const searchId = uuidv4()

describe('AutocompleteOfferItem component', () => {
  beforeEach(() => {
    mockSearchState = {
      ...initialSearchState,
      venue,
      priceRange: [0, 20],
    }
  })

  it('should render AutocompleteOfferItem', () => {
    expect(
      render(
        <AutocompleteOfferItem
          hit={mockHit}
          sendEvent={mockSendEvent}
          shouldShowCategory
          addSearchHistory={jest.fn()}
        />
      )
    ).toMatchSnapshot()
  })

  it('should create a suggestion clicked event when pressing a hit', async () => {
    render(
      <AutocompleteOfferItem hit={mockHit} sendEvent={mockSendEvent} addSearchHistory={jest.fn()} />
    )
    await fireEvent.press(screen.getByTestId('autocompleteOfferItem_1'))

    expect(mockSendEvent).toHaveBeenCalledTimes(1)
  })

  describe('when item is not in the first three suggestions', () => {
    it('should execute a search with the query suggestion on hit click', async () => {
      render(
        <AutocompleteOfferItem
          hit={mockHit}
          sendEvent={mockSendEvent}
          addSearchHistory={jest.fn()}
        />
      )
      await fireEvent.press(screen.getByTestId('autocompleteOfferItem_1'))

      expect(navigate).toHaveBeenCalledWith(
        ...getTabNavConfig('Search', {
          ...initialSearchState,
          query: mockHit.query,
          isFromHistory: undefined,
          offerGenreTypes: undefined,
          offerNativeCategories: undefined,
          locationFilter: mockSearchState.locationFilter,
          venue: mockSearchState.venue,
          priceRange: mockSearchState.priceRange,
          view: SearchView.Results,
          searchId,
          isAutocomplete: true,
        })
      )
    })

    it('should not display the most popular native category of the query suggestion', async () => {
      render(
        <AutocompleteOfferItem
          hit={mockHit}
          sendEvent={mockSendEvent}
          addSearchHistory={jest.fn()}
        />
      )

      expect(screen.queryByText('Séances de cinéma')).not.toBeOnTheScreen()
    })

    it('should not execute the search with the category, native category and genre of the previous search on hit click', async () => {
      mockSearchState = {
        ...mockSearchState,
        offerCategories: [SearchGroupNameEnumv2.LIVRES],
        offerNativeCategories: [NativeCategoryIdEnumv2.LIVRES_PAPIER],
        offerGenreTypes: [
          { key: GenreType.BOOK, name: 'Bandes dessinées', value: 'Bandes dessinées' },
        ],
      }
      render(
        <AutocompleteOfferItem
          hit={mockHit}
          sendEvent={mockSendEvent}
          addSearchHistory={jest.fn()}
        />
      )
      await fireEvent.press(screen.getByTestId('autocompleteOfferItem_1'))

      expect(navigate).toHaveBeenCalledWith(
        ...getTabNavConfig('Search', {
          ...initialSearchState,
          query: mockHit.query,
          locationFilter: mockSearchState.locationFilter,
          venue: mockSearchState.venue,
          priceRange: mockSearchState.priceRange,
          view: SearchView.Results,
          searchId,
          isAutocomplete: true,
          offerNativeCategories: undefined,
          offerGenreTypes: undefined,
        })
      )
    })
  })

  describe('when item is in the first three suggestions', () => {
    describe('should execute a search with the query suggestion and', () => {
      it('its most popular native category when it associated to only one category on hit click', async () => {
        render(
          <AutocompleteOfferItem
            hit={mockHit}
            sendEvent={mockSendEvent}
            shouldShowCategory
            addSearchHistory={jest.fn()}
          />
        )
        await fireEvent.press(screen.getByTestId('autocompleteOfferItem_1'))

        expect(navigate).toHaveBeenCalledWith(
          ...getTabNavConfig('Search', {
            ...initialSearchState,
            query: mockHit.query,
            offerCategories: [SearchGroupNameEnumv2.FILMS_SERIES_CINEMA],
            offerNativeCategories: [NativeCategoryIdEnumv2.SEANCES_DE_CINEMA],
            locationFilter: mockSearchState.locationFilter,
            venue: mockSearchState.venue,
            priceRange: mockSearchState.priceRange,
            view: SearchView.Results,
            searchId,
            isAutocomplete: true,
          })
        )
      })

      it('its most popular native category is associated to several categories and is associated to the most popular category', async () => {
        render(
          <AutocompleteOfferItem
            hit={mockHitSeveralCategoriesWithAssociationToNativeCategory}
            sendEvent={mockSendEvent}
            shouldShowCategory
            addSearchHistory={jest.fn()}
          />
        )
        await fireEvent.press(screen.getByTestId('autocompleteOfferItem_1'))

        expect(navigate).toHaveBeenCalledWith(
          ...getTabNavConfig('Search', {
            ...initialSearchState,
            query: mockHitSeveralCategoriesWithAssociationToNativeCategory.query,
            offerCategories: [SearchGroupNameEnumv2.MUSEES_VISITES_CULTURELLES],
            offerNativeCategories: [NativeCategoryIdEnumv2.ARTS_VISUELS],
            locationFilter: mockSearchState.locationFilter,
            venue: mockSearchState.venue,
            priceRange: mockSearchState.priceRange,
            view: SearchView.Results,
            searchId,
            isAutocomplete: true,
          })
        )
      })

      it('its most popular category when native category associated to several categories and not associated to the most popular category', async () => {
        render(
          <AutocompleteOfferItem
            hit={mockHitSeveralCategoriesWithoutAssociationToNativeCategory}
            sendEvent={mockSendEvent}
            shouldShowCategory
            addSearchHistory={jest.fn()}
          />
        )
        await fireEvent.press(screen.getByTestId('autocompleteOfferItem_1'))

        expect(navigate).toHaveBeenCalledWith(
          ...getTabNavConfig('Search', {
            ...initialSearchState,
            query: mockHitSeveralCategoriesWithoutAssociationToNativeCategory.query,
            offerCategories: [SearchGroupNameEnumv2.FILMS_SERIES_CINEMA],
            locationFilter: mockSearchState.locationFilter,
            venue: mockSearchState.venue,
            priceRange: mockSearchState.priceRange,
            view: SearchView.Results,
            searchId,
            isAutocomplete: true,
          })
        )
      })

      it('the most popular category when the suggestion has not native category', async () => {
        render(
          <AutocompleteOfferItem
            hit={mockHitWithOnlyCategory}
            sendEvent={mockSendEvent}
            shouldShowCategory
            addSearchHistory={jest.fn()}
          />
        )
        await fireEvent.press(screen.getByTestId('autocompleteOfferItem_1'))

        expect(navigate).toHaveBeenCalledWith(
          ...getTabNavConfig('Search', {
            ...initialSearchState,
            query: mockHitWithOnlyCategory.query,
            offerCategories: [SearchGroupNameEnumv2.FILMS_SERIES_CINEMA],
            locationFilter: mockSearchState.locationFilter,
            venue: mockSearchState.venue,
            priceRange: mockSearchState.priceRange,
            view: SearchView.Results,
            searchId,
            isAutocomplete: true,
          })
        )
      })

      it('without the most popular category and native category when there are unknown in the app', async () => {
        render(
          <AutocompleteOfferItem
            hit={mockHitUnknownNativeCategoryAndCategory}
            sendEvent={mockSendEvent}
            shouldShowCategory
            addSearchHistory={jest.fn()}
          />
        )
        await fireEvent.press(screen.getByTestId('autocompleteOfferItem_1'))

        expect(navigate).toHaveBeenCalledWith(
          ...getTabNavConfig('Search', {
            ...initialSearchState,
            query: mockHitWithOnlyCategory.query,
            offerCategories: [],
            offerNativeCategories: undefined,
            locationFilter: mockSearchState.locationFilter,
            venue: mockSearchState.venue,
            priceRange: mockSearchState.priceRange,
            view: SearchView.Results,
            searchId,
            isAutocomplete: true,
          })
        )
      })

      it('without the most popular category when it is unknown in the app', async () => {
        render(
          <AutocompleteOfferItem
            hit={mockHitUnknownCategory}
            sendEvent={mockSendEvent}
            shouldShowCategory
            addSearchHistory={jest.fn()}
          />
        )
        await fireEvent.press(screen.getByTestId('autocompleteOfferItem_1'))

        expect(navigate).toHaveBeenCalledWith(
          ...getTabNavConfig('Search', {
            ...initialSearchState,
            query: mockHitWithOnlyCategory.query,
            offerCategories: [],
            locationFilter: mockSearchState.locationFilter,
            venue: mockSearchState.venue,
            priceRange: mockSearchState.priceRange,
            view: SearchView.Results,
            searchId,
            isAutocomplete: true,
          })
        )
      })

      it('without the most popular native category but the most popular category when native category is unknown in the app', async () => {
        render(
          <AutocompleteOfferItem
            hit={mockHitUnknownNativeCategory}
            sendEvent={mockSendEvent}
            shouldShowCategory
            addSearchHistory={jest.fn()}
          />
        )
        await fireEvent.press(screen.getByTestId('autocompleteOfferItem_1'))

        expect(navigate).toHaveBeenCalledWith(
          ...getTabNavConfig('Search', {
            ...initialSearchState,
            query: mockHitWithOnlyCategory.query,
            offerCategories: [SearchGroupNameEnumv2.CD_VINYLE_MUSIQUE_EN_LIGNE],
            offerNativeCategories: undefined,
            locationFilter: mockSearchState.locationFilter,
            priceRange: mockSearchState.priceRange,
            view: SearchView.Results,
            searchId,
            isAutocomplete: true,
            venue: mockSearchState.venue,
          })
        )
      })
    })

    describe('should display the most popular native category of the query suggestion', () => {
      it('when it associated to only one category', async () => {
        render(
          <AutocompleteOfferItem
            hit={mockHit}
            sendEvent={mockSendEvent}
            shouldShowCategory
            addSearchHistory={jest.fn()}
          />
        )

        expect(screen.getByText('Séances de cinéma')).toBeOnTheScreen()
      })

      it('when it associated to the most popular category', async () => {
        render(
          <AutocompleteOfferItem
            hit={mockHitSeveralCategoriesWithAssociationToNativeCategory}
            sendEvent={mockSendEvent}
            shouldShowCategory
            addSearchHistory={jest.fn()}
          />
        )

        expect(screen.getByText('Arts visuels')).toBeOnTheScreen()
      })
    })

    describe('should not display the most popular category or native category of the query suggestion', () => {
      it('when it does not return by Algolia', async () => {
        render(
          <AutocompleteOfferItem
            hit={mockHitWithoutCategoryAndNativeCategory}
            sendEvent={mockSendEvent}
            shouldShowCategory
            addSearchHistory={jest.fn()}
          />
        )

        expect(screen.queryByText('dans')).not.toBeOnTheScreen()
      })

      it('when there are unknown in the app', async () => {
        render(
          <AutocompleteOfferItem
            hit={mockHitUnknownNativeCategoryAndCategory}
            sendEvent={mockSendEvent}
            shouldShowCategory
            addSearchHistory={jest.fn()}
          />
        )

        expect(screen.queryByText('dans')).not.toBeOnTheScreen()
      })
    })

    describe('should not display the most popular native category of the query suggestion', () => {
      it('when it is not associated to the most popular category', async () => {
        render(
          <AutocompleteOfferItem
            hit={mockHitSeveralCategoriesWithoutAssociationToNativeCategory}
            sendEvent={mockSendEvent}
            shouldShowCategory
            addSearchHistory={jest.fn()}
          />
        )

        expect(screen.queryByText('Arts visuels')).not.toBeOnTheScreen()
      })

      it('when it is unknown in the app', () => {
        render(
          <AutocompleteOfferItem
            hit={mockHitUnknownNativeCategory}
            sendEvent={mockSendEvent}
            shouldShowCategory
            addSearchHistory={jest.fn()}
          />
        )

        expect(screen.queryByText('dans CD_VINYLES')).not.toBeOnTheScreen()
      })
    })

    describe('should not display the most popular category of the query suggestion', () => {
      it('when native category associated to only one category', async () => {
        render(
          <AutocompleteOfferItem
            hit={mockHit}
            sendEvent={mockSendEvent}
            shouldShowCategory
            addSearchHistory={jest.fn()}
          />
        )

        expect(screen.queryByText('Films, séries, cinéma')).not.toBeOnTheScreen()
      })

      it('when native category associated to the most popular category', async () => {
        render(
          <AutocompleteOfferItem
            hit={mockHitSeveralCategoriesWithAssociationToNativeCategory}
            sendEvent={mockSendEvent}
            shouldShowCategory
            addSearchHistory={jest.fn()}
          />
        )

        expect(screen.queryByText('Films, séries, cinéma')).not.toBeOnTheScreen()
      })

      it('when category is unknown in the app', async () => {
        render(
          <AutocompleteOfferItem
            hit={mockHitUnknownCategory}
            sendEvent={mockSendEvent}
            shouldShowCategory
            addSearchHistory={jest.fn()}
          />
        )

        expect(screen.queryByText('dans')).not.toBeOnTheScreen()
      })
    })

    describe('should display the most popular category of the query suggestion when', () => {
      it('is not associated to the most popular category', async () => {
        render(
          <AutocompleteOfferItem
            hit={mockHitSeveralCategoriesWithoutAssociationToNativeCategory}
            sendEvent={mockSendEvent}
            shouldShowCategory
            addSearchHistory={jest.fn()}
          />
        )

        expect(screen.getByText('Films, séries, cinéma')).toBeOnTheScreen()
      })

      it('has not native category associated to the suggestion', async () => {
        render(
          <AutocompleteOfferItem
            hit={mockHitWithOnlyCategory}
            sendEvent={mockSendEvent}
            shouldShowCategory
            addSearchHistory={jest.fn()}
          />
        )

        expect(screen.getByText('Films, séries, cinéma')).toBeOnTheScreen()
      })

      it('native category is unknown in the app', async () => {
        render(
          <AutocompleteOfferItem
            hit={mockHitUnknownNativeCategory}
            sendEvent={mockSendEvent}
            shouldShowCategory
            addSearchHistory={jest.fn()}
          />
        )

        expect(screen.getByText('CD, vinyles, musique en ligne')).toBeOnTheScreen()
      })
    })
  })
})
