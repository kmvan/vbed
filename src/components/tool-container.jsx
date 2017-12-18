import React, { Component } from 'react'
import { observer } from 'mobx-react'
import getAjaxUrl from '~helper/get-ajax-url'
import getFileUrlByFilename from '~helper/get-img-url-by-filename'
import copy from 'copy-to-clipboard'
import { _ } from '~helper/i18n'
import classNames from 'classnames'

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
            className: {
                'button': true,
            },
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
            className: {
                'button': true,
                'button-outline': true,
            },
        }, {
            tx: _('Clean'),
            icon: 'trash',
            callback: this.clearList,
            className: {
                'button': true,
                'button-outline': true,
            },
        }]

        return (
            <div className="tool-container row">
                {btns.map((btn, i) => {
                    const { value, className, tx, icon, callback } = btn
                    let el
                    let gridClass = className || {}
                    gridClass = {
                        ...gridClass, ...{
                            'widefat': true
                        }
                    }
                    switch (btn.type) {
                        case 'select':
                            el = <select
                                onChange={e => callback(e.target.value)}
                                value={value}
                                className={classNames(gridClass)}
                            >
                                {Object.entries(tx).map(([k, v], j) =>
                                    <option key={`opt-${i}${j}`} value={k}>{v}</option>
                                )}
                            </select>
                            break
                        default:
                            el = <button
                                onClick={callback}
                                className={classNames(gridClass)}
                            >
                                <i className={`fa fa-${icon}`} />
                                <span className="tx">
                                    {` ${tx}`}
                                </span>
                            </button>
                    }

                    return <div
                        className="column"
                        key={i}
                    >{el}</div>
                })}
            </div>
        )
    }
}

export default ToolContainer
