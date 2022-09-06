import React from 'react'
import waitForExpect from 'wait-for-expect'

import { mockGoBack } from 'features/navigation/__mocks__/useGoBack'
import * as Share from 'libs/share/shareApp/shareApp'
import { ShareAppModal } from 'libs/share/shareApp/ShareAppModal'
import { render } from 'tests/utils'

const shareApp = jest.spyOn(Share, 'shareApp').mockResolvedValue()

describe('<ShareAppModal />', () => {
  it('should goBack to previous page and display native share modal', async () => {
    render(<ShareAppModal />)

    await waitForExpect(async () => {
      expect(shareApp).toBeCalled()
      expect(mockGoBack).toBeCalled()
    })
  })
})
