import React from 'react'

import { navigate } from '__mocks__/@react-navigation/native'
import { AgeSelection } from 'features/tutorial/pages/AgeSelection'
import { analytics } from 'libs/analytics'
import { storage } from 'libs/storage'
import { fireEvent, render, waitFor } from 'tests/utils'

const AGES = [15, 16, 17, 18]

jest.mock('features/navigation/navigationRef')

describe('AgeSelection', () => {
  beforeEach(async () => {
    await storage.clear('user_age')
  })

  it('should render correctly', () => {
    const renderAPI = render(<AgeSelection />)
    expect(renderAPI).toMatchSnapshot()
  })

  it.each(AGES)(
    'should navigate to AgeInformation page with params age=%s when pressing "j’ai %s ans"',
    async (age) => {
      const { getByText } = render(<AgeSelection />)
      const button = getByText(`${age} ans`)

      fireEvent.press(button)

      await waitFor(() => {
        expect(navigate).toHaveBeenCalledWith('AgeInformation', { age })
      })
    }
  )

  it('should navigate to AgeSelectionOther page when pressing "Autre"', async () => {
    const { getByText } = render(<AgeSelection />)
    const button = getByText('Autre')

    fireEvent.press(button)
    await waitFor(() => {
      expect(navigate).toHaveBeenCalledWith('AgeSelectionOther', undefined)
    })
  })

  it.each(AGES)('should log analytics with params age=%s when pressing "j’ai %s ans"', (age) => {
    const { getByText } = render(<AgeSelection />)
    const button = getByText(`${age} ans`)

    fireEvent.press(button)
    expect(analytics.logSelectAge).toHaveBeenCalledWith(age)
  })

  it('should log analytics when pressing "Autre"', () => {
    const { getByText } = render(<AgeSelection />)
    const button = getByText('Autre')

    fireEvent.press(button)
    expect(analytics.logSelectAge).toHaveBeenCalledWith('other')
  })

  it.each(AGES)(
    'should set user age to %s in local storage  when pressing "j’ai %s ans"',
    async (age) => {
      const { getByText } = render(<AgeSelection />)
      const button = getByText(`${age} ans`)

      fireEvent.press(button)
      const userAge = await storage.readObject('user_age')
      expect(userAge).toBe(age)
    }
  )
})
