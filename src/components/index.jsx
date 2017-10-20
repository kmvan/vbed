import '~helper/lang-loader'
import React, { Component } from 'react'
import { observer, inject } from 'mobx-react'
import StatusTip from '~helper/status-tip'
import Login from './login'
import Footer from './footer'
import VbedMain from './vbed-main'
import { _ } from '~helper/i18n'
import storeServer from '~stores/server'

@observer
class Index extends Component {
    constructor() {
        super()
        this.storeServer = storeServer
    }

    renderContent() {
        if (this.storeServer.isLoading) {
            return <StatusTip type="loading" >{_('Loading, please wait...')}</StatusTip>
        }

        return [
            <Login key="Login" />,
            <VbedMain key="VbedMain" />,
            <Footer key="Footer" />,
        ]
    }

    render() {
        return (
            <div className="container">
                {this.renderContent()}
            </div>
        )
    }
}

export default Index
