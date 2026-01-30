import { useNavigation } from '@react-navigation/native'
import React, { useEffect } from 'react'

export const Chatbot = () => {
  const { goBack } = useNavigation()
  return <Chatbotx />
}

const Chatbotx = () => {
  useEffect(() => {
    if (document.getElementById('lightchat-bot')) return

    const script = document.createElement('script')

    script.src = 'https://genii-script.tolk.ai/lightchat.js'
    script.type = 'module'
    script.id = 'lightchat-bot'

    script.setAttribute('project-id', '6811b250-212c-4365-8c46-20cc3082d042')

    document.body.appendChild(script)

    return () => {
      document.body.removeChild(script)
    }
  }, [])

  return null
}
