
const app = getApp()

export default function MPage(option) {
  const regeneratorRuntime = regeneratorRuntime

  const onLoad = option.onLoad
  option.onLoad = function(e) {
    app.setWatcher(this)
    onLoad && onLoad.call(this, e)
  }
  Page(option)
}