import React, { ReactNode, useState, useEffect, useRef } from 'react'
import styled from 'styled-components/native'

import { useNetInfoContext } from 'libs/network/NetInfoWrapper'
import { getSpacing, Typo, Spacer } from 'ui/theme'

const THIRTY_SECONDS = 15000

export function OfflineModeContainer({ children }: { children: ReactNode }) {
  const netInfo = useNetInfoContext()
  const [show, setShow] = useState(!netInfo.isConnected)
  const isInternetReachable = useRef(netInfo.isInternetReachable)

  useEffect(() => {
    setShow(!netInfo.isConnected)
  }, [netInfo.isConnected])

  useEffect(() => {
    isInternetReachable.current = netInfo.isInternetReachable
    let timer: number | undefined
    if (!isInternetReachable.current) {
      timer = globalThis.setTimeout(() => {
        if (!isInternetReachable.current) {
          setShow(true)
        }
      }, THIRTY_SECONDS)
    } else {
      setShow(false)
    }
    return () => {
      if (timer) {
        globalThis.clearInterval(timer)
      }
    }
  }, [netInfo.isInternetReachable])

  return (
    <FlexView>
      <FlexView>{children}</FlexView>
      {show ? (
        <OfflineModeBanner>
          <OfflineModeBannerText>aucune connexion internet.</OfflineModeBannerText>
          <Spacer.BottomScreen />
        </OfflineModeBanner>
      ) : null}
    </FlexView>
  )
}

const FlexView = styled.View({
  flex: 1,
})

const OfflineModeBanner = styled.View(({ theme }) => ({
  backgroundColor: theme.offlineMode.banner.backgroundColor,
  padding: getSpacing(1.5),
  justifyContent: 'center',
  alignItems: 'center',
}))

const OfflineModeBannerText = styled(Typo.Caption)(({ theme }) => ({
  color: theme.offlineMode.banner.textColor,
}))
