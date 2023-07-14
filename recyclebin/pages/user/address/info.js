var util = require('../../../utils/util.js');
const { setFlavor } = require('../../../wxParse/showdown.js');
//获取应用实例
var app = getApp();
Page({
  data: {
    name: "",
    phone: "",
    address: "",
    latitude: "",
    longitude: "",
    customItem: "",

  },
  //打开地图选择位置
  getLocation: function () {
    var self = this;
    var fromLat = wx.getStorageSync('lat');
    var fromLng = wx.getStorageSync('lng');
    var scope = parseInt(wx.getStorageSync('scope'));
    var toLat = 0;
    var toLng = 0;
    wx.chooseLocation({
      success: function (res) {
        self.setData({
          address: res.address+" "+res.name
        })
        toLat = res.latitude;
        toLng = res.longitude;
        var str = res.address;
        var reg = /.+?(省|市|自治区|自治州|县|区)/g; // 省市区的正则
        console.log(str.match(reg));
        console.log(str.match(reg)[0]);
        console.log(str.match(reg)[1]);
        if (str.match(reg).length > 2) {
          self.setData({
            province: str.match(reg)[0],
            city: str.match(reg)[1],
            district: str.match(reg)[2]
          })
        }
        if (str.match(reg).length == 2) {
          self.setData({
            province: str.match(reg)[0],
            city: str.match(reg)[0],
            district: str.match(reg)[1]
          })
        }
        console.log(str.match(reg)[2]);
        console.log("选点位置====", res.name);
        console.log("详细地址====", res.address);
        console.log("lat====", res.latitude);
        console.log("lng====", res.longitude);
        https://apis.map.qq.com/ws/distance/v1/matrix/?mode=driving&from=39.984092,116.306934;40.007763,116.353798&to=39.981987,116.362896;39.949227,116.394310&key=OB4BZ-D4W3U-B7VVO-4PJWW-6TKDJ-WPB77
        wx.request({
          url: 'https://apis.map.qq.com/ws/distance/v1/matrix/?mode=driving&from='+fromLat+','+fromLng+'&to='+toLat+','+toLng+'&key=BAVBZ-LJD6F-YPWJL-NJKZZ-WXWAQ-B2BHO',
          success: function (e) {
            console.log(e.data);
            console.log("distance====", e.data.result.rows[0].elements[0].distance);
            var distance = parseInt(e.data.result.rows[0].elements[0].distance);
            if(distance>scope){
              wx.showModal({
                title: '温馨提示',
                content: '回收范围超过距离，默认'+scope+'米，您的距离：'+distance+'米',
                showCancel:false,
                success (res) {
                  self.setData({
                    address:''
                  })
                }
              })
              
            }
          }
        })
      }
    })
    
  },
  onLoad: function (options) {
    wx.request({
      url: util.apiUrl + 'GetSiteApi.ashx',
      success: function (res) {
        wx.setStorageSync('lat', res.data.result[0].lat);
        wx.setStorageSync('lng', res.data.result[0].lng);
        wx.setStorageSync('scope', res.data.result[0].scope);
      }
    })

    var aid = options.aid;
    var self = this;
    wx.setStorageSync('aid', aid);
    if (aid > 0) {
      wx.request({
        url: util.apiUrl + 'GetAddressApi.ashx?type=4&id=' + aid,
        success: function (e) {
          self.setData({
            name: e.data.result[0].name,
            phone: e.data.result[0].phone,
            address: e.data.result[0].address,
            detail:e.data.result[0].detail,
          })
        }
      })
    }

  },
  submit: function (t) {
    var self = this;
    var uid = wx.getStorageSync('uid');
    var aid = wx.getStorageSync('aid');
    if (t.detail.value.name.length == 0) {
      wx.showToast({
        title: "请填写真实姓名",
        icon: "none"
      })
      return false;
    }
    if (t.detail.value.phone.length == 0) {
      wx.showToast({
        title: "请填真实手机号",
        icon: "none"
      })
      return false;
    }
    if (!/^(13[0123456789][0-9]{8}|14[0123456789][0-9]{8}|15[0123456789][0-9]{8}|16[0123456789][0-9]{8}|17[0123456789][0-9]{8}|18[012356789][0-9]{8}|19[012356789][0-9]{8})$/.test(t.detail.value.phone)) {
      wx.showToast({
        title: "请输入正确手机号",
        icon: "none"
      })
      return false;
    }
    if (t.detail.value.address.length == 0) {
      wx.showToast({
        title: "点击获取地理位置",
        icon: "none"
      })
      return false;
    }
    if (t.detail.value.detail.length == 0) {
      wx.showToast({
        title: "填写单元号门牌号",
        icon: "none"
      })
      return false;
    }
    wx.request({
      url: util.apiUrl + "GetAddressApi.ashx?type=1&aid=" + aid + "&id=" + uid + "&name=" + t.detail.value.name + "&phone=" + t.detail.value.phone + "&address=" + t.detail.value.address + "&detail=" + t.detail.value.detail ,
      success: function (e) {
        "1" == e.data && wx.navigateBack({
          delta: 2,
          success: function (e) {
            wx.showToast({
              title: "已提交保存",
              icon: "success"
            });
          }
        }), "-1" == e.data && wx.navigateBack({
          delta: 2,
          success: function (e) {
            wx.showToast({
              title: "请稍后再试",
              icon: "none"
            });
          }
        });
      },
      fail: function (e) {
        wx.showToast({
          title: "内容错误，请稍后再试",
          icon: "none"
        });
      }
    });
  },
  onShow: function () {
    wx.hideShareMenu({
      menus: ['shareAppMessage', 'shareTimeline']
    });
  }
});