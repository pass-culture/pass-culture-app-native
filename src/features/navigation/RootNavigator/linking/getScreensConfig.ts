import { PathConfigMap } from '@react-navigation/native'
import { ComponentType } from 'react'

import { AllNavParamList } from 'features/navigation/RootNavigator'
import { TabRoute } from 'features/navigation/TabBar/types'

import { Route } from '../types'

import { getScreenComponent } from './getScreenComponent'

type AnyScreen = keyof AllNavParamList

export function getScreensAndConfig(
  routes: Route[] | TabRoute[],
  ScreenComponent: ComponentType<any> // eslint-disable-line @typescript-eslint/no-explicit-any
) {
  const screensConfig: PathConfigMap<AllNavParamList> = {}
  const Screens: JSX.Element[] = []
  routes.forEach((route) => {
    const { name, path, deeplinkPaths, pathConfig } = route
    if (path && pathConfig) {
      throw new Error(`Screen ${name}: you cannot declare both path and pathConfig`)
    }
    if (!path && !pathConfig) {
      throw new Error(`Screen ${name}: you have to declare either path or pathConfig`)
    }
    if (path) {
      screensConfig[name] = { path }
      Screens.push(getScreenComponent(name, route, ScreenComponent))
      deeplinkPaths?.forEach((p, idx) => {
        const deeplinkName = getPrivateScreenName(`${name}${idx + 1}`) as AnyScreen
        screensConfig[deeplinkName] = { path: p }
        Screens.push(getScreenComponent(deeplinkName, route, ScreenComponent))
      })
    } else if (pathConfig) {
      const { deeplinkPaths: deeplinkPathsFromPathConfig, ...restOfPathConfig } = pathConfig
      screensConfig[name] = restOfPathConfig
      Screens.push(getScreenComponent(name, route, ScreenComponent))
      deeplinkPathsFromPathConfig?.forEach((p, idx) => {
        const deeplinkName = getPrivateScreenName(`${name}${idx + 1}`) as AnyScreen
        screensConfig[deeplinkName] = { ...restOfPathConfig, path: p }
        Screens.push(getScreenComponent(deeplinkName, route, ScreenComponent))
      })
    }
  })
  return { screensConfig, Screens }
}

const PRIVATE_SCREEN_PREFIX = '_DeeplinkOnly'

function getPrivateScreenName(name: string): string {
  return PRIVATE_SCREEN_PREFIX + name
}

export function isPrivateScreen(name: string): boolean {
  return name.startsWith(PRIVATE_SCREEN_PREFIX)
}
