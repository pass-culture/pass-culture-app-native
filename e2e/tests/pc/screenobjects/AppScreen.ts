import { find } from '../helpers/utils/selector'

export default class AppScreen {
  selector: string
  /** find selector is a cross platform selector
   * It use data-testid in web and testID in native
   */
  isCrossPlatformSelector?: boolean
  constructor(selector: string, isCrossPlatformSelector?: boolean) {
    this.selector = selector
    this.isCrossPlatformSelector = isCrossPlatformSelector
  }

  async waitForIsShown(): Promise<boolean | void> {
    return (this.isCrossPlatformSelector ? find : $)(this.selector).waitForDisplayed()
  }

  async waitForIsHidden(): Promise<boolean | void> {
    return (this.isCrossPlatformSelector ? find : $)(this.selector).waitForDisplayed({
      reverse: true,
    })
  }
}
