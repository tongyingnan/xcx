var prom = require('../../../utils/prom');
var config = require('../../../config');
const { extend, Dialog } = require('../../../zanui/index');

Page(extend({}, Dialog, {
    data: {
        id: '',
        companyId:'',
        header: '',
        projectList: [],
        url: '../../../zanui/five.png',
        page: 1,
        pageSize: 10,
        windowHeight: 0
    },
    loading:function () {
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
        prom.wxPromisify(wx.getStorage) ({
            key: 'id'
        }).then(function (res) {
            that.setData({
                id:res.data
            })
        }).then(function () {
            prom.wxPromisify(wx.getStorage) ({
                key: 'company_id'
            }).then(function (res) {
                that.setData({
                    companyId:res.data
                })
            }).then(function () {
                prom.wxPromisify(wx.getStorage) ({
                    key: 'header'
                }).then(function (res) {
                    that.setData({
                        header: res.data
                    })
                }).then(function () {
                    var url =  `${config.juwai.companyUrl}/` + that.data.companyId + '/user/' + that.data.id + '/browsed';
                    wx.request({
                        method: 'GET',
                        url: url,
                        data: {
                            offset: that.data.pageSize * (that.data.page - 1),
                            limit: that.data.pageSize
                        },
                        header: that.data.header,
                        success: function(res) {
                            console.log(res.data);
                            if (res.statusCode == 200) {
                                if (that.data.page === 1) {
                                    that.setData({
                                        projectList:res.data
                                    });
                                } else {
                                    var words = that.data.projectList.concat(res.data);
                                    that.setData({
                                        projectList: words
                                    })
                                }

                            } else {

                            }
                        }
                    });
                })
            })
        })
    },
    onLoad:function () {
        var that = this;
        that.loading();
        //获取屏幕高度
        wx.getSystemInfo({
            success: function (res) {
                that.setData({
                    windowHeight: res.windowHeight
                });
                console.log("屏幕高度: " + res.windowHeight)
            }
        })
    },
    load:function () {
        console.log(1);
        var that = this;
        that.setData({
            page :that.data.page + 1
        });
        that.loading();
    },
    goToProjectDetail: function (event) {
        var p = event.currentTarget.id;
        wx.navigateTo({
            url: '../projectDetail/projectDetail?id='+p
        })
    },
    goToReport:function (event) {
        var p = event.currentTarget.id;
        wx.navigateTo({
            url: '../../consumers/report/report?id='+p
        })
    },
    collect:function () {
        // if (this.data.url == '../../../zanui/five.png') {
        //     this.setData({
        //         url: '../../../zanui/five1.png'
        //     })
        // } else {
        //     this.setData({
        //         url: '../../../zanui/five.png'
        //     })
        // }
    }
}))