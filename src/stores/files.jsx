import { computed, observable, action } from 'mobx'
import moveUp from '~helper/array-move-up'
import moveDown from '~helper/array-move-down'
import getFileUrlByFilename from '~helper/get-img-url-by-filename'
import { _ } from '~helper/i18n'

class store {
    DEFAULT_FILE = {
        isUploading: true,
        error: '',
        filename: '',
        size: 'large',
        copyMode: 'copyUrl',
        copyCount: 0,
    }
    SIZES = {
        bmiddle: 'bmiddle,mw=400',
        large: 'large,original',
        mw1024: 'mw1024,mw=1024',
        mw600: 'mw600,mw=600',
        mw690: 'mw690,mw=690',
        orj480: 'orj480,mw=480',
        small: 'small,mw/mh=200',
        sq612: 'sq612,mw/mh=612,crop',
        square: 'square,mw/mh=80,crop',
        thumb150: 'thumb150,mw/mh=150,crop',
        thumb180: 'thumb180,mw/mh=180,crop',
        thumb300: 'thumb300,mw/mh=300,crop',
        thumbnail: 'thumbnail,mw/mh=120',
    }
    COPY_MODES = {
        copyUrl: _('Copy URL only'),
        copyImg: _('Copy image HTML'),
        copyImgWithLink: _('Copy image HTML with link'),
        copyMdImg: _('Copy Markdown image'),
        copyMdImgWithLink: _('Copy Markdown image with link'),
    }
    SPLIT_PAGES = {
        0: _('No page breaks'),
        1: _('%d image(s) per page').replace('%d', 1),
        2: _('%d image(s) per page').replace('%d', 2),
        3: _('%d image(s) per page').replace('%d', 3),
        4: _('%d image(s) per page').replace('%d', 4),
        5: _('%d image(s) per page').replace('%d', 5),
        10: _('%d image(s) per page').replace('%d', 10),
    }
    SPLIT_TAG = '<!--nextpage-->'
    LAST_SIZE_ID = 'vbedLastSize'
    LAST_COPY_MODE_ID = 'vbedLastCopyMode'

    @observable upload = () => { }
    @observable uploadSuccess = () => { }
    @observable files = []
    @observable isUploading = false
    @observable lastFileSize = 'large'
    @observable lastFileCopyMode = 'copyUrl'
    @observable filesCopyMode = 'copyUrl'
    @observable filesSize = 'mw1024'
    @observable refs = {}
    @observable splitPage = 0

    @action
    setUploadSuccessCallback = uploadSuccess => {
        this.uploadSuccess = uploadSuccess
    }
    @action
    setSplitPage = splitPage => {
        this.splitPage = ~~splitPage
    }
    @action
    setRef = (id, c) => {
        this.refs[id] = c

        return c
    }

    get getLastFileSize() {
        const last = localStorage.getItem(this.LAST_SIZE_ID)

        if (!last || last === 'undefined') {
            return this.DEFAULT_FILE.size
        }

        return last
    }

    get getLastFileCopyMode() {
        const last = localStorage.getItem(this.LAST_COPY_MODE_ID)

        if (!last || last === 'undefined') {
            return this.DEFAULT_FILE.copyMode
        }

        return last
    }

    @computed
    get isAllFileComputed() {
        for (let i = 0; i < this.filesCount; i++) {
            if (this.files[i].isUploading) {
                return false
            }
        }

        return true
    }

    @action
    setLastFileSize = lastFileSize => {
        this.lastFileSize = lastFileSize

        localStorage.setItem(this.LAST_SIZE_ID, lastFileSize)
    }

    @action
    setLastFileCopyMode = lastFileCopyMode => {
        this.lastFileCopyMode = lastFileCopyMode

        localStorage.setItem(this.LAST_COPY_MODE_ID, lastFileCopyMode)
    }

    @action
    reverseFiles = () => {
        this.files = this.files.reverse()
    }

    @action
    moveFile = (type, i) => {
        switch (type) {
            case 'up':
                moveUp(this.files, this.files[i])
                break
            case 'down':
                moveDown(this.files, this.files[i])
                break
            case 'top':
                moveUp(this.files, this.files[i], i)
                break
            case 'bottom':
                moveDown(this.files, this.files[i], this.filesCount - 1)
                break
            case 'delete':
            case 'remove':
                this.files.splice(i, 1)
                break
        }
    }


    @action
    setUploadCallback = (upload) => {
        this.upload = upload
    }

    @computed
    get filesCount() {
        return this.files.length
    }

    @action
    setIsUploading = isUploading => {
        this.isUploading = isUploading
    }

    @action
    setFiles = files => {
        this.files = files
    }

    @action
    setFile = (i, file) => {
        this.files[i] = { ...this.files[i], ...file }
    }

    @action
    addFile = file => {
        this.files.unshift({ ...this.DEFAULT_FILE, ...file })
    }

    getAllTpl = () => {
        let tpls = []
        this.files.map((file, i) => {
            tpls.push(this.getTpl(file))

            i !== (this.filesCount - 1)
                &&
                (i + 1) >= this.splitPage
                &&
                (i + 1) % this.splitPage === 0
                && tpls.push(this.getSplitPageTpl())
        })

        return tpls.join(`\n`)
    }

    getTpl = file => {
        const alt = _('V-Bed by INN STUDIO')
        const { copyMode, size, filename } = file
        const imgUrl = getFileUrlByFilename(filename, size)
        const imgUrlLarge = getFileUrlByFilename(filename, 'large')
        const img = `<img src="${imgUrl}" alt="${alt}" />`

        switch (copyMode) {
            case 'copyUrl':
                return imgUrl
            case 'copyImg':
                return img
            case 'copyImgWithLink':
                return `<a href="${imgUrlLarge}" target="_blank" ref="nofollow">${img}</a>`
            case 'copyMdImg':
                return `![${alt}][${imgUrl}]`
            case 'copyMdImgWithLink':
                return `[![${alt}](${imgUrl})](${imgUrlLarge})`
        }
    }

    @action
    setFilesCopyMode = copyMode => {
        this.files = this.files.map(file => {
            if (file.copyMode !== copyMode) {
                file.copyMode = copyMode
            }

            return file
        })
        this.filesCopyMode = copyMode
        this.setLastFileCopyMode(copyMode)
    }

    @action
    setFilesSize = size => {
        this.files = this.files.map(file => {
            if (file.size !== size) {
                file.size = size
            }
            file.copyMode = 'copyUrl'

            return file
        })
        this.filesSize = size
        this.setLastFileSize(size)
    }

    getSplitPageTpl(i) {
        return `${this.SPLIT_TAG}`
    }
}

export default new store()
