import { createOneTimePasswordStore } from './oneTimePasswordStore'

const EMPTY_CODE = ['', '', '', '']
const PARTIAL_CODE = ['1', '2', '', '']
const FULL_CODE = ['1', '2', '3', '4']
const CODE_WITH_EMPTY_THIRD = ['1', '2', '', '4']
const PASTED_CODE_WITH_INVALID_VALUE = ['1', '2', 'A', '4']

describe('createOneTimePasswordStore', () => {
  describe('initial values', () => {
    it('should initialize values from initial values', () => {
      const store = createOneTimePasswordStore(4, PARTIAL_CODE)

      expect(store.getState().values).toEqual(PARTIAL_CODE)
    })

    it('should truncate initial values to the number of inputs', () => {
      const store = createOneTimePasswordStore(2, [...FULL_CODE, '5'])

      expect(store.getState().values).toEqual(['1', '2'])
    })

    it('should initialize empty values when no initial values are provided', () => {
      const store = createOneTimePasswordStore(4)

      expect(store.getState().values).toEqual(EMPTY_CODE)
    })
  })

  describe('setCharacter', () => {
    it('should set a character at the given index and return the next focus index', () => {
      const store = createOneTimePasswordStore(4)
      const nextFocusIndex = store.getState().setCharacter(1, '5')

      expect(store.getState().values).toEqual(['', '5', '', ''])
      expect(nextFocusIndex).toBe(2)
    })

    it('should uppercase a character', () => {
      const store = createOneTimePasswordStore(4)

      store.getState().setCharacter(0, 'a')

      expect(store.getState().values).toEqual(['A', '', '', ''])
    })

    it('should keep an invalid character', () => {
      const store = createOneTimePasswordStore(4)
      store.getState().setCharacter(0, '@')

      expect(store.getState().values).toEqual(['@', '', '', ''])
    })

    it('should wrap focus to the first input after the last input', () => {
      const store = createOneTimePasswordStore(4)
      const nextFocusIndex = store.getState().setCharacter(3, '5')

      expect(store.getState().values).toEqual(['', '', '', '5'])
      expect(nextFocusIndex).toBe(0)
    })

    it('should do nothing when the value is empty', () => {
      const store = createOneTimePasswordStore(4, FULL_CODE)
      const nextFocusIndex = store.getState().setCharacter(1, '')

      expect(store.getState().values).toEqual(FULL_CODE)
      expect(nextFocusIndex).toBeNull()
    })

    it('should treat multiple characters as a paste', () => {
      const store = createOneTimePasswordStore(4)
      const nextFocusIndex = store.getState().setCharacter(0, '12')

      expect(store.getState().values).toEqual(PARTIAL_CODE)
      expect(nextFocusIndex).toBe(1)
    })
  })

  describe('paste', () => {
    it('should fill the inputs with the pasted value', () => {
      const store = createOneTimePasswordStore(4)
      const nextFocusIndex = store.getState().paste(FULL_CODE.join(''))

      expect(store.getState().values).toEqual(FULL_CODE)
      expect(nextFocusIndex).toBe(3)
    })

    it('should uppercase pasted values', () => {
      const store = createOneTimePasswordStore(4)
      store.getState().paste('ab12')

      expect(store.getState().values).toEqual(['A', 'B', '1', '2'])
    })

    it('should truncate pasted values to the number of inputs', () => {
      const store = createOneTimePasswordStore(4)
      const nextFocusIndex = store.getState().paste('123456')

      expect(store.getState().values).toEqual(FULL_CODE)
      expect(nextFocusIndex).toBe(3)
    })

    it('should keep invalid pasted characters', () => {
      const store = createOneTimePasswordStore(4)
      store.getState().paste('12A4')

      expect(store.getState().values).toEqual(PASTED_CODE_WITH_INVALID_VALUE)
    })

    it('should return null when pasting an empty value', () => {
      const store = createOneTimePasswordStore(4)
      const nextFocusIndex = store.getState().paste('')

      expect(store.getState().values).toEqual(EMPTY_CODE)
      expect(nextFocusIndex).toBeNull()
    })
  })

  describe('backspace', () => {
    it('should clear the current input when it contains a value', () => {
      const store = createOneTimePasswordStore(4, FULL_CODE)
      const previousFocusIndex = store.getState().backspace(2)

      expect(store.getState().values).toEqual(CODE_WITH_EMPTY_THIRD)
      expect(previousFocusIndex).toBeNull()
    })

    it('should clear and focus the previous input when the current input is empty', () => {
      const store = createOneTimePasswordStore(4, CODE_WITH_EMPTY_THIRD)
      const previousFocusIndex = store.getState().backspace(2)

      expect(store.getState().values).toEqual(['1', '', '', '4'])
      expect(previousFocusIndex).toBe(1)
    })

    it('should do nothing when backspace is pressed on the first empty input', () => {
      const store = createOneTimePasswordStore(4, ['', '2', '3', '4'])
      const previousFocusIndex = store.getState().backspace(0)

      expect(store.getState().values).toEqual(['', '2', '3', '4'])
      expect(previousFocusIndex).toBeNull()
    })
  })

  describe('setValues', () => {
    it('should update values', () => {
      const store = createOneTimePasswordStore(4)
      store.getState().setValues(PARTIAL_CODE)

      expect(store.getState().values).toEqual(PARTIAL_CODE)
    })

    it('should truncate values to the number of inputs', () => {
      const store = createOneTimePasswordStore(2)
      store.getState().setValues([...FULL_CODE, '5'])

      expect(store.getState().values).toEqual(['1', '2'])
    })
  })
})
