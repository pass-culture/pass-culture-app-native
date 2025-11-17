import React, { createElement, FunctionComponent, useState } from 'react'
import styled from 'styled-components/native'
import { v4 as uuidv4 } from 'uuid'

import { CheatcodesSubscreensButtonList } from 'cheatcodes/components/CheatcodesSubscreenButtonList'
import { CheatcodesTemplateScreen } from 'cheatcodes/components/CheatcodesTemplateScreen'
import { LinkToCheatcodesScreen } from 'cheatcodes/components/LinkToCheatcodesScreen'
import { MAX_ASYNC_TEST_REQ_COUNT, useErrorAsyncQuery } from 'cheatcodes/queries/useErrorAsyncQuery'
import { CheatcodeCategory } from 'cheatcodes/types'
import { NoContentError } from 'features/home/pages/NoContentError'
import { Maintenance } from 'features/maintenance/pages/Maintenance'
import { getCheatcodesHookConfig } from 'features/navigation/CheatcodesStackNavigator/getCheatcodesHookConfig'
import { useGoBack } from 'features/navigation/useGoBack'
import { useLogTypeFromRemoteConfig } from 'libs/hooks/useLogTypeFromRemoteConfig'
import { ScreenError } from 'libs/monitoring/errors'
import { Typo } from 'ui/theme'

const errorsCheatcodeCategory: CheatcodeCategory = {
  id: uuidv4(),
  title: 'Errors 👾',
  navigationTarget: {
    screen: 'CheatcodesStackNavigator',
    params: { screen: 'CheatcodesNavigationErrors' },
  },
  subscreens: [
    {
      id: uuidv4(),
      title: 'BannedCountryError',
      navigationTarget: { screen: 'BannedCountryError' },
    },
    { id: uuidv4(), title: 'Contentful KO error', showOnlyInSearch: true },
    { id: uuidv4(), title: 'Offre inexistante', showOnlyInSearch: true },
    { id: uuidv4(), title: 'Maintenance', showOnlyInSearch: true },
    { id: uuidv4(), title: 'Error rendering', showOnlyInSearch: true },
    { id: uuidv4(), title: 'Async error', showOnlyInSearch: true },
  ],
}

export const cheatcodesNavigationErrorsButtons: CheatcodeCategory[] = [errorsCheatcodeCategory]

// Define the component outside the render path to make it stable.
const MaintenanceScreenForCheatcode = () => (
  <Maintenance message="Some maintenance message that is set in Firestore" />
)

export const CheatcodesNavigationErrors: FunctionComponent = () => {
  const { goBack } = useGoBack(...getCheatcodesHookConfig('CheatcodesMenu'))
  const [renderedError, setRenderedError] = useState(undefined)
  const [screenError, setScreenError] = useState<ScreenError | undefined>(undefined)
  const [asyncTestReqCount, setAsyncTestReqCount] = useState(0)
  const { logType } = useLogTypeFromRemoteConfig()

  const { refetch: errorAsyncQuery, isFetching } = useErrorAsyncQuery(
    asyncTestReqCount,
    setAsyncTestReqCount
  )

  if (screenError) {
    throw screenError
  }

  const visibleSubscreens = errorsCheatcodeCategory.subscreens.filter(
    (subscreen) => !subscreen.showOnlyInSearch
  )

  return (
    <CheatcodesTemplateScreen title={errorsCheatcodeCategory.title} onGoBack={goBack}>
      <CheatcodesSubscreensButtonList buttons={visibleSubscreens} />

      <LinkToCheatcodesScreen
        button={{
          id: 'async-error-action',
          title:
            asyncTestReqCount < MAX_ASYNC_TEST_REQ_COUNT
              ? `${MAX_ASYNC_TEST_REQ_COUNT - asyncTestReqCount} erreurs asynchrones restantes`
              : 'OK',
          onPress: () => errorAsyncQuery(),
          disabled: isFetching || asyncTestReqCount >= MAX_ASYNC_TEST_REQ_COUNT,
        }}
        variant="secondary"
      />

      <LinkToCheatcodesScreen
        button={{
          id: 'contentful-error-action',
          title: 'Contentful KO error',
          onPress: () =>
            setScreenError(
              new ScreenError('Contentful error', {
                Screen: NoContentError,
                logType,
              })
            ),
        }}
        variant="secondary"
      />

      <LinkToCheatcodesScreen
        button={{
          id: 'non-existent-offer-action',
          title: 'Offre inexistante',
          navigationTarget: { screen: 'Offer', params: { id: 0, from: 'searchresults' } },
        }}
        variant="secondary"
      />

      <LinkToCheatcodesScreen
        button={{
          id: 'maintenance-error-action',
          title: 'Maintenance',
          onPress: () =>
            setScreenError(
              new ScreenError('Test maintenance page', {
                Screen: MaintenanceScreenForCheatcode,
                logType,
              })
            ),
        }}
        variant="secondary"
      />

      <LinkToCheatcodesScreen
        button={{
          id: 'rendering-error-action',
          title: 'Error rendering',
          onPress: () => {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-expect-error
            setRenderedError(createElement(CenteredText, { children: CenteredText })) // eslint-disable-line react/no-children-prop
          },
        }}
        variant="secondary"
      />
      {renderedError}
    </CheatcodesTemplateScreen>
  )
}

const CenteredText = styled(Typo.BodyAccentXs)({
  width: '100%',
  textAlign: 'center',
})
