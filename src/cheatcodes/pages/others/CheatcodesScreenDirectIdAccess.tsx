import { useNavigation } from '@react-navigation/native'
import React, { useMemo, useState } from 'react'
import styled from 'styled-components/native'

import { CheatcodesTemplateScreen } from 'cheatcodes/components/CheatcodesTemplateScreen'
import {
  DEFAULT_DIRECT_ID_ENTITY_KEY,
  DIRECT_ID_ENTITIES,
  DIRECT_ID_ENTITY_KEYS,
  DirectIdEntityKey,
  isDirectIdValueValid,
} from 'cheatcodes/helpers/directIdAccessConfig'
import { getCheatcodesHookConfig } from 'features/navigation/navigators/CheatcodesStackNavigator/getCheatcodesHookConfig'
import { UseNavigationType } from 'features/navigation/navigators/RootNavigator/types'
import { useGoBack } from 'features/navigation/useGoBack'
import { getErrorMessage } from 'shared/getErrorMessage/getErrorMessage'
import { Button } from 'ui/designSystem/Button/Button'
import { RadioButtonGroup } from 'ui/designSystem/RadioButtonGroup/RadioButtonGroup'
import { showErrorSnackBar } from 'ui/designSystem/Snackbar/snackBar.store'
import { TextInput } from 'ui/designSystem/TextInput/TextInput'

const TITLE = 'Accès direct par ID 🎯'

export const CheatcodesScreenDirectIdAccess = (): React.JSX.Element => {
  const { goBack } = useGoBack(...getCheatcodesHookConfig('CheatcodesMenu'))
  const navigation = useNavigation<UseNavigationType>()

  const [selectedKey, setSelectedKey] = useState<DirectIdEntityKey>(DEFAULT_DIRECT_ID_ENTITY_KEY)
  const [idValue, setIdValue] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const selectedEntity = DIRECT_ID_ENTITIES[selectedKey]

  const options = useMemo(
    () =>
      DIRECT_ID_ENTITY_KEYS.map((key) => ({
        key,
        label: DIRECT_ID_ENTITIES[key].label,
      })),
    []
  )

  const onSelectEntity = (label: string) => {
    const next = DIRECT_ID_ENTITY_KEYS.find((key) => DIRECT_ID_ENTITIES[key].label === label)
    if (!next || next === selectedKey) return
    setSelectedKey(next)
    setIdValue('')
  }

  const isValueValid = isDirectIdValueValid(selectedEntity, idValue)
  const isDisabled = !isValueValid || isLoading

  const onPress = async () => {
    const trimmedId = idValue.trim()

    if (!selectedEntity.validate) {
      selectedEntity.navigate(navigation, trimmedId)
      return
    }

    setIsLoading(true)
    try {
      await selectedEntity.validate(trimmedId)
      selectedEntity.navigate(navigation, trimmedId)
    } catch (error) {
      showErrorSnackBar(`${selectedEntity.label} introuvable\u00a0: ${getErrorMessage(error)}`)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <CheatcodesTemplateScreen title={TITLE} onGoBack={goBack} flexDirection="column">
      <RadioButtonGroup
        label="Type d’entité"
        options={options}
        value={selectedEntity.label}
        onChange={onSelectEntity}
      />
      <Spacer />
      <TextInput
        label={`Identifiant ${selectedEntity.label.toLowerCase()}`}
        value={idValue}
        onChangeText={setIdValue}
        keyboardType={selectedEntity.idType === 'number' ? 'numeric' : 'default'}
        autoCapitalize="none"
        autoComplete="off"
        autoCorrect={false}
      />
      <Spacer />
      <Button
        wording="Y aller"
        onPress={onPress}
        disabled={isDisabled}
        isLoading={isLoading}
        fullWidth
      />
    </CheatcodesTemplateScreen>
  )
}

const Spacer = styled.View(({ theme }) => ({
  height: theme.designSystem.size.spacing.l,
}))
