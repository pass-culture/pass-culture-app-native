import React from 'react'

export interface SmartBannerProperties {
  daysHidden?: number
  daysReminder?: number
  appStoreLanguage?: string
  title?: string
  author?: string
  button?: string
  storeText?: { ios: string; android: string; windows?: string; kindle?: string }
  price?: { ios: string; android: string; windows?: string; kindle?: string }
  position?: 'top' | 'bottom'
  force?: string
  url?: { ios: string; android: string; windows?: string; kindle?: string }
  ignoreIosVersion?: boolean
  appMeta?: { ios: string; android: string; windows?: string; kindle?: string }
  onClose?: () => void
  onInstall?: () => void
}

declare const SmartBanner: React.ComponentClass<SmartBannerProperties>

type SmartBanner = React.ComponentClass<SmartBannerProperties>

export default SmartBanner
