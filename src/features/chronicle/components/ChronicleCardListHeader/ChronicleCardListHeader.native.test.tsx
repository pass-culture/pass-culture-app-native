import React from 'react'

import { ChronicleCardListHeader } from 'features/chronicle/components/ChronicleCardListHeader/ChronicleCardListHeader'
import { render, screen, userEvent } from 'tests/utils'
import * as useModal from 'ui/components/modals/useModal'

const user = userEvent.setup()

jest.useFakeTimers()

describe('<ChronicleCardListHeader />', () => {
  it('should display correctly', () => {
    render(<ChronicleCardListHeader />)

    expect(screen.getByText('Tous les avis')).toBeOnTheScreen()
  })

  it('should open chronicle modal when pressing "Qui écrit les avis ?" button', async () => {
    const mockShowModal = jest.fn()
    jest.spyOn(useModal, 'useModal').mockReturnValueOnce({
      visible: false,
      showModal: mockShowModal,
      hideModal: jest.fn(),
      toggleModal: jest.fn(),
    })
    render(<ChronicleCardListHeader />)

    await user.press(screen.getByText('Qui écrit les avis ?'))

    expect(mockShowModal).toHaveBeenCalledTimes(1)
  })
})
