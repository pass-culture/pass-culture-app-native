import React from 'react'

import { useAccessibilityFiltersContext } from 'features/accessibility/context/AccessibilityFiltersWrapper'
import { FilterBehaviour } from 'features/search/enums'
import { screen, render, fireEvent } from 'tests/utils'

import { AccessibilityFiltersModal, AccessibilityModalProps } from './AccessibilityFiltersModal'

const mockDisabilitiesFalse = {
  isAudioDisabilityCompliant: false,
  isMentalDisabilityCompliant: false,
  isMotorDisabilityCompliant: false,
  isVisualDisabilityCompliant: false,
}
const mockDisabilitiesTrue = {
  isAudioDisabilityCompliant: true,
  isMentalDisabilityCompliant: true,
  isMotorDisabilityCompliant: true,
  isVisualDisabilityCompliant: true,
}
const defaultValuesAccessibilityContext = {
  disabilities: {
    ...mockDisabilitiesFalse,
  },
  setDisabilities: jest.fn(() => ({})),
}

jest.mock('features/accessibility/context/AccessibilityFiltersWrapper')
const mockUseAccessibilityFiltersContext = useAccessibilityFiltersContext as jest.Mock

describe('<AccessibilityFiltersModal />', () => {
  beforeEach(() => {
    mockUseAccessibilityFiltersContext.mockReturnValue(defaultValuesAccessibilityContext)
  })

  it('should render modal correctly', async () => {
    renderAccessibilityFiltersModal()
    await screen.findByText(
      'Filtrer par l’accessibilité des lieux en fonction d’un ou plusieurs handicaps'
    )

    expect(screen).toMatchSnapshot()
  })

  it('should call context when modal is opened', async () => {
    renderAccessibilityFiltersModal()
    await screen.findByText(
      'Filtrer par l’accessibilité des lieux en fonction d’un ou plusieurs handicaps'
    )

    expect(mockUseAccessibilityFiltersContext).toHaveBeenCalledWith()
  })

  it('should call context when search button is pressed', async () => {
    const context = mockUseAccessibilityFiltersContext.mockReturnValue(
      defaultValuesAccessibilityContext
    )
    const { disabilities, setDisabilities } = context()
    renderAccessibilityFiltersModal()

    const audioCheckbox = await screen.findByRole('checkbox', { name: 'Handicap auditif' })
    fireEvent.press(audioCheckbox)

    const searchButton = await screen.findByTestId('Rechercher')
    fireEvent.press(searchButton)

    expect(setDisabilities).toHaveBeenCalledWith({
      ...disabilities,
      isAudioDisabilityCompliant: true,
    })
  })

  it('should not call context when search button is not pressed', async () => {
    const context = mockUseAccessibilityFiltersContext.mockReturnValue(
      defaultValuesAccessibilityContext
    )
    const { disabilities, setDisabilities } = context()
    renderAccessibilityFiltersModal()

    const audioCheckbox = await screen.findByRole('checkbox', { name: 'Handicap visuel' })
    fireEvent.press(audioCheckbox)

    const closeButton = await screen.findByTestId('icon-close')
    fireEvent.press(closeButton)

    expect(setDisabilities).not.toHaveBeenCalledWith({
      ...disabilities,
      isVisualDisabilityCompliant: true,
    })
  })

  it('should reset filter when reset button and search button are pressed', async () => {
    const context = mockUseAccessibilityFiltersContext.mockReturnValue({
      disabilities: { ...mockDisabilitiesTrue },
      setDisabilities: jest.fn(() => ({})),
    })

    const { setDisabilities } = context()
    renderAccessibilityFiltersModal()

    const resetButton = await screen.findByTestId('Réinitialiser')
    fireEvent.press(resetButton)

    const searchButton = await screen.findByTestId('Rechercher')
    fireEvent.press(searchButton)

    expect(setDisabilities).toHaveBeenCalledWith(mockDisabilitiesFalse)
  })

  it('should not reset filter when reset button is pressed but search button is not', async () => {
    const context = mockUseAccessibilityFiltersContext.mockReturnValue({
      disabilities: { ...mockDisabilitiesTrue },
      setDisabilities: jest.fn(() => ({})),
    })

    const { setDisabilities } = context()
    renderAccessibilityFiltersModal()

    const resetButton = await screen.findByTestId('Réinitialiser')
    fireEvent.press(resetButton)

    const closeButton = await screen.findByTestId('icon-close')
    fireEvent.press(closeButton)

    expect(setDisabilities).not.toHaveBeenCalled()
  })
})

function renderAccessibilityFiltersModal({
  filterBehaviour = FilterBehaviour.SEARCH,
}: Partial<AccessibilityModalProps> = {}) {
  const mockHideModal = jest.fn()
  const mockOnClose = jest.fn()
  return render(
    <AccessibilityFiltersModal
      title="Accessibilité"
      accessibilityLabel="Ne pas filtrer sur les lieux accessibles puis retourner aux résultats"
      isVisible
      hideModal={mockHideModal}
      filterBehaviour={filterBehaviour}
      onClose={mockOnClose}
    />
  )
}
