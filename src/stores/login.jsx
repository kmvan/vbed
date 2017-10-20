import { action, computed, observable } from 'mobx'
import fetchServer from '~helper/fetch-server'
import { get } from 'lodash'
class store {
    @observable isLoggedIn = false
    @observable isLoading = true

    constructor() {
        (async () => {
            const res = await fetchServer({
                action: 'checkLogin',
            })

            if (res && res.code === 0) {
                res.data.isLoggedIn && this.setIsLoggedIn(true)
            }
        })
    }


}

export default new store()
