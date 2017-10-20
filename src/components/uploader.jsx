import React, { Component } from 'react'
import { observer } from 'mobx-react'
import getAjaxUrl from '~helper/get-ajax-url'
import { _ } from '~helper/i18n'
import './style/uploader'

import storeServer from '~stores/server'
import storeFiles from '~stores/files'

@observer
class Uploader extends Component {
    ALLOW_FILE_TYPES = ['image/png', 'image/gif', 'image/jpeg']
    constructor() {
        super()
        this.storeFiles = storeFiles
        this.storeServer = storeServer
        this.storeFiles.setUploadCallback(this.upload)
        this.storeFiles.setUploadSuccessCallback(this.uploadSuccess)
    }


    fileChange = async (e) => {
        e.stopPropagation()
        e.preventDefault()
        const files = Array.from(e.dataTransfer ? e.dataTransfer.files : e.target.files)
        const filesCount = files.length

        if (!filesCount) {
            return false
        }

        for (const file of files) {
            this.storeFiles.addFile({
                file,
            })
        }

        for (let i = filesCount - 1; i >= 0; i--) {
            const file = files[i]

            if (this.ALLOW_FILE_TYPES.indexOf(file.type) === -1) {
                continue
            }

            const res = await this.upload({
                file,
                i,
            })
            await this.uploadSuccess({
                i,
                res,
            })
        }
    }

    upload = async ({ file, i }) => {
        return new Promise((resolve, reject) => {
            const fd = new FormData()
            fd.append('file', file)

            const xhr = new XMLHttpRequest()
            xhr.addEventListener('load', () => {
                if (xhr.status === 200) {
                    let res = xhr.responseText

                    try {
                        res = JSON.parse(res)
                    } catch (err) {
                        resolve(err.toString())
                    }

                    setTimeout(() => {
                        resolve(res)
                    }, 1)
                }
            })
            xhr.addEventListener('error', () => {
                reject(xhr.statusText)
            })
            xhr.open('post', getAjaxUrl({
                action: 'upload',
                csrf: this.storeServer.csrf,
            }))
            xhr.send(fd)
        })
    }

    uploadSuccess = async ({
        i,
        res,
    } = {}) => {
        if (res && res.code === 0) {
            const file = res.data.file
            this.storeFiles.setFile(i, {
                isUploading: false,
                isNew: false,
                filename: res.data.filename,
                error: '',
                size: this.storeFiles.getLastFileSize,
            })
        } else if (res && res.code) {
            this.storeFiles.setFile(i, {
                error: res.msg,
                isUploading: false,
                isNew: false,
            })
        } else {
            console.log(res)
            this.storeFiles.setFile(i, {
                error: res,
                isUploading: false,
                isNew: false,
            })
        }
    }

    uploadError = async ({
        e,
        i,
    } = {}) => {
        this.storeFiles.setFile(i, {
            error: 'Upload error',
            isUploading: false,
        })
    }

    renderFile() {
        return (
            <input
                type="file"
                onChange={this.fileChange}
                value=""
                multiple="multiple"
                accept="image/gif, image/jpeg, image/png"
                hidden
            />
        )
    }

    render() {
        return (
            <div className="uploader-container">
                <label
                    className="uploader button widefat"
                    onDragStart={this.fileChange}
                    onDrop={this.fileChange}
                    onDragEnter={this.fileChange}
                    onDragLeave={this.fileChange}
                    onDragEnd={this.fileChange}
                    onDragOver={this.fileChange}
                >
                    <i className="fa fa-picture-o" />{' '}
                    {_('Select / Drag and drop / Paste')}
                    {' '}<i className="fa fa-picture-o" />
                    {this.renderFile()}
                </label>
            </div>
        )
    }
}

export default Uploader
