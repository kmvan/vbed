import React, { Component } from 'react'
import classNames from 'classnames'

import './style.scss'

class StatusTip extends Component {
    constructor() {
        super()
    }

    renderIcon() {
        const { type } = this.props
        let icon = ''

        switch (type) {
            case 'loading':
                icon = 'cog fa-spin'
                break
            case 'success':
            case 'ok':
                icon = 'check-circle'
                break
            case 'error':
                icon = 'times-circle'
                break
            case 'info':
                icon = 'info-circle'
                break
            case 'question':
                icon = 'question-circle'
                break
        }

        return <div className="status-tip-icon"><i className={`fa fa-fw fa-${icon}`} /></div>
    }


    renderContent() {
        if (this.props.children) {
            return <div className="status-tip-content">{this.props.children}</div>
        }
    }

    render() {
        const classStr = classNames({
            'status-tip': true,
            [`status-tip-${this.props.type}`]: true,
        })

        return (
            <div className={classStr}>
                {this.renderIcon()}
                {this.renderContent()}
            </div>
        )
    }
}

export default StatusTip
