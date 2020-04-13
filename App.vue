<script>
	import {
		mapActions
	} from 'vuex'

	export default {
		onLaunch: function() {
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
		},
	}
</script>

<style>
	/* #ifndef APP-PLUS-NVUE */
	/* uni.css - 通用组件、模板样式库，可以当作一套ui库应用 */
	@import './common/uni.css';
	/* #endif*/
</style>
