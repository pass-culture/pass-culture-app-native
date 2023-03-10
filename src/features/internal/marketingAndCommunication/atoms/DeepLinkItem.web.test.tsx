import React from 'react'

import { DeeplinkItem } from 'features/internal/marketingAndCommunication/atoms/DeeplinkItem'
import { GeneratedDeeplink } from 'features/internal/marketingAndCommunication/components/DeeplinksGeneratorForm'
import { fireEvent, render, screen } from 'tests/utils/web'
import {
  hideSnackBar,
  showErrorSnackBar,
  showInfoSnackBar,
  showSuccessSnackBar,
} from 'ui/components/snackBar/__mocks__/SnackBarContext'
import { SNACK_BAR_TIME_OUT, useSnackBarContext } from 'ui/components/snackBar/SnackBarContext'

const writeText = jest.fn()
const mockedUseSnackBarContext = useSnackBarContext as jest.MockedFunction<
  typeof useSnackBarContext
>

jest.mock('ui/components/snackBar/SnackBarContext', () => ({
  useSnackBarContext: jest.fn(() => ({})),
}))

Object.assign(navigator, {
  clipboard: {
    writeText,
  },
})

describe('<DeeplinkItem />', () => {
  const deeplink: GeneratedDeeplink = {
    firebaseLink: 'https://firebaseLink',
    universalLink: 'https://universalLink',
  }

  beforeEach(() => {
    mockedUseSnackBarContext.mockReturnValue({
      hideSnackBar,
      showInfoSnackBar,
      showSuccessSnackBar,
      showErrorSnackBar,
    })
  })

  it('should copy the universal link to clipboard', () => {
    render(<DeeplinkItem deeplink={deeplink} />)

    fireEvent.click(screen.getByTestId('Copier'))

    expect(writeText).toBeCalledWith(deeplink.universalLink)
    expect(showSuccessSnackBar).toBeCalledWith({
      message: `${deeplink.universalLink} à été copié dans ton press-papier\u00a0!`,
      timeout: SNACK_BAR_TIME_OUT,
    })
  })

  it('should copy the firebase link to clipboard', () => {
    render(<DeeplinkItem deeplink={deeplink} />)

    fireEvent.click(screen.getByTestId('Copier dans le presse-papier'))

    expect(writeText).toBeCalledWith(deeplink.firebaseLink)
    expect(showSuccessSnackBar).toBeCalledWith({
      message: `${deeplink.firebaseLink} à été copié dans ton press-papier\u00a0!`,
      timeout: SNACK_BAR_TIME_OUT,
    })
  })
})
