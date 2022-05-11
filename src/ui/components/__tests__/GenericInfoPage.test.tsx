import React from 'react'

import { render } from 'tests/utils'
import { GenericInfoPage } from 'ui/components/GenericInfoPage'
import { BicolorPhonePending } from 'ui/svg/icons/BicolorPhonePending'

describe('<GenericInfoPage />', () => {
  it('should render correctly', () => {
    const renderAPI = render(<GenericInfoPage title="GenericInfoPage" icon={BicolorPhonePending} />)
    expect(renderAPI).toMatchSnapshot()
  })
})
