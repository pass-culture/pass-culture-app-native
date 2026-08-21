import React, { useState, useEffect } from 'react'

import { CheatcodesTemplateScreen } from 'cheatcodes/components/CheatcodesTemplateScreen'
import { LastLoginInfoBanner } from 'features/auth/components/LastLoginInfoBanner'
import { getLastLoginInfo } from 'features/auth/helpers/getLastLoginInfo'
import { FormattedLastLoginInfo } from 'features/auth/types'

export const CheatcodesScreenLastLoginInfo = () => {
  const [lastLoginInfo, setLastLoginInfo] = useState<FormattedLastLoginInfo | null>(null)

  useEffect(() => {
    const loadLastLoginInfo = async () => {
      const info = await getLastLoginInfo()
      setLastLoginInfo(info)
    }
    void loadLastLoginInfo()
  }, [])

  return (
    <CheatcodesTemplateScreen title="Last login info 📱" flexDirection="column">
      <LastLoginInfoBanner lastLoginInfo={lastLoginInfo} />
    </CheatcodesTemplateScreen>
  )
}
