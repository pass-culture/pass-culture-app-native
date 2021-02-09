import { render, waitFor } from '@testing-library/react-native'
import React from 'react'

import {
  DotComponent,
  DotComponentProps,
} from 'features/firstLogin/tutorials/components/DotComponent'

describe('<DotComponent />', () => {
  it('should render correctly', async () => {
    const renderAPI = renderDotComponent()
    await waitFor(() => {
      expect(renderAPI).toMatchSnapshot()
    })
  })
  it('renders dot active color', async () => {
    const renderAPI = renderDotComponent({
      isActive: true,
    })
    await waitFor(() => {
      expect(renderAPI).toMatchSnapshot()
    })
  })
})

function renderDotComponent(props: DotComponentProps = {}) {
  return render(<DotComponent {...props} />)
}
