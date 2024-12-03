import { StackScreenProps } from '@react-navigation/stack'
import React from 'react'

import { navigate } from '__mocks__/@react-navigation/native'
import { VenueTypeCodeKey } from 'api/gen'
import { VenueMapFiltersModalStackParamList } from 'features/navigation/VenueMapFiltersStackNavigator/types'
import { VenueMapTypeFilter } from 'features/venueMap/components/VenueMapTypeFilter/VenueMapTypeFilter'
import { FILTERS_VENUE_TYPE_MAPPING } from 'features/venueMap/constant'
import { useVenuesFilter, useVenuesFilterActions } from 'features/venueMap/store/venuesFilterStore'
import { render, screen, userEvent } from 'tests/utils'

const mockGoBack = jest.fn()

const mockNavigation: StackScreenProps<
  VenueMapFiltersModalStackParamList,
  'VenueMapTypeFilter'
>['navigation'] = {
  navigate: jest.fn(),
  goBack: mockGoBack,
  dispatch: jest.fn(),
  reset: jest.fn(),
  isFocused: jest.fn(),
  canGoBack: jest.fn(),
  getId: jest.fn(),
  getState: jest.fn(),
  getParent: jest.fn(),
  setParams: jest.fn(),
  setOptions: jest.fn(),
  addListener: jest.fn(),
  removeListener: jest.fn(),
  replace: jest.fn(),
  push: jest.fn(),
  pop: jest.fn(),
  popToTop: jest.fn(),
}

jest.mock('features/venueMap/store/venuesFilterStore')
const mockUseVenuesFilter = useVenuesFilter as jest.Mock
mockUseVenuesFilter.mockReturnValue([])

const mockAddVenuesFilters = jest.fn()
const mockRemoveVenuesFilters = jest.fn()
const mockSetVenuesFilters = jest.fn()
const mockUseVenuesFilterActions = useVenuesFilterActions as jest.Mock
mockUseVenuesFilterActions.mockReturnValue({
  addVenuesFilters: mockAddVenuesFilters,
  removeVenuesFilters: mockRemoveVenuesFilters,
  setVenuesFilters: mockSetVenuesFilters,
})

const user = userEvent.setup()

jest.useFakeTimers()

