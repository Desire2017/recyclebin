// pages/user/index.js
var util = require('../../utils/util.js');
//获取应用实例
var s = getApp();
const defaultAvatarUrl = 'https://mmbiz.qpic.cn/mmbiz/icTdbqWNOwNRna42FI242Lcia07jQodd2FJGIYQfG0LAJGFxM4FbnQP6yfMxBgJ0F3YRqJCJ1aPAK2dQagdusBZg/0';
Page({
  data: {
    hiddenLoading: !1,
    avatarUrl: defaultAvatarUrl
  },
  //联系售后
  contact: function () {
    wx.makePhoneCall({
      phoneNumber: wx.getStorageSync('phone'), //此号码并非真实电话号码，仅用于测试  
      success: function () { },
      fail: function () {
        wx.showToast({
          title: '取消拨打',
          icon: 'none'
        })
      }
    })
  },
  //获取手机号
  getPhoneNumber(e) {
    var self = this;
    var uid = wx.getStorageSync('uid');
    var code = e.detail.code;
    var access_token = wx.getStorageSync('access_token');
    console.log("获取手机号的code值：" + e.detail.code);
    if (code) {
      wx.request({
        url: util.apiUrl + 'GetPhoneApi.ashx?access_token=' + access_token + '&code=' + code+'&uid='+uid,
        success(res) {
          console.log("获取手机号：" + res.data)
          wx.navigateTo({
            url: "/pages/user/info/detail?phone=" + res.data + "&access_token=" + access_token + "&openid=" + wx.getStorageSync('openid'),
          })
        }
      })
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    var self = this;
    var uid = wx.getStorageSync('uid');
    wx.request({
      url: util.apiUrl + 'GetSystemConfigApi.ashx',
      success(res) {
        wx.setStorageSync('phone', res.data.result[0].phone)
      }
    })
    wx.request({
      url: util.apiUrl + 'GetAppletUserApi.ashx?type=0&id=' + uid,
      success(res) {
        self.setData({
          avatarUrl:res.data.result[0].avatarUrl,
          nickName:res.data.result[0].nickName,
          phone: res.data.result[0].phone
        })
      }
    })
    //获取客服图标
    wx.request({
      url: util.apiUrl + "GetIconApi.ashx?type=2",
      success(res) {
        self.setData({
          service:res.data.result[0].img
        })
      }
    })
  },


  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {
    var self = this;
    wx.request({
      url: util.apiUrl + 'GetSystemConfigApi.ashx',
      success(res) {
        wx.setStorageSync('phone', res.data.result[0].phone)
      }
    })
    wx.request({
      url: util.apiUrl + 'GetAppletUserApi.ashx?type=0&id=' + wx.getStorageSync('uid'),
      success(res) {
        self.setData({
          avatarUrl:res.data.result[0].avatarUrl,
          nickName:res.data.result[0].nickName,
          phone: res.data.result[0].phone
        })
      }
    })
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  }
})