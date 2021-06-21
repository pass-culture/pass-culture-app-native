import 'react-app-polyfill/ie9'
import 'react-app-polyfill/ie11'
import 'react-app-polyfill/stable'
import React from 'react'
import ReactDOM from 'react-dom'
import { View, Text } from 'react-native'
// import { App } from './App'

ReactDOM.render(
  <View>
    <Text>hello world</Text>
  </View>,
  document.getElementById('root')
)
