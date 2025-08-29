import {
  INITIAL_LIST_SIZE,
  STEP_LIST_INCREMENT,
  expandList,
  getListToDisplay,
  hasReachedEnd,
} from 'features/offer/helpers/expandableList'

const baseList = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

describe('expandableList', () => {
  beforeAll(jest.fn())

  describe('expandList', () => {
    it('should return the size of the list to display increased by step value', () => {
      expect(expandList(baseList, INITIAL_LIST_SIZE)).toBe(INITIAL_LIST_SIZE + STEP_LIST_INCREMENT)
    })

    it('should return the max length of the base list when reached', () => {
      const increased_size = expandList(baseList, INITIAL_LIST_SIZE)

      expect(expandList(baseList, increased_size)).toBe(baseList.length)
    })
  })

  describe('getListToDisplay', () => {
    it('should return the list to display given the size', () => {
      expect(getListToDisplay(baseList, 3)).toEqual([1, 2, 3])
    })

    it('should return the whole list to display when size exceed length of base list', () => {
      expect(getListToDisplay(baseList, 12)).toEqual(baseList)
    })
  })

  describe('hasReachedEnd', () => {
    it('should return true when displayed list has reached end of base List', () => {
      expect(hasReachedEnd(baseList, 10)).toBe(true)
    })

    it('should return true when displayed list has exceeded end of base List', () => {
      expect(hasReachedEnd(baseList, 11)).toBe(true)
    })

    it('should return true when displayed list has not reached end of base List', () => {
      expect(hasReachedEnd(baseList, 3)).toBe(false)
    })
  })
})
