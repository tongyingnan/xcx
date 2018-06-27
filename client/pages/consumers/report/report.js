var prom = require('../../../utils/prom');
var config = require('../../../config');

Page({
    data:{
        matter:'提交客户信息后，我们会第一时间与您本人联系以确认客户信息并给予客户邀约建议，协助您邀约客户到访。',
        items: [
            {name: 'agree', value: '我已阅读并同意以上<<注意事项>>及'},
        ],
        isAgree: false,
        id: '',
        isShowAdd:true
    },
    onLoad:function (options) {
        var that = this;
        wx.getStorage({
          key: 'id',
          success: res => {
            that.setData({
                id: res.data
            })
          }
        });
        wx.getStorage({
          key: 'company_id',
          success: res => {
            that.setData({
                companyId: res.data
            })
          }
        });
        wx.getStorage({
          key: 'header',
          success: res => {
            that.setData({
                header: res.data
            })
          }
        });
        if (options.id) {
            that.setData({
                id:options.id,
                url: 'http://mobile-api.juwai.io/china-agent/project/'+ options.id,
                isShowAdd:false
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
        }
    },
    radioChange: function(e) {
        if (e.detail.value == 'agree') {
            this.setData({
                isAgree: true
            })
        }
    },
    addReport:function () {
        wx.navigateTo({
            url: '../addReport/addReport'
        })
    },
    sureReport:function (e) {
        var that = this;
        if (e.detail.value.project == '') {
            wx.showModal({
                showCancel: false,
                title: '提示',
                content: '项目名称不能为空'
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
        } else if (e.detail.value.sex == '') {
            wx.showModal({
                showCancel: false,
                title: '提示',
                content: '称谓不能为空'
            })
        } else if (e.detail.value.email == '') {
            wx.showModal({
                showCancel: false,
                title: '提示',
                content: '电子邮件不能为空'
            })
        } else if (e.detail.value.country == '') {
            wx.showModal({
                showCancel: false,
                title: '提示',
                content: '目标国家不能为空'
            })
        } else if (e.detail.value.type == '') {
            wx.showModal({
                showCancel: false,
                title: '提示',
                content: '房产类型不能为空'
            })
        } else if (that.data.isAgree == false) {
            wx.showModal({
                showCancel: false,
                title: '提示',
                content: '请同意居外用户条款'
            })
        } else {
            var url = `${config.juwai.companyUrl}/` + that.data.companyId + '/user/' + that.data.id + '/consumer'
            wx.request({
                method: 'POST',
                url: url,
                data: {
                    full_name: e.detail.value.realName,
                    name_prefix: e.detail.value.sex,
                    phone: e.detail.value.phone,
                    email: e.detail.value.email,
                    target_country: e.detail.value.country,
                    project_id: that.data.id,
                    property_type: e.detail.value.property_type,
                    budget: e.detail.value.budget,
                    purpose: e.detail.value.purpose,
                    note: e.detail.value.msg
                },
                header: that.data.header,
                success: function(res) {
                    if (res.statusCode == 201) {
                        wx.showModal({
                            showCancel: false,
                            title: '提示',
                            content: '报备成功',
                            success: function(res) {
                                if (res.confirm) {
                                    wx.navigateTo({
                                        url: '/pages/consumers/myConsumers/myConsumers'
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