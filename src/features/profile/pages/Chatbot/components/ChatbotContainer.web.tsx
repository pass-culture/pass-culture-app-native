import React, { useEffect } from 'react'
import { styled } from 'styled-components'

export const ChatbotContainer = () => {
  return (
    <Container>
      <Chatbot />
    </Container>
  )
}

const Container = styled.div({
  height: 600,
  backgroundColor: 'red',
})

const Chatbot = () => {
  useEffect(() => {
    if (document.getElementById('lightchat-bot')) return

    const script = document.createElement('script')

    script.src = 'https://genii-script.tolk.ai/lightchat.js'
    script.type = 'module'
    script.id = 'lightchat-bot'

    script.setAttribute('project-id', '6811b250-212c-4365-8c46-20cc3082d042')
    script.setAttribute('template', 'fullscreen')
    script.setAttribute('template-fullscreen-height', '100%')

    document.body.appendChild(script)

    return () => {
      document.body.removeChild(script)
    }
  }, [])

  return null
}

export default Chatbot
