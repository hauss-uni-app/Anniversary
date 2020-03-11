import Vue from "vue"
import Vuex from "vuex"

Vue.use(Vuex)

const store = new Vuex.Store({
	state: {
		allData: [],
		hasLogin: false,
		loginProvider: "",
		openid: "123456",
		testvuex: false,
		selected: [],
		colorIndex: 0,
		userInfo: {
			nickName: "您未登录",
			avatarUrl: "/static/calender_press.png"
		},
		version: 0
	},
	mutations: {
		setAllData(state, allData) {
			state.allData = allData;
		},
		setCurrentMonthSelected(state, selected) {
			state.selected = selected;
			console.log('state.selected aaa', selected)
			if (selected.length > 0) {
				if (selected[0].user > 0) {
					state.version = selected[0].user[0].version
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
		},
		setUserInfo(state, userInfo) {
			uni.setStorage({
				key: 'userInfo',
				data: userInfo,
				success: (res) => {
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
						content: "找不到 key 对应的数据",
						showCancel: false
					})
				}
			})
		},
	},
	actions: {
		// lazy loading openid
		getCurrentMonthSelected: async function({
			commit,
			state
		}, date) {
			return await new Promise((resolve, reject) => {
				var para = {}
				para.openId = state.openid
				if (date != undefined) {
					para.date = date
				}
				uni.request({
					url: 'http://192.168.15.107:8012/api/User',
					data: para
				}).then(res => {
					const selected = res[1].data.response
					console.log('request selected', selected)
					commit("setCurrentMonthSelected", selected)
					resolve(selected)
				}).catch(err => {
					console.log('request fail', err);
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
				var requestUrl = 'https://localhost:44320/api/Info?openId=' + state.openid + '&name=' + para.name + '&date=' +
					new Date(para.date).toLocaleDateString();
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
					console.log('request fail', err);
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
				var requestUrl = 'https://localhost:44320/api/Info/Update?openId=' + state.openid +
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
					console.log('request fail', err);
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
