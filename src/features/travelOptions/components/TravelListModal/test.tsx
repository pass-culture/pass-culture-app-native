import React, { useEffect } from 'react'
import {
  StyleSheet,
  View,
  Button,
  NativeModules,
  NativeEventEmitter,
  BackHandler,
  Text,
} from 'react-native'
import HyperSdkReact from 'hyper-sdk-react'
HyperSdkReact.createHyperServices()
const App = () => {
  const initiatePayload = JSON.stringify({
    // Replace with your initiate payload
    requestId: '6bdee986-f106-4884-ba9a-99c478d78c22',
    service: 'in.yatri.consumer',
    payload: {
      clientId: 'passcultureconsumer',
      merchantId: 'passcultureconsumer',
      action: 'initiate',
      environment: 'master',
      service: 'in.yatri.consumer',
    },
  })
  const processPayload2 = JSON.stringify({
    // Replace with your process payload
    requestId: '6bdee986-f106-4884-ba9a-99c478d78c22',
    service: 'in.yatri.consumer',
    payload: {
      clientId: 'passcultureconsumer',
      merchantId: 'passcultureconsumer',
      action: 'initiate',
      service: 'in.yatri.consumer',
      environment: 'master',
      signatureAuthData: {
        signature:
          'nXVl9/UH67bd4UTUJfkns54F7FDRTk0igFjRuJN5RCl8rEZNTnlwJwWaSWEnI4kVsizKqK03+hv7KowJduV2dJNToa4jEq+q+lWhVx4hW9zWllX7qVzu94WWXyrJV/zBod/XmrGqEaNgM2BxFsSHsqbKGcKkATbmf1hO9BHHkr0Fia+p1vPyf7rW7l2SDXQq0Ywcx5d9CtO6S74N+rAS0ntXLmjIsuHncQFG2JfRg0g/aBGxeDq02rtjcUVxe1nVj9nPi/xG6n5tvVQLnNyHEf58nPb2/aYIyl9xC8h7Nm/UnONLJwzBlTumMn+knG7r0wBm1iRP+QIL29ZOaceXgg==',
        authData:
          '{"mobileNumber":"9493143166","mobileCountryCode":"+91","merchantId":"MOBILITY_PASSCULTURE","timestamp":"2023-04-13T07:28:40+00:00"}',
      },
    },
  })
  const handleClick = () => {
    HyperSdkReact.initiate(initiatePayload)
    HyperSdkReact.isInitialised().then((init) => {
      console.log('isInitialised:', init)
    })
  }
  useEffect(() => {
    const eventEmitter = new NativeEventEmitter(NativeModules.HyperSdkReact)
    const eventListener = eventEmitter.addListener('HyperEvent', (resp) => {
      const data = JSON.parse(resp)
      const event = data.event || ''
      switch (event) {
        case 'show_loader':
          // show some loader here
          break
        case 'hide_loader':
          // hide the loader
          break
        case 'initiate_result':
          const payload = data.payload || {}
          const res = payload ? payload.status : payload
          console.log('initiate_result: ', payload)
          if (res === 'SUCCESS') {
            // Initiation is successful, call process method
            HyperSdkReact.process(processPayload2)
            console.log('process_call: is called ', payload)
          } else {
            // Handle initiation failure
            console.log('Initiation failed.')
          }
          break
        case 'process_result':
          const processPayload = data.payload || {}
          console.log('process_result: ', processPayload)
          // Handle process result
          if (processPayload?.action === 'terminate') {
            HyperSdkReact.terminate()
            console.log('process_call: is called ', processPayload)
          }
          break
        default:
          console.log('Unknown Event', data)
      }
    })
    BackHandler.addEventListener('hardwareBackPress', () => {
      return !HyperSdkReact.isNull() && HyperSdkReact.onBackPressed()
    })
    return () => {
      eventListener.remove()
      BackHandler.removeEventListener('hardwareBackPress', () => null)
    }
  }, [])
  return (
    <View style={{ flex: 1 }}>
      <Button onPress={handleClick} title="ride"></Button>
    </View>
  )
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
})
export default App
