export const INITIAL_LIST_SIZE = 6
export const STEP_LIST_INCREMENT = 3

export const expandList = <T>(
  list: T[],
  previousLen: number,
  increaseLen = STEP_LIST_INCREMENT
): number => Math.min(list.length, previousLen + increaseLen)

export const getListToDisplay = <T>(list: T[], len: number) => list.slice(0, len)

export const hasReachedEnd = <T>(list: T[], len: number) => list.length <= len
