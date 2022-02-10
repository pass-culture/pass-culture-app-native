import { t } from '@lingui/macro'
import AsyncStorage from '@react-native-async-storage/async-storage'
import React, { useCallback, useEffect } from 'react'
import { FlatList } from 'react-native'
import styled from 'styled-components/native'

import { DeeplinkItem } from 'features/_marketingAndCommunication/atoms/DeeplinkItem'
import { GeneratedDeeplink } from 'features/_marketingAndCommunication/components/DeeplinksGeneratorForm'
import { CheckboxInput } from 'ui/components/inputs/CheckboxInput'
import { useSnackBarContext } from 'ui/components/snackBar/SnackBarContext'
import { getSpacing, padding, Spacer, Typo } from 'ui/theme'

interface Props {
  history: Array<GeneratedDeeplink>
  keepHistory: boolean
  setKeepHistory: (keepHistory: boolean) => void
  rehydrateHistory: (history: GeneratedDeeplink[]) => void
}

const keyExtractor = (item: GeneratedDeeplink, index: number) => `${item.universalLink}_#${index}`

export const DeeplinksHistory = ({
  history,
  keepHistory,
  setKeepHistory,
  rehydrateHistory,
}: Props) => {
  const { showErrorSnackBar } = useSnackBarContext()

  const renderItem = ({ item, index }: { item: GeneratedDeeplink; index: number }) => {
    const indice = `#${index}`
    return <DeeplinkItem before={<Typo.Caption>{indice}</Typo.Caption>} deeplink={item} />
  }

  const onToggleKeepHistory = useCallback(() => {
    async function toggle() {
      const newKeepHistory = !keepHistory
      if (newKeepHistory) {
        await AsyncStorage.setItem('mac_persist', 'true')
        await AsyncStorage.setItem('mac_history', JSON.stringify(history))
        setKeepHistory(true)
      } else {
        await AsyncStorage.removeItem('mac_persist')
        setKeepHistory(false)
      }
    }
    toggle()
  }, [keepHistory, history])

  async function clearLocalData() {
    try {
      await AsyncStorage.removeItem('mac_persist')
      await AsyncStorage.removeItem('mac_history')
    } catch (error) {
      if (error instanceof Error)
        showErrorSnackBar({
          message: t`L'historique n'a pas pu supprimer les données locales: ${error.message}`,
        })
    }
  }

  useEffect(() => {
    async function init() {
      const persist = await AsyncStorage.getItem('mac_persist')
      try {
        if (persist === 'true') {
          setKeepHistory(true)
          if (rehydrateHistory) {
            const localStr = await AsyncStorage.getItem('mac_history')
            rehydrateHistory(JSON.parse(localStr || '[]'))
          }
        } else {
          setKeepHistory(false)
          clearLocalData()
        }
      } catch (error) {
        showErrorSnackBar({ message: `L'historique est indisponible` })
        clearLocalData()
      }
    }
    init()
  }, [])

  return (
    <Container>
      <TitleContainer>{t`Historique`}</TitleContainer>
      <FlatList
        style={flatListStyle}
        data={history}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        ItemSeparatorComponent={Separator}
        ListFooterComponent={HorizontalMargin}
      />
      <BottomContainer>
        <StyledCheckBox onPress={onToggleKeepHistory}>
          <CheckboxInput isChecked={!!keepHistory} setIsChecked={onToggleKeepHistory} />
          <CheckBoxText>{t`Conserver l'historique`}</CheckBoxText>
        </StyledCheckBox>
      </BottomContainer>
    </Container>
  )
}

const flatListStyle = { marginVertical: getSpacing(4) }

const HorizontalMargin = () => <Spacer.Column numberOfSpaces={10} />

const CheckBoxText = styled(Typo.Body)({
  alignSelf: 'center',
  ...padding(0, 8, 0, 4),
})

const StyledCheckBox = styled.TouchableOpacity.attrs(({ theme }) => ({
  activeOpacity: theme.activeOpacity,
}))({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  width: '100%',
})

const Container = styled.View({
  flex: 1,
  padding: getSpacing(2),
})

const TitleContainer = styled.Text(({ theme }) => ({
  ...theme.typography.title4,
  textAlign: 'center',
}))

const Separator = styled.View(({ theme }) => ({
  height: 2,
  backgroundColor: theme.colors.greyLight,
  marginVertical: getSpacing(4),
}))

const BottomContainer = styled.View(({ theme }) => ({
  flex: 1,
  justifyContent: 'flex-end',
  ...padding(2),
  backgroundColor: theme.colors.white,
}))
