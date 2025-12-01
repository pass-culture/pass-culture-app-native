import { getSegmentFromIdentifier } from 'shared/useABSegment/getSegmentFromIdentifier'

describe('getSegmentFromIdentifier', () => {
  it('should return the segment A when identifier is even number', () => {
    const segment = getSegmentFromIdentifier(1234)

    expect(segment).toEqual('A')
  })

  it('should return the segment B when identifier is odd number', () => {
    const segment = getSegmentFromIdentifier(1235)

    expect(segment).toEqual('B')
  })

  it('should return the segment A when last character of the string converted is even number', () => {
    // b = 98 -> Segment A
    const segment = getSegmentFromIdentifier('ad7b7b5a169641e27cadbdb35adad9c4ca23099b')

    expect(segment).toEqual('A')
  })

  it('should return the segment B when last character of the string converted is odd number', () => {
    // a = 97 -> Segment B
    const segment = getSegmentFromIdentifier('ad7b7b5a169641e27cadbdb35adad9c4ca23099a')

    expect(segment).toEqual('B')
  })

  // Normally this case should not happen as we always provide an identifier but the typing allows it
  it('should return the segment B when identifier is undefined', () => {
    const segment = getSegmentFromIdentifier()

    expect(segment).toEqual('B')
  })
})
