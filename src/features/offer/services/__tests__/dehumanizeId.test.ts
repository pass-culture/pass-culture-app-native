import { dehumanizeId, humanizeId } from '../dehumanizeId'

interface HumToDehumTest {
  humanizedId: string
  dehumanizedId: number
}

describe('dehumanizeId', () => {
  it.each`
    humanizedId | dehumanizedId
    ${'AHEHK'}  | ${116853}
    ${'AHD3Q'}  | ${116664}
    ${'AHD3G'}  | ${116659}
    ${'AHD3C'}  | ${116657}
    ${'AGHYA'}  | ${102272}
    ${'A98K8'}  | ${138407}
  `(
    'a given humanizedId: $humanizedId becomes a dehumanizedId: $dehumanizedId',
    ({ dehumanizedId, humanizedId }: HumToDehumTest) => {
      expect(dehumanizeId(humanizedId)).toBe(dehumanizedId)
      expect(humanizeId(dehumanizedId)).toBe(humanizedId)
    }
  )

  it.each`
    dehumanizedId | humanizedId
    ${27101402}   | ${'AG8YRWQ'}
    ${116}        | ${'8Q'}
    ${116853}     | ${'AHEHK'}
    ${116664}     | ${'AHD3Q'}
    ${116659}     | ${'AHD3G'}
    ${116657}     | ${'AHD3C'}
    ${6303845}    | ${'MAYGK'}
    ${116659}     | ${'AHD3G'}
  `(
    'a given dehumanizedId: $dehumanizedId becomes a humanizedId: $humanizedId',
    ({ dehumanizedId, humanizedId }: HumToDehumTest) => {
      expect(humanizeId(dehumanizedId)).toBe(humanizedId)
      expect(dehumanizeId(humanizedId)).toBe(dehumanizedId)
    }
  )
})
