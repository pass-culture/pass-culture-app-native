import React from 'react'

import { DeeplinkItem } from 'features/internal/atoms/DeeplinkItem'
import { GeneratedDeeplink } from 'features/internal/components/DeeplinksGeneratorForm'
import { act, fireEvent, render, screen } from 'tests/utils/web'
import { SNACK_BAR_TIME_OUT } from 'ui/components/snackBar/SnackBarContext'

const writeText = jest.fn()
const mockShowSuccessSnackBar = jest.fn()
const mockShowErrorSnackBar = jest.fn()
jest.mock('ui/components/snackBar/SnackBarContext', () => ({
  useSnackBarContext: () => ({
    showSuccessSnackBar: mockShowSuccessSnackBar,
    showErrorSnackBar: mockShowErrorSnackBar,
  }),
}))

Object.assign(navigator, {
  clipboard: {
    writeText,
  },
})

jest.mock('libs/firebase/analytics/analytics')

describe('<DeeplinkItem />', () => {
  const deeplink: GeneratedDeeplink = {
    firebaseLink: 'https://firebaseLink',
    universalLink: 'https://universalLink',
  }

  it('should copy the universal link to clipboard', async () => {
    render(<DeeplinkItem deeplink={deeplink} />)

    await act(() => fireEvent.click(screen.getByLabelText('Copier')))

    expect(writeText).toHaveBeenCalledWith(deeplink.universalLink)
    expect(mockShowSuccessSnackBar).toHaveBeenCalledWith({
      message: 'Copié\u00a0!',
      timeout: SNACK_BAR_TIME_OUT,
    })
  })

  it('should copy the firebase link to clipboard', async () => {
    render(<DeeplinkItem deeplink={deeplink} />)

    await act(() => fireEvent.click(screen.getByLabelText('Copier dans le presse-papier')))

    expect(writeText).toHaveBeenCalledWith(deeplink.firebaseLink)
    expect(mockShowSuccessSnackBar).toHaveBeenCalledWith({
      message: 'Copié\u00a0!',
      timeout: SNACK_BAR_TIME_OUT,
    })
  })
})
