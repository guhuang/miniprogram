import { unique } from '../utils/util'
const mockList = [
  { name: '1.scy', age: 18, gender: '男' },
  { name: '2.舒长云', age: 28, gender: '男' },
  { name: '3.舒長雲', age: 38, gender: '男' },
  { name: '4.scy', age: 18, gender: '男' },
  { name: '5.舒长云', age: 28, gender: '男' },
]
module.exports =  Behavior({
  properties: {
    params: {
      type: Object,
      value: {}
    },
    pageSize: {
      type: Number,
      value: 5
    },
    isShowRefresh: {
      type: Boolean,
      value: true
    },
    isPullDownRefresh: {
      type: Boolean,
      value: true
    },
    isReachBottom: {
      type: Boolean,
      value: true
    }
  },
  data: {
    isEnd: false,
    isEmpty: false,
    renderList: [],
    pageNum: 0,
  },
  observers: {
    'params.**': function (field) {
      console.log(field)
      this.initList()
    }
  },
  lifetimes: {
    async attached () {
      console.log(`comp attach`)
      const pages = getCurrentPages()
      this.currentPage = pages[pages.length - 1]
      this.currentPage.oldOnShow = this.currentPage.onShow
      this.currentPage.oldOnPullDownRefresh = this.currentPage.onPullDownRefresh
      this.currentPage.oldOnReachBottom = this.currentPage.onReachBottom
      if (this.data.isReachBottom) {
        this.currentPage.onReachBottom = async () => {
          if (this.currentPage.oldOnReachBottom) {
            await this.currentPage.oldOnReachBottom.call(this.currentPage)
          }
          if (!this.data.isEnd && !this.data.isEmpty) {
            await this.onReachBottom()
          }
        }
      }
      if (this.data.isPullDownRefresh) {
        const self = this
        this.currentPage.onPullDownRefresh = unique(async function () {
          if (self.currentPage.oldOnPullDownRefresh) {
            await self.currentPage.oldOnPullDownRefresh.call(self.currentPage)
          }
          await self.onPullDownRefresh()
        })
      }
      if (this.data.isShowRefresh) {
        this.currentPage.onShow = async () => {
          if (this.currentPage.oldOnShow) {
            await this.currentPage.oldOnShow.call(this.currentPage)
          }
          await this.onShow()
        }  
      } else {
        this.onShow()
      }
    },
    detached () {
      this.currentPage.onShow = this.currentPage.oldOnShow
      this.currentPage.onPullDownRefresh = this.currentPage.oldOnPullDownRefresh
      this.currentPage.onReachBottom = this.currentPage.oldOnReachBottom
    }
  },
  methods: {
    async onShow () {
      console.log('comp show');
      await this.initList()
    },
    async onPullDownRefresh () {
      console.log(`comp pulldownRefresh`)
      await this.initList()
      wx.stopPullDownRefresh()
    },
    async onReachBottom () {
      await this.loadData()
    },
    async initList () {
      console.log(`pulldownRefresh init`)
      this.setData({
        pageNum: 0,
        isEnd: false,
        isEmpty: false,
        renderList: []
      })
      return await this.loadData(true)
    },
    async loadData () {
      const { list, total } = await new Promise(resolve => {
        setTimeout(() => {
          const total = 17
          const noResult = {
            list: [],
            total: 0
          }
          const remaindNum = total - (this.data.pageNum * this.data.pageSize)
          const res = {
            list: remaindNum >= 5 ? mockList : mockList.slice(0, remaindNum),
            total: 17
          }
          resolve(res)
        }, 1000);
      })
      const key = `renderList[${this.data.pageNum}]`
      const currentTotal = this.data.pageSize * this.data.pageNum + list.length
      const data = {
        [key]: list,
        isEnd: currentTotal >= total,
        isEmpty: !total,
        pageNum: this.data.pageNum + 1,
      }
      this.setData(data)
    }
  }
})