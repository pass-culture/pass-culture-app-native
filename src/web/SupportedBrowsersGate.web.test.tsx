import React from 'react'
// eslint-disable-next-line no-restricted-imports
import * as DeviceDetect from 'react-device-detect'

import { render, screen } from 'tests/utils/web'
import { SupportedBrowsersGate } from 'web/SupportedBrowsersGate.web'

describe('SupportedBrowsersGate', () => {
  describe.each`
    browserName  | minimalSupportedVersion
    ${'Chrome'}  | ${80}
    ${'Firefox'} | ${80}
    ${'Edge'}    | ${80}
    ${'Safari'}  | ${14}
  `('$browserName v$minimalSupportedVersion', ({ browserName, minimalSupportedVersion }) => {
    const currentbrowserName: string = browserName
    const currentMinimalSupportedVersion: number = minimalSupportedVersion

    beforeAll(() => {
      jest.replaceProperty(DeviceDetect, 'browserName', currentbrowserName)
    })

    afterAll(() => {
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
  })
})
