import React, { Component } from 'react'
import { _ } from '~helper/i18n'

class Footer extends Component {
    render() {
        return (
            <div className="footer">
                <a href="https://inn-studio.com/vbed/" target="_blank"><i className="fa fa-weibo"></i> {_('V-Bed')} </a> by <a href="https://inn-studio.com/" target="_blank">INN STUDIO</a>
            </div>
        )
    }
}

export default Footer
