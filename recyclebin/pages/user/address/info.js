var util = require('../../../utils/util.js');
//获取应用实例
var app = getApp();
Page({
  data: {
    name: "",
    phone: "",
    region: ["选择-省-市-县/地区", "", ""],
    province: "选择-省",
    city: "-市",
    district: "-县",
    latitude: "",
    longitude: "",
    customItem: "",

  },
  //打开地图选择位置
  getLocation: function () {
    var self = this;
    wx.chooseLocation({
      success: function (res) {
        self.setData({
          address: res.address
        })
        var str = res.address;
        var reg = /.+?(省|市|自治区|自治州|县|区)/g; // 省市区的正则
        console.log(str.match(reg));
        console.log(str.match(reg)[0]);
        console.log(str.match(reg)[1]);
        if (str.match(reg).length > 2)
          console.log(str.match(reg)[2]);
        console.log("选点位置====", res.name);
        console.log("详细地址====", res.address);
        console.log("lat====", res.latitude);
        console.log("lng====", res.longitude);

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
            region: e.data.result[0].region,
            province: e.data.result[0].province,
            city: e.data.result[0].city,
            district: e.data.result[0].district,
            street: e.data.result[0].street

          })
        }
      })
    }

  },
  bindRegionChange: function (e) {
    console.log("picker发送选择改变，携带值为", e.detail.value), this.setData({
      region: e.detail.value,
      province: e.detail.value[0],
      city: e.detail.value[1],
      district: e.detail.value[2],
    });
    console.log("县区:", e.detail.value[2])
  },
  submit: function (t) {
    var a = this;
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
    if (a.data.region[0] == "选择-省-市-县/地区") {
      wx.showToast({
        title: "请选择-省-市-县/地区",
        icon: "none"
      })
      return false;
    }
    if (t.detail.value.address.length == 0) {
      wx.showToast({
        title: "请填写详细地址",
        icon: "none"
      })
      return false;
    }
    wx.request({
      url: 'https://apis.map.qq.com/ws/direction/v1/driving/?from=39.915285,116.403857&to=39.915285,116.803857&waypoints=39.111,116.112;39.112,116.113&output=json&callback=cb&key=BAVBZ-LJD6F-YPWJL-NJKZZ-WXWAQ-B2BHO',
    })


    wx.request({
      url: util.apiUrl + "GetAddressApi.ashx?type=1&aid=" + aid + "&id=" + uid + "&name=" + t.detail.value.name + "&phone=" + t.detail.value.phone + "&province=" + a.data.region[0] + "&city=" + a.data.region[1] + "&district=" + a.data.region[2] + "&street=" + t.detail.value.address,
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