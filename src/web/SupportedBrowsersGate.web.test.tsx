import React from 'react'
// eslint-disable-next-line no-restricted-imports
import * as DeviceDetect from 'react-device-detect'

import { render, screen } from 'tests/utils/web'
import { SupportedBrowsersGate } from 'web/SupportedBrowsersGate'

describe('SupportedBrowsersGate', () => {
  it('render correctly', () => {
    const { container } = render(<SupportedBrowsersGate />)

    expect(container).toMatchSnapshot()
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
      const currentbrowserName: string = browserName
      const currentMinimalSupportedVersion: number = minimalSupportedVersion

      beforeAll(() => {
        browserProperty in DeviceDetect && jest.replaceProperty(DeviceDetect, browserProperty, true)
        jest.replaceProperty(DeviceDetect, 'browserName', currentbrowserName)
      })

      afterAll(() => {
        browserProperty in DeviceDetect &&
          jest.replaceProperty(DeviceDetect, browserProperty, false)
        jest.replaceProperty(DeviceDetect, 'browserName', 'none')
        jest.replaceProperty(DeviceDetect, 'browserVersion', '')
      })

      it(`should support ${currentbrowserName} for versions ${currentMinimalSupportedVersion} and above`, () => {
        jest.replaceProperty(DeviceDetect, 'browserVersion', String(currentMinimalSupportedVersion))

        render(<SupportedBrowsersGate />)

        expect(
          screen.queryByText(
            `Oups ! Nous ne pouvons afficher correctement l’application car ton navigateur (${currentbrowserName} v${currentMinimalSupportedVersion}) n’est pas à jour`
          )
        ).not.toBeInTheDocument()
      })

      it(`should not support ${currentbrowserName} for versions below ${currentMinimalSupportedVersion}`, () => {
        const unsupportedVersion = currentMinimalSupportedVersion - 1
        jest.replaceProperty(DeviceDetect, 'browserVersion', unsupportedVersion.toString())

        render(<SupportedBrowsersGate />)

        expect(
          screen.getByText(
            `Oups ! Nous ne pouvons afficher correctement l’application car ton navigateur (${currentbrowserName} v${unsupportedVersion}) n’est pas à jour`
          )
        ).toBeInTheDocument()
      })
    }
  )
})
