var util = require('../../../utils/util.js');
//获取应用实例
Page({

  /**
   * 页面的初始数据
   */
  data: {

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
    var id = options.id;
    var self = this;
    wx.request({
      url: util.apiUrl + "GetAdvertApi.ashx?id=9",
      success(res) {
        self.setData({
          top: res.data.result
        })
      }
    })
    wx.request({
      url: util.apiUrl + "GetRecycleOrderApi.ashx?type=2&id=" + id,
      success: function (o) {
        self.setData({
          tradeNo: o.data.result[0].tradeNo,
          categoryName: o.data.result[0].categoryName,
          type: o.data.result[0].type,
          date: o.data.result[0].date,
          time: o.data.result[0].time,
          set: o.data.result[0].set,
          remark: o.data.result[0].remark,
        });
        wx.request({
          url: util.apiUrl + "GetAddressApi.ashx?type=4&id=" + o.data.result[0].aid,
          success: function (a) {
            self.setData({
              name: a.data.result[0].name,
              phone: a.data.result[0].phone,
              address: a.data.result[0].address + " " + a.data.result[0].detail
            });
          }
        })
      }
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {
    wx.hideShareMenu({
      menus: ['shareAppMessage', 'shareTimeline']
    });
  },

})