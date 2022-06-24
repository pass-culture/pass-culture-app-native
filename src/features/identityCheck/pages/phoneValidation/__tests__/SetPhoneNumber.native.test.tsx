import React from 'react'

import { SetPhoneNumber } from 'features/identityCheck/pages/phoneValidation/SetPhoneNumber'
import { render, waitFor } from 'tests/utils'
import * as useModalAPI from 'ui/components/modals/useModal'

describe('SetPhoneNumber', () => {
  // FIXME(anoukhello) find a way to get snapshot with modal animation
  // when keeping visible to true, snapshot is different on every test run on modal animation props opacity and translateY
  it('should match snapshot without modal appearance', async () => {
    jest.spyOn(useModalAPI, 'useModal').mockReturnValueOnce({
      visible: false,
      showModal: jest.fn(),
      hideModal: jest.fn(),
      toggleModal: jest.fn(),
    })
    const SetPhoneNumberPage = render(<SetPhoneNumber />)
    await waitFor(() => expect(SetPhoneNumberPage).toMatchSnapshot())
  })

  it('should show modal on first render', async () => {
    const { getByText } = render(<SetPhoneNumber />)
    await waitFor(() => expect(getByText("J'ai compris")).toBeTruthy())
  })

  // TODO PC-14869 : implement the check that modal is visible when going to SetPhoneValiditationCode then using GoBack
})
