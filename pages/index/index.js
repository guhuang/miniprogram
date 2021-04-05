Page({
  data: {
    name: 'scy',
    params: {
      city: '北京',
      department: '开发部门',
      title: '测试'
    }
  },
  onShow () {
    console.log('page show');
  },
  onPullDownRefresh () {
    console.log('page pullDownRefersh');
  },
  onReachBottom () {
    console.log(`page onReachBottom`)
  },
  modifyConditions (e) {
    const { type } = e.currentTarget.dataset
    if (type === 'city') {
      this.setData({
        'params.city': '上海'
      })
    } else if (type === 'department') {
      this.setData({
        'params.department': 'HR部门'
      })
    } else if (type === 'title') {
      this.setData({
        'params.title': 'test'
      })
    }
  }
})