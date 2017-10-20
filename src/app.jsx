import 'babel-polyfill'
import 'isomorphic-fetch'

import React from 'react'
import { render } from 'react-dom'
import Index from './components'
import ready from './components/ready'

import './components/style/global.scss'

ready(() => {
    const rootInstance = render(
        <Index />,
        document.getElementById('app')
    )
})

