import queryString from 'query-string'

export default (args = {}) => {
    args = {
        ...{
            action: '',
        }, ...args
    }

    return 'api/?' + queryString.stringify(args)
}
