import { useState } from 'react'

export const useFlakyUseQueryMutation = () => {
  const [toto, setToto] = useState(true)
  return { mutate: () => setToto(false), toto }
}
