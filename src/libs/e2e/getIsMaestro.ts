import { getIsMaestroNotMemoized } from './getIsMaestroNotMemoized'

let memo: boolean | undefined = undefined

export const getIsMaestro = async () => {
  if (memo === undefined) {
    memo = await getIsMaestroNotMemoized()
  }

  return memo
}
