var util = require('../../utils/util.js');
var WxParse = require('../../wxParse/wxParse.js');
//获取应用实例
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    var self = this;
    wx.request({
      url: util.apiUrl + 'GetArticleApi.ashx?type=0&id=1' ,
      success(res) {
        wx.setNavigationBarTitle({
          title: res.data.result[0].title,
        })
        self.setData({
          title: res.data.result[0].title
        })
        WxParse.wxParse('content', 'html', res.data.result[0].content, self, 10)
      }
    })
  },

  

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {

  },

})