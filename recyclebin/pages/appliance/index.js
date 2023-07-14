
var WxParse = require('../../wxParse/wxParse.js');
var util = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
  },

  radioChange(e) {
    console.log('radio发生change事件，携带value值为：', e.detail.value);
  },
  goHome:function(e){
    wx.switchTab({
      url: '/pages/home/index',
    })
  },
  imgH: function (e) {
    var winWid = wx.getSystemInfoSync().windowWidth; //获取当前屏幕的宽度
    var imgh = e.detail.height; //图片高度
    var imgw = e.detail.width;
    var swiperH = winWid * imgh / imgw + "px"
    this.setData({
      headbanner: swiperH //设置高度
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    var self = this;
    var uid = wx.getStorageSync('uid');
    wx.request({
      url: util.apiUrl + 'GetArticleApi.ashx?type=0&id=4',
      success(res) {
        WxParse.wxParse('content', 'html', res.data.result[0].content, self, 10)
      }
    })
    //获取顶部广告
    wx.request({
      url: util.apiUrl + "GetAdvertApi.ashx?id=7",
      success(res) {
        self.setData({
          topbg: res.data.result
        })
      }
    })

    //顶部菜单
    wx.request({
      url: util.apiUrl + "GetApplianceClassApi.ashx?&type=1",
      success(res) {
        self.setData({
          applianceClass: res.data.result
        })
      }
    })
    wx.request({
      url: util.apiUrl + "GetAddressApi.ashx?type=3&id=" + uid,
      success: function (e) {
        JSON.stringify(e.data.result).length > 2 ? (self.setData({
          showView: !0,
          name: e.data.result[0].name,
          phone: e.data.result[0].phone,
          address: e.data.result[0].address + " " + e.data.result[0].detail
        }), wx.setStorageSync("aid", e.data.result[0].id), console.log("aid:" + e.data.result[0].id),
          wx.setStorageSync("type", 1)) : (self.setData({
            showView: !1
          }), wx.setStorageSync("type", 0));
      }
    });

    wx.request({
      url: util.apiUrl + "GetApplianceSetApi.ashx",
      success: function (e) {
        self.setData({
          set: e.data.result
        })
      }
    })

    //分享，标题，图片
    wx.request({
      url: util.apiUrl + "GetShareApi.ashx",
      success(res) {
        wx.setStorageSync('shareTitle', res.data.result[0].title);
        wx.setStorageSync('shareImg', res.data.result[0].image)
      }
    })
    wx.request({
      url: util.apiUrl + "GetAppletUserApi.ashx?type=0&id=" + wx.getStorageSync('uid'),
      success: function (e) {
        if (!e.data.result[0].phone) {
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
      }
    })
  },
  onShow: function (e) {
    var self = this;
    var uid = wx.getStorageSync("uid");
    wx.request({
      url: util.apiUrl + "GetAddressApi.ashx?type=3&id=" + uid,
      success: function (s) {
        JSON.stringify(s.data.result).length > 2 ? (self.setData({
          showView: !0,
          name: s.data.result[0].name,
          phone: s.data.result[0].phone,
          address: s.data.result[0].address + " " + s.data.result[0].detail
        }), wx.setStorageSync("aid", s.data.result[0].id), console.log("aid:" + s.data.result[0].id),
          wx.setStorageSync("type", 1)) : (self.setData({
            showView: !1
          }), wx.setStorageSync("type", 0));
      }
    });
  },
  submit: function (t) {
    var a = this;
    var uid = wx.getStorageSync('uid');
    var aid = wx.getStorageSync('aid');
    if (wx.getStorageSync('type') == 0) {
      wx.showToast({
        title: "请选择/新建取件地址",
        icon: "none"
      })
      return false;
    }
    if (t.detail.value.set == 0) {
      wx.showToast({
        title: "请选择家电规格",
        icon: "none"
      })
      return false;
    }

    var url = util.apiUrl + "GetRecycleOrderApi.ashx?type=5&uid=" + uid + "&cid=3" + "&aid=" + aid + "&set=" + t.detail.value.set;

    wx.request({
      url: url,
      success: function (res) {
        if (res.data == 1) {
          wx.showModal({
            title: "温馨提示",
            content: "已提交，等待上门回收",
            showCancel: !1,
            success: function (e) {
              wx.switchTab({
                url: "/pages/home/index"
              });
            }
          });
        }
        if (res.data == -1) {
          wx.showModal({
            title: "温馨提示",
            content: "请稍后再试",
            showCancel: !1,
            success: function (e) {
              wx.switchTab({
                url: "/pages/home/index"
              });
            }
          });
        }
      },
      fail: function (e) {
        wx.showModal({
          title: "温馨提示",
          content: "请稍后再试",
          showCancel: !1,
          success: function (e) {
            wx.switchTab({
              url: "/pages/home/index"
            });
          }
        });
      }
    });
  },
})