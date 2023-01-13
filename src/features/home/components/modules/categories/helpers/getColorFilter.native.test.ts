import {
  brandFilter,
  getDesktopColorFilter,
  getMobileColorFilter,
  secondaryFilter,
} from 'features/home/components/modules/categories/helpers/getColorFilter'

describe('getMobileColorFilter', () => {
  it.each`
    index | filter             | expectedFilter
    ${0}  | ${brandFilter}     | ${'brandFilter'}
    ${1}  | ${secondaryFilter} | ${'secondaryFilter'}
    ${2}  | ${secondaryFilter} | ${'secondaryFilter'}
    ${3}  | ${brandFilter}     | ${'brandFilter'}
    ${4}  | ${brandFilter}     | ${'brandFilter'}
    ${5}  | ${secondaryFilter} | ${'secondaryFilter'}
    ${6}  | ${secondaryFilter} | ${'secondaryFilter'}
  `('should return $expectedFilter when index=$index', ({ index, filter }) => {
    expect(getMobileColorFilter(index)).toEqual(filter)
  })
})

describe('getDesktopColorFilter', () => {
  it.each`
    index | filter             | expectedFilter
    ${0}  | ${brandFilter}     | ${'brandFilter'}
    ${1}  | ${secondaryFilter} | ${'secondaryFilter'}
    ${2}  | ${brandFilter}     | ${'brandFilter'}
    ${3}  | ${secondaryFilter} | ${'secondaryFilter'}
    ${4}  | ${secondaryFilter} | ${'secondaryFilter'}
    ${5}  | ${brandFilter}     | ${'brandFilter'}
    ${6}  | ${secondaryFilter} | ${'secondaryFilter'}
  `('should return $expectedFilter when index=$index', ({ index, filter }) => {
    expect(getDesktopColorFilter(index)).toEqual(filter)
  })
})
