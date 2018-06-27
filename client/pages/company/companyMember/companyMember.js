var prom = require('../../../utils/prom');
var config = require('../../../config');

Page({
    data:{
        companyMemberMsg: '',
        companyId: '',
        header: {}
    },
    getCompanyMsg:function () {
        var that = this;
        var url = `${config.juwai.companyUrl}/` + that.data.companyId + '/user';
        wx.request({
            method: 'GET',
            url: url,
            data: {},
            header: that.data.header,
            success: function(res) {
                console.log(res.data);
                if (res.statusCode == 200) {
                    that.setData({
                        companyMemberMsg: res.data
                    })
                } else {

                }
            }
        });
    },
    onLoad:function () {
        var that = this;
        prom.wxPromisify(wx.getStorage) ({
            key: 'company_id',
        }).then(function (res) {
            that.setData({
                companyId: res.data
            });
        }).then(function () {
            prom.wxPromisify(wx.getStorage) ({
                key: 'header',
            }).then(function (res) {
                that.setData({
                    header: res.data
                });
            }).then(function () {
                that.getCompanyMsg()
            })
        })
    },
    goToRegister:function () {
        wx.navigateTo({
          url: '../companyMemberRegister/companyMemberRegister'
        })
    },
    goToCompanyDetail:function (event) {
        var p = event.currentTarget.id;
        wx.navigateTo({
            url: '../companyMemberDetail/companyMemberDetail?id='+p
        })
    },
    onShareAppMessage: function () {
        return {
            title: '居外通',
            desc: '企业成员注册',
            path: 'pages/company/companyMemberRegister/companyMemberRegister'
        }
    }
})