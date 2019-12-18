import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const store = new Vuex.Store({
	state: {
		selected: []
	},
	mutations: {
		getCurrentMonthSelected(state) {

				console.log("getCurrentMonthSelected");
				state.selected = [{
						date: '2019-08-20',
						info: '打卡',
						days: '100'
					},
					{
						date: '2019-08-21',
						info: '签到',
						days: '100'
					},
					{
						date: '2019-08-22',
						info: '已打卡',
						days: '100'
					},
					{
						date: '2019-11-21',
						info: '签到2',
						days: '100'
					},
					{
						date: '2019-11-21',
						info: '签到1',
						days: '100'
					},
					{
						date: '2019-11-21',
						info: '签到2',
						days: '100'
					},
					{
						date: '2019-11-21',
						info: '签到1',
						days: '100'
					},
					{
						date: '2019-11-21',
						info: '签到2',
						days: '100'
					},
					{
						date: '2019-11-21',
						info: '签到1',
						days: '100'
					}]
					console.log(state.selected);


		},
		login(state, provider) {
			state.hasLogin = true;
			state.loginProvider = provider;
		},
		logout(state) {
			state.hasLogin = false
			state.openid = null
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
		}
	},
	actions: {
		// lazy loading openid
		// getCurrentMonthSelected: async function({
		// 	commit,
		// 	state
		// }) {
		// 	return await new Promise((resolve, reject) => {
		// 		if (state.openid) {
		// 			resolve(state.openid)
		// 		} else {
		// 			uni.login({
		// 				success: (data) => {
		// 					commit('login')
		// 					setTimeout(function() { //模拟异步请求服务器获取 openid
		// 						const openid = '123456789'
		// 						console.log('uni.request mock openid[' + openid + ']');
		// 						commit('setOpenid', openid)
		// 						resolve(openid)
		// 					}, 1000)
		// 				},
		// 				fail: (err) => {
		// 					console.log('uni.login 接口调用失败，将无法正常使用开放接口等服务', err)
		// 					reject(err)
		// 				}
		// 			})
		// 		}
		// 	})
		// }
	}
})

export default store
