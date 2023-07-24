// pages/home/index.js
var util = require('../../utils/util.js');
var QQMapWX = require('../../utils/qqmap-wx-jssdk.js');
var qqmapsdk;
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
  imgH1: function (e) {
    var winWid = wx.getSystemInfoSync().windowWidth; //获取当前屏幕的宽度
    var imgh = e.detail.height; //图片高度
    var imgw = e.detail.width;
    var swiperH = winWid * imgh / imgw + "px"
    this.setData({
      headbanner1: swiperH //设置高度
    })
  },
  imgH2: function (e) {
    var winWid = wx.getSystemInfoSync().windowWidth; //获取当前屏幕的宽度
    var imgh = e.detail.height; //图片高度
    var imgw = e.detail.width;
    var swiperH = winWid * imgh / imgw + "px"
    this.setData({
      headbanner2: swiperH //设置高度
    })
  },
  //衣服回收
  clothes: function (e) {
    var id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: '/pages/clothes/class?id='+id,
    })
  },
  //分类页面跳转
  goCategory: function (e) {
    var index = e.currentTarget.dataset.index;
    var id = e.currentTarget.dataset.id;
    console.log("index=======" + index);
    switch (id) {
      case 1:
        result: wx.navigateTo({
          url: '/pages/clothes/index',
        })
        break;
      case 2:
        result: wx.navigateTo({
          url: '/pages/book/index',
        })
        break;
      case 3:
        result: wx.navigateTo({
          url: '/pages/appliance/index',
        })
        break;
      case 4:
        result: wx.navigateTo({
          url: '/pages/furniture/index',
        })
        break;
    }

  },
  //动态
  goTrend: function (e) {
    wx.switchTab({
      url: '/pages/trend/index',
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    qqmapsdk = new QQMapWX({
      key: 'BAVBZ-LJD6F-YPWJL-NJKZZ-WXWAQ-B2BHO' //这里自己的key秘钥进行填充
    });

    var self = this;
    if (JSON.stringify(options) != {}) {
      if (options.scene) {
        console.log("recid======:" + options.scene);
        wx.setStorageSync('recid', options.scene);
      } else {
        console.log("recid======:" + 0);
        wx.setStorageSync('recid', 0);
      }
    }
    //获取access_token
    wx.request({
      url: util.apiUrl + 'GetAccessTokenApi.ashx',
      success(res) {
        wx.setStorageSync('access_token', res.data)
        console.log('access_token:' + res.data)
      }
    })

    //获取小程序名称
    wx.request({
      url: util.apiUrl + "GetSystemConfigApi.ashx",
      success(res) {
        wx.setNavigationBarTitle({
          title: res.data.result[0].name
        });
        wx.setStorageSync('appletName', res.data.result[0].name)
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
    //获取客服图标，分享图标
    wx.request({
      url: util.apiUrl + "GetIconApi.ashx?type=2",
      success(res) {
        self.setData({
          service: res.data.result[0].img
        })
      }
    })
    wx.request({
      url: util.apiUrl + "GetIconApi.ashx?type=1",
      success(res) {
        self.setData({
          share: res.data.result[0].img
        })
      }
    })
    //获取顶部广告
    wx.request({
      url: util.apiUrl + "GetAdvertApi.ashx?id=1",
      success(res) {
        self.setData({
          banners1: res.data.result
        })
      }
    })

    //顶部菜单
    wx.request({
      url: util.apiUrl + "GetClothesClassApi.ashx?type=1",
      success(res) {
        self.setData({
          category1: res.data.result
        })
      }
    })

    //获取动态广告
    wx.request({
      url: util.apiUrl + "GetAdvertApi.ashx?id=3",
      success(res) {
        self.setData({
          banners3: res.data.result
        })
      }
    })
    //中部菜单
    wx.request({
      url: util.apiUrl + "GetCategoryApi.ashx?state=1&type=0",
      success(res) {
        self.setData({
          category: res.data.result
        })
      }
    })

    //中部广告图
    wx.request({
      url: util.apiUrl + "GetAdvertApi.ashx?id=2",
      success(res) {
        self.setData({
          banners2: res.data.result
        })
      }
    })
    //动态
    wx.request({
      url: util.apiUrl + "GetAdvertApi.ashx?id=4",
      success(res) {
        self.setData({
          banners4: res.data.result
        })
      }
    })
    //合作伙伴
    wx.request({
      url: util.apiUrl + "GetPartnerApi.ashx",
      success(res) {
        self.setData({
          partner: res.data.result,
          hiddenLoading: true
        })
      }
    })

    //登录
    wx.login({
      success: function (s) {
        if (s.code) {
          self;
          var t = s.code;
          wx.setStorageSync("code", t), console.log("code:" + t), wx.request({
            url: util.apiUrl + "GetOpenIDApi.ashx?code=" + t,
            success: function (e) {
              var s = e.data.result[0].session_key,
                t = e.data.result[0].openid;
              console.log("session_key:" + s);
              console.log("openid:" + t);
              wx.setStorageSync("session_key", s);
              wx.setStorageSync("openid", t);
              wx.request({
                url: util.apiUrl + "GetUserInfoApi.ashx?type=0&access_token=" + wx.getStorageSync('access_token') + "&openid=" + t + "&pid=" + wx.getStorageSync('recid'),
                success: function (e) {
                  console.log("==uid===" + e.data.result[0].uid);
                  wx.setStorageSync("uid", e.data.result[0].uid);
                  wx.setStorageSync('level', e.data.result[0].userLevel);
                }
              })
            }
          });
        }
      }
    });
    var screenW = wx.getSystemInfoSync().windowWidth; //获取屏幕宽度
    var contentW = wx.getStorageSync('notice').length * this.data.size; //获取文本宽度（大概宽度）
    var allT = (contentW / screenW) * this.data.moveTimes; //文字很长时计算有几屏
    allT = allT < 8 ? 8 : allT; //不够一平-----最小滚动一平时间
    this.setData({
      marqueeW: -contentW + "px",
      allT: allT + "s"
    });
  },


  
  onPullDownRefresh: function () {
    wx.showNavigationBarLoading()
    wx.showToast({
      title: "加载中...",
      icon: "loading"
    });
    var self = this;
    //获取小程序名称
    wx.request({
      url: util.apiUrl + "GetSystemConfigApi.ashx",
      success(res) {
        wx.setNavigationBarTitle({
          title: res.data.result[0].name
        });
      }
    })
    //获取顶部广告
    wx.request({
      url: util.apiUrl + "GetAdvertApi.ashx?id=1",
      success(res) {
        self.setData({
          banners: res.data.result
        })
      }
    })
    //中部菜单
    wx.request({
      url: util.apiUrl + "GetCategoryApi.ashx?type=0",
      success(res) {
        self.setData({
          category: res.data.result,
          hiddenLoading: true
        })
      }
    })
    setTimeout(function () {
      // complete
      wx.hideNavigationBarLoading() //完成停止加载
      wx.stopPullDownRefresh() //停止下拉刷新
    }, 1000);
  },
  //分享
  onShareAppMessage() {
    console.log("会员uid=====" + wx.getStorageSync('uid'));
    var recid = wx.getStorageSync('uid');
    var title = wx.getStorageSync('shareTitle');
    var image = wx.getStorageSync('shareImg');
    var path = '/pages/home/index?recid=' + recid;
    return {
      title: title,
      path: path,
      imageUrl: image
    }
  }
});