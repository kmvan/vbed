import React, { Component } from 'react'
import { observer } from 'mobx-react'
import getAjaxUrl from '~helper/get-ajax-url'
import getFileUrlByFilename from '~helper/get-img-url-by-filename'
import copy from 'copy-to-clipboard'
import { _ } from '~helper/i18n'

import storeFiles from '~stores/files'

@observer
class ToolContainer extends Component {
    constructor() {
        super()

        this.storeFiles = storeFiles
    }

    copyAll = () => {
        copy(this.storeFiles.getAllTpl())
    }

    clearList = () => {
        if (window.confirm(_('Are you sure Clean all?'))) {
            this.storeFiles.setFiles([])
        }
    }

    render() {
        if (this.storeFiles.filesCount < 2) {
            return null
        }

        const btns = [{
            tx: _(`Copy (%d)`).replace('%d', this.storeFiles.filesCount),
            icon: 'copy',
            callback: this.copyAll,
            className: 'button',
        }, {
            type: 'select',
            tx: this.storeFiles.COPY_MODES,
            callback: this.storeFiles.setFilesCopyMode,
            value: this.storeFiles.filesCopyMode,
        }, {
            type: 'select',
            tx: this.storeFiles.SIZES,
            callback: this.storeFiles.setFilesSize,
            value: this.storeFiles.filesSize,
        }, {
            type: 'select',
            tx: this.storeFiles.SPLIT_PAGES,
            callback: this.storeFiles.setSplitPage,
            value: this.storeFiles.splitPage,
        }, {
            tx: _('Reverse'),
            icon: 'exchange fa-rotate-90',
            callback: this.storeFiles.reverseFiles,
        }, {
            tx: _('Clean'),
            icon: 'trash',
            callback: this.clearList,
        }]

        return (
            <div className="tool-container btn-group">
                {btns.map((btn, i) => {
                    const { value, className, tx, icon, callback } = btn

                    switch (btn.type) {
                        case 'select':
                            return (
                                <select
                                    key={i}
                                    onChange={e => callback(e.target.value)}
                                    value={value}
                                >
                                    {Object.entries(tx).map(([k, v], j) =>
                                        <option key={`opt-${i}${j}`} value={k}>{v}</option>
                                    )}
                                </select>
                            )
                        default:
                            return (
                                <button
                                    key={i}
                                    onClick={callback}
                                    className={className || 'button button-outline'}
                                >
                                    <i className={`fa fa-${icon}`} />{' '}{tx}
                                </button>
                            )
                    }
                })}
            </div>
        )
    }
}

export default ToolContainer
