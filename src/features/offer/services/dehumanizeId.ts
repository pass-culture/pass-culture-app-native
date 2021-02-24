import { decode, encode } from 'hi-base32'

export const dehumanizeId = (humanId: string) => {
  try {
    return byteArrayToInt(decode.asBytes(humanId.replace(/8/g, 'O').replace(/9/g, 'I')))
  } catch {
    return null
  }
}

const byteArrayToInt = (bytes: number[]) =>
  bytes.reduce((result, byte, index) => result + byte * Math.pow(256, bytes.length - 1 - index), 0)

const intToByteArray = (x: number): number[] => [x << 8, x << 16, x << 24].map((z) => z >>> 24)

export const humanizeId = (dehumanizedId: number) => {
  try {
    return encode(intToByteArray(dehumanizedId))
      .replace(/O/g, '8')
      .replace(/I/g, '9')
      .replace(/=/g, '')
  } catch {
    return null
  }
}
