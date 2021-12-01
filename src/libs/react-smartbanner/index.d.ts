import React from 'react'

export interface SmartBannerProperties {
  button: string
  daysHidden: number
  ignoreIosVersion?: boolean
  position: 'top' | 'bottom'
  price: { ios: string; android: string }
  storeText: { ios: string; android: string }
  title: string
}

declare const SmartBanner: React.ComponentClass<SmartBannerProperties>

type SmartBanner = React.ComponentClass<SmartBannerProperties>

export default SmartBanner
