import flushPromises from 'flush-promises'

export async function flushAllPromises() {
  await flushPromises()
  return new Promise((resolve) => setImmediate(resolve))
}
