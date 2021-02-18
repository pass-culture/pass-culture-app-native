import { renderHook } from '@testing-library/react-hooks'
import { act } from '@testing-library/react-native'
import { rest } from 'msw/'
import React from 'react'
import waitForExpect from 'wait-for-expect'

import { navigate } from '__mocks__/@react-navigation/native'
import { UserProfileResponse } from 'api/gen'
import { AuthContext } from 'features/auth/AuthContext'
import { env } from 'libs/environment'
import { storage } from 'libs/storage'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { server } from 'tests/server'
import { flushAllPromises } from 'tests/utils'

import { useEligibleCard } from './useEligibleCard'

afterEach(async () => {
  jest.clearAllMocks()
  await storage.clear('has_seen_eligible_card')
})

describe('useEligibleCard', () => {
  it('should read has_seen_eligible_card when loggedIn and continue if false, call /me and abort when showEligibleCard is false', async () => {
    simulateMustSkipEligibleCard()
    await storage.saveObject('has_seen_eligible_card', false)
    renderUseEligibleCardHook()

    await act(flushAllPromises)

    expect(await storage.readObject('has_seen_eligible_card')).toBe(false)
    expect(navigate).not.toBeCalledWith('EighteenBirthday')
  })

  it('should read has_seen_eligible_card when loggedIn and abort if true', async () => {
    await storage.saveObject('has_seen_eligible_card', true)
    renderUseEligibleCardHook()

    await act(flushAllPromises)

    expect(navigate).not.toBeCalledWith('EighteenBirthday')
  })

  it('should read has_seen_eligible_card when loggedIn and continue if false, call /me and redirect when showEligibleCard is true and set has_seen_eligible_card to true in storage', async () => {
    simulateMustShowEligibleCard()
    await storage.saveObject('has_seen_eligible_card', false)
    renderUseEligibleCardHook()

    await act(flushAllPromises)

    await waitForExpect(async () => {
      expect(await storage.readObject('has_seen_eligible_card')).toBe(true)
      expect(navigate).toBeCalledWith('EighteenBirthday')
    })
  })
})

function renderUseEligibleCardHook({ isLoggedIn } = { isLoggedIn: true }) {
  return renderHook(useEligibleCard, {
    wrapper: ({ children }) =>
      reactQueryProviderHOC(
        <AuthContext.Provider value={{ isLoggedIn, setIsLoggedIn: jest.fn() }}>
          {children}
        </AuthContext.Provider>
      ),
  })
}

export function simulateMustShowEligibleCard() {
  server.use(
    rest.get(env.API_BASE_URL + '/native/v1/me', (req, res, ctx) => {
      return res(
        ctx.status(200),
        ctx.json({
          showEligibleCard: true,
        } as UserProfileResponse)
      )
    })
  )
}

function simulateMustSkipEligibleCard() {
  server.use(
    rest.get(env.API_BASE_URL + '/native/v1/me', (req, res, ctx) => {
      return res(
        ctx.status(200),
        ctx.json({
          showEligibleCard: false,
        } as UserProfileResponse)
      )
    })
  )
}
