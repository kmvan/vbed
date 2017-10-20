import React, { Component } from 'react'
import { observer } from 'mobx-react'
import { _ } from '~helper/i18n'

import './style/split-page'

import storeFiles from '~stores/files'

@observer
class SplitPage extends Component {
    static defaultProps = {
        index: 0,
    }

    constructor() {
        super()

        this.storeFiles = storeFiles
    }

    render() {
        const i = this.props.index

        if (
            i !== (this.storeFiles.filesCount - 1)
            &&
            (i + 1) >= this.storeFiles.splitPage
            &&
            (i + 1) % this.storeFiles.splitPage === 0
        ) {
            return <div className="split-page">
                <i className="fa fa-cut" />
                {` ${_('Page Breaks')} `}
                <i className="fa fa-cut" />
            </div>
        }

        return null
    }
}

export default SplitPage
