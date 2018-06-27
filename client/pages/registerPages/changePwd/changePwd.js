var prom = require('../../../utils/prom');
var config = require('../../../config');

Page({
    data: {
        header: {},
        companyId: '',
        id: ''
    },
    onLoad:function () {
        var that = this;
        wx.getStorage({
            key: 'company_id',
            success: res => {
                that.setData({
                    companyId: res.data,
                })
            }
        });
        wx.getStorage({
            key: 'id',
            success: res => {
                that.setData({
                    id: res.data,
                })
            }
        });
        wx.getStorage({
            key: 'header',
            success: res => {
                that.setData({
                    header: res.data,
                })
            }
        });
    },
    sureChange: function (e) {
        var that = this;
        if (e.detail.value.oldPwd == '') {
            wx.showModal({
                showCancel: false,
                title: '提示',
                content: '旧密码不能为空'
            })
        } else if (e.detail.value.newPwd1 == '') {
            wx.showModal({
                showCancel: false,
                title: '提示',
                content: '新密码不能为空'
            })
        } else if (e.detail.value.newPwd2 == '') {
            wx.showModal({
                showCancel: false,
                title: '提示',
                content: '请再次输入新密码'
            })
        } else if (e.detail.value.newPwd1 !== e.detail.value.newPwd2) {
            wx.showModal({
                showCancel: false,
                title: '提示',
                content: '两次输入的密码不一致'
            })
        } else {
            var url = `${config.juwai.companyUrl}/`+ that.data.companyId +'/user/'+ that.data.id + '/password/' + e.detail.value.oldPwd;
            wx.request({
                method: 'PUT',
                url: url,
                data: {
                    old_password: e.detail.value.oldPwd,
                    new_password: e.detail.value.newPwd1,
                    new_password_repeat: e.detail.value.newPwd2
                },
                header: that.data.header,
                success: function(res) {
                    if (res.statusCode == 200) {
                        wx.showModal({
                            showCancel: false,
                            title: '提示',
                            content: '修改成功'
                        })
                    } else {
                        wx.showModal({
                            showCancel: false,
                            title: '提示',
                            content: '您填写的信息有误'
                        })
                    }
                }
            });
        }
    }
})