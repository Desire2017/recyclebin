// pages/trend/index.js
var util = require('../../utils/util.js');
var WxParse = require('../../wxParse/wxParse.js');
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tabs: ["推荐", "交流区"],
    activeIndex: 0,
    sliderOffset: 0,
    sliderLeft: 0,
    curIndex: 0,
    isScroll: !1
  },
  tabClick: function (e) {
    this.setData({
      sliderOffset: e.currentTarget.offsetLeft,
      activeIndex: e.currentTarget.id
    });
  },
  switchTab: function (e) {
    this.setData({
      curIndex: e.target.dataset.index
    });
    var a = e.target.id,
      res = this;
    wx.request({
      url: util.apiUrl + "GetInfoApi.ashx?type=1&cid=" + a,
      success: function (t) {
        res.setData({
          info: t.data.result
        });
        for (let i = 0; i < t.data.result.length; i++) {
          WxParse.wxParse('content' + i, 'html', t.data.result[i].content, self);
          if (i === t.data.result.length - 1) {
            WxParse.wxParseTemArray("contentList", 'content', t.data.result.length, self)
          }
        }
      }
    });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    var self = this;
    //页面标题
    wx.request({
      url: util.apiUrl + "GetPageTitleApi.ashx?type=2",
      success(res){
        wx.setNavigationBarTitle({
          title: res.data.result[0].title,
        })
      }
    })
    wx.request({
      url: util.apiUrl + "GetInfoApi.ashx?type=2",
      success: function (t) {
        self.setData({
          infoClass: t.data.result
        });
      }
    });
    wx.request({
      url: util.apiUrl + "GetInfoApi.ashx?type=1&cid=1",
      success: function (t) {
        self.setData({
          info: t.data.result
        });
        for (let i = 0; i < t.data.result.length; i++) {
          WxParse.wxParse('content' + i, 'html', t.data.result[i].content, self);
          if (i === t.data.result.length - 1) {
            WxParse.wxParseTemArray("contentList", 'content', t.data.result.length, self)
          }
        }
      }
    })
  },
  goInfo: function (e) {
    var id = e.currentTarget.dataset.id;
    console.log("id=======" + id);
    wx.navigateTo({
      url: '/pages/trend/details?id=' + id,
    })
  },
  switchTab: function (e) {
    var self = this;
    self.setData({
      curIndex: e.target.dataset.index
    });
    var a = e.target.id;
    
    wx.request({
      url: util.apiUrl + "GetInfoApi.ashx?type=1&cid=" + a,
      success: function (t) {
        self.setData({
          info: t.data.result
        });
        for (let i = 0; i < t.data.result.length; i++) {
          WxParse.wxParse('content' + i, 'html', t.data.result[i].content, self);
          if (i === t.data.result.length - 1) {
            WxParse.wxParseTemArray("contentList", 'content', t.data.result.length, self)
          }
        }
      }
    });
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  }
})