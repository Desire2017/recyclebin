// pages/user/invite/index.js
var util = require('../../../utils/util.js');
//获取应用实例
var app = getApp();

Page({
  data: {
    hiddenLoading: false,
  },
  onLoad: function (t) {
    var a = this,
      s = wx.getStorageSync("uid");
    if (s) {
      wx.request({
        url: util.apiUrl + "GetAppletUserApi.ashx?type=0&id=" + s,
        success: function (t) {
          a.setData({
            headImg: t.data.result[0].image,
            name: t.data.result[0].nickName,
            id: t.data.result[0].id,
            img: util.qrcodeUrl+ t.data.result[0].qrcode,
            hiddenLoading: true
          });
        }
      });
    }
    if (!s) {
      wx.showModal({
        title: "温馨提示",
        content: "请到“我的”-点击登录",
        showCancel: !1,
        success: function (e) {
          wx.switchTab({
            url: "/pages/user/index"
          });
        }
      });
    }
  },
  onShow:function(){
    wx.hideShareMenu({
			menus: ['shareAppMessage', 'shareTimeline']
		});
  },
  saveImg: function (e) {
    var self = this;
    var t = e.currentTarget.dataset.src;
    wx.setStorageSync('imgSrc', t)
    wx.downloadFile({
      url: t,
      success: function (e) {
        wx.saveImageToPhotosAlbum({
          filePath: e.tempFilePath,
          success: function (e) {
            "saveImageToPhotosAlbum:ok" === e.errMsg && wx.showToast({
              title: "保存成功"
            });
          },
          fail: function (e) {
            wx.showToast({
              title: "保存失败,请同意授权",
              icon: "none"
            });
          }
        });
      },
      fail: function () {
        wx.showToast({
          title: "请同意授权",
          icon: "none"
        });
      }
    });
  },
});