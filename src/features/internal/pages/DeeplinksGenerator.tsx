import AsyncStorage from '@react-native-async-storage/async-storage'
import React, { useCallback, useState } from 'react'
import styled from 'styled-components/native'

import {
  DeeplinksGeneratorForm,
  GeneratedDeeplink,
} from 'features/internal/components/DeeplinksGeneratorForm'
import { DeeplinksHistory } from 'features/internal/components/DeeplinksHistory'
import { DeeplinksResult } from 'features/internal/components/DeeplinksResult'
import { BlurHeader } from 'ui/components/headers/BlurHeader'
import {
  PageHeaderWithoutPlaceholder,
  useGetHeaderHeight,
} from 'ui/components/headers/PageHeaderWithoutPlaceholder'
import { SNACK_BAR_TIME_OUT, useSnackBarContext } from 'ui/components/snackBar/SnackBarContext'
import { Page } from 'ui/pages/Page'
import { getSpacing } from 'ui/theme'

const linksInitialState: Array<GeneratedDeeplink> = []

export const DeeplinksGenerator = () => {
  const [result, setResult] = useState(linksInitialState[0])
  const [links, setLinks] = useState<Array<GeneratedDeeplink>>(linksInitialState)
  const [keepHistory, setKeepHistory] = useState(false)
  const { showErrorSnackBar } = useSnackBarContext()
  const headerHeight = useGetHeaderHeight()

  const onGenerate = useCallback(
    (generatedDeeplink: GeneratedDeeplink) => {
      async function add() {
        setLinks((previousGeneratedLinks) => [generatedDeeplink, ...previousGeneratedLinks])
        setResult(generatedDeeplink)
        if (keepHistory) {
          try {
            const localHistory = JSON.parse((await AsyncStorage.getItem('mac_history')) ?? '[]')
            await AsyncStorage.setItem(
              'mac_history',
              JSON.stringify([...localHistory, generatedDeeplink])
            )
          } catch (error) {
            if (error instanceof Error)
              showErrorSnackBar({
                message: `Le lien ${generatedDeeplink.universalLink} n’a pas été ajouté à l’historique\u00a0: ${error.message}`,
                timeout: SNACK_BAR_TIME_OUT,
              })
          }
        }
      }
      add()
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [keepHistory]
  )

  const rehydratedHistory = useCallback((history: GeneratedDeeplink[]) => {
    setLinks(history)
  }, [])

  return (
    <Page>
      <PageHeaderWithoutPlaceholder
        title="Envie de tout envie de lien&nbsp;?"
        shouldDisplayBackButton
      />
      <Placeholder height={headerHeight} />
      <Container>
        <Row>
          <Left>
            <DeeplinksGeneratorForm onCreate={onGenerate} />
          </Left>
          <Right>
            <DeeplinksResult result={result} />
            <Divider />
            <DeeplinksHistory
              history={links}
              keepHistory={keepHistory}
              setKeepHistory={setKeepHistory}
              rehydrateHistory={rehydratedHistory}
            />
          </Right>
        </Row>
      </Container>
      <BlurHeader height={headerHeight} />
    </Page>
  )
}

const Divider = styled.View(({ theme }) => ({
  height: getSpacing(2),
  backgroundColor: theme.designSystem.color.background.subtle,
}))

const Row = styled.View(({ theme }) => ({
  flex: 1,
  flexDirection: theme.isMobileViewport ? 'column' : 'row',
}))

const Left = styled.View({
  flex: 1,
})

const Right = styled.View({
  flex: 1,
})

const Container = styled.View({
  flex: 1,
  paddingTop: getSpacing(6),
  paddingBottom: getSpacing(4),
})

const Placeholder = styled.View<{ height: number }>(({ height }) => ({
  height,
}))
