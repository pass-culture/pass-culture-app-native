import { $$$ } from '../helpers/utils/selector'

export default class AppScreen {
  selector: string
  /** $$$ selector is a cross platform selector
   * It use data-testid in web and testID in native
   */
  is$$$selector?: boolean
  constructor(selector: string, is$$$selector?: boolean) {
    this.selector = selector
    this.is$$$selector = is$$$selector
  }

  async waitForIsShown(): Promise<boolean | void> {
    return (this.is$$$selector ? $$$ : $)(this.selector).waitForDisplayed({
      reverse: false,
    })
  }

  async waitForIsHidden(): Promise<boolean | void> {
    return (this.is$$$selector ? $$$ : $)(this.selector).waitForDisplayed({
      reverse: true,
    })
  }
}
