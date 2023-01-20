import { useNavigation } from '@react-navigation/native'
import React, { FunctionComponent, useState, createElement } from 'react'
import { ScrollView } from 'react-native'
import { useQuery } from 'react-query'
import styled from 'styled-components/native'

import { NoContentError } from 'features/home/components/NoContentError'
import { Row } from 'features/internal/cheatcodes/components/Row'
import { Maintenance } from 'features/maintenance/Maintenance'
import { UseNavigationType } from 'features/navigation/RootNavigator/types'
import { AsyncError, ScreenError } from 'libs/monitoring'
import { QueryKeys } from 'libs/queryKeys'
import { ButtonPrimary } from 'ui/components/buttons/ButtonPrimary'
import { PageHeaderSecondary } from 'ui/components/headers/PageHeaderSecondary'
import { Typo } from 'ui/theme'

const MAX_ASYNC_TEST_REQ_COUNT = 3

export const NavigationErrors: FunctionComponent = () => {
  const { navigate } = useNavigation<UseNavigationType>()
  const [renderedError, setRenderedError] = useState(undefined)
  const [screenError, setScreenError] = useState<ScreenError | undefined>(undefined)
  const [asyncTestReqCount, setAsyncTestReqCount] = useState(0)

  const { refetch: errorAsyncQuery, isFetching } = useQuery(
    QueryKeys.ERROR_ASYNC,
    () => errorAsync(),
    {
      cacheTime: 0,
      enabled: false,
    }
  )

  async function errorAsync() {
    setAsyncTestReqCount((v) => ++v)
    if (asyncTestReqCount <= MAX_ASYNC_TEST_REQ_COUNT) {
      throw new AsyncError('NETWORK_REQUEST_FAILED', errorAsyncQuery)
    }
  }

  if (screenError) {
    throw screenError
  }

  return (
    <ScrollView>
      <PageHeaderSecondary title="Errors 👾" />
      <StyledContainer>
        <Row half>
          <ButtonPrimary
            wording="Banned Country Error"
            onPress={() => navigate('BannedCountryError')}
          />
        </Row>
        <Row half>
          <ButtonPrimary
            wording={
              asyncTestReqCount < MAX_ASYNC_TEST_REQ_COUNT
                ? `${MAX_ASYNC_TEST_REQ_COUNT} erreurs asynchrones`
                : 'OK'
            }
            disabled={isFetching || asyncTestReqCount >= MAX_ASYNC_TEST_REQ_COUNT}
            onPress={() => errorAsyncQuery()}
          />
        </Row>
        <Row half>
          <ButtonPrimary
            wording="Contentful KO error"
            onPress={() =>
              setScreenError(
                new ScreenError(
                  'Échec de la requête https://cdn.contentful.com/spaces/2bg01iqy0isv/environments/testing/entries?include=2&content_type=homepageNatif&access_token=<TOKEN>, code: 400',
                  NoContentError
                )
              )
            }
          />
        </Row>
        <Row half>
          <ButtonPrimary
            wording="Offre inexistante"
            onPress={() => navigate('Offer', { id: 0, from: 'search' })}
          />
        </Row>
        <Row half>
          <ButtonPrimary
            wording="Maintenance Page"
            onPress={() =>
              setScreenError(
                new ScreenError('Test maintenance page', () => (
                  <Maintenance message="Some maintenance message that is set in Firestore" />
                ))
              )
            }
          />
        </Row>
        <Row half>
          <ButtonPrimary
            wording="Erreur rendering"
            onPress={() => {
              // eslint-disable-next-line @typescript-eslint/ban-ts-comment
              // @ts-expect-error
              setRenderedError(createElement(CenteredText, { children: CenteredText })) // eslint-disable-line react/no-children-prop
            }}
          />
          {renderedError}
        </Row>
      </StyledContainer>
    </ScrollView>
  )
}

const StyledContainer = styled.View({
  display: 'flex',
  flexWrap: 'wrap',
  flexDirection: 'row',
})

const CenteredText = styled(Typo.Caption)({
  width: '100%',
  textAlign: 'center',
})
