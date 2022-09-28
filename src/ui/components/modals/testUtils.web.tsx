export { render } from 'tests/utils/web'

import { fireEvent as fireEventDOM } from 'tests/utils/web'

// standardize API between web and native
// https://github.com/testing-library/dom-testing-library/blob/1fc17bec5d28e5b58fcdd325d6d2caaff02dfb47/types/events.d.ts#L94
// https://github.com/callstack/react-native-testing-library/blob/c42bae123d69375e27b94ff0329380a13e31e87b/typings/index.d.ts#L365
export const fireEvent = {
  press: fireEventDOM.click,
}
