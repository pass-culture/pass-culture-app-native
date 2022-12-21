import {
  brandFilter,
  getColorFilter,
  secondaryFilter,
} from 'features/home/components/modules/categories/helpers/getColorFilter'

describe('getColorFilter', () => {
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
    expect(getColorFilter(index)).toEqual(filter)
  })
})
