import { decode } from 'hi-base32'

export const dehumanizeId = (humanId: string) => {
  try {
    return byteArrayToInt(decode.asBytes(humanId.replace(/8/g, 'O').replace(/9/g, 'I')))
  } catch {
    return null
  }
}

const byteArrayToInt = (bytes: number[]) => {
  return bytes.reduce(
    (result, byte, index) => result + byte * Math.pow(256, bytes.length - 1 - index),
    0
  )
}
