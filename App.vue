<script>
	import {
		mapState,
		mapMutations,
		mapActions
	} from 'vuex'

	export default {
		onLaunch: function() {
			// if (state.openid == null)
			// 	this.setOpenid('oRrdQt82aW4Jj-bEP1QhE3DKR9Ew')
			// this.getCurrentMonthSelected(new Date().toLocaleDateString())
			this.getCurrentMonthSelected()
			console.log('App Launch')
		},
		onShow: function() {
			console.log('App Show')
		},
		onHide: function() {
			console.log('App Hide')
		},
		methods: {
			...mapActions(['getCurrentMonthSelected']),
			...mapMutations(['setOpenid']),
			...mapState({
				loginProvider: state => state.loginProvider,
				hasLogin: state => state.hasLogin,
				userInfo: state => state.userInfo
			})
		}
	}
</script>

<style>
	/* #ifndef APP-PLUS-NVUE */
	/* uni.css - 通用组件、模板样式库，可以当作一套ui库应用 */
	@import './common/uni.css';
	/* #endif*/
</style>
