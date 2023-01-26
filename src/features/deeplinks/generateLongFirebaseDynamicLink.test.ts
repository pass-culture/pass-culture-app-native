import { env } from 'libs/environment'

import { generateLongFirebaseDynamicLink } from './generateLongFirebaseDynamicLink'

describe('Formatting deeplink url', () => {
  afterAll(() => jest.resetAllMocks())

  const longDynamicLinkURI = 'apn=app.android&isi=1557887412&ibi=app.ios&efr=1'
  const FIREBASE_DYNAMIC_LINK_URL = 'https://passcultureapptesting.page.link'

  describe('generateLongFirebaseDynamicLink', () => {
    it('should return a format long firebase dynamic link', () => {
      const fullWebAppUrlWithParams = 'https://web.example.com/offre/1'
      const encodedFullWebAppUrlWithParams = 'https%3A%2F%2Fweb.example.com%2Foffre%2F1'
      const dynamicLink = generateLongFirebaseDynamicLink(fullWebAppUrlWithParams)
      expect(dynamicLink).toEqual(
        `${FIREBASE_DYNAMIC_LINK_URL}/?link=${encodedFullWebAppUrlWithParams}&${longDynamicLinkURI}`
      )
    })
  })

  describe('generateLongFirebaseDynamicLink with extra FDL params', () => {
    it('should return a format long firebase dynamic link', () => {
      const fullWebAppUrlWithParams = 'https://web.example.com/set-email'
      const encodedFullWebAppUrlWithParams = 'https%3A%2F%2Fweb.example.com%2Fset-email'
      const ofl = `https://${env.WEBAPP_V2_DOMAIN}/set-email`
      const amv = '10160005'
      const extraParams = {
        ofl,
        amv,
      }
      const dynamicLink = generateLongFirebaseDynamicLink(fullWebAppUrlWithParams, extraParams)
      expect(dynamicLink).toEqual(
        `${FIREBASE_DYNAMIC_LINK_URL}/?link=${encodedFullWebAppUrlWithParams}&${longDynamicLinkURI}&ofl=https://webapp-v2.example.com/set-email&amv=10160005`
      )
    })
  })
})
