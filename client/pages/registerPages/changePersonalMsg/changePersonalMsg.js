var prom = require('../../../utils/prom');
var config = require('../../../config');

Page({
    data: {
        header: {},
        oldMsg: {},
        companyId: '',
        id: '',
        isShowSms: true,
        isShowTime: false,
        time: 60,
    },
    onLoad:function () {
        var that = this;
        wx.getStorage({
            key: 'nickName',
            success: function(res) {
                that.setData({
                    nickName: res.data,
                })
            }
        });
        wx.getStorage({
            key: 'avatarUrl',
            success: function(res) {
                that.setData({
                    avatarUrl: res.data,
                })
            }
        });
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
        prom.wxPromisify(wx.getStorage) ({
            key: 'header'
        }).then(function (res) {
            that.setData({
                header:res.data
            })
        }).then(function () {
            that.currentUser();
        })
    },
    // 得到初始用户信息
    currentUser:function () {
        var that = this;
        wx.request({
            method: 'GET',
            url: `${config.juwai.agentUrl}/current-user`,
            data: {},
            header: that.data.header,
            success: function(res) {
                if (res.statusCode == 200) {
                    that.setData({
                        oldMsg:res.data
                    })
                } else {

                }
            }
        });
    },
    countDown() {
        var that = this;
        var countdown = setInterval(() => {
            // that.data.time -= 1;
            that.setData({
                time: that.data.time - 1
            })
            if (that.data.time === 0) {
                that.setData({
                    isShowTime: false,
                    isShowSms: true,
                    time: 60
                });
                clearInterval(countdown);
            }
        }, 1000);
    },
    getSms: function (e) {
        var that = this;
        if (e.detail.value.phone == '') {
            wx.showModal({
                showCancel: false,
                title: '提示',
                content: '手机号码不能为空'
            })
        } else {
            that.setData({
                isShowTime: true,
                isShowSms: false,
            });
            that.countDown();
            wx.request({
                method: 'POST',
                url: `${config.juwai.agentUrl}/sms`,
                data: {
                    phone_number: e.detail.value.phone,
                },
                header: {
                    'content-type': 'application/json' // 默认值
                },
                success: function(res) {
                    if (res.statusCode == 200) {
                        console.log(1);
                    } else {
                        console.log(1);
                    }
                }
            });
        }
    },
    sureChange: function (e) {
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
        } else if (e.detail.value.sms == '') {
            wx.showModal({
                showCancel: false,
                title: '提示',
                content: '验证码不能为空'
            })
        } else {
            var url = `${config.juwai.companyUrl}/`+ that.data.companyId +'/user/'+ that.data.id;
            wx.request({
                method: 'PUT',
                url: url,
                data: {
                    city_name: e.detail.value.city,
                    full_name: e.detail.value.realName,
                    phone_number: e.detail.value.phone,
                    verify_code: e.detail.value.sms,
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