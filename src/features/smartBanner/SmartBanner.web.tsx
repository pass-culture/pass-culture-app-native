import { t } from '@lingui/macro'
import React from 'react'

import ReactSmartBanner from 'libs/react-smartbanner'

import { author } from '../../../package.json'

const price = {
  ios: t`GRATUIT`,
  android: t`GRATUIT`,
}
const storeText = {
  ios: t`Sur l'App Store`,
  android: t`Sur Google Play`,
}

const buttonText = t`Voir`

export const SmartBanner = () => (
  <ReactSmartBanner
    button={buttonText}
    daysHidden={1}
    ignoreIosVersion
    position="top"
    price={price}
    storeText={storeText}
    title={author.name}
  />
)
