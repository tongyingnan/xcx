Page({
    sureRegister: function (e) {
        var that = this;
        if (e.detail.value.companyName == '') {
            wx.showModal({
                showCancel: false,
                title: '提示',
                content: '企业名称不能为空'
            })
        } else if (e.detail.value.city == '') {
            wx.showModal({
                showCancel: false,
                title: '提示',
                content: '城市不能为空'
            })
        } else {
            wx.setStorage({
                key:"companyName",
                data:e.detail.value.companyName
            });
            wx.setStorage({
                key:"city",
                data:e.detail.value.city
            });
            wx.navigateTo({
                url: '../registerNext/registerNext'
            })
        }
    },
})