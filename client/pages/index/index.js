//index.js
var qcloud = require('../../vendor/wafer2-client-sdk/index');
var config = require('../../config');
var util = require('../../utils/util.js');
var prom = require('../../utils/prom.js');

Page({
    data: {
        userInfo: {},
        logged: false,
        takeSession: false,
        requestResult: ''
    },
    sureLogin: function (e) {
        var that = this;
        if (e.detail.value.userName == '') {
            wx.showModal({
                showCancel: false,
                title: '提示',
                content: '用户名不能为空'
            })
        } else if (e.detail.value.userPwd == '') {
            wx.showModal({
                showCancel: false,
                title: '提示',
                content: '密码不能为空'
            })
        } else {
            that.setData({
                userName:e.detail.value.userName,
                userPwd:e.detail.value.userPwd
            });
            wx.request({
                method: 'POST',
                url: 'http://mobile-api.juwai.io/oauth/token',
                // url: 'https://mobile-api.juwai.com/oauth/token',
                data: {
                    grant_type: 'password',
                    client_id: '1',
                    client_secret: 'TGsFa1qhmZX43ANOQFk8rKiBJcCFthMdNErF8Ej3',
                    // client_secret: 'Nay5c1GB9PYWfpGLWlBEIdsQKIvJ3baoe7CdIRAY',
                    username:that.data.userName,
                    password:that.data.userPwd
                },
                header: {
                    'content-type': 'application/json' // 默认值
                },
                success: function(res) {
                    that.setData({
                        getLogs:res.data
                    });
                    if (res.statusCode == 200) {
                        wx.setStorage({
                            key:"token",
                            data:`${res.data.token_type} ${res.data.access_token}`
                        });
                        wx.showModal({
                            showCancel: false,
                            title: '提示',
                            content: '登录成功',
                            success: function(res) {
                                if (res.confirm) {
                                    wx.navigateTo({
                                        url: '../profile/profile'
                                    })
                                }
                            }
                        })
                    } else {
                        wx.showModal({
                            showCancel: false,
                            title: '提示',
                            content: '用户名或密码有误'
                        })
                    }
                }
            });
        }
    },
    telUs: function () {
        wx.makePhoneCall({
            phoneNumber: '500001' //仅为示例，并非真实的电话号码
        })
    },
    goToResister: function () {
        wx.navigateTo({
            url: '../registerPages/register/register'
        })
    },
    getUserInfo:function () {
        var that = this;
        wx.getUserInfo({
            success: function(res) {
                var userInfo = res.userInfo;
                var nickName = userInfo.nickName;
                var avatarUrl = userInfo.avatarUrl;
                that.setData({
                    userInfo: res.userInfo,
                    logged: true
                });
                wx.setStorage({
                    key:"nickName",
                    data: res.userInfo.nickName
                });
                wx.setStorage({
                    key:"avatarUrl",
                    data: res.userInfo.avatarUrl
                });
            }
        })
    },
    onLoad:function () {
        var that = this;
        prom.wxPromisify(wx.getSetting) ({

        }).then(function (res) {
            if (!res.authSetting['scope.userInfo']) {
                wx.authorize({
                    scope: 'scope.userInfo',
                    success(res) {
                        console.log(res);
                        that.getUserInfo();
                    }
                })
            } else {
                that.getUserInfo();
            }
        }).then(function () {
            prom.wxPromisify(wx.getStorage) ({
                key: 'token'
            }).then(function (res) {
                if (res.data) {
                    wx.navigateTo({
                        url: '../profile/profile'
                    })
                }
            })
        });
        // wx.getStorage({
        //     key: 'token',
        //     success: function(res) {
        //         console.log(res.data);
        //         wx.navigateTo({
        //             url: '../profile/profile'
        //         })
        //     },
        //     fail :function () {
        //         wx.getSetting({
        //             success(res) {
        //                 if (!res.authSetting['scope.userInfo']) {
        //                     wx.authorize({
        //                         scope: 'scope.userInfo',
        //                         success(res) {
        //                             console.log(res);
        //                             that.getUserInfo();
        //                         }
        //                     })
        //                 } else {
        //                     that.getUserInfo();
        //                 }
        //             }
        //         })
        //         // wx.showModal({
        //         //     title: '微信授权',
        //         //     content: ' 申请获得以下权限\r\n获得你的公开信息（昵称、头像等）',
        //         //     cancelText: '拒绝',
        //         //     confirmText: '允许',
        //         //     success: function(res) {
        //         //         if (res.confirm) {
        //         //             if (that.data.logged) return
        //         //
        //         //             util.showBusy('正在登录')
        //         //             // var that = this
        //         //             wx.getUserInfo({
        //         //                 success: function(res) {
        //         //                     util.showSuccess('登录成功')
        //         //                     var userInfo = res.userInfo
        //         //                     var nickName = userInfo.nickName
        //         //                     var avatarUrl = userInfo.avatarUrl
        //         //                     var gender = userInfo.gender //性别 0：未知、1：男、2：女
        //         //                     var province = userInfo.province
        //         //                     var city = userInfo.city
        //         //                     var country = userInfo.country
        //         //                     that.setData({
        //         //                         userInfo: res.userInfo,
        //         //                         logged: true
        //         //                     })
        //         //                     wx.setStorage({
        //         //                         key:"nickName",
        //         //                         data: res.userInfo.nickName
        //         //                     });
        //         //                     wx.setStorage({
        //         //                         key:"avatarUrl",
        //         //                         data: res.userInfo.avatarUrl
        //         //                     });
        //         //                 }
        //         //             })
        //         //         } else if (res.cancel) {
        //         //             console.log('用户点击取消')
        //         //         }
        //         //     }
        //         // })
        //     }
        // });
    },
    // 用户登录示例
    login: function() {
        if (this.data.logged) return

        util.showBusy('正在登录')
        var that = this

        // 调用登录接口
        qcloud.login({
            success(result) {
                if (result) {
                    util.showSuccess('登录成功')
                    that.setData({
                        userInfo: result,
                        logged: true
                    })
                } else {
                    // 如果不是首次登录，不会返回用户信息，请求用户信息接口获取
                    qcloud.request({
                        url: config.service.requestUrl,
                        login: true,
                        success(result) {
                            util.showSuccess('登录成功')
                            that.setData({
                                userInfo: result.data.data,
                                logged: true
                            })
                        },

                        fail(error) {
                            util.showModel('请求失败', error)
                            console.log('request fail', error)
                        }
                    })
                }
            },

            fail(error) {
                util.showModel('登录失败', error)
                console.log('登录失败', error)
            }
        })
    },

    // 切换是否带有登录态
    switchRequestMode: function (e) {
        this.setData({
            takeSession: e.detail.value
        })
        this.doRequest()
    },

    doRequest: function () {
        util.showBusy('请求中...')
        var that = this
        var options = {
            url: config.service.requestUrl,
            login: true,
            success (result) {
                util.showSuccess('请求成功完成')
                console.log('request success', result)
                that.setData({
                    requestResult: JSON.stringify(result.data)
                })
            },
            fail (error) {
                util.showModel('请求失败', error);
                console.log('request fail', error);
            }
        }
        if (this.data.takeSession) {  // 使用 qcloud.request 带登录态登录
            qcloud.request(options)
        } else {    // 使用 wx.request 则不带登录态
            wx.request(options)
        }
    },

    // 上传图片接口
    doUpload: function () {
        var that = this

        // 选择图片
        wx.chooseImage({
            count: 1,
            sizeType: ['compressed'],
            sourceType: ['album', 'camera'],
            success: function(res){
                util.showBusy('正在上传')
                var filePath = res.tempFilePaths[0]

                // 上传图片
                wx.uploadFile({
                    url: config.service.uploadUrl,
                    filePath: filePath,
                    name: 'file',

                    success: function(res){
                        util.showSuccess('上传图片成功')
                        console.log(res)
                        res = JSON.parse(res.data)
                        console.log(res)
                        that.setData({
                            imgUrl: res.data.imgUrl
                        })
                    },

                    fail: function(e) {
                        util.showModel('上传图片失败')
                    }
                })

            },
            fail: function(e) {
                console.error(e)
            }
        })
    },

    // 预览图片
    previewImg: function () {
        wx.previewImage({
            current: this.data.imgUrl,
            urls: [this.data.imgUrl]
        })
    },

    // 切换信道的按钮
    switchChange: function (e) {
        var checked = e.detail.value

        if (checked) {
            this.openTunnel()
        } else {
            this.closeTunnel()
        }
    },

    openTunnel: function () {
        util.showBusy('信道连接中...')
        // 创建信道，需要给定后台服务地址
        var tunnel = this.tunnel = new qcloud.Tunnel(config.service.tunnelUrl)

        // 监听信道内置消息，包括 connect/close/reconnecting/reconnect/error
        tunnel.on('connect', () => {
            util.showSuccess('信道已连接')
            console.log('WebSocket 信道已连接')
            this.setData({ tunnelStatus: 'connected' })
        })

        tunnel.on('close', () => {
            util.showSuccess('信道已断开')
            console.log('WebSocket 信道已断开')
            this.setData({ tunnelStatus: 'closed' })
        })

        tunnel.on('reconnecting', () => {
            console.log('WebSocket 信道正在重连...')
            util.showBusy('正在重连')
        })

        tunnel.on('reconnect', () => {
            console.log('WebSocket 信道重连成功')
            util.showSuccess('重连成功')
        })

        tunnel.on('error', error => {
            util.showModel('信道发生错误', error)
            console.error('信道发生错误：', error)
        })

        // 监听自定义消息（服务器进行推送）
        tunnel.on('speak', speak => {
            util.showModel('信道消息', speak)
            console.log('收到说话消息：', speak)
        })

        // 打开信道
        tunnel.open()

        this.setData({ tunnelStatus: 'connecting' })
    },

    /**
     * 点击「发送消息」按钮，测试使用信道发送消息
     */
    sendMessage() {
        if (!this.data.tunnelStatus || !this.data.tunnelStatus === 'connected') return
        // 使用 tunnel.isActive() 来检测当前信道是否处于可用状态
        if (this.tunnel && this.tunnel.isActive()) {
            // 使用信道给服务器推送「speak」消息
            this.tunnel.emit('speak', {
                'word': 'I say something at ' + new Date(),
            });
        }
    },

    /**
     * 点击「关闭信道」按钮，关闭已经打开的信道
     */
    closeTunnel() {
        if (this.tunnel) {
            this.tunnel.close();
        }
        util.showBusy('信道连接中...')
        this.setData({ tunnelStatus: 'closed' })
    }
})
