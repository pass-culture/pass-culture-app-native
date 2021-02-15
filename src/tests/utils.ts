import flushPromises from 'flush-promises'

export async function flushAllPromises() {
  await flushPromises()
  return new Promise((resolve) => setImmediate(resolve))
}

/**
  __Warning__ : avoid usage of this function as much as possible.
  
  Usecase : when you get the "state update not wrapped in act" warning 
  no matter what you do.
  @param times number of times you want to call `flushAllPromises()`. Increment `times` until the warning disappears.
*/
export async function flushAllPromisesTimes(times: number) {
  for (let i = 0; i < times; i++) {
    await flushAllPromises()
  }
}
