var prom = require('../../../utils/prom');
var config = require('../../../config');

Page({
    data: {
        id: '',
        pid: '',
        consumerDetail: '',
        projectDetail: '',
        steps: [
            {
                current: false,
                done: false,
                text: '首次通话',
                // desc: '10.01'
            },
            {
                done: false,
                current: false,
                text: '到访',
            },
            {
                done: false,
                current: false,
                text: '认筹'
            },
            {
                done: false,
                current: false,
                text: '认购并签约'
            },
            {
                done: false,
                current: false,
                text: '交易完成'
            }
        ],
    },
    goToProjectDetail:function (event) {
        var p = event.currentTarget.id;
        wx.navigateTo({
            url: '../../project/projectDetail/projectDetail?id='+p
        })
    },
    onLoad:function (options) {
        var that = this;
        prom.wxPromisify(wx.getStorage) ({
            key: 'id'
        }).then(function (res) {
            that.setData({
                id:res.data
            })
        }).then(function () {
            prom.wxPromisify(wx.getStorage) ({
                key: 'company_id'
            }).then(function (res) {
                that.setData({
                    companyId:res.data
                })
            }).then(function () {
                prom.wxPromisify(wx.getStorage) ({
                    key: 'header'
                }).then(function (res) {
                    that.setData({
                        header: res.data
                    })
                }).then(function () {
                    var url= `${config.juwai.companyUrl}/` + that.data.companyId + '/user/' + that.data.id + '/consumer/'+ options.id;
                    prom.wxPromisify(wx.request) ({
                        method: 'GET',
                        url: url,
                        data: {},
                        header: that.data.header,
                    }).then(function (res) {
                        console.log(res.data);
                    if (res.data.status == 1) {
                            that.setData({
                                steps:[
                                    {
                                        current: true,
                                        done: true,
                                        text: '首次通话',
                                    },
                                    {
                                        done: false,
                                        current: false,
                                        text: '到访',
                                    },
                                    {
                                        done: false,
                                        current: false,
                                        text: '认筹'
                                    },
                                    {
                                        done: false,
                                        current: false,
                                        text: '认购并签约'
                                    },
                                    {
                                        done: false,
                                        current: false,
                                        text: '交易完成'
                                    }
                                ],
                            })
                        }  else if (res.data.status == 2) {
                            that.setData({
                                steps:[
                                    {
                                        current: true,
                                        done: true,
                                        text: '首次通话',
                                    },
                                    {
                                        done: true,
                                        current: true,
                                        text: '到访',
                                    },
                                    {
                                        done: false,
                                        current: false,
                                        text: '认筹'
                                    },
                                    {
                                        done: false,
                                        current: false,
                                        text: '认购并签约'
                                    },
                                    {
                                        done: false,
                                        current: false,
                                        text: '交易完成'
                                    }
                                ],
                            })
                        } else if (res.data.status == 3) {
                            that.setData({
                                steps:[
                                    {
                                        current: true,
                                        done: true,
                                        text: '首次通话',
                                    },
                                    {
                                        done: true,
                                        current: true,
                                        text: '到访',
                                    },
                                    {
                                        done: true,
                                        current: true,
                                        text: '认筹'
                                    },
                                    {
                                        done: false,
                                        current: false,
                                        text: '认购并签约'
                                    },
                                    {
                                        done: false,
                                        current: false,
                                        text: '交易完成'
                                    }
                                ],
                            })
                        }  else if (res.data.status == 4) {
                            that.setData({
                                steps:[
                                    {
                                        current: true,
                                        done: true,
                                        text: '首次通话',
                                    },
                                    {
                                        done: true,
                                        current: true,
                                        text: '到访',
                                    },
                                    {
                                        done: true,
                                        current: true,
                                        text: '认筹'
                                    },
                                    {
                                        done: true,
                                        current: true,
                                        text: '认购并签约'
                                    },
                                    {
                                        done: false,
                                        current: false,
                                        text: '交易完成'
                                    }
                                ],
                            })
                        } else if (res.data.status == 5) {
                            that.setData({
                                steps:[
                                    {
                                        current: true,
                                        done: true,
                                        text: '首次通话',
                                    },
                                    {
                                        done: true,
                                        current: true,
                                        text: '到访',
                                    },
                                    {
                                        done: true,
                                        current: true,
                                        text: '认筹'
                                    },
                                    {
                                        done: true,
                                        current: true,
                                        text: '认购并签约'
                                    },
                                    {
                                        done: true,
                                        current: true,
                                        text: '交易完成'
                                    }
                                ],
                            })
                        } else if (res.data.status == -1) {
                            if (res.data.status_changes[0].status == -1) {
                                that.setData({
                                    steps:[
                                        {
                                            current: true,
                                            done: true,
                                            text: '已失效',
                                        }
                                    ],
                                })
                            } else if (res.data.status_changes[1].status == -1) {
                                that.setData({
                                    steps:[
                                        {
                                            current: false,
                                            done: false,
                                            text: '首次通话',
                                        },
                                        {
                                            current: true,
                                            done: true,
                                            text: '已失效',
                                        }
                                    ],
                                })
                            } else if (res.data.status_changes[2].status == -1) {
                                that.setData({
                                    steps:[
                                        {
                                            current: false,
                                            done: false,
                                            text: '首次通话',
                                        },
                                        {
                                            done: false,
                                            current: false,
                                            text: '到访',
                                        },
                                        {
                                            current: true,
                                            done: true,
                                            text: '已失效',
                                        }
                                    ],
                                })
                            } else if (res.data.status_changes[3].status == -1) {
                                that.setData({
                                    steps:[
                                        {
                                            current: false,
                                            done: false,
                                            text: '首次通话',
                                        },
                                        {
                                            done: false,
                                            current: false,
                                            text: '到访',
                                        },
                                        {
                                            done: false,
                                            current: false,
                                            text: '认筹'
                                        },
                                        {
                                            current: true,
                                            done: true,
                                            text: '已失效',
                                        }
                                    ],
                                })
                            } else if (res.data.status_changes[4].status == -1) {
                                that.setData({
                                    steps:[
                                        {
                                            current: false,
                                            done: false,
                                            text: '首次通话',
                                        },
                                        {
                                            done: false,
                                            current: false,
                                            text: '到访',
                                        },
                                        {
                                            done: false,
                                            current: false,
                                            text: '认筹'
                                        },
                                        {
                                            done: false,
                                            current: false,
                                            text: '认购并签约'
                                        },
                                        {
                                            current: true,
                                            done: true,
                                            text: '已失效',
                                        }
                                    ],
                                })
                            } else if (res.data.status_changes[5].status == -1) {
                                that.setData({
                                    steps:[
                                        {
                                            current: false,
                                            done: false,
                                            text: '首次通话',
                                        },
                                        {
                                            done: false,
                                            current: false,
                                            text: '到访',
                                        },
                                        {
                                            done: false,
                                            current: false,
                                            text: '认筹'
                                        },
                                        {
                                            done: false,
                                            current: false,
                                            text: '认购并签约'
                                        },
                                        {
                                            done: false,
                                            current: false,
                                            text: '交易完成'
                                        },
                                        {
                                            current: true,
                                            done: true,
                                            text: '已失效',
                                        }
                                    ],
                                })
                            }
                        }
                        that.setData({
                            consumerDetail:res.data
                        });
                        that.setData({
                            pid:res.data.project_id
                        })
                    }).then(function () {
                        var url= 'http://mobile-api.juwai.io/china-agent/project/'+ that.data.pid;
                        wx.request({
                            method: 'GET',
                            url: url,
                            data: {},
                            header: {
                                'content-type': 'application/json', // 默认值
                            },
                            success: function(res) {
                                if (res.statusCode == 200) {
                                    that.setData({
                                        projectDetail :res.data
                                    });
                                } else {

                                }
                            }
                        });
                    })
                });
            })
        })
    }
})