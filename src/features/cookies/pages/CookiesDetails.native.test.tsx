import React from 'react'

import { CookiesDetails } from 'features/cookies/pages/CookiesDetails'
import { flushAllPromisesWithAct, render } from 'tests/utils'

const mockSettings = jest.fn().mockReturnValue({ data: { appEnableCookiesV2: true } })
jest.mock('features/auth/settings', () => ({
  useAppSettings: jest.fn(() => mockSettings()),
}))

jest.mock('features/profile/api')

describe('<CookiesDetails/>', () => {
  it('should render correctly', async () => {
    const renderAPI = render(
      <CookiesDetails
        settingsCookiesChoice={{
          marketing: false,
          performance: false,
          customization: false,
        }}
        setSettingsCookiesChoice={() => null}
      />
    )
    await flushAllPromisesWithAct()

    expect(renderAPI).toMatchSnapshot()
  })
})
