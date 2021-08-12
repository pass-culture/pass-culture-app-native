import { useNavigation } from '@react-navigation/native'
import { useCallback } from 'react'

import { UseNavigationType } from 'features/navigation/RootNavigator'
import { routes as rootNavigatorRoutes } from 'features/navigation/RootNavigator/routes'
import { routes as tabBarRoutes } from 'features/navigation/TabBar/routes'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type StringifyConfig = { [key: string]: (value: any) => string }

export const useSetParamsWithStringifier = (screenName: string) => {
  const navigation = useNavigation<UseNavigationType>()

  return useCallback(
    (routeParams) => {
      const route = {
        name: screenName,
        params: routeParams,
      }
      const options = {
        [screenName]: [...rootNavigatorRoutes, ...tabBarRoutes].find(
          (route) => route.name === screenName
        )?.pathConfig,
      }
      const config =
        options[route.name] !== undefined
          ? (options[route.name] as { stringify?: StringifyConfig }).stringify
          : undefined

      const params = route.params
        ? // Stringify all of the param values before we use them
          Object.entries(route.params).reduce<{
            [key: string]: string
          }>((acc, [key, value]) => {
            acc[key] = config && config[key] ? config[key](value) : String(value)
            return acc
          }, {})
        : undefined

      navigation.setParams(route.params as Record<string, unknown>)
    },
    [screenName]
  )
}
