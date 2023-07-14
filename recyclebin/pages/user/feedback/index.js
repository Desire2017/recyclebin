var util = require('../../../utils/util.js');
//获取应用实例
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },
  radioChange: function (e) {
    console.log('radio发生change事件，携带value值为：', e.detail.value)
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var uid = wx.getStorageSync('uid');
    var self = this;
    wx.request({
      url: util.apiUrl + "GetFeedbackApi.ashx?type=1&id=" + uid,
      success: function (e) {
        self.setData({
          list: e.data.result
        })
      }
    })
    wx.request({
      url: util.apiUrl + 'GetFeedbackApi.ashx?type=3',
      success: function (e) {
        self.setData({
          class: e.data.result
        })
      }
    })
  },
  onShow: function () {
    wx.hideShareMenu({
      menus: ['shareAppMessage', 'shareTimeline']
    });
  },
  getMore: function (e) {
    var uid = wx.getStorageSync('uid');
    var self = this;
    wx.request({
      url: util.apiUrl + "GetFeedbackApi.ashx?type=2&id=" + uid,
      success: function (e) {
        self.setData({
          list: e.data.result
        })
      }
    })
  },
  submit: function (t) {
    var a = t.detail.value.feedback;
    if (t.detail.value.className == 0) {
      wx.showToast({
        title: "请选反馈类别",
        icon: "none"
      })
      return false;
    }
    if(t.detail.value.feedback.length==0){
      wx.showToast({
        title: "内容不能为空",
        icon: "none",
        duration: 1500
      })
      return false;
    }

    wx.request({
      url: util.apiUrl + "GetFeedbackApi.ashx?type=0&id=" + wx.getStorageSync("uid") + "&feedback=" + a+"&cid="+t.detail.value.className,
      success: function (e) {
        "1" == e.data && wx.navigateBack({
          delta: 1,
          success: function (e) {
            wx.showToast({
              title: "留言成功",
              icon: "success",
              duration: 2e3
            });
          }
        }), "-1" == e.data && wx.navigateBack({
          delta: 1,
          success: function (e) {
            wx.showToast({
              title: "请稍后再试",
              icon: "none",
              duration: 1500
            });
          }
        });
      },
      fail: function (e) {
        wx.showToast({
          title: "内容错误，请稍后再试",
          icon: "none",
          duration: 1500
        });
      }
    });
  }
})