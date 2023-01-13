class Browser {
  async url(url: string) {
    const p = await browser.url(url)
    await browser.execute(() => {
      // @ts-ignore due to a bug with safaridriver not setting navigation.webdriver
      // this is only necessary for iOS Safari browser
      globalThis.window.webdriver = true
    })
    return p
  }
}

export default new Browser()
