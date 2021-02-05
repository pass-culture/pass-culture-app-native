import { createStackNavigator } from '@react-navigation/stack'
import { ComponentType } from 'react'

import { AcceptCgu } from 'features/auth/signup/AcceptCgu'
import { AccountCreated } from 'features/auth/signup/AccountCreated'

import { wrapRoute } from './RootNavigator'
import { Route } from './types'

jest.mock('@react-navigation/stack', () => {
  const callback = jest.fn()
  return {
    TransitionPresets: {},
    createStackNavigator: () => {
      Object.assign(cb, {
        Screen: () => null,
      })
      cb()
      return cb
    },
  }
})

jest.mock('@react-navigation/bottom-tabs', () => {
  return {
    createBottomTabNavigator: jest.fn(),
  }
})

describe('RootNavigator utils', () => {
  let hoc: () => ComponentType<any> // eslint-disable-line @typescript-eslint/no-explicit-any
  let routeWithHoc: Route
  let routeWithoutHoc: Route
  beforeEach(() => {
    hoc = jest.fn()
    routeWithHoc = {
      name: 'AcceptCgu',
      component: AcceptCgu,
      hoc: hoc,
    }
    routeWithoutHoc = {
      name: 'AccountCreated',
      component: AccountCreated,
    }
  })
  it('should create stack navigator', () => {
    expect(createStackNavigator()).toHaveBeenCalled()
  })
  it('should wrap a route when declared with hocs wrapper', () => {
    wrapRoute(routeWithHoc)
    expect(hoc).toHaveBeenCalledWith(AcceptCgu)
  })
  it('should not wrap a route when not declared with hocs wrapper', () => {
    wrapRoute(routeWithoutHoc)
    expect(hoc).not.toHaveBeenCalledWith(AccountCreated)
  })
})
