import AsyncStorage from '@react-native-async-storage/async-storage'
import React, { useCallback, useEffect, useState } from 'react'
import styled from 'styled-components/native'

import { CheatcodesTemplateScreen } from 'cheatcodes/components/CheatcodesTemplateScreen'
import { Separator } from 'ui/components/Separator'
import { ViewGap } from 'ui/components/ViewGap/ViewGap'
import { Button } from 'ui/designSystem/Button/Button'
import { showErrorSnackBar, showSuccessSnackBar } from 'ui/designSystem/Snackbar/snackBar.store'
import { Trash } from 'ui/svg/icons/Trash'
import { Typo } from 'ui/theme'

type StorageEntry = [string, string | null]

export const CheatcodesScreenAsyncStorage = () => {
  const [entries, setEntries] = useState<StorageEntry[]>([])

  const refreshEntries = useCallback(async () => {
    try {
      const keys = await AsyncStorage.getAllKeys()
      const keyValuePairs = await AsyncStorage.multiGet(keys)
      setEntries([...keyValuePairs].sort(([keyA], [keyB]) => keyA.localeCompare(keyB)))
    } catch {
      showErrorSnackBar('Impossible de lire l’AsyncStorage')
    }
  }, [])

  useEffect(() => {
    void refreshEntries()
  }, [refreshEntries])

  const removeKey = async (key: string) => {
    try {
      await AsyncStorage.removeItem(key)
      showSuccessSnackBar(`Clé "${key}" supprimée`)
    } catch {
      showErrorSnackBar(`Impossible de supprimer la clé "${key}"`)
    }
    await refreshEntries()
  }

  const removeAllKeys = async () => {
    try {
      const keys = await AsyncStorage.getAllKeys()
      if (keys.length > 0) {
        await AsyncStorage.multiRemove(keys)
      }
      showSuccessSnackBar(`${keys.length} clé(s) supprimée(s)`)
    } catch {
      showErrorSnackBar('Impossible de vider l’AsyncStorage')
    }
    await refreshEntries()
  }

  return (
    <CheatcodesTemplateScreen title="AsyncStorage 🗑️" flexDirection="column">
      <ViewGap gap={4}>
        <Typo.Body>
          {entries.length} clé(s) en stockage. Supprimer une clé permet de retester les parcours
          «&nbsp;vu une seule fois&nbsp;» (fake doors, modales, tutoriels…).
        </Typo.Body>
        <ButtonsContainer gap={2}>
          <Button
            wording="Tout supprimer"
            icon={Trash}
            variant="primary"
            color="danger"
            size="small"
            onPress={removeAllKeys}
          />
          <Button
            wording="Rafraîchir"
            variant="secondary"
            color="neutral"
            size="small"
            onPress={refreshEntries}
          />
        </ButtonsContainer>
        <Separator.Horizontal />
        {entries.length === 0 ? (
          <StyledBodyEmpty>L’AsyncStorage est vide.</StyledBodyEmpty>
        ) : (
          entries.map(([key, value]) => (
            <EntryContainer key={key} gap={1}>
              <EntryHeader>
                <EntryKeyContainer>
                  <Typo.BodyAccent numberOfLines={2}>{key}</Typo.BodyAccent>
                </EntryKeyContainer>
                <Button
                  iconButton
                  icon={Trash}
                  variant="tertiary"
                  color="danger"
                  size="small"
                  accessibilityLabel={`Supprimer la clé ${key}`}
                  onPress={() => removeKey(key)}
                />
              </EntryHeader>
              <EntryValue numberOfLines={3}>{value ?? 'null'}</EntryValue>
            </EntryContainer>
          ))
        )}
      </ViewGap>
    </CheatcodesTemplateScreen>
  )
}

const ButtonsContainer = styled(ViewGap)({
  flexDirection: 'row',
})

const EntryContainer = styled(ViewGap)(({ theme }) => ({
  paddingBottom: theme.designSystem.size.spacing.s,
  borderBottomWidth: 1,
  borderBottomColor: theme.designSystem.color.border.subtle,
}))

const EntryHeader = styled.View({
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between',
})

const EntryKeyContainer = styled.View({
  flex: 1,
})

const EntryValue = styled(Typo.BodyXs)(({ theme }) => ({
  color: theme.designSystem.color.text.subtle,
}))

const StyledBodyEmpty = styled(Typo.Body)(({ theme }) => ({
  color: theme.designSystem.color.text.subtle,
}))
