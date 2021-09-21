import React from 'react'
import ReactDOM from 'react-dom'

import { App } from './App'
import reportWebVitals from './reportWebVitals'
import * as serviceWorkerRegistration from './serviceWorkerRegistration'

ReactDOM.render(<App />, document.getElementById('root'))

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://cra.link/PWA
serviceWorkerRegistration.register({
  onUpdate: () => {
    // eslint-disable-next-line
    console.log('onUpdate serviceWorker')
    window.location.reload()
    window.alert(
      'Nous avons mis à jour le pass Culture ! L‘application va maintenant se relancer pour appliquer les changements.'
    )
  },
  onSuccess: () => {
    // eslint-disable-next-line
    console.log('onSuccess serviceWorker: Content is cached for offline use')
  },
})

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals()
