import React, { Component } from 'react'
import { observer } from 'mobx-react'
import Uploader from './uploader.jsx'
import ListContainer from './list-container'
import ToolContainer from './tool-container'

import storeServer from '~stores/server'

@observer
class VbedMain extends Component {
    constructor() {
        super()
        this.storeServer = storeServer
    }

    render() {
        if (!this.storeServer.isLoggedIn) {
            return null
        }

        return (
            <div className="vbed-container">
                <Uploader />
                <ToolContainer />
                <ListContainer />
            </div>
        )
    }
}

export default VbedMain
