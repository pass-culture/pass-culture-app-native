import React from 'react'

import { render } from 'tests/utils'
import { GenericInfoPageWhite } from 'ui/pages/GenericInfoPageWhite'
import { BicolorPhonePending } from 'ui/svg/icons/BicolorPhonePending'

describe('<GenericInfoPageWhite />', () => {
  it('should render correctly', () => {
    const renderAPI = render(
      <GenericInfoPageWhite title="GenericInfoPageWhite" icon={BicolorPhonePending} />
    )
    expect(renderAPI).toMatchSnapshot()
  })
})
