Component({
  properties: {
    isEnd: {
      type: Boolean,
      value: false
    },
    isEmpty: {
      type: Boolean,
      value: false
    },
    endTips: {
      type: String,
      value: '—— 暂无更多 ——'
    },
    loadingTips: {
      type: String,
      value: '正在拼命加载中'
    }
  }
})