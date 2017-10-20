function getUrl(filename, size = 'large') {
    if (!filename) {
        return ''
    }
    return `https://wx3.sinaimg.cn/${size}/${filename}`
}

export default getUrl
