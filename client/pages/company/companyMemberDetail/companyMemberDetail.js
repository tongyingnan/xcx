var prom = require('../../../utils/prom')

Page({
    data: {
        id: '',
        url: '',
        companyMemberMsg: {},
        companyMemberDetail: '',
        switchMsg:'启用账号',
        active: '1'
    },
    onLoad:function (options) {
        var that = this;
        that.setData({
            id:options.id,
        });
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
    getCompanyMsg:function () {
        var that = this;
        var url = 'http://mobile-api.juwai.io/china-agent/company/' + that.data.companyId + '/user';
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
                    });
                    for (let i = 0;i < that.data.companyMemberMsg.length;i += 1) {
                        if (that.data.companyMemberMsg[i].id == that.data.id) {
                            that.setData({
                                companyMemberDetail: that.data.companyMemberMsg[i]
                            })
                        }
                    }
                } else {

                }
            }
        });
    },
    sureChangeMember:function (e) {
        var that = this;
        if (e.detail.value.city == '') {
            wx.showModal({
                showCancel: false,
                title: '提示',
                content: '城市名称不能为空'
            })
        } else if (e.detail.value.realName == '') {
            wx.showModal({
                showCancel: false,
                title: '提示',
                content: '真实姓名不能为空'
            })
        } else if (e.detail.value.phone == '') {
            wx.showModal({
                showCancel: false,
                title: '提示',
                content: '手机号码不能为空'
            })
        } else {
            var url='http://mobile-api.juwai.io/china-agent/company/'+ that.data.companyId +'/user/'+ that.data.id;
            wx.request({
                method: 'PUT',
                url: url,
                data: {
                    city_name: e.detail.value.city,
                    full_name: e.detail.value.realName,
                    phone_number: e.detail.value.phone,
                    active: that.data.active
                },
                header: that.data.header,
                success: function(res) {
                    if (res.statusCode == 200) {
                        wx.showModal({
                            showCancel: false,
                            title: '提示',
                            content: '修改成功',
                            success: function(res) {
                                if (res.confirm) {
                                    // wx.navigateBack({
                                    //     delta: 1
                                    // })
                                    wx.redirectTo({
                                        url: '../companyMember/companyMember'
                                    })
                                }
                            }
                        })
                    } else {
                        wx.showModal({
                            showCancel: false,
                            title: '提示',
                            content: '您填写的信息有误',
                        })
                    }
                }
            });
        }
    },
    switchChange:function (e) {
        if (e.detail.value === true) {
            this.setData({
                switchMsg: '启用账号',
                active: '1'
            })
        } else {
            this.setData({
                switchMsg: '禁用账号',
                active: '0'
            })
        }
    }
})