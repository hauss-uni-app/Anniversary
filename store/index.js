import Vue from "vue"
import Vuex from "vuex"

Vue.use(Vuex)

const store = new Vuex.Store({
	state: {
		allData:[],
		hasLogin: false,
		loginProvider: "",
		openid: null,
		testvuex: false,
		selected: [],
		colorIndex: 0,
		userInfo: {
			nickName: "您未登录",
			avatarUrl: "/static/calender_press.png"
		}
	},
	mutations: {
		setAllData(state,allData){
			state.allData = allData;
		},
		setCurrentMonthSelected(state, selected) {
			state.selected = selected;
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
		getAllData: async function({
			commit,
			state
		}, date) {
			return await new Promise((resolve, reject) => {
				uni.request({
					url: 'http://www.mocky.io/v2/5e33d79a3000008300d96084',
					//url: 'http://www.mocky.io/v2/5e1d8185360000521dc740e8',
					// url: 'http://www.mocky.io/v2/5e3500962f000068007933c5',
				}).then(res => {
					console.log('request success', JSON.stringify(res[1].data));
					const allData = res[1].data
					commit("setAllData", allData)
					resolve(allData)
				}).catch(err => {
					//console.log('request fail', err);
					uni.showModal({
						content: err.errMsg,
						showCancel: false
					});
					reject(err)
				});
			})
		},

		// lazy loading openid
		getCurrentMonthSelected: async function({
			commit,
			state
		}, date) {
			return await new Promise((resolve, reject) => {
				uni.request({
					url: 'http://www.mocky.io/v2/5e33d79a3000008300d96084',
					//url: 'http://www.mocky.io/v2/5e1d8185360000521dc740e8',
					//url: 'http://www.mocky.io/v2/5e3500962f000068007933c5',
				}).then(res => {
					console.log('request success', JSON.stringify(res[1].data));
					const selected = res[1].data
					commit("setCurrentMonthSelected", selected)
					resolve(selected)
				}).catch(err => {
					//console.log('request fail', err);
					uni.showModal({
						content: err.errMsg,
						showCancel: false
					});
					reject(err)
				});
			})
		}
	},
})

export default store
