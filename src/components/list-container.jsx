import React, { Component } from 'react'
import { observer } from 'mobx-react'
import getAjaxUrl from '~helper/get-ajax-url'
import getFileUrlByFilename from '~helper/get-img-url-by-filename'
import copy from 'copy-to-clipboard'
import SplitPage from './split-page'
import { _ } from '~helper/i18n'

import './style/list.scss'

import storeFiles from '~stores/files'

@observer
class ListContainer extends Component {
    constructor() {
        super()

        this.storeFiles = storeFiles
    }

    renderItemUrl(file, i) {
        if (file.error) {
            return null
        }

        const refId = `tpl-${i}`
        return (
            <input
                type="text"
                className="widefat"
                value={file.isUploading ? _('Uploading...') : this.storeFiles.getTpl(file)}
                onChange={() => false}
                spellCheck={false}
                autoComplete="false"
            />
        )
    }

    setCopyMode = (copyMode, i) => {
        this.storeFiles.setFile(i, {
            copyMode,
        })
        this.storeFiles.setLastFileCopyMode(copyMode)
    }

    renderCopyMode(file, i) {
        if (file.isUploading || file.error) {
            return
        }

        const opts = Object.entries(this.storeFiles.COPY_MODES).map(([mode, text], i) =>
            <option key={i} value={mode}>{text}</option>
        )

        return (
            <select
                onChange={e => this.setCopyMode(e.target.value, i)}
                value={file.copyMode}
            >
                {opts}
            </select>
        )
    }

    copy = (file, i) => {
        copy(this.storeFiles.getTpl(file))
        this.storeFiles.setFile(i, {
            copyCount: file.copyCount + 1
        })
    }

    renderCopyBtn(file, i) {
        if (file.isUploading || file.error) {
            return
        }

        return (
            <button
                className="button copy"
                onClick={() => this.copy(file, i)}
            >
                <i className="fa fa-files-o" />
                <span className="tx">
                    {` ${_('Copy')}`}
                    {file.copyCount ? ` +${file.copyCount}` : ''}
                </span>
            </button>
        )
    }

    setFileSize = (size, i) => {
        this.storeFiles.setFile(i, {
            size,
        })
        this.storeFiles.setLastFileSize(size)
    }

    renderSize(file, i) {
        if (file.isUploading || file.error) {
            return
        }
        const opts = Object.entries(this.storeFiles.SIZES).map(([size, text]) =>
            <option key={size} value={size}>{text}</option>
        )

        return (
            <select
                onChange={e => this.setFileSize(e.target.value, i)}
                value={file.size}
            >
                {opts}
            </select>
        )
    }

    deleteFile = async (i) => {
        if (window.confirm(_('Are you sure delete this item?'))) {
            this.storeFiles.moveFile('delete', i)
        }
    }

    renderControlBtn(file, i) {
        if (!this.storeFiles.isAllFileComputed || file.error) {
            return
        }

        let btns = [{
            tx: _('Delete'),
            icon: 'trash',
            callback: () => this.deleteFile(i),
        }]

        if (this.storeFiles.filesCount > 1 && i !== 0) {
            btns.push({
                tx: _('Top'),
                icon: 'step-backward fa-rotate-90',
                callback: () => this.storeFiles.moveFile('top', i),
            })
        }

        if (this.storeFiles.filesCount > 3 && i > 1 && i < this.storeFiles.filesCount - 1) {
            btns.push({
                tx: _('Up'),
                icon: 'play fa-rotate-270',
                callback: () => this.storeFiles.moveFile('up', i),
            })
        }

        if (this.storeFiles.filesCount > 3 && i > 0 && i < this.storeFiles.filesCount - 2) {
            btns.push({
                tx: _('Down'),
                icon: 'play fa-rotate-90',
                callback: () => this.storeFiles.moveFile('down', i),
            })
        }

        if (this.storeFiles.filesCount > 1 && i < this.storeFiles.filesCount - 1) {
            btns.push({
                tx: _('Bottom'),
                icon: 'step-backward fa-rotate-270',
                callback: () => this.storeFiles.moveFile('bottom', i),
            })
        }

        return (
            <div className="tools">
                {btns.map((btn, i) => (
                    <button
                        key={i}
                        onClick={btn.callback}
                        className="button button-outline"
                    >
                        <i className={`fa fa-${btn.icon}`} />
                        <span className="tx">
                            {` ${btn.tx}`}
                        </span>
                    </button>
                ))}
            </div>
        )
    }

    reUpload = async (file, i) => {
        this.storeFiles.setFile(i, {
            error: '',
            isUploading: true,
        })
        const res = await this.storeFiles.upload({ file, i })
        await this.storeFiles.uploadSuccess({ i, res })
    }

    renderError(file, i) {
        if (file.error) {
            return <button
                className="button widefat btn-reupload"
                onClick={() => this.reUpload(file, i)}
            >
                <i className="fa fa-refresh" />
                {' '}
                {_('Error, click to re-upload (%s)').replace('%s', file.error)}
            </button>
        }
    }

    renderTools(...args) {
        if (args[0].error) {
            return null
        }

        return (
            <div className="tools btn-group" >
                {this.renderCopyBtn(...args)}
                {this.renderCopyMode(...args)}
                {this.renderSize(...args)}
            </div >
        )
    }

    renderThumbnail(file, i) {
        if (file.isUploading) {
            return <i className="fa fa-spin fa-cog fa-5x" />
        }

        if (file.error) {
            return <i className="fa fa-times-rectangle fa-5x" />
        }

        return <a href={getFileUrlByFilename(file.filename, file.size)} target="_blank">
            <img src={getFileUrlByFilename(file.filename, 'thumb150')} alt="" />
        </a>
    }

    renderItem(file, i) {
        return (
            <div
                key={i}
                className="item"
            >
                <div className="preview">
                    {this.renderThumbnail(file, i)}
                </div>
                <div className="body">
                    {this.renderItemUrl(file, i)}
                    {this.renderTools(file, i)}
                    {this.renderControlBtn(file, i)}
                    {this.renderError(file, i)}
                </div>
            </div>

        )
    }

    renderItems() {
        let items = []

        this.storeFiles.files.map((file, i) => {
            items.push(this.renderItem(file, i))
            const splitPage = <SplitPage index={i} key={`split-page-${i}`} />
            splitPage && items.push(splitPage)
        })

        return items
    }

    render() {
        if (!this.storeFiles.filesCount) {
            return null
        }
        return (
            <div className="list-container">
                {this.renderItems()}
            </div>
        )
    }
}

export default ListContainer
