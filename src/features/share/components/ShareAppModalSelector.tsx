import React, { FC } from 'react'

import { ShareAppModal } from 'features/share/pages/ShareAppModal'
import { ShareAppModalVersionA } from 'features/share/pages/ShareAppModalVersionA'
import { ShareAppModalVersionB } from 'features/share/pages/ShareAppModalVersionB'
import { CustomRemoteConfig } from 'libs/firebase/remoteConfig/remoteConfig.types'

type SelectorProps = {
  visible: boolean
  close: () => void
  share: () => void
  version: CustomRemoteConfig['shareAppModalVersion']
}

export const ShareAppModalSelector: FC<SelectorProps> = ({ visible, close, share, version }) => {
  if (version === 'A') {
    return <ShareAppModalVersionA visible={visible} close={close} share={share} />
  }

  if (version === 'B') {
    return <ShareAppModalVersionB visible={visible} close={close} share={share} />
  }

  return <ShareAppModal visible={visible} close={close} share={share} />
}
