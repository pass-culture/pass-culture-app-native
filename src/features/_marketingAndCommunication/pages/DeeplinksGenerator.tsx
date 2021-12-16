import { t } from '@lingui/macro'
import AsyncStorage from '@react-native-async-storage/async-storage'
import React, { useCallback, useState } from 'react'
import styled from 'styled-components/native'

import {
  DeeplinksGeneratorForm,
  GeneratedDeeplink,
} from 'features/_marketingAndCommunication/components/DeeplinksGeneratorForm'
import { DeeplinksHistory } from 'features/_marketingAndCommunication/components/DeeplinksHistory'
import { DeeplinksResult } from 'features/_marketingAndCommunication/components/DeeplinksResult'
import { PageHeader } from 'ui/components/headers/PageHeader'
import { SNACK_BAR_TIME_OUT, useSnackBarContext } from 'ui/components/snackBar/SnackBarContext'
import { ColorsEnum, getSpacing, Spacer } from 'ui/theme'

const linksInitialState: Array<GeneratedDeeplink> = []

export const DeeplinksGenerator = () => {
  const [result, setResult] = useState(linksInitialState[0])
  const [links, setLinks] = useState<Array<GeneratedDeeplink>>(linksInitialState)
  const [keepHistory, setKeepHistory] = useState(false)
  const { showErrorSnackBar } = useSnackBarContext()

  const onGenerate = useCallback(
    (generatedDeeplink) => {
      async function add() {
        setLinks((previousGeneratedLinks) => [generatedDeeplink, ...previousGeneratedLinks])
        setResult(generatedDeeplink)
        if (keepHistory) {
          try {
            const localHistory = JSON.parse((await AsyncStorage.getItem('mac_history')) || '[]')
            await AsyncStorage.setItem(
              'mac_history',
              JSON.stringify([...localHistory, generatedDeeplink])
            )
          } catch (error) {
            if (error instanceof Error)
              showErrorSnackBar({
                message: t`Le lien ${generatedDeeplink.universalLink} n'a pas été ajouté à l'historique: ${error.message}`,
                timeout: SNACK_BAR_TIME_OUT,
              })
          }
        }
      }
      add()
    },
    [keepHistory]
  )

  return (
    <React.Fragment>
      <Spacer.TopScreen />
      <Spacer.Column numberOfSpaces={18} />
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
            rehydrateHistory={(history) => setLinks(history)}
          />
        </Right>
      </Row>
      <Spacer.Column numberOfSpaces={4} />
      <PageHeader title={t`Envie de tout envie de lien ?`} />
    </React.Fragment>
  )
}

const Divider = styled.View({
  height: getSpacing(2),
  backgroundColor: ColorsEnum.GREY_LIGHT,
})

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
