import { modalManager } from 'shared/modalManager/modalManager.store'

const { actions, applySelector, selectors, handlers } = modalManager

describe('modalManager', () => {
  beforeEach(() => {
    actions.reset()
  })

  it('should display a modal when none is displayed', () => {
    handlers.openModal('ACHIEVEMENT')

    const displayedModal = applySelector(selectors.selectDisplayedModal())

    expect(displayedModal).toBe('ACHIEVEMENT')
  })

  it('should not display a new modal when one is displayed', () => {
    handlers.openModal('ACHIEVEMENT')
    handlers.openModal('REACTION')

    const displayedModal = applySelector(selectors.selectDisplayedModal())

    expect(displayedModal).toBe('ACHIEVEMENT')
  })

  it('should display the next stacked modal when the current one is closed', () => {
    handlers.openModal('ACHIEVEMENT')
    handlers.openModal('STACKABLE')

    handlers.closeModal()

    const displayedModal = applySelector(selectors.selectDisplayedModal())

    expect(displayedModal).toBe('STACKABLE')
  })

  it('should not display modal when the current one is closed and none is stacked', () => {
    handlers.openModal('ACHIEVEMENT')
    handlers.openModal('REACTION')

    handlers.closeModal()

    const displayedModal = applySelector(selectors.selectDisplayedModal())

    expect(displayedModal).toBeUndefined()
  })
})
