import { searchSuggestionsAccessibilityStore } from 'features/search/store/searchSuggestionsAccessibility.store'

const { actions, selectors, store } = searchSuggestionsAccessibilityStore

describe('searchSuggestionsAccessibilityStore', () => {
  beforeEach(() => store.setState({ instances: {} }))

  it('should track the registered options of each instance', () => {
    actions.registerOption('search', 'option-1')
    actions.registerOption('search', 'option-1')

    expect(selectors.selectHasOptions('search')).toBe(true)
    expect(selectors.selectHasOptions('other-search')).toBe(false)
    expect(selectors.selectInstance('search').optionIds).toEqual(['option-1'])

    actions.unregisterOption('search', 'option-1')

    expect(selectors.selectHasOptions('search')).toBe(false)
  })

  it('should set and reset the active option', () => {
    actions.registerOption('search', 'option-1')
    actions.setActiveOption('search', 'option-1')

    expect(selectors.selectActiveOptionId('search')).toBe('option-1')
    expect(selectors.selectIsActiveOption('search', 'option-1')).toBe(true)
    expect(selectors.selectIsActiveOption('search', 'option-2')).toBe(false)

    actions.setActiveOption('search', null)

    expect(selectors.selectActiveOptionId('search')).toBeNull()
  })

  it('should reset the active option when it is unregistered', () => {
    actions.registerOption('search', 'option-1')
    actions.registerOption('search', 'option-2')
    actions.setActiveOption('search', 'option-1')

    actions.unregisterOption('search', 'option-2')

    expect(selectors.selectActiveOptionId('search')).toBe('option-1')

    actions.unregisterOption('search', 'option-1')

    expect(selectors.selectActiveOptionId('search')).toBeNull()
  })

  it('should not recreate an instance after its removal', () => {
    actions.registerOption('search', 'option-1')
    actions.remove('search')

    actions.unregisterOption('search', 'option-1')
    actions.setActiveOption('search', 'option-1')

    expect(store.getState().instances).toEqual({})
  })
})
