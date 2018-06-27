var prom = require('../../../utils/prom');

Page({
    data: {
        page: 1,
        pageSize: 20
    },
    addReport:function (event) {
        var p = event.currentTarget.id;
        wx.navigateTo({
            url: '../report/report?id='+p
        })
    },
    load:function () {
        var that = this;
        that.setData({
            page :that.data.page + 1
        });
        that.loading();
    },
    //分次加载
    loading:function () {
        var that = this;
        wx.request({
            method: 'GET',
            url: 'http://mobile-api.juwai.io/china-agent/project',
            data: {
                offset: that.data.pageSize * (that.data.page - 1),
                limit: that.data.pageSize,
            },
            header: {
                'content-type': 'application/json', // 默认值
            },
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
                }
            }
        });
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
    }
});