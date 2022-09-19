import React from 'react'

import { useAppSettings } from 'features/auth/settings'
import { PrivacyPolicyV1 } from 'features/firstLogin/PrivacyPolicy/PrivacyPolicyV1'
import { PrivacyPolicyV2 } from 'features/firstLogin/PrivacyPolicy/PrivacyPolicyV2'

export function PrivacyPolicy() {
  const { data: settings } = useAppSettings()

  return settings?.appEnableCookiesV2 ? <PrivacyPolicyV2 /> : <PrivacyPolicyV1 />
}
