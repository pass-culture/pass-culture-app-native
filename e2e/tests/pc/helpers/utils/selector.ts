import { flags } from './platform'

// If possible, try to improve use this: https://webdriver.io/docs/customcommands/
// We need to succeed to configure this globalThis, typing through before(){} in the wdio.shared.conf.ts
// So we can remove the import of this selector every time we use it.
export function $$$(selector: string) {
  return $(flags.isWeb ? `[data-testid="${selector}"]` : `~${selector}`)
}
