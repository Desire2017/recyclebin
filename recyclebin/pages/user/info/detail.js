// pages/user/info/detail.js
var util = require('../../../utils/util.js');
//获取应用实例
var app = getApp();
const defaultAvatarUrl = 'https://mmbiz.qpic.cn/mmbiz/icTdbqWNOwNRna42FI242Lcia07jQodd2FJGIYQfG0LAJGFxM4FbnQP6yfMxBgJ0F3YRqJCJ1aPAK2dQagdusBZg/0';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    avatarUrl: defaultAvatarUrl,
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
      url: util.apiUrl + 'GetHeadImgUploadApi.ashx',
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

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    var phone = options.phone;
    wx.setStorageSync('userPhone', phone)
  },
  onShow:function(){
    wx.hideShareMenu({
			menus: ['shareAppMessage', 'shareTimeline']
		});
  },
  submit: function (t) {
    var a = this;
    t.detail.formId;
    return 0 == t.detail.value.nickName.length ? (wx.showToast({
      title: "请输入昵称",
      icon: "none"
    }), !1) : void wx.request({
      url: util.apiUrl + "GetUserInfoApi.ashx?type=1&uid="+wx.getStorageSync('uid') + "&nickName=" + t.detail.value.nickName +"&headImg=" + wx.getStorageSync('avatarUrl')+ "&phone=" + wx.getStorageSync('userPhone'),
      success: function (e) {
        console.log("==uid==="+e.data.result[0].uid);
        wx.setStorageSync("uid", e.data.result[0].uid);
        wx.setStorageSync('level', e.data.result[0].userLevel);
        wx.setStorageSync('nickName', t.detail.value.nickName);
        if(wx.getStorageSync('url')){
          wx.redirectTo({
            url: wx.getStorageSync('url'),
          })
        }
        if(!wx.getStorageSync('url')){
          wx.navigateBack({
            delta: 1,
            success: function (e) {
              wx.showToast({
                title: "已保存",
                icon: "success"
              });
            }
          })
        }
        
      },
      fail: function (e) {
        wx.showToast({
          title: "内容错误，请稍后再试",
          icon: "none"
        });
      }
    });
  }
})