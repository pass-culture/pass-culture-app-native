import { find } from '../helpers/utils/selector'

export default class AppScreen {
  selector: string
  /** find selector is a cross platform selector
   * It use data-testid in web and testID in native
   */
  isFindSelector?: boolean
  constructor(selector: string, isFindSelector?: boolean) {
    this.selector = selector
    this.isFindSelector = isFindSelector
  }

  async waitForIsShown(): Promise<boolean | void> {
    return (this.isFindSelector ? find : $)(this.selector).waitForDisplayed({
      reverse: false,
    })
  }

  async waitForIsHidden(): Promise<boolean | void> {
    return (this.isFindSelector ? find : $)(this.selector).waitForDisplayed({
      reverse: true,
    })
  }
}
