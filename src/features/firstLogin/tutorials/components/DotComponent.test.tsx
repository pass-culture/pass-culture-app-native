import { render } from '@testing-library/react-native'
import React from 'react'

import { DotComponent } from 'features/firstLogin/tutorials/components/DotComponent'

describe('<DotComponent />', () => {
  it('should render correctly', () => {
    const renderAPI = renderDotComponent()
    expect(renderAPI).toMatchSnapshot()
  })
  it('renders dot active color', () => {
    const renderAPI = renderDotComponent({
      isActive: true,
    })
    expect(renderAPI).toMatchSnapshot()
  })
})

function renderDotComponent(props = {}) {
  return render(<DotComponent {...props} />)
}
