import { useNavigation } from '@react-navigation/native'
import React, { createElement, FunctionComponent, useState } from 'react'
import { useQuery } from 'react-query'
import styled from 'styled-components/native'

import { CheatcodesTemplateScreen } from 'cheatcodes/components/CheatcodesTemplateScreen'
import { LinkToScreen } from 'cheatcodes/components/LinkToScreen'
import { NoContentError } from 'features/home/pages/NoContentError'
import { Maintenance } from 'features/maintenance/pages/Maintenance'
import { UseNavigationType } from 'features/navigation/RootNavigator/types'
import { useLogTypeFromRemoteConfig } from 'libs/hooks/useLogTypeFromRemoteConfig'
import { AsyncError, ScreenError } from 'libs/monitoring'
import { LogTypeEnum } from 'libs/monitoring/errors'
import { QueryKeys } from 'libs/queryKeys'
import { Typo } from 'ui/theme'

const MAX_ASYNC_TEST_REQ_COUNT = 3

export const CheatcodesNavigationErrors: FunctionComponent = () => {
  const { navigate } = useNavigation<UseNavigationType>()
  const [renderedError, setRenderedError] = useState(undefined)
  const [screenError, setScreenError] = useState<ScreenError | undefined>(undefined)
  const [asyncTestReqCount, setAsyncTestReqCount] = useState(0)
  const { logType } = useLogTypeFromRemoteConfig()

  const { refetch: errorAsyncQuery, isFetching } = useQuery(
    [QueryKeys.ERROR_ASYNC],
    () => errorAsync(),
    {
      cacheTime: 0,
      enabled: false,
    }
  )

  async function errorAsync() {
    setAsyncTestReqCount((v) => ++v)
    if (asyncTestReqCount <= MAX_ASYNC_TEST_REQ_COUNT) {
      throw new AsyncError('NETWORK_REQUEST_FAILED', {
        retry: errorAsyncQuery,
        logType: LogTypeEnum.ERROR,
      })
    }
    return null
  }

  if (screenError) {
    throw screenError
  }

  return (
    <CheatcodesTemplateScreen title="Errors 👾">
      <LinkToScreen screen="BannedCountryError" />
      <LinkToScreen
        title={
          asyncTestReqCount < MAX_ASYNC_TEST_REQ_COUNT
            ? `${MAX_ASYNC_TEST_REQ_COUNT} erreurs asynchrones`
            : 'OK'
        }
        disabled={isFetching || asyncTestReqCount >= MAX_ASYNC_TEST_REQ_COUNT}
        onPress={() => errorAsyncQuery()}
      />
      <LinkToScreen
        title="Contentful KO error"
        onPress={() =>
          setScreenError(
            new ScreenError(
              'Échec de la requête https://cdn.contentful.com/spaces/2bg01iqy0isv/environments/testing/entries?include=2&content_type=homepageNatif&access_token=<TOKEN>, code: 400',
              { Screen: NoContentError, logType }
            )
          )
        }
      />
      <LinkToScreen
        title="Offre inexistante"
        onPress={() => navigate('Offer', { id: 0, from: 'searchresults' })}
      />
      <LinkToScreen
        title="Maintenance Page"
        onPress={() =>
          setScreenError(
            new ScreenError('Test maintenance page', {
              Screen: () => (
                <Maintenance message="Some maintenance message that is set in Firestore" />
              ),
              logType,
            })
          )
        }
      />
      <LinkToScreen
        title="Erreur rendering"
        onPress={() => {
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-expect-error
          setRenderedError(createElement(CenteredText, { children: CenteredText })) // eslint-disable-line react/no-children-prop
        }}
      />
      {renderedError}
    </CheatcodesTemplateScreen>
  )
}

const CenteredText = styled(Typo.Caption)({
  width: '100%',
  textAlign: 'center',
})
