import { computed, observable, action } from 'mobx'
import fetchServer from '~helper/fetch-server'

class store {
    @observable isLoading = true
    @observable data = {}

    constructor() {
        (async () => {
            const res = await fetchServer({
                action: 'init'
            })

            if (res && res.code === 0) {
                this.setData(res.data)
            }
            this.setIsLoading(false)
        })()
    }

    @action
    setIsLoading = isLoading => {
        this.isLoading = isLoading
    }

    @computed
    get isLoggedIn() {
        return this.data.isLoggedIn
    }

    @action
    setData = data => {
        this.data = data
    }

    @computed
    get csrf() {
        return this.data.csrf
    }
}

export default new store()
