import React from 'react'
import { Button } from 'react-native'

import { AccessibilityFiltersWrapper } from 'features/accessibility/context/AccessibilityFiltersWrapper'
import { FilterBehaviour } from 'features/search/enums'
import { MODAL_TO_SHOW_TIME } from 'tests/constants'
import { renderAsync, screen, userEvent } from 'tests/utils'

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
    await renderAccessibilityFiltersModal()

    jest.advanceTimersByTime(MODAL_TO_SHOW_TIME)
    await screen.findByText(
      'Filtrer par l’accessibilité des lieux en fonction d’un ou plusieurs handicaps'
    )

    expect(screen).toMatchSnapshot()
  })

  it('should save selected disabilities when search button is pressed', async () => {
    await renderAccessibilityFiltersModal()

    const audioCheckbox = await screen.findByRole('checkbox', { name: 'Handicap auditif' })
    await user.press(audioCheckbox)

    const searchButton = await screen.findByText('Rechercher')
    await user.press(searchButton)

    const openModalButton = await screen.findByText('Show modal')
    await user.press(openModalButton)

    expect(audioCheckbox).toHaveAccessibilityState({ checked: true })
  })

  it('should apply default disabilities when reset button is pressed', async () => {
    await renderAccessibilityFiltersModal()

    const audioCheckbox = await screen.findByRole('checkbox', { name: 'Handicap auditif' })
    await user.press(audioCheckbox)

    const searchButton = await screen.findByText('Rechercher')
    await user.press(searchButton)

    const openModalButton = await screen.findByText('Show modal')
    await user.press(openModalButton)

    const resetButton = await screen.findByText('Réinitialiser')
    await user.press(resetButton)

    const closeButton = await screen.findByTestId('icon-close')
    await user.press(closeButton)

    await user.press(openModalButton)

    expect(audioCheckbox).toHaveAccessibilityState({ checked: false })
  })

  it('should not save modified disabilities when pressing close button', async () => {
    await renderAccessibilityFiltersModal()

    const audioCheckbox = await screen.findByRole('checkbox', { name: 'Handicap visuel' })
    await user.press(audioCheckbox)

    const closeButton = await screen.findByTestId('icon-close')
    await user.press(closeButton)

    const openModalButton = await screen.findByText('Show modal')
    await user.press(openModalButton)

    expect(audioCheckbox).toHaveAccessibilityState({ checked: false })
  })
})

const renderAccessibilityFiltersModal = ({
  filterBehaviour,
}: Partial<AccessibilityModalProps> = {}) => {
  return renderAsync(
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
