import { getSegmentFromIdentifier } from 'shared/useABSegment/getSegmentFromIdentifier'

describe('getSegmentFromIdentifier', () => {
  it('should return the segment A when identifier is even number', () => {
    const segment = getSegmentFromIdentifier(['A', 'B'], 1234)

    expect(segment).toEqual('A')
  })

  it('should return the segment B when identifier is odd number', () => {
    const segment = getSegmentFromIdentifier(['A', 'B'], 1235)

    expect(segment).toEqual('B')
  })

  it('should return the segment A when last character of the string converted is even number', () => {
    // b = 1929301784 -> Segment A
    const segment = getSegmentFromIdentifier(['A', 'B'], '1960205e')

    expect(segment).toEqual('A')
  })

  it('should return the segment B when last character of the string converted is odd number', () => {
    // a = 4172329739 -> Segment B
    const segment = getSegmentFromIdentifier(['A', 'B'], '67e2373d')

    expect(segment).toEqual('B')
  })

  // Normally this case should not happen as we always provide an identifier but the typing allows it
  it('should return undefined when identifier is undefined', () => {
    const segment = getSegmentFromIdentifier(['A', 'B'])

    expect(segment).toEqual(undefined)
  })
})
