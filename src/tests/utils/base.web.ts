// eslint-disable-next-line no-restricted-imports
import { fireEvent as testingLibFireEvent } from '@testing-library/react'
export { act, cleanup, render, waitFor } from '@testing-library/react'
export type { RenderOptions } from '@testing-library/react'

export const fireEvent = {
  ...testingLibFireEvent,
  changeText: (element: Document | Node | Element | Window, value: string | number) =>
    testingLibFireEvent.change(element, { target: { value } }),
  press: testingLibFireEvent.click,
}
