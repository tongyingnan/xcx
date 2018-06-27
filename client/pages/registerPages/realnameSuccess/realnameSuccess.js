Page({
    goToProject:function () {
        wx.navigateTo({
            url: '../../project/projectList/projectList'
        })
    },
    goToProfile:function () {
        wx.navigateTo({
            url: '../../profile/profile'
        })
    }
});