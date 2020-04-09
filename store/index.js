import Vue from "vue"
import Vuex from "vuex"

Vue.use(Vuex)

const store = new Vuex.Store({
	state: {
		allData: [],
		hasLogin: false,
		loginProvider: "",
		openid: "",
		testvuex: false,
		selected: [],
		colorIndex: 0,
		userInfo: {
			nickName: "您未登录",
			avatarUrl: "/static/calender_press.png"
		},
		url: "http://120.25.215.190/",
		version: 0,
		selectedDate: ''
	},
	mutations: {
		setAllData(state, allData) {
			state.allData = allData;
		},
		setCurrentMonthSelected(state, selected) {
			state.selected = selected;
			if (selected.length > 0) {
				if (selected[0].user != null) {
					state.version = selected[0].user.version
				}
			}
			//console.log(state.selected);
		},
		login(state, provider) {
			uni.setStorage({
				key: 'hasLogin',
				data: true,
				success: (res) => {
					state.hasLogin = true;
					state.loginProvider = provider;
				},
				fail: () => {
					uni.showModal({
						title: '储存数据失败!',
						showCancel: false
					})
				}
			})
		},
		logout(state) {
			uni.setStorage({
				key: 'hasLogin',
				data: false,
				success: (res) => {
					state.hasLogin = false;
					state.openid = null
				},
				fail: () => {
					uni.showModal({
						title: '储存数据失败!',
						showCancel: false
					})
				}
			})
		},
		setOpenid(state, openid) {
			state.openid = openid
		},
		setVersion(state, version) {
			state.version = version
		},
		setTestTrue(state) {
			state.testvuex = true
		},
		setTestFalse(state) {
			state.testvuex = false
		},
		setColorIndex(state, index) {
			state.colorIndex = index
		},
		clearUserInfo(state) {
			state.userInfo = {
				nickName: "您未登录",
				avatarUrl: "/static/calender_press.png"
			};
			state.openid = null;
			state.selected = [];
		},
		setUserInfo(state, userInfo) {
			uni.setStorage({
				key: 'userInfo',
				data: userInfo,
				success: (res) => {
					console.log('userInfo subcc', userInfo.openId)
					state.userInfo = userInfo
					state.openid = userInfo.openId
				},
				fail: () => {
					uni.showModal({
						title: '储存数据失败!',
						showCancel: false
					})
				}
			})
		},
		getUserInfo(state) {
			uni.getStorage({
				key: 'userInfo',
				success: (res) => {
					state.userInfo = res.data
					state.openid = res.data.openId
				},
				fail: () => {
					uni.showModal({
						title: '读取数据失败',
						content: "请登录",
						showCancel: false
					})
				}
			})
		},
		setSelectedDate(state, date) {
			state.selectedDate = date
		}
	},
	actions: {
		// lazy loading openid
		getCurrentMonthSelected: async function({
			commit,
			state
		}, date) {
			return await new Promise((resolve, reject) => {
				console.log(state.openid)
				//check whether local version is different from the server`s
				uni.request({
					url: state.url + 'api/User/Version',
					data: state.openid,
					sslVerify: false
				}).then(res => {
					if (res != undefined) {
						if (res[1].data != undefined) {
							if (res[1].data.response != undefined) {
								const version = res[1].data.response
								console.log('version',version)
								console.log('stateversion',state.version)
								if (version != state.version) {
									//get lastest info
									var para = {}
									para.openId = state.openid
									if (date != undefined) {
										// para.date = date
									}
									uni.request({
										url: state.url + 'api/User',
										// url: 'http://192.168.15.107/api/User',
										// url: 'http://120.25.215.190/api/User',
										data: para,
										sslVerify: false,
									}).then(res => {
										if (res != undefined) {
											if (res[1].data != undefined) {
												if (res[1].data.response != undefined) {
													const selected = res[1].data.response
													console.log('request selected', selected)

													//set local select and version
													commit("setCurrentMonthSelected", selected)
													resolve(selected)
												}
											}
										}
										resolve(null)
									}).catch(err => {
										//console.log('request fail', err);
										uni.showModal({
											content: err.errMsg,
										});
										reject(err)
									});
								}else{
									resolve(state.selected)
								}
							}
						}
					}
				}).catch(err => {
					// console.log('request fail', err);
					uni.showModal({
						content: err.errMsg,
					});
					reject(err)
				});
			})
		},

		addInfo: async function({
			commit,
			state
		}, para) {
			return await new Promise((resolve, reject) => {
				var requestUrl = state.url + 'api/Info?openId=' + state.openid + '&name=' + para.name + '&date=' +
					new Date(para.date).toLocaleDateString();

				// var requestUrl = 'http://192.168.15.107/api/Info?openId=' + state.openid + '&name=' + para.name +
				// 	'&date=' +
				// 	new Date(para.date).toLocaleDateString();

				// var requestUrl = 'http://120.25.215.190/api/Info?openId=' + state.openid + '&name=' + para.name +
				// 	'&date=' +
				// 	new Date(para.date).toLocaleDateString();
				uni.request({
					// url: 'http://192.168.15.107:8012/api/Info',
					url: requestUrl,
					method: 'POST',
					header: {
						'content-type': 'application/x-www-form-urlencoded',
					}
				}).then(res => {
					if (res != undefined) {
						if (res[1].data != undefined) {
							if (res[1].data.response != undefined) {
								const selected = res[1].data.response
								commit("setCurrentMonthSelected", selected)
								resolve(selected)
							}
						}
					}
					resolve(null)
				}).catch(err => {
					// console.log('request fail', err);
					uni.showModal({
						content: err.errMsg,
					});
					reject(err)
				});
			})
		},

		updateInfo: async function({
			commit,
			state
		}, para) {
			return await new Promise((resolve, reject) => {
				var requestUrl = state.url + 'api/Info/Update?openId=' + state.openid +
					'&infoId=' + para.infoId +
					(para.name != undefined ? '&name=' + para.name : '') +
					(para.date != undefined ? '&date=' + new Date(para.date).toLocaleDateString() : '');
				uni.request({
					url: requestUrl,
					method: 'PUT',
					header: {
						'content-type': 'application/x-www-form-urlencoded',
					}
				}).then(res => {
					if (res != undefined) {
						if (res[1] != undefined) {
							if (res[1].data != undefined) {
								if (res[1].data.response != undefined) {
									const selected = res[1].data.response
									commit("setCurrentMonthSelected", selected)
									resolve(selected)
								}
							}
						}
					}
					resolve(null)
				}).catch(err => {
					// console.log('request fail', err);
					uni.showModal({
						content: err.errMsg,
						// showCancel: false
					});
					reject(err)
				});
			})
		},

		deleteInfo: async function({
			commit,
			state
		}, para) {
			return await new Promise((resolve, reject) => {
				var requestUrl = state.url + 'api/Info/?openId=' + state.openid +
					'&infoId=' + para.infoId;

				uni.request({
					url: requestUrl,
					method: 'DELETE',
					header: {
						'content-type': 'application/x-www-form-urlencoded',
					}
				}).then(res => {
					if (res != undefined) {
						if (res[1] != undefined) {
							if (res[1].data != undefined) {
								if (res[1].data.response != undefined) {
									const selected = res[1].data.response
									commit("setCurrentMonthSelected", selected)
									resolve(selected)
								}
							}
						}
					}
					resolve(null)
				}).catch(err => {
					// console.log('request fail', err);
					uni.showModal({
						content: err.errMsg,
						// showCancel: false
					});
					reject(err)
				});
			})
		},

		

	},
})

export default store
