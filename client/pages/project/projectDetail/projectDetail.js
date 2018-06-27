var prom = require('../../../utils/prom');
var config = require('../../../config');
const { extend, Dialog } = require('../../../zanui/index');

Page(extend({}, Dialog, {
    data: {
        borderBottom1:'4px solid red',
        borderBottom2:'1px solid black',
        isShowTab: true,
        isShowCover:false,
        isShowDialog:false,
        id: '',
        url: '',
        projectDetail: '',
        position: { lng: 120.12, lat: 30.2459 },
        markers: [{
            iconPath: "./map.jpg",
            id: 0,
            latitude: 30.2459,
            longitude: 120.12,
            width: 50,
            height: 50
        }],
    },
    consult:function () {
        var that = this;
        wx.request({
            method: 'GET',
            url: `${config.juwai.agentUrl}/project/`+ that.data.id +'/juwai-contact',
            data: {},
            header: {
                'content-type': 'application/json', // 默认值
            },
            success: function(res) {
                console.log(res.data);
                if (res.statusCode == 200) {
                    that.setData({
                        consultDetail:res.data
                    });
                    wx.showModal({
                        // showCancel:false,
                        confirmText: '拨打电话',
                        confirmColor: '#e21e2f',
                        title: that.data.consultDetail.chinese_name + that.data.consultDetail.english_name,
                        content: that.data.consultDetail.title + '\r\n' + that.data.consultDetail.phone_number + '\r\n' + that.data.consultDetail.email + '\r\n' + that.data.consultDetail.wechat_username,
                        success: function(res) {
                            if (res.confirm) {
                                wx.makePhoneCall({
                                    phoneNumber: that.data.consultDetail.phone_number
                                })
                            }
                        }
                    })
                } else {

                }
            }
        });
    },
    //放大图片
    clickImg:function (event) {
        this.setData({
            isShowCover:true,
            coverSrc:event.currentTarget.dataset.src
        });
    },
    pause:function () {
        this.setData({
            isShowCover:false
        })
    },
    onReady: function (e) {
        // 使用 wx.createMapContext 获取 map 上下文
        this.mapCtx = wx.createMapContext('myMap')
    },
    tab1:function () {
      this.setData({
          borderBottom1:'4px solid red',
          borderBottom2:'1px solid black',
          isShowTab: true
      })
    },
    tab2:function () {
        this.setData({
            borderBottom1:'1px solid black',
            borderBottom2:'4px solid red',
            isShowTab: false
        })
    },
    onLoad:function (options) {
        var that = this;
        prom.wxPromisify(wx.getStorage) ({
            key: 'verification_status'
        }).then(function (res) {
            if (res.data == '0') {
                that.setData({
                    isShowDialog:true
                });
                that.showZanDialog({
                    title: '马上实名认证，开通以下特权',
                    content: '立即查看居外优选房产项目\r\n最新活动\r\n海外购房指南\r\n全球最新房产动态\r\n成功案例',
                    confirmText: '去实名认证',
                    cancelText: '稍后再说',
                    showCancel: true
                }).then(() => {
                    wx.navigateTo({
                        url: '../../registerPages/realname/realname'
                    })
                }).catch(() => {
                    console.log('=== dialog ===', 'type: cancel');
                });
            }
        });
        var pages = getCurrentPages();    //获取加载的页面
        var currentPage = pages[pages.length-1];    //获取当前页面的对象
        var url = currentPage.route;    //当前页面url
        that.setData({
            id:options.id,
            url: 'http://mobile-api.juwai.io/china-agent/project/'+ options.id
        });
        wx.request({
            method: 'GET',
            url: that.data.url,
            data: {},
            header: {
                'content-type': 'application/json', // 默认值
            },
            success: function(res) {
                console.log(res.data);
                if (res.statusCode == 200) {
                    that.setData({
                        projectDetail:res.data
                    });
                } else {

                }
            }
        });
    },
    report:function (event) {
        var p = event.currentTarget.id;
        wx.navigateTo({
            url: '../../consumers/report/report?id='+p
        })
    }
}))