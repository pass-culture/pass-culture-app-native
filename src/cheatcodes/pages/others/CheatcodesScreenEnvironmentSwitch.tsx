import React, { useState } from 'react'
import styled from 'styled-components/native'

import { CheatcodesTemplateScreen } from 'cheatcodes/components/CheatcodesTemplateScreen'
import { env } from 'libs/environment/env'
import {
  clearEnvironmentOverride,
  getEffectiveEnvironment,
  isEnvironmentOverridden,
  setEnvironmentOverride,
} from 'libs/environment/envOverride/envOverride'
import { SWITCHABLE_ENVIRONMENTS, SwitchableEnvironment } from 'libs/environment/envOverride/types'
import { clearRefreshToken } from 'libs/keychain/keychain'
import { storage } from 'libs/storage'
import { reloadApp } from 'shared/reloadApp/reloadApp'
import { AppInformationModal } from 'ui/components/modals/AppInformationModal'
import { useModal } from 'ui/components/modals/useModal'
import { Button } from 'ui/designSystem/Button/Button'
import { RadioButtonGroup } from 'ui/designSystem/RadioButtonGroup/RadioButtonGroup'
import { showErrorSnackBar } from 'ui/designSystem/Snackbar/snackBar.store'
import { Typo } from 'ui/theme'

const TITLE = 'Environnement 🌍'

const options = SWITCHABLE_ENVIRONMENTS.map((environment) => ({
  key: environment,
  label: environment,
}))

const purgeSessionAndReload = async () => {
  await storage.clear('access_token')
  await clearRefreshToken()
  reloadApp()
}

export const CheatcodesScreenEnvironmentSwitch = (): React.JSX.Element => {
  const effectiveEnvironment = getEffectiveEnvironment()
  const [targetEnvironment, setTargetEnvironment] = useState<SwitchableEnvironment | null>(null)
  const { visible, showModal, hideModal } = useModal(false)

  const onSelectEnvironment = (value: string) => {
    if (value === effectiveEnvironment) return
    setTargetEnvironment(value as SwitchableEnvironment)
    showModal()
  }

  const onCancel = () => {
    setTargetEnvironment(null)
    hideModal()
  }

  const onConfirm = async () => {
    if (!targetEnvironment) return
    try {
      await setEnvironmentOverride(targetEnvironment)
      await purgeSessionAndReload()
    } catch {
      onCancel()
      showErrorSnackBar('Impossible de changer d’environnement')
    }
  }

  const onReset = async () => {
    try {
      await clearEnvironmentOverride()
      await purgeSessionAndReload()
    } catch {
      showErrorSnackBar('Impossible de réinitialiser l’environnement')
    }
  }

  return (
    <CheatcodesTemplateScreen title={TITLE} flexDirection="column">
      <Typo.Body>Environnement du build&nbsp;:</Typo.Body>
      <Typo.Title3>{env.ENV}</Typo.Title3>
      <Typo.Body>Environnement effectif&nbsp;:</Typo.Body>
      <Typo.Title3>{effectiveEnvironment}</Typo.Title3>
      <Spacer />
      <RadioButtonGroup
        label="Cibler l’environnement"
        options={options}
        value={effectiveEnvironment}
        onChange={onSelectEnvironment}
      />
      <Spacer />
      {isEnvironmentOverridden() ? (
        <Button
          wording="Réinitialiser (retour à l’environnement du build)"
          onPress={onReset}
          fullWidth
        />
      ) : null}
      <AppInformationModal
        title="Changer d’environnement"
        visible={visible}
        onCloseIconPress={onCancel}>
        <StyledBody>
          L’app va pointer vers l’environnement «&nbsp;{targetEnvironment}&nbsp;». Tu seras
          déconnecté·e et l’app va redémarrer.
        </StyledBody>
        <ModalSpacer />
        <Button wording="Confirmer et redémarrer" onPress={onConfirm} fullWidth />
        <ModalSpacer />
        <Button wording="Annuler" variant="secondary" onPress={onCancel} fullWidth />
      </AppInformationModal>
    </CheatcodesTemplateScreen>
  )
}

const Spacer = styled.View(({ theme }) => ({
  height: theme.designSystem.size.spacing.l,
}))

const ModalSpacer = styled.View(({ theme }) => ({
  height: theme.designSystem.size.spacing.m,
}))

const StyledBody = styled(Typo.Body)({
  textAlign: 'center',
})
