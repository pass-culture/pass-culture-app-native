import React, { useContext, useEffect, useState } from 'react'

import { getIsE2e } from 'libs/e2e/getIsE2e'
import { env } from 'libs/environment'

const E2eContext = React.createContext<boolean>(false)

export function E2eContextProvider({ children }: { children: JSX.Element | JSX.Element[] }) {
  const [isE2e, setIsE2e] = useState<boolean>(false)
  useEffect(() => {
    getIsE2e().then(setIsE2e)
  }, [])
  return <E2eContext.Provider value={isE2e}>{children}</E2eContext.Provider>
}

export function useIsE2e(): boolean {
  const isE2e = useContext(E2eContext)
  return env.ENV !== 'production' && isE2e
}