describe('VenueMapTypeFilter', () => {
  it('should navigate to venue map when pressing modal close button', async () => {
    render(
      <VenueMapTypeFilter
        navigation={mockNavigation}
        route={{
          key: 'VenueMapTypeFilter',
          name: 'VenueMapTypeFilter',
          params: { title: 'Sorties', filterGroup: 'OUTINGS' },
        }}
      />
    )

    await user.press(screen.getByLabelText('Fermer'))

    expect(navigate).toHaveBeenNthCalledWith(1, 'VenueMap')
  })

  it('should trigger goBack when pressing modal back button', async () => {
    render(
      <VenueMapTypeFilter
        navigation={mockNavigation}
        route={{
          key: 'VenueMapTypeFilter',
          name: 'VenueMapTypeFilter',
          params: { title: 'Sorties', filterGroup: 'OUTINGS' },
        }}
      />
    )

    await user.press(screen.getByLabelText('Revenir en arrière'))

    expect(mockGoBack).toHaveBeenCalledTimes(1)
  })

  it('should display venue type filter title', () => {
    render(
      <VenueMapTypeFilter
        navigation={mockNavigation}
        route={{
          key: 'VenueMapTypeFilter',
          name: 'VenueMapTypeFilter',
          params: { title: 'Sorties', filterGroup: 'OUTINGS' },
        }}
      />
    )

    expect(screen.getByText('Sorties')).toBeOnTheScreen()
  })

  it('should display checkboxes associated to venue type filter', () => {
    render(
      <VenueMapTypeFilter
        navigation={mockNavigation}
        route={{
          key: 'VenueMapTypeFilter',
          name: 'VenueMapTypeFilter',
          params: { title: 'Sorties', filterGroup: 'OUTINGS' },
        }}
      />
    )

    expect(screen.getByText('Tout sélectionner')).toBeOnTheScreen()
    expect(screen.getByText('Musique - Salle de concerts')).toBeOnTheScreen()
    expect(screen.getByText('Cinéma - Salle de projections')).toBeOnTheScreen()
    expect(screen.getByText('Musée')).toBeOnTheScreen()
  })

  it('should toggle show all checkbox when complete venue type group selected', () => {
    mockUseVenuesFilter.mockReturnValueOnce(FILTERS_VENUE_TYPE_MAPPING['OUTINGS'])
    render(
      <VenueMapTypeFilter
        navigation={mockNavigation}
        route={{
          key: 'VenueMapTypeFilter',
          name: 'VenueMapTypeFilter',
          params: { title: 'Sorties', filterGroup: 'OUTINGS' },
        }}
      />
    )

    const showAllCheckbox = screen.getByRole('checkbox', { name: 'Tout sélectionner' })

    expect(showAllCheckbox).toHaveAccessibilityState({ checked: true })
  })

  it('should toggle venue type checkbox when it is included in venue filters', () => {
    mockUseVenuesFilter.mockReturnValueOnce([VenueTypeCodeKey.CONCERT_HALL])

    render(
      <VenueMapTypeFilter
        navigation={mockNavigation}
        route={{
          key: 'VenueMapTypeFilter',
          name: 'VenueMapTypeFilter',
          params: { title: 'Sorties', filterGroup: 'OUTINGS' },
        }}
      />
    )

    const concertHallCheckbox = screen.getByRole('checkbox', {
      name: 'Musique - Salle de concerts',
    })

    expect(concertHallCheckbox).toHaveAccessibilityState({ checked: true })
  })

  it('should reset venue types filters when pressing show all checkbox (checked) and venue type filter is empty without the current venue type group', async () => {
    mockUseVenuesFilter.mockReturnValueOnce(FILTERS_VENUE_TYPE_MAPPING['OUTINGS'])
    render(
      <VenueMapTypeFilter
        navigation={mockNavigation}
        route={{
          key: 'VenueMapTypeFilter',
          name: 'VenueMapTypeFilter',
          params: { title: 'Sorties', filterGroup: 'OUTINGS' },
        }}
      />
    )

    const showAllCheckbox = screen.getByRole('checkbox', { name: 'Tout sélectionner' })

    await user.press(showAllCheckbox)

    expect(mockRemoveVenuesFilters).toHaveBeenNthCalledWith(
      1,
      FILTERS_VENUE_TYPE_MAPPING['OUTINGS']
    )
  })

  it('should add venue types filters of the current group when pressing show all checkbox (not checked) and venue type filter is not empty without the current venue type group', async () => {
    mockUseVenuesFilter.mockReturnValueOnce(FILTERS_VENUE_TYPE_MAPPING['SHOPS'])
    render(
      <VenueMapTypeFilter
        navigation={mockNavigation}
        route={{
          key: 'VenueMapTypeFilter',
          name: 'VenueMapTypeFilter',
          params: { title: 'Sorties', filterGroup: 'OUTINGS' },
        }}
      />
    )

    const showAllCheckbox = screen.getByRole('checkbox', { name: 'Tout sélectionner' })

    await user.press(showAllCheckbox)

    expect(mockAddVenuesFilters).toHaveBeenNthCalledWith(1, FILTERS_VENUE_TYPE_MAPPING['OUTINGS'])
  })

  it('should remove venue type filter when pressing venue type checkbox (checked)', async () => {
    mockUseVenuesFilter.mockReturnValueOnce([VenueTypeCodeKey.CONCERT_HALL])
    render(
      <VenueMapTypeFilter
        navigation={mockNavigation}
        route={{
          key: 'VenueMapTypeFilter',
          name: 'VenueMapTypeFilter',
          params: { title: 'Sorties', filterGroup: 'OUTINGS' },
        }}
      />
    )

    const concertHallCheckbox = screen.getByRole('checkbox', {
      name: 'Musique - Salle de concerts',
    })

    await user.press(concertHallCheckbox)

    expect(mockRemoveVenuesFilters).toHaveBeenNthCalledWith(1, [VenueTypeCodeKey.CONCERT_HALL])
  })

  it('should add venue type filter when pressing venue type checkbox (not checked)', async () => {
    mockUseVenuesFilter.mockReturnValueOnce([VenueTypeCodeKey.FESTIVAL])
    render(
      <VenueMapTypeFilter
        navigation={mockNavigation}
        route={{
          key: 'VenueMapTypeFilter',
          name: 'VenueMapTypeFilter',
          params: { title: 'Sorties', filterGroup: 'OUTINGS' },
        }}
      />
    )

    const concertHallCheckbox = screen.getByRole('checkbox', {
      name: 'Musique - Salle de concerts',
    })

    await user.press(concertHallCheckbox)

    expect(mockAddVenuesFilters).toHaveBeenNthCalledWith(1, [VenueTypeCodeKey.CONCERT_HALL])
  })

  it('should complete selection when some checkboxes are checked and pressing select all', async () => {
    mockUseVenuesFilter.mockReturnValueOnce([VenueTypeCodeKey.FESTIVAL])
    render(
      <VenueMapTypeFilter
        navigation={mockNavigation}
        route={{
          key: 'VenueMapTypeFilter',
          name: 'VenueMapTypeFilter',
          params: { title: 'Sorties', filterGroup: 'OUTINGS' },
        }}
      />
    )

    const showAllCheckbox = screen.getByRole('checkbox', { name: 'Tout sélectionner' })

    await user.press(showAllCheckbox)

    expect(screen.getAllByRole('checkbox')).toHaveLength(
      FILTERS_VENUE_TYPE_MAPPING.OUTINGS.length + 1
    )
  })
})
