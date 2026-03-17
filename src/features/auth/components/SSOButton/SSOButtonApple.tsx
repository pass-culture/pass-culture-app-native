import React, { FC } from 'react'
import { Platform } from 'react-native'

import { AccessibilityRole } from 'libs/accessibilityRole/accessibilityRole'
import { Button } from 'ui/designSystem/Button/Button'
import { Apple } from 'ui/svg/icons/socialNetwork/Apple'

type Props = {
  type: 'signup' | 'login'
}

export const SSOButtonApple: FC<Props> = ({ type }) => {
  if (Platform.OS === 'android') return null

  const wording = `${type === 'login' ? 'Se connecter' : 'S\u2019inscrire'} avec Apple`

  return (
    <Button
      accessibilityRole={AccessibilityRole.BUTTON}
      wording={wording}
      icon={Apple}
      // TODO(PC-39896): implement Apple SSO sign-in handler
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      onPress={() => {}}
      variant="secondary"
      fullWidth
      color="neutral"
    />
  )
}
