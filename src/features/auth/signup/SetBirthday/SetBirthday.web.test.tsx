import mockdate from 'mockdate'
import React from 'react'

import { render } from 'tests/utils/web'

import { SetBirthday } from './SetBirthday'

const CURRENT_DATE = new Date('2020-12-01T00:00:00.000Z')

const props = { goToNextStep: jest.fn(), signUp: jest.fn() }

jest.mock('features/auth/settings')

// eslint-disable-next-line local-rules/no-allow-console
allowConsole({ warn: true })

describe('<SetBirthday />', () => {
  beforeEach(() => {
    mockdate.set(CURRENT_DATE)
    jest.useFakeTimers()
  })

  describe('touch device', () => {
    it('should render correctly', () => {
      const renderAPI = render(<SetBirthday {...props} />, { theme: { isTouch: true } })
      expect(renderAPI).toMatchSnapshot()
    })
  })

  describe('no touch device', () => {
    it('should render correctly', () => {
      const renderAPI = render(<SetBirthday {...props} />, { theme: { isTouch: false } })
      expect(renderAPI).toMatchSnapshot()
    })
  })
})
