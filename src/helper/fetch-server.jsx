import getAjaxUrl from './get-ajax-url'

export default (urlArgs, header = {}) => {
    return new Promise(async (resolve) => {
        if (header.body) {
            if (!header.method) {
                header.method = 'post'
            }
        }

        header = {
            ...{
                credentials: 'same-origin',
                method: 'get',
            }, ...header
        }

        let res

        try {
            res = await fetch(getAjaxUrl(urlArgs), header)
            res = await res.json()
        } finally {
            resolve(res)
        }
    })
}
