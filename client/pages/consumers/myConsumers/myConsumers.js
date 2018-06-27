var prom = require('../../../utils/prom');
var config = require('../../../config');

Page({
    data: {
        id: '',
        companyId:'',
        header: '',
        consumerList: [],
        projectList: [],
        array: [{
            key: 99999,
            value: '全部',
        }],
        array1: [99999],
        index: 0
    },
    goToConsumerDetail:function (event) {
        var p = event.currentTarget.id;
        wx.navigateTo({
            url: '../consumerDetail/consumerDetail?id='+p
        })
    },
    goToReport:function () {
        wx.navigateTo({
            url: '../report/report'
        })
    },
    bindPickerChange: function(e) {
        var that = this;
        console.log(that.data.array[e.detail.value].key);
        that.setData({
            index: e.detail.value
        });
        if (that.data.array[e.detail.value].key === 99999) {
            var data = {}
        } else {
            var data = {
                project_id:that.data.array[e.detail.value].key
            }
        }
        var url =  `${config.juwai.companyUrl}/` + that.data.companyId + '/user/' + that.data.id + '/consumer';
        wx.request({
            method: 'GET',
            url: url,
            data: data,
            header: that.data.header,
            success: function(res) {
                console.log(res.data);
                if (res.statusCode == 200) {
                    that.setData({
                        consumerList:res.data
                    });
                } else {

                }
            }
        });
    },
    getProjectName:function () {
        var that = this;
        for (let i =0;i < that.data.consumerList.length; i +=1) {
            for (let l =0;l < that.data.projectList.length; l +=1) {
                if (that.data.consumerList[i].project_id === that.data.projectList[l].id && that.data.array1.includes(that.data.projectList[l].id) === false) {
                    that.data.array1.push(that.data.projectList[l].id);
                    var words = that.data.array.concat({
                        key: that.data.projectList[l].id,
                        value: that.data.projectList[l].location.country_name
                    });
                    that.setData({
                        array: words
                    })
                }
            }
        }
        console.log(that.data.array);
    },
    onLoad:function () {
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
                    var url =  `${config.juwai.companyUrl}/` + that.data.companyId + '/user/' + that.data.id + '/consumer';
                    prom.wxPromisify(wx.request) ({
                        method: 'GET',
                        url: url,
                        data: {},
                        header: that.data.header,
                    }).then(function (res) {
                        console.log(res.data);
                        that.setData({
                            consumerList:res.data
                        });
                    }).then(function () {
                        wx.request({
                            method: 'GET',
                            url: `${config.juwai.agentUrl}/project`,
                            data: {
                                offset: 0,
                                limit: 9999
                            },
                            header: that.data.header,
                            success: function(res) {
                                if (res.statusCode == 200) {
                                    that.setData({
                                        projectList:res.data
                                    });
                                    that.getProjectName();
                                } else {

                                }
                            }
                        });
                    })
                })
            })
        })
    },
})