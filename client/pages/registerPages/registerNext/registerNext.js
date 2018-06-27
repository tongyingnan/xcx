Page({
    data: {
        isShowSms: true,
        isShowTime: false,
        time: 60,
        companyName: '',
        city: '',
        items: [
            {name: 'agree', value: '我已阅读并同意'},
        ],
        isAgree: false
    },
    onLoad:function () {
        var that = this;
        wx.getStorage({
            key: 'companyName',
            success: function(res) {
                that.data.companyName=res.data;
                console.log(that.data.companyName);
            }
        });
        wx.getStorage({
            key: 'city',
            success: function(res) {
                that.data.city=res.data;
                console.log(that.data.city);
            }
        })
    },
    radioChange: function(e) {
        if (e.detail.value == 'agree') {
            this.setData({
                isAgree: true
            })
        }
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
                url: 'http://mobile-api.juwai.io/china-agent/sms',
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
    sureRegisterMember: function (e) {
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
        } else if (e.detail.value.pwd == '') {
            wx.showModal({
                showCancel: false,
                title: '提示',
                content: '密码不能为空'
            })
        } else if (e.detail.value.pwd2 == '') {
            wx.showModal({
                showCancel: false,
                title: '提示',
                content: '请再次输入密码'
            })
        } else if (e.detail.value.pwd !== e.detail.value.pwd2) {
            wx.showModal({
                showCancel: false,
                title: '提示',
                content: '两次输入的密码不一样'
            })
        } else if (that.data.isAgree == false) {
            wx.showModal({
                showCancel: false,
                title: '提示',
                content: '请同意居外用户条款'
            })
        } else {
            wx.request({
                method: 'POST',
                url: 'http://mobile-api.juwai.io/china-agent/company',
                data: {
                    company_name: that.data.companyName,
                    city_name: that.data.city,
                    user_city_name: e.detail.value.city,
                    full_name: e.detail.value.realName,
                    phone_number: e.detail.value.phone,
                    verify_code: e.detail.value.sms,
                    password: e.detail.value.pwd
                },
                header: {
                    'content-type': 'application/json' // 默认值
                },
                success: function(res) {
                    if (res.statusCode == 201) {
                        wx.showModal({
                            showCancel: false,
                            title: '提示',
                            content: '注册成功',
                            success: function(res) {
                                if (res.confirm) {
                                    wx.navigateTo({
                                        url: '../registerSuccess/registerSuccess'
                                    })
                                }
                            }
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