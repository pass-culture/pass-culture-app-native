import { act } from 'tests/utils'

// Function to ensure that all background promises and state updates have a chance to complete before your test makes its assertions.
// `new Promise((resolve) => setTimeout(resolve, 0))`: trick to "yield to the event loop."
export async function waitForPromiseResolution() {
  await act(async () => {
    await new Promise((resolve) => setTimeout(resolve, 0))
  })
}
