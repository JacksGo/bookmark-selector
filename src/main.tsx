import React from 'react'
import ReactDOM from 'react-dom/client'
import { FluentProvider, webLightTheme } from '@fluentui/react-components'

import App from './App'
import StateProvider from './state/StateProvider'

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <FluentProvider theme={webLightTheme}>
      <StateProvider>
        <App />
      </StateProvider>
    </FluentProvider>
  </React.StrictMode>,
)
