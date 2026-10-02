import { useState } from 'react'

type UseOneTimePasswordParams = { numberOfInputs: number }

export const useOneTimePassword = ({ numberOfInputs }: UseOneTimePasswordParams) => {
  const [code, setCode] = useState<string[]>(() => Array.from({ length: numberOfInputs }, () => ''))

  const handleCodeChange = (nextCode: string[]) => setCode(nextCode)

  const isCodeComplete = code.length === numberOfInputs && code.every((value) => /^\d$/.test(value))

  return { code, isCodeComplete, handleCodeChange }
}
