import React, { Component } from 'react'
import { observer } from 'mobx-react'
import { _ } from '~helper/i18n'

import './style/login.scss'

import storeServer from '~stores/server'

@observer
class Login extends Component {
    constructor() {
        super()

        this.storeServer = storeServer
    }

    reload = (e) => {
        e.preventDefault()
        location.reload()
    }


    render() {
        if (this.storeServer.isLoggedIn) {
            return null
        }

        return (
            <div className="login">
                <p>{_('Welcome, please sign Sina Weibo to authorize V-Bed')}</p>
                <button
                    className="button widefat"
                    onClick={this.reload}
                >
                    <i className="fa fa-check-circle" />{' '}
                    {_('Has been authorized and Click to refresh')}
                </button>
                <a
                    href={this.storeServer.data.oauthUrl}
                    className="button button-outline widefat"
                >
                    <i className="fa fa-question-circle" />{' '}
                    {_('Not authorized, please click here')}
                </a>
            </div>
        )
    }
}

export default Login
