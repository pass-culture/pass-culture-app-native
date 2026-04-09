import AsyncStorage from '@react-native-async-storage/async-storage'
import React, { useCallback, useEffect } from 'react'
import { FlatList } from 'react-native'
import styled, { useTheme } from 'styled-components/native'

import { DeeplinkItem } from 'features/internal/atoms/DeeplinkItem'
import { TouchableOpacity } from 'ui/components/TouchableOpacity'
import { Checkbox } from 'ui/designSystem/Checkbox/Checkbox'
import { showErrorSnackBar } from 'ui/designSystem/Snackbar/snackBar.store'
import { padding, Typo } from 'ui/theme'

export interface DeeplinksHistoryProps {
  history: Readonly<string[]>
  keepHistory: boolean
  setKeepHistory: (keepHistory: boolean) => void
  rehydrateHistory: (history: string[]) => void
}

const keyExtractor = (item: string, index: number) => `${item}_#${index}`

export const DeeplinksHistory = ({
  history,
  keepHistory,
  setKeepHistory,
  rehydrateHistory,
}: DeeplinksHistoryProps) => {
  const { designSystem } = useTheme()
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [keepHistory, history])

  async function clearLocalData() {
    try {
      await AsyncStorage.removeItem('mac_persist')
      await AsyncStorage.removeItem('mac_history')
    } catch (error) {
      if (error instanceof Error)
        showErrorSnackBar(`L’historique n’a pas pu supprimer les données locales: ${error.message}`)
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
            rehydrateHistory(JSON.parse(localStr ?? '[]'))
          }
        } else {
          setKeepHistory(false)
          clearLocalData()
        }
      } catch (error) {
        showErrorSnackBar('L’historique est indisponible')
        clearLocalData()
      }
    }
    init()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <Container>
      <StyledTitle4>Historique</StyledTitle4>
      <FlatList
        style={{ marginVertical: designSystem.size.spacing.l }}
        data={history}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        ItemSeparatorComponent={Separator}
      />
      <BottomContainer>
        <StyledCheckBox>
          <Checkbox
            isChecked={!!keepHistory}
            label="Conserver l’historique"
            onPress={onToggleKeepHistory}
          />
        </StyledCheckBox>
      </BottomContainer>
    </Container>
  )
}

const renderItem = ({ item, index }: { item: string; index: number }) => {
  const indice = `#${index}`
  return (
    <DeeplinkItem before={<Typo.BodyAccentXs>{indice}</Typo.BodyAccentXs>} universalLink={item} />
  )
}

const StyledCheckBox = styled(TouchableOpacity)({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  width: '100%',
})

const Container = styled.View(({ theme }) => ({
  flex: 1,
  padding: theme.designSystem.size.spacing.s,
}))

const StyledTitle4 = styled(Typo.Title4)({
  textAlign: 'center',
})

const Separator = styled.View(({ theme }) => ({
  height: 2,
  backgroundColor: theme.designSystem.color.background.subtle,
  marginVertical: theme.designSystem.size.spacing.l,
}))

const BottomContainer = styled.View(({ theme }) => ({
  flex: 1,
  justifyContent: 'flex-end',
  ...padding(2),
  backgroundColor: theme.designSystem.color.background.default,
  marginTop: theme.designSystem.size.spacing.xxxl,
}))
