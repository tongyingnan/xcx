var prom = require('../../../utils/prom');
var config = require('../../../config');
var util = require('../../../utils/util.js')

Page({
    data:{
        steps: [
            {
                current: true,
                done: true,
                text: '提交信息',
                // desc: '10.01'
            },
            {
                done: false,
                current: false,
                text: '签署合同',
            },
            {
                done: false,
                current: false,
                text: '审核完成'
            }
        ],
        isChoose: false
    },
    choose:function () {
        var that = this;
        wx.chooseImage({
            count: 1, // 默认9
            sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
            sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
            success: function (res) {
                // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
                util.showBusy('正在上传');
                that.setData({
                    imgSrc: res.tempFilePaths,
                    isChoose: true
                });
                util.showSuccess('上传图片成功');
            }
        })
    },
    onLoad:function () {
        var that = this;
        wx.getStorage({
            key: 'company_id',
            success: function(res) {
                that.setData({
                    companyId:res.data
                })
            }
        });
        wx.getStorage({
            key: 'header',
            success: function(res) {
                that.setData({
                    header:res.data
                })
            }
        })
    },
    sureRealname:function (e) {
        var that = this;
        if (e.detail.value.company_name == '') {
            wx.showModal({
                showCancel: false,
                title: '提示',
                content: '企业名称不能为空'
            })
        } else if (e.detail.value.business_license_number == '') {
            wx.showModal({
                showCancel: false,
                title: '提示',
                content: '营业执照号码不能为空'
            })
        } else if (e.detail.value.taxpayer_id_number == '') {
            wx.showModal({
                showCancel: false,
                title: '提示',
                content: '纳税人识别号码不能为空'
            })
        } else if (e.detail.value.contract_recipient_name == '') {
            wx.showModal({
                showCancel: false,
                title: '提示',
                content: '收件人姓名不能为空'
            })
        } else if (e.detail.value.contract_recipient_email == '') {
            wx.showModal({
                showCancel: false,
                title: '提示',
                content: '电邮地址不能为空'
            })
        } else if (e.detail.value.contract_recipient_phone == '') {
            wx.showModal({
                showCancel: false,
                title: '提示',
                content: '手机号码不能为空'
            })
        } else if (e.detail.value.contract_recipient_location == '') {
            wx.showModal({
                showCancel: false,
                title: '提示',
                content: '省/市/县不能为空'
            })
        } else if (e.detail.value.contract_recipient_address == '') {
            wx.showModal({
                showCancel: false,
                title: '提示',
                content: '详细地址不能为空'
            })
        } else {
            var url = `${config.juwai.companyUrl}/` + that.data.companyId + '/verification';
            wx.request({
                method: 'POST',
                url: url,
                data: {
                    company_name: e.detail.value.company_name,
                    business_license_number: e.detail.value.business_license_number,
                    taxpayer_id_number: e.detail.value.taxpayer_id_number,
                    contract_recipient_name: e.detail.value.contract_recipient_name,
                    contract_recipient_email: e.detail.value.contract_recipient_email,
                    contract_recipient_phone: e.detail.value.contract_recipient_phone,
                    contract_recipient_location: e.detail.value.contract_recipient_location,
                    contract_recipient_address: e.detail.value.contract_recipient_address
                },
                header: that.data.header,
                success: function(res) {
                    if (res.statusCode == 200) {
                        wx.showModal({
                            showCancel: false,
                            title: '提示',
                            content: '提交成功',
                            success: function(res) {
                                if (res.confirm) {
                                    wx.navigateTo({
                                        url: '../realnameSuccess/realnameSuccess'
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
});