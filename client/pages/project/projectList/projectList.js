var prom = require('../../../utils/prom');
var config = require('../../../config');
const { Tab, extend, Dialog, } = require('../../../zanui/index');

Page(extend({}, Tab,Dialog, {
    data: {
        projectList: [],
        isShowCover:false,
        url: '../../../zanui/five.png',
        page: 1,
        pageSize: 10,
        windowHeight: 0,
        isShowDialog:false,
        tab: {
            list: [],
            selectedId: '1',
            scroll: true,
            height: 45
        },
        tab1: {
            list: [],
            selectedId: '',
            scroll: true,
            height: 45
        },
        showModal: false,
        modalSrc: ''
    },
    //放大图片
    clickImg:function (event) {
        this.setData({
            modalSrc:event.currentTarget.dataset.src,
            modalSrcs:event.currentTarget.dataset.srcs,
            index:event.currentTarget.dataset.index,
            showModal: true
        });
    },
    hideModal:function () {
        this.setData({
            showModal:false,
            touchStart: 0,
            touchMove: 0,
            index: 0
        })
    },
    // 图片放大切换
    touchStart:function (e) {
        this.setData({
            touchStart: e.touches[0].pageX
        });
    },
    touchMove:function (e) {
        this.setData({
            touchMove: e.touches[0].pageX
        });
    },
    touchEnd:function (e) {
        if (this.data.touchMove - this.data.touchStart <= 0) {
            if (this.data.index < this.data.modalSrcs.length-1) {
                this.setData({
                    index: this.data.index + 1,
                    modalSrc: this.data.modalSrcs[this.data.index + 1],
                });
            } else {
                this.setData({
                    index: 0,
                    modalSrc: this.data.modalSrcs[0]
                });
            }
        } else {
            if (this.data.index > 0) {
                this.setData({
                    index: this.data.index - 1,
                    modalSrc: this.data.modalSrcs[this.data.index - 1],
                });
            } else {
                this.setData({
                    index: this.data.modalSrcs.length-1,
                    modalSrc: this.data.modalSrcs[this.data.modalSrcs.length-1],
                });
            }
        }
    },
    // 滚动事件
    // scroll:function (e) {
    //     this.setData({
    //         scrollTop: e.detail.scrollTop
    //     });
    // },
    //筛选请求
    requestProject:function () {
        var that = this;
        wx.request({
            method: 'GET',
            url: 'http://mobile-api.juwai.io/china-agent/project',
            data: that.data.data,
            header: {
                'content-type': 'application/json', // 默认值
            },
            success: function(res) {
                console.log(res.data);
                if (res.statusCode == 200) {
                    that.setData({
                        projectList:res.data
                    });
                }
            }
        });
    },
    //分次加载
    loading:function () {
        var that = this;
        wx.request({
            method: 'GET',
            url: 'http://mobile-api.juwai.io/china-agent/project',
            data: {
                offset: that.data.pageSize * (that.data.page - 1),
                limit: that.data.pageSize,
                country_id: that.data.selectedId ? that.data.selectedId : '0',
                city_id: that.data.selectedCityId ? that.data.selectedCityId : '',
                price: that.data.price ? that.data.price : '0-30000000'
            },
            header: {
                'content-type': 'application/json', // 默认值
            },
            success: function(res) {
                console.log(res.data);
                if (res.statusCode == 200) {
                    if (that.data.page === 1) {
                        that.setData({
                            projectList:res.data
                        });
                    } else {
                        var words = that.data.projectList.concat(res.data);
                        that.setData({
                            projectList: words
                        })
                    }
                }
            }
        });
    },
    //价格
    sliderchange:function (e) {
        var that = this;
        var max_prices = that.data.max_price ? that.data.max_price : '30000000';
        var min_prices = e.detail.value + '0000';
        that.setData({
            page: 1,
            min_price: e.detail.value + '0000'
        });
        if (that.data.max_price) {
            that.setData({
                price: [min_prices, that.data.max_price].join('-')
            })
        } else {
            that.setData({
                price: [min_prices, '30000000'].join('-')
            })
        }
        that.setData({
            data:{
                offset: that.data.pageSize * (that.data.page - 1),
                limit: that.data.pageSize,
                country_id: that.data.selectedId ? that.data.selectedId : '',
                city_id: that.data.selectedCityId ? that.data.selectedCityId : '',
                price: [min_prices, max_prices].join('-')
            }
        });
        that.requestProject();
    },
    sliderchange1:function (e) {
        var that = this;
        var min_prices = that.data.min_price ? that.data.min_price : '0';
        var max_prices = e.detail.value + '0000';
        that.setData({
            page: 1,
            max_price: e.detail.value + '0000'
        });
        if (that.data.min_price) {
            that.setData({
                price: [that.data.min_price, max_prices].join('-')
            })
        } else {
            that.setData({
                price: ['0', max_prices].join('-')
            })
        }
        that.setData({
            data:{
                offset: that.data.pageSize * (that.data.page - 1),
                limit: that.data.pageSize,
                country_id: that.data.selectedId ? that.data.selectedId : '',
                city_id: that.data.selectedCityId ? that.data.selectedCityId : '',
                price: [min_prices, max_prices].join('-')
            }
        });
        that.requestProject();
    },
    //国家选中
    handleZanTabChange(e) {
        var that = this;
        var componentId = e.componentId;
        var selectedId = e.selectedId;
        if (e.componentId === 'tab') {
            that.setData({
                [`${componentId}.selectedId`]: selectedId,
                page: 1,
                selectedId: selectedId
            });
            var tab1 = {
                list: [],
                selectedId: '',
                scroll: true,
                height: 45
            };
            if (e.selectedId === '0') {
                that.setData({
                    tab1: tab1
                })
            }
            for (const item in that.data.locationList) {
                if (e.selectedId == that.data.locationList[item].country_id) {
                    for (const item1 in that.data.locationList[item].country_cities) {
                        tab1.list.push({
                            id: item1,
                            title: that.data.locationList[item].country_cities[item1]
                        });
                        that.setData({
                            tab1:tab1
                        })
                    }
                }
            }
            that.setData({
                data:{
                    offset: that.data.pageSize * (that.data.page - 1),
                    limit: that.data.pageSize,
                    country_id: e.selectedId,
                    price: that.data.price ? that.data.price : '0-30000000'
                }
            });
            that.requestProject();
        } else if (e.componentId === 'tab1') {
            that.setData({
                [`${componentId}.selectedId`]: selectedId,
                page: 1,
                selectedCityId: selectedId,
                data:{
                    offset: that.data.pageSize * (that.data.page - 1),
                    limit: that.data.pageSize,
                    country_id: that.data.selectedId,
                    city_id: e.selectedId,
                    price: that.data.price ? that.data.price : '0-30000000'
                }
            });
            that.requestProject();
        }
    },
    onLoad:function () {
        var that = this;
        prom.wxPromisify(wx.getStorage) ({
            key: 'verification_status'
        }).then(function (res) {
            if (res.data == '0') {
                that.setData({
                    isShowDialog:true
                });
                that.showZanDialog({
                    title: '马上实名认证，开通以下特权',
                    content: '立即查看居外优选房产项目\r\n最新活动\r\n海外购房指南\r\n全球最新房产动态\r\n成功案例',
                    confirmText: '去实名认证',
                    cancelText: '稍后再说',
                    showCancel: true
                }).then(() => {
                        wx.navigateTo({
                            url: '../../registerPages/realname/realname'
                        })
                    }).catch(() => {
                        console.log('=== dialog ===', 'type: cancel');
                    });
            }
        });
        wx.request({
            method: 'GET',
            url: 'http://mobile-api.juwai.io/china-agent/filter/location',
            data: {},
            header: {
                'content-type': 'application/json', // 默认值
            },
            success: function(res) {
                console.log(res.data);
                if (res.statusCode == 200) {
                    that.setData({
                        locationList:res.data
                    });
                    var tab = {
                        list: [{
                            id: '0',
                            title: '全部'
                        }],
                        selectedId: '0',
                        scroll: true,
                        height: 45
                    };
                    for (const item in res.data) {
                        tab.list.push({
                            id: res.data[item].country_id,
                            title: res.data[item].country_name
                        })
                    }
                    that.setData({
                        tab: tab
                    })
                }
            }
        });
        that.loading();
        //获取屏幕高度
        wx.getSystemInfo({
            success: function (res) {
                that.setData({
                    windowHeight: res.windowHeight
                });
                console.log("屏幕高度: " + res.windowHeight)
            }
        });
        // wx.getStorage({
        //     key: 'scrollTop',
        //     success: function(res) {
        //         that.setData({
        //             scrollTop: res.data
        //         })
        //     }
        // })
    },
    load:function () {
      var that = this;
      that.setData({
          page :that.data.page + 1
      });
      that.loading();
    },
    goToProjectDetail: function (event) {
        // wx.setStorage({
        //   key:"scrollTop",
        //   data:this.data.scrollTop
        // });
        var p = event.currentTarget.id;
        wx.navigateTo({
            url: '../projectDetail/projectDetail?id='+p
        })
    },
    report:function (event) {
        var p = event.currentTarget.id;
        wx.navigateTo({
            url: '../../consumers/report/report?id='+p
        })
    },
    collect:function (event) {
        var that = this;
        var p = event.currentTarget.id;
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
                    var url =  `${config.juwai.companyUrl}/` + that.data.companyId + '/user/' + that.data.id + '/favorite';
                    wx.request({
                        method: 'POST',
                        url: url,
                        data: {
                            project_id:p
                        },
                        header: that.data.header,
                        success: function(res) {
                            console.log(res.data);
                            if (res.statusCode == 201) {
                                wx.showModal({
                                    title: '提示',
                                    content: '您已收藏成功',
                                    showCancel: false,
                                    success: function(res) {
                                        if (res.confirm) {

                                        }
                                    }
                                })
                            }
                        }
                    });
                })
            })
        })
    }
}))