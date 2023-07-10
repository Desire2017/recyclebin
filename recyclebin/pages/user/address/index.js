// pages/user/address/index.js
var util = require('../../../utils/util.js');
//获取应用实例
var app = getApp();

Page({
  data: {},
  onLoad: function (s) {
    var t = this, a = wx.getStorageSync("uid");
    a && wx.request({
      url: util.apiUrl + "GetAddressApi.ashx?type=0&id=" + a,
      success: function (e) {
        t.setData({
          address: e.data.result
        });
      }
    }), a || wx.showModal({
      title: "温馨提示",
      content: "请到“我的”-点击登录",
      showCancel: !1,
      success: function (e) {
        wx.switchTab({
          url: "/pages/user/index"
        });
      }
    });
  },
  onShow: function () {
    var self = this;
    var uid = wx.getStorageSync('uid');
    wx.request({
      url: util.apiUrl + "GetAddressApi.ashx?type=0&id=" + uid,
      success: function (e) {
        self.setData({
          address: e.data.result
        });
      }
    })
    wx.hideShareMenu({
      menus: ['shareAppMessage', 'shareTimeline']
    });
  },
  Address: function () {
    wx.navigateTo({
      url: "/pages/user/address/info?aid=0"
    });
  },
  setDefault: function (s) {
    var self = this;
    var uid = wx.getStorageSync('uid');
    var t = s.currentTarget.id;
    wx.request({
      url: util.apiUrl + "GetAddressApi.ashx?type=2&id=" + t,
      success: function (e) {
        "1" == e.data && (wx.setStorageSync("aid", t), wx.showToast({
          title: "已选择默认地址",
          icon: "success",
          duration: 2e3,
          success: function (e) {
            wx.request({
              url: util.apiUrl + "GetAddressApi.ashx?type=0&id=" + uid,
              success: function (e) {
                self.setData({
                  address: e.data.result
                });
              }
            })
          }
        }));
      }
    });
  },
  delAddress: function (e) {
    var t = e.currentTarget.id;
    wx.request({
      url: util.apiUrl + "GetAddressApi.ashx?type=5&id=" + t,
      success: function (e) {
        "1" == e.data && (wx.showToast({
          title: "已删除地址",
          icon: "success",
          duration: 2000,
          success: function (e) {
            wx.navigateBack({
              delta: 1
            });
          }
        }));
      }
    });
  },
  editAddress:function(e){
    var aid = e.currentTarget.id;
    wx.navigateTo({
      url: '/pages/user/address/info?aid='+aid,
    })
  }

});