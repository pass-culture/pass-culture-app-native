import React from 'react'
import { Button } from 'react-native'

import { AccessibilityFiltersWrapper } from 'features/accessibility/context/AccessibilityFiltersWrapper'
import { FilterBehaviour } from 'features/search/enums'
import { MODAL_TO_SHOW_TIME } from 'tests/constants'
import { render, screen, userEvent } from 'tests/utils'

import { AccessibilityFiltersModal, AccessibilityModalProps } from './AccessibilityFiltersModal'

jest.mock('react-native/Libraries/Animated/createAnimatedComponent', () => {
  return function createAnimatedComponent(Component: unknown) {
    return Component
  }
})

const user = userEvent.setup()
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
    await user.press(audioCheckbox)

    const searchButton = await screen.findByText('Rechercher')
    await user.press(searchButton)

    const openModalButton = await screen.findByText('Show modal')
    await user.press(openModalButton)
    jest.advanceTimersByTime(MODAL_TO_SHOW_TIME)

    expect(audioCheckbox).toHaveAccessibilityState({ checked: true })
  })

  it('should apply default disabilities when reset button is pressed', async () => {
    renderAccessibilityFiltersModal()

    const audioCheckbox = await screen.findByRole('checkbox', { name: 'Handicap auditif' })
    await user.press(audioCheckbox)

    const searchButton = await screen.findByText('Rechercher')
    await user.press(searchButton)

    const openModalButton = await screen.findByText('Show modal')
    await user.press(openModalButton)
    jest.advanceTimersByTime(MODAL_TO_SHOW_TIME)

    const resetButton = await screen.findByText('Réinitialiser')
    await user.press(resetButton)

    const closeButton = await screen.findByTestId('icon-close')
    user.press(closeButton)

    await user.press(openModalButton)
    jest.advanceTimersByTime(MODAL_TO_SHOW_TIME)

    expect(audioCheckbox).toHaveAccessibilityState({ checked: false })
  })

  it('should not save modified disabilities when pressing close button', async () => {
    renderAccessibilityFiltersModal()

    const audioCheckbox = await screen.findByRole('checkbox', { name: 'Handicap visuel' })
    user.press(audioCheckbox)

    const closeButton = await screen.findByTestId('icon-close')
    user.press(closeButton)

    const openModalButton = await screen.findByText('Show modal')
    user.press(openModalButton)

    jest.advanceTimersByTime(MODAL_TO_SHOW_TIME)

    expect(audioCheckbox).toHaveAccessibilityState({ checked: false })
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
