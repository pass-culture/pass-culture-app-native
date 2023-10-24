import React from 'react'

import { render, screen } from 'tests/utils'
import { SupportedBrowsersGate } from 'web/SupportedBrowsersGate'

const defaultDeviceMock: Record<string, unknown> = {
  __esModule: true,
  isChrome: false,
  isMobileSafari: false,
  isSafari: false,
  isFirefox: false,
  isEdge: false,
  isSamsungBrowser: false,
  browserName: 'none',
}
jest.mock('react-device-detect', () => defaultDeviceMock)

describe('SupportedBrowsersGate', () => {
  it('render correctly', () => {
    render(<SupportedBrowsersGate />)

    expect(screen).toMatchSnapshot()
  })

  describe.each`
    browserProperty       | browserName        | minimalSupportedVersion
    ${'isChrome'}         | ${'Chrome'}        | ${50}
    ${'isMobileSafari'}   | ${'Mobile Safari'} | ${12}
    ${'isSafari'}         | ${'Safari'}        | ${10}
    ${'isFirefox'}        | ${'Firefox'}       | ${55}
    ${'isEdge'}           | ${'Edge'}          | ${79}
    ${'isSamsungBrowser'} | ${'Samsung'}       | ${5}
    ${'isInstagram'}      | ${'Instagram'}     | ${200}
    ${'isBrave'}          | ${'Brave'}         | ${98}
    ${'isChromium'}       | ${'Chromium'}      | ${0}
  `(
    '$browserName v$minimalSupportedVersion',
    ({ browserProperty, browserName, minimalSupportedVersion }) => {
      beforeAll(() => {
        defaultDeviceMock[browserProperty] = true
        defaultDeviceMock.browserName = browserName
      })

      afterAll(() => {
        defaultDeviceMock[browserProperty] = false
        defaultDeviceMock.browserName = 'none'
        defaultDeviceMock.browserVersion = undefined
      })

      it(`should support ${browserName} for versions ${minimalSupportedVersion} and above`, () => {
        defaultDeviceMock.browserVersion = minimalSupportedVersion

        render(<SupportedBrowsersGate />)

        expect(
          screen.queryByText(
            `Oups ! Nous ne pouvons afficher correctement l’application car ton navigateur (${browserName} v${minimalSupportedVersion}) n’est pas à jour`
          )
        ).not.toBeOnTheScreen()
      })

      it(`should not support ${browserName} for versions below ${minimalSupportedVersion}`, () => {
        const unsupportedVersion = minimalSupportedVersion - 1
        defaultDeviceMock.browserVersion = unsupportedVersion

        render(<SupportedBrowsersGate />)

        expect(
          screen.getByText(
            `Oups ! Nous ne pouvons afficher correctement l’application car ton navigateur (${browserName} v${unsupportedVersion}) n’est pas à jour`
          )
        ).toBeOnTheScreen()
      })
    }
  )
})
