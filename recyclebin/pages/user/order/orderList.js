var util = require('../../../utils/util.js');
//获取应用实例
var app = getApp();

Page({
  data: {
    hiddenLoading: !1,
    name1: "全部订单",
    name2: "待回收",
    name3: "服务中",
    name4: "待评价",
    activeIndex: 0,
    sliderOffset: 0,
  },
  onLoad: function (r) {
    var s = r.state;
    var self = this;
    if (s == 0) {
      self.setData({
        activeIndex: 1
      })
    }
    if (s == 1) {
      self.setData({
        activeIndex: 2
      })
    }
    if (s == 2) {
      self.setData({
        activeIndex: 3
      })
    }
    if (s == 99) {
      self.setData({
        activeIndex: 0
      })
    }
    var t = this,
      n = wx.getStorageSync("uid");
    n && wx.request({
      url: util.apiUrl + "GetRecycleOrderApi.ashx?type=3&uid=" + n + "&state=" + s,
      success: function (e) {
        t.setData({
          orders: e.data.result,
          hiddenLoading: !0
        });
      }
    }), n || wx.showModal({
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
  onShow: function (e) {
    wx.hideShareMenu({
      menus: ['shareAppMessage', 'shareTimeline']
    });

  },
  goShopping: function () {
    wx.switchTab({
      url: '/pages/home/index'
    })
  },
  allOrders: function (t) {
    this.setData({
      sliderOffset: t.currentTarget.offsetLeft,
      activeIndex: t.currentTarget.id,
      hiddenLoading: !1
    });
    var uid = wx.getStorageSync('uid');
    var state = t.currentTarget.dataset.id;
    console.log("state=" + state);
    var self = this;
    
    wx.request({
      url: util.apiUrl + "GetRecycleOrderApi.ashx?type=3&uid=" + uid + "&state=" + parseInt(state),
      success: function (e) {
        if(e.data.result!=""){
          self.setData({
            orders: e.data.result,
            hiddenLoading: !0
          });
        }
        else{
          self.setData({
            orders: [],
            hiddenLoading: !0
          });
        }
        
      }
    });
  },
  // 取消订单
  cancelConfirm: function (t) {
    var n = this,
      a = t.currentTarget.dataset.id;
    wx.showModal({
      title: "预约取消",
      content: "确认预约取消吗？",
      confirmText: "确认",
      cancelText: "再想想",
      success: function (t) {
        t.confirm && wx.request({
          url: util.apiUrl + "GetRecycleOrderApi.ashx?type=4&id=" + a,
          success: function (e) {
            1 == e.data && wx.showToast({
              title: "预约已取消",
              icon: "none",
              duration: 1500,
              complete: function (e) {
                wx.redirectTo({
                  url: '/pages/user/order/orderList?state=99',
                })
              }
            }), 0 == e.data && wx.showToast({
              title: "预约取消失败，请稍后再试",
              icon: "none",
              duration: 1500,
              complete: function (e) {
                wx.redirectTo({
                  url: '/pages/user/order/orderList?state=99',
                })
              }
            });
          }
        });
      }
    });
  },
  //师傅信息
  checkMaster: function (t) {
    var n = t.currentTarget.dataset.id;
    wx.request({
      url: util.apiUrl + "GetRecycleOrderApi.ashx?type=7&id=" + n,
      success: function (e) {
        wx.showModal({
          title: e.data.result[0].name,
          content: "手机号： " + e.data.result[0].phone,
          confirmText: "确认",
          showCancel: !1
        });
      }
    });
  }

});