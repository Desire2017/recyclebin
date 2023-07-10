var util = require('../../../utils/util.js');
//获取应用实例
var app = getApp();

Page({
  data: {
    files: []
  },
  onLoad: function (t) {
    var a = this, i = wx.getStorageSync("uid");
    i && wx.request({
      url: util.apiUrl + "GetAppletUserApi.ashx?type=0&id=" + i,
      success: function (e) {
        a.setData({
          nickName: e.data.result[0].nickName,
          userName: e.data.result[0].realyName,
          phone: e.data.result[0].phone,
          avatarUrl: e.data.result[0].avatarUrl
        })
      }
    }), i || wx.showModal({
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
  onShow:function(){
    wx.hideShareMenu({
			menus: ['shareAppMessage', 'shareTimeline']
		});
  },
  onChooseAvatar(e) {
    const { avatarUrl } = e.detail 
    this.setData({
      avatarUrl,
    })
    console.log("头像路径："+avatarUrl)
    var self = this;
    wx.uploadFile({
      filePath: avatarUrl,
      name: 'file',
      url: util.apiUrl + 'GetImgUploadApi.ashx',
      header: { 'content-type': 'multipart/form-data' },
      success: function (i) {
        console.log(i.data);
        self.setData({
          idA: i.data
        })
        wx.setStorageSync('avatarUrl', i.data)
      }
    })
  },
  submit: function (t) {
    var a = t.detail.value.nickName, i = t.detail.value.userName, s = t.detail.value.phone;
    return 0 == t.detail.value.nickName.length || 0 == t.detail.value.userName.length || 0 == t.detail.value.phone.length ? (wx.showToast({
      title: "内容不能为空",
      icon: "none",
      duration: 1500
    }), !1) : 0 == /^(13[0123456789][0-9]{8}|14[0123456789][0-9]{8}|15[0123456789][0-9]{8}|16[0123456789][0-9]{8}|17[0123456789][0-9]{8}|18[012356789][0-9]{8}|199[0-9]{8})$/.test(t.detail.value.phone) ? (wx.showToast({
      title: "请填写正确手机号",
      icon: "none",
      duration: 1500
    }), !1) : void wx.request({
      url: util.apiUrl + "GetAppletUserApi.ashx?type=1&id=" + wx.getStorageSync("uid") + "&name=" + i + "&phone=" + s + "&nickName=" + a +"&headImg=" + wx.getStorageSync('avatarUrl'),
      success: function (e) {
        "1" == e.data && wx.navigateBack({
          delta: 1,
          success: function (e) {
            wx.showToast({
              title: "修改成功",
              icon: "success",
              duration: 2e3
            });
          }
        }), "-1" == e.data && wx.navigateBack({
          delta: 2,
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
});