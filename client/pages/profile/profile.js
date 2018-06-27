var config = require('../../config');
var prom = require('../../utils/prom');

Page({
    data: {
        phone: '',
        token: '',
        nickName: '',
        avatarUrl: '',
        header: {},
        phoneNumber: '',
        companyName: '',
        companyId: '',
        verificationMsg: '',
        isShowVerification: true,
        companyMemberCount: '',
        isShowMember:true
    },
    // 得到最后一位客户信息
    consumerMsg:function () {
        var that = this;
        var url =  `${config.juwai.companyUrl}/` + that.data.companyId + '/user/' + that.data.id + '/consumer';
        wx.request({
            method: 'GET',
            url: url,
            data: {},
            header: that.data.header,
            success:res=>{
                var ids = [];
                for (const obj in res.data) {
                    ids.push(res.data[obj].id);
                }
                that.setData({
                    cid: ids.sort()[ids.length-1]
                })
            }
        })
    },
    // 得到用户信息
    currentUser:function () {
        var that = this;
        wx.request({
            method: 'GET',
            url: 'http://mobile-api.juwai.io/china-agent/current-user',
            // url: 'https://mobile-api.juwai.com/china-agent/current-user',
            data: {},
            header: that.data.header,
            success: function(res) {
                if (res.statusCode == 200) {
                    if (res.data.is_company_owner != 1) {
                        that.setData({
                            isShowMember:false
                        })
                    }
                    wx.setStorage({
                        key:"company_id",
                        data:res.data.company_id
                    });
                    that.setData({
                        companyId: res.data.company_id
                    });
                    wx.setStorage({
                        key:"id",
                        data:res.data.id
                    });
                    that.setData({
                        id: res.data.id
                    });
                    wx.setStorage({
                        key:"is_company_owner",
                        data:res.data.is_company_owner
                    });
                    that.setData({
                        phoneNumber: res.data.phone_number
                    });
                    that.setData({
                        companyName: res.data.full_name
                    });
                    that.companyVerification();
                    that.companyMemberCount();
                    that.consumerMsg();
                } else {

                }
            }
        });
    },
    // 得到公司认证信息
    companyVerification:function () {
        var that = this;
        var url = 'http://mobile-api.juwai.io/china-agent/company/' + that.data.companyId + '/verification';
        wx.request({
            method: 'GET',
            url: url,
            data: {},
            header: that.data.header,
            success: function(res) {
                if (res.statusCode == 200) {
                    wx.setStorage({
                      key:"verification_status",
                      data:res.data.verification_status
                    });
                    if (res.data.verification_status === 2) {
                       that.setData({
                           verificationMsg: '已实名认证',
                           isShowVerification: false
                       })
                    } else {
                        that.setData({
                            verificationMsg: '未实名认证'
                        })
                    }
                } else {

                }
            }
        });
    },
    // 得到企业成员数量
    companyMemberCount:function () {
        var that = this;
        var url = 'http://mobile-api.juwai.io/china-agent/company/' + that.data.companyId + '/user';
        wx.request({
            method: 'GET',
            url: url,
            data: {},
            header: that.data.header,
            success: function(res) {
                if (res.statusCode == 200) {
                    that.setData({
                        companyMemberCount: res.data.length
                    })
                } else {

                }
            }
        });
    },
    // 设置通用header
    setHeader:function () {
        var that = this;
        wx.setStorage({
            key:"header",
            data:{
                'Accept': 'application/json',
                'content-type': 'application/json',
                'Authorization': that.data.token
            },
        });
    },
    onLoad:function () {
        wx.showLoading({
            title: '加载中',
        });
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
            key: 'token',
            success: function(res) {
                that.setData({
                    token: res.data,
                });
                that.setData({
                    header: {
                        'Accept': 'application/json',
                        'content-type': 'application/json',
                        'Authorization': that.data.token
                    },
                });
                that.currentUser();
                that.setHeader();
            }
        });
        wx.hideLoading();
    },
    goToProgress:function () {
        var p = this.data.cid;
        wx.navigateTo({
            url: '../consumers/consumerDetail/consumerDetail?id=' +p
        })
    },
    goToConsumers:function () {
        wx.navigateTo({
            url: '../consumers/myConsumers/myConsumers'
        })
    },
    goToCollect: function () {
        wx.navigateTo({
            url: '../project/projectCollect/projectCollect'
        })
    },
    goToBrowsed: function () {
        wx.navigateTo({
            url: '../project/projectBrowsed/projectBrowsed'
        })
    },
    goToProjectList: function () {
        wx.navigateTo({
            url: '../project/projectList/projectList'
        })
    },
    goToCompanyDetail:function () {
        wx.navigateTo({
          url: '../company/companyDetail/companyDetail'
        })  
    },
    goToCompanyMember: function () {
        wx.navigateTo({
            url: '../company/companyMember/companyMember'
        })
    },
    goToChangePersonalMsg: function () {
        wx.navigateTo({
            url: '../registerPages/changePersonalMsg/changePersonalMsg'
        })
    },
    goToChangePwd: function () {
        wx.navigateTo({
            url: '../registerPages/changePwd/changePwd'
        })
    },
    goToRealname:function () {
        wx.navigateTo({
            url: '../registerPages/realname/realname'
        })
    },
    goToProblems:function () {
        wx.navigateTo({
            url: '../commonProblem/problems/problems'
        })
    },
    signOut: function () {
        var that = this;
        var url = 'http://mobile-api.juwai.io/oauth/token/' + that.data.token;
        wx.request({
            method: 'DELETE',
            url: url,
            data: {},
            header: that.data.header,
            success: function(res) {
                if (res.statusCode == 200) {
                    wx.showModal({
                        showCancel: false,
                        title: '提示',
                        content: '您已退出登录',
                        success: function(res) {
                            if (res.confirm) {
                                wx.clearStorage();
                                wx.navigateTo({
                                    url: '../index/index'
                                })
                            }
                        }
                    })
                } else {
                    console.log(res.data);
                }
            }
        });
    }
})