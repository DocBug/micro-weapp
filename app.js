import Watcher from './utils/watcher'
import './utils/runtime'
import './utils/config'

App({

  setWatcher: Watcher.setWatcher,
  observe: Watcher.observe,

  watch: {
    userInfo: {
      handler(newVal, oldVal) {
        console.log('userInfo:', newVal, oldVal)
      },
      deep: true
    }
  },

  onLaunch () {
    global.app = this
    this.setWatcher(this)
  },
  
  globalData: {
    userInfo: null
  },

  $watchDate: {
    name: 'zhangsan',
    shopcart: [],
    project: {
      name: '12',
      id: 10
    }
  },
  
})