var prom = require('../../../utils/prom')

Page({
    data: {
        companyDetail: {},
        companyId: '',
        header: {},
        isDisabled: false,
        isVrification: ''
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
                var url = 'http://mobile-api.juwai.io/china-agent/company/' + that.data.companyId;
                wx.request({
                    method: 'GET',
                    url: url,
                    data: {},
                    header: that.data.header,
                    success: function(res) {
                        console.log(res.data);
                        if (res.statusCode == 200) {
                            that.setData({
                                companyDetail: res.data
                            })
                        } else {

                        }
                    }
                });
            })
        });
        prom.wxPromisify(wx.getStorage) ({
            key: 'is_company_owner'
        }).then(function (res) {
            if (res.data != 1) {
                that.setData({
                    isDisabled: true
                })
            }
        });
        prom.wxPromisify(wx.getStorage) ({
            key: 'verification_status'
        }).then(function (res) {
            that.setData({
                isVrification:res.data
            })
        }).then(function () {
            if (that.data.isVrification == '2') {
                that.setData({
                    isDisabled: true
                })
            }
        })
    },
    sureChange: function (e) {
        var that = this;
        if (e.detail.value.companyName == '') {
            wx.showModal({
                showCancel: false,
                title: '提示',
                content: '企业名称不能为空'
            })
        } else if (e.detail.value.businessLicenseNumber == '') {
            wx.showModal({
                showCancel: false,
                title: '提示',
                content: '营业执照号码不能为空'
            })
        } else if (e.detail.value.taxpayerIdNumber == '') {
            wx.showModal({
                showCancel: false,
                title: '提示',
                content: '纳税人识别号不能为空'
            })
        } else if (e.detail.value.mainBusiness == '') {
            wx.showModal({
                showCancel: false,
                title: '提示',
                content: '主要业务不能为空'
            })
        } else if (e.detail.value.cityName == '') {
            wx.showModal({
                showCancel: false,
                title: '提示',
                content: '所在城市不能为空'
            })
        } else if (e.detail.value.contractRecipientLocation == '') {
            wx.showModal({
                showCancel: false,
                title: '提示',
                content: '办公地址不能为空'
            })
        } else if (e.detail.value.employeeNumber == '') {
            wx.showModal({
                showCancel: false,
                title: '提示',
                content: '员工数目不能为空'
            })
        } else {
            var url = 'http://mobile-api.juwai.io/china-agent/company/' + that.data.companyId;
            wx.request({
                method: 'PUT',
                url: url,
                data: {
                    company_name: e.detail.value.companyName,
                    business_license_number: e.detail.value.businessLicenseNumber,
                    taxpayer_id_number: e.detail.value.taxpayerIdNumber,
                    main_business: e.detail.value.mainBusiness,
                    city_name: e.detail.value.cityName,
                    office_address: e.detail.value.contractRecipientLocation,
                    employee_number: e.detail.value.employeeNumber
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