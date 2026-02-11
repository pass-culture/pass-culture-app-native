import React from 'react'

import { DeeplinkItem } from 'features/internal/atoms/DeeplinkItem'
import { render, screen, fireEvent, waitFor } from 'tests/utils/web'

const writeText = jest.fn()

Object.assign(navigator, {
  clipboard: {
    writeText,
  },
})

jest.mock('libs/firebase/analytics/analytics')

describe('<DeeplinkItem />', () => {
  it('should copy the universal link to clipboard', async () => {
    render(<DeeplinkItem universalLink="https://universalLink" />)

    const copyButton = screen.getByLabelText('Copier')
    fireEvent.click(copyButton)

    await waitFor(() => {
      expect(writeText).toHaveBeenCalledWith('https://universalLink')
    })

    expect(screen.getByTestId('snackbar-success')).toBeInTheDocument()
    expect(screen.getByText(/Copié/)).toBeInTheDocument()
  })
})
