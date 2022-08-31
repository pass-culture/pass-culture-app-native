import React from 'react'

import { CookiesDetails } from 'features/cookies/pages/CookiesDetails'
import { render } from 'tests/utils'

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
    expect(renderAPI).toMatchSnapshot()
  })
})
