import React from 'react'
import { Button } from 'react-native'

import { AccessibilityFiltersWrapper } from 'features/accessibility/context/AccessibilityFiltersWrapper'
import { FilterBehaviour } from 'features/search/enums'
import { MODAL_TO_SHOW_TIME } from 'tests/constants'
import { screen, render, fireEvent } from 'tests/utils'

import { AccessibilityFiltersModal, AccessibilityModalProps } from './AccessibilityFiltersModal'

jest.useFakeTimers()

describe('<AccessibilityFiltersModal />', () => {
  it('should render modal correctly', async () => {
    renderAccessibilityFiltersModal()

    jest.advanceTimersByTime(MODAL_TO_SHOW_TIME)
    await screen.findByText(
      'Filtrer par l’accessibilité des lieux en fonction d’un ou plusieurs handicaps'
    )

    expect(screen).toMatchSnapshot()
  })

  it('should save selected disabilities when search button is pressed', async () => {
    renderAccessibilityFiltersModal()

    const audioCheckbox = await screen.findByRole('checkbox', { name: 'Handicap auditif' })
    fireEvent.press(audioCheckbox)

    const searchButton = await screen.findByText('Rechercher')
    fireEvent.press(searchButton)

    const openModalButton = await screen.findByText('Show modal')
    fireEvent.press(openModalButton)
    jest.advanceTimersByTime(MODAL_TO_SHOW_TIME)

    expect(screen).toMatchSnapshot()
  })

  it('should not save modified disabilities when pressing close button', async () => {
    renderAccessibilityFiltersModal()

    const audioCheckbox = await screen.findByRole('checkbox', { name: 'Handicap visuel' })
    fireEvent.press(audioCheckbox)

    const closeButton = await screen.findByTestId('icon-close')
    fireEvent.press(closeButton)

    const openModalButton = await screen.findByText('Show modal')
    fireEvent.press(openModalButton)

    jest.advanceTimersByTime(MODAL_TO_SHOW_TIME)

    expect(screen).toMatchSnapshot()
  })

  it('should reset filter when reset button and search button are pressed', async () => {
    renderAccessibilityFiltersModal()

    const resetButton = await screen.findByText('Réinitialiser')
    fireEvent.press(resetButton)

    const searchButton = await screen.findByText('Rechercher')
    fireEvent.press(searchButton)

    const openModalButton = await screen.findByText('Show modal')
    fireEvent.press(openModalButton)
    jest.advanceTimersByTime(MODAL_TO_SHOW_TIME)

    expect(screen).toMatchSnapshot()
  })

  it('should not reset filter when reset button is pressed and user closes modal', async () => {
    renderAccessibilityFiltersModal()

    const resetButton = await screen.findByTestId('Réinitialiser')
    fireEvent.press(resetButton)

    const closeButton = await screen.findByTestId('icon-close')
    fireEvent.press(closeButton)

    const openModalButton = await screen.findByText('Show modal')
    fireEvent.press(openModalButton)
    jest.advanceTimersByTime(MODAL_TO_SHOW_TIME)

    expect(screen).toMatchSnapshot()
  })
})

function renderAccessibilityFiltersModal({
  filterBehaviour,
}: Partial<AccessibilityModalProps> = {}) {
  return render(
    <AccessibilityFiltersWrapper>
      <DummyComponent filterBehaviour={filterBehaviour} />
    </AccessibilityFiltersWrapper>
  )
}

const DummyComponent = ({
  filterBehaviour = FilterBehaviour.SEARCH,
}: Partial<AccessibilityModalProps>) => {
  const [visible, setVisible] = React.useState(true)
  return (
    <React.Fragment>
      <Button title="Show modal" onPress={() => setVisible(true)} />
      <AccessibilityFiltersModal
        title="Accessibilité"
        accessibilityLabel="Ne pas filtrer sur les lieux accessibles puis retourner aux résultats"
        isVisible={visible}
        hideModal={() => setVisible(false)}
        filterBehaviour={filterBehaviour}
        onClose={() => setVisible(false)}
      />
    </React.Fragment>
  )
}
