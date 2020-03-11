<template>
	<view class="uni-calendar" @touchmove.stop.prevent="clean">
		<view v-if="!insert&&show" class="uni-calendar__mask" :class="{'uni-calendar--mask-show':aniMaskShow}" @click="clean"></view>
		<view v-if="insert || show" class="uni-calendar__content" :class="{'uni-calendar--fixed':!insert,'uni-calendar--ani-show':aniMaskShow}">
			<view v-if="!insert" class="uni-calendar__header uni-calendar--fixed-top">
				<view class="uni-calendar__header-btn-box" @click="close">
					<text class="uni-calendar__header-text uni-calendar--fixed-width">取消</text>
				</view>
				<view class="uni-calendar__header-btn-box" @click="confirm">
					<text class="uni-calendar__header-text uni-calendar--fixed-width">确定</text>
				</view>
			</view>
			<view class="uni-calendar__header">
				<!-- <view class="uni-calendar__header-btn-box" @click="pre">
					<view class="uni-calendar__header-btn uni-calendar--left"></view>
				</view> -->
				<picker mode="date" :value="nowDate.fullDate" @change="bindDateChange">
					<view class="uni-calendar__weeks">
						<text class="uni-input-cal">{{ (nowDate.year||'') +'年'+( nowDate.month||'') +'月 '}}</text>
						<text class="uni-input_down-cal">▼</text>
					</view>
				</picker>

				<!-- <view class="uni-calendar__header-btn-box" @click="next">
					<view class="uni-calendar__header-btn uni-calendar--right"></view>
				</view> -->
				<text class="uni-calendar__backtoday" @click="backtoday">回到今天</text>
			</view>
			<view class="uni-calendar__weeks">
				<view class="uni-calendar__weeks-header" v-for="(week,wIndex) in weekHeader" :key="wIndex"><text class="uni-calendar__weeks-header">{{week}}</text></view>
			</view>

			<view class="uni-calendar__box">
				<!-- <view class="uni-calendar__box-bg">
					<text class="uni-calendar__box-bg-text">{{nowDate.month}}</text>
				</view> -->
				<swiper class="uni-swipper" :duration="100" :circular="true" :current="currentIndex" @change="swiperChange">
					<swiper-item>
						<view class="uni-calendar__weeks" v-for="(item,weekIndex) in preweeks" :key="weekIndex">
							<view class="uni-calendar__weeks-item" v-for="(preweeks,preweeksIndex) in item" :key="preweeksIndex">
								<uni-calendar-item :weeks="preweeks" :calendar="precalendar" :selected="selected" :lunar="lunar" @change="choiceDate"></uni-calendar-item>
							</view>
						</view>
					</swiper-item>

					<swiper-item>
						<view class="uni-calendar__weeks" v-for="(item,weekIndex) in weeks" :key="weekIndex">
							<view class="uni-calendar__weeks-item" v-for="(weeks,weeksIndex) in item" :key="weeksIndex">
								<uni-calendar-item :weeks="weeks" :calendar="calendar" :selected="selected" :lunar="lunar" @change="choiceDate"></uni-calendar-item>
							</view>
						</view>
					</swiper-item>

					<swiper-item>
						<view class="uni-calendar__weeks" v-for="(item,weekIndex) in nextweeks" :key="weekIndex">
							<view class="uni-calendar__weeks-item" v-for="(nextweeks,nextweeksIndex) in item" :key="nextweeksIndex">
								<uni-calendar-item :weeks="nextweeks" :calendar="nextcalendar" :selected="selected" :lunar="lunar" @change="choiceDate"></uni-calendar-item>
							</view>
						</view>
					</swiper-item>
				</swiper>
			</view>
		</view>
	</view>
</template>

<script>
	import Calendar from './util.js';
	import uniCalendarItem from './uni-calendar-item.vue';
	import {
		mapState,
		mapMutations,
		mapActions
	} from 'vuex'

	function getDate(type) {
		const date = new Date();

		let year = date.getFullYear();
		let month = date.getMonth() + 1;
		let day = date.getDate();

		if (type === 'start') {
			year = year - 60;
		} else if (type === 'end') {
			year = year + 2;
		}
		month = month > 9 ? month : '0' + month;;
		day = day > 9 ? day : '0' + day;

		return `${year}-${month}-${day}`;
	}

	export default {
		components: {
			uniCalendarItem,
		},
		props: {
			/**
			 * 当前日期
			 */
			date: {
				type: String,
				default: ''
			},
			/**
			 * 是否开启阴历日期
			 */
			lunar: {
				type: Boolean,
				default: false
			},
			/**
			 * 开始时间
			 */
			startDate: {
				type: String,
				default: ''
			},
			/**
			 * 结束时间
			 */
			endDate: {
				type: String,
				default: ''
			},
			/**
			 * 范围
			 */
			range: {
				type: Boolean,
				default: false
			},
			/**
			 * 插入
			 */
			insert: {
				type: Boolean,
				default: true
			}
		},
		data() {
			return {
				lastIndex: 1,
				currentIndex: 1,
				show: false,
				preweeks: [],
				nextweeks: [],
				weeks: [],
				weekHeader: ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"],
				precalendar: {},
				calendar: {},
				nextcalendar: {},
				nowDate: '',
				aniMaskShow: false,
				pickerstartDate: getDate('start'),
				pickerendDate: getDate('end'),
			}
		},
		computed: {
			...mapState(['selected'])
		},
		watch: {
			selected(newVal) {
				console.log("watch selected");
				this.setDate(this.nowDate.fullDate);
				// this.nowDate = this.calendar = this.cale.getInfo(newVal.date)
				// this.cale.setSelectInfo(this.nowDate.fullDate, newVal)
				// this.preweeks = this.cale.preweeks
				// this.nextweeks = this.cale.nextweeks
				// this.weeks = this.cale.weeks
			}
		},
		created() {
			// 获取日历方法实例
			this.cale = new Calendar({
				date: this.date,
				selected: this.selected,
				startDate: this.startDate,
				endDate: this.endDate,
				range: this.range,
			})
			// console.log(this.cale.date.fullDate)
			// this.init(this.cale.date.fullDate)
			this.setDate(this.cale.date.fullDate)
		},
		methods: {
			...mapActions(['getCurrentMonthSelected']),
			// 取消穿透
			clean() {},
			init(date) {
				this.months = this.cale.months;

				this.weeks = this.cale.weeks
				this.nowDate = this.calendar = this.cale.getInfo(date)
				this.$nextTick(function() {
					this.preweeks = this.cale.preweeks
					this.nextweeks = this.cale.nextweeks
					this.precalendar = this.calendar
					this.nextcalendar = this.calendar
				})
			},
			open() {
				this.show = true
				this.$nextTick(() => {
					this.aniMaskShow = true
				})
			},
			close() {
				this.aniMaskShow = false
				this.$nextTick(() => {
					setTimeout(() => {
						this.show = false
					}, 300)
				})
			},
			// confirm() {
			// 	this.setEmit('confirm')
			// 	this.close()
			// },
			change(weeks) {
				this.setEmit('change', weeks)
			},
			setEmit(name, weeks) {
				//console.log(weeks)
				let {
					year,
					month,
					date,
					fullDate,
					lunar,
					extraInfo
				} = weeks
				this.$emit(name, {
					range: this.cale.multipleStatus,
					year,
					month,
					date,
					fulldate: fullDate,
					lunar,
					extraInfo: extraInfo || {}
				})
			},
			choiceDate(weeks) {
				// //console.log(weeks)
				if (weeks.disable) return

				// this.$nextTick(function() {
				if (this.currentIndex == 0)
					this.precalendar = weeks
				if (this.currentIndex == 1)
					this.calendar = weeks
				if (this.currentIndex == 2)
					this.nextcalendar = weeks
				this.change(weeks)
				// });
			},
			backtoday() {
				this.setDate(new Date().toLocaleDateString())
			},
			pre() {
				const {
					fullDate,
					year,
					month,
					date,
					day
				} = this.cale.getDate(this.nowDate.fullDate, -1, 'month')

				const preDate = new Date(year, month - 1, 1).toLocaleDateString()
				this.setDate(preDate)
			},
			next() {
				// debugger
				const {
					fullDate,
					year,
					month,
					date,
					day
				} = this.cale.getDate(this.nowDate.fullDate, +1, 'month')

				const nextDate = new Date(year, month - 1, 1).toLocaleDateString()

				this.setDate(nextDate)
			},
			async setDate(date) {
				var preweeks = []
				var nextweeks = []
				var weeks = []

				// await this.getCurrentMonthSelected(date)
				this.cale.setDate(date)
				this.cale.selected = this.selected
				console.log('currentindex', this.currentIndex)
				if (this.currentIndex == 1) {
					weeks = this.cale.weeks
					this.nowDate = this.calendar = this.cale.getInfo(date)
					this.weeks = weeks
					this.$nextTick(function() {
						this.change(this.calendar)
						preweeks = this.cale.preweeks
						nextweeks = this.cale.nextweeks
						this.preweeks = preweeks
						this.nextweeks = nextweeks
					})
				} else if (this.currentIndex == 0) {
					preweeks = this.cale.weeks

					this.nowDate = this.precalendar = this.cale.getInfo(date)
					this.preweeks = preweeks
					this.$nextTick(function() {
						this.change(this.precalendar)
						nextweeks = this.cale.preweeks
						weeks = this.cale.nextweeks
						this.weeks = weeks
						this.nextweeks = nextweeks
					})
				} else if (this.currentIndex == 2) {
					nextweeks = this.cale.weeks
					this.nowDate = this.nextcalendar = this.cale.getInfo(date)
					this.nextweeks = nextweeks
					this.$nextTick(function() {
						this.change(this.nextcalendar)
						weeks = this.cale.preweeks
						preweeks = this.cale.nextweeks
						this.weeks = weeks
						this.preweeks = preweeks
					})
				}
			},
			swiperChange(e) {
				let index = e.detail.current;
				// //console.log(e);

				let isPrev = (index - this.lastIndex == -1 || index - this.lastIndex == 2) ? true : false;
				this.currentIndex = index;
				if (isPrev) {
					this.pre();
				} else {
					this.next();
				}
				this.lastIndex = index;
			},
			bindDateChange: function(e) {
				// console.log(e);
				this.setDate(e.detail.value)
			},
		}

	}
</script>

<style lang="scss" scoped>
	.uni-calendar {
		/* #ifndef APP-NVUE */
		display: flex;
		/* #endif */
		flex-direction: column;
	}

	.uni-calendar__mask {
		position: fixed;
		bottom: 0;
		top: 0;
		left: 0;
		right: 0;
		background-color: $uni-bg-color-mask;
		transition-property: opacity;
		transition-duration: 0.3s;
		opacity: 0;
		/* #ifndef APP-NVUE */
		z-index: 99;
		/* #endif */
	}

	.uni-calendar--mask-show {
		opacity: 1
	}

	.uni-calendar--fixed {
		position: fixed;
		bottom: 0;
		left: 0;
		right: 0;
		transition-property: transform;
		transition-duration: 0.3s;
		transform: translateY(460px);
		/* #ifndef APP-NVUE */
		z-index: 99;
		/* #endif */
	}

	.uni-calendar--ani-show {
		transform: translateY(0);
	}

	.uni-calendar__content {
		background-color: #fff;
	}

	.uni-calendar__header {
		position: relative;
		/* #ifndef APP-NVUE */
		display: flex;
		/* #endif */
		flex-direction: row;
		justify-content: center;
		align-items: center;
		height: 50px;
		border-bottom-color: $uni-border-color;
		border-bottom-style: solid;
		border-bottom-width: 1px;
		background-color: $uni-color-primary;
	}

	.uni-calendar--fixed-top {
		/* #ifndef APP-NVUE */
		display: flex;
		/* #endif */
		flex-direction: row;
		justify-content: space-between;
		border-top-color: $uni-border-color;
		border-top-style: solid;
		border-top-width: 1px;
	}

	.uni-calendar--fixed-width {
		width: 50px;
		// padding: 0 15px;
	}

	.uni-calendar__backtoday {
		position: absolute;
		right: 0;
		top: 25rpx;
		padding: 0 5px;
		padding-left: 10px;
		height: 25px;
		line-height: 25px;
		font-size: 12px;
		border-top-left-radius: 25px;
		border-bottom-left-radius: 25px;
		color: #333;
		background-color: #f1f1f1;
		// align-items: center;
		// -webkit-box-pack: center;
	}

	.uni-calendar__header-text {
		text-align: center;
		// width: 100px;
		font-size: $uni-font-size-base;
		color: $uni-text-color;
	}

	.uni-calendar__header-btn-box {
		/* #ifndef APP-NVUE */
		display: flex;
		/* #endif */
		flex-direction: row;
		align-items: center;
		justify-content: center;
		width: 50px;
		height: 50px;
	}

	.uni-calendar__header-btn {
		width: 10px;
		height: 10px;
		border-left-color: $uni-text-color-placeholder;
		border-left-style: solid;
		border-left-width: 2px;
		border-top-color: $uni-color-subtitle;
		border-top-style: solid;
		border-top-width: 2px;
	}

	.uni-calendar--left {
		transform: rotate(-45deg);
		border-color: white;
	}

	.uni-calendar--right {
		transform: rotate(135deg);
		border-color: white;
	}


	.uni-calendar__weeks {
		position: relative;
		/* #ifndef APP-NVUE */
		display: flex;
		/* #endif */
		flex-direction: row;
	}

	.uni-calendar__weeks-header {
		flex: 1;
		justify-content: center;
		align-items: center;
		font-size: $uni-font-size-base;
		margin-bottom: 5px;
		margin-top: 5px;
	}

	.uni-calendar__weeks-header {
		color: $uni-color-primary;
	}

	.uni-calendar__weeks-item {
		flex: 1;
	}

	.uni-calendar__box {
		position: relative;
	}

	.uni-calendar__box-bg {
		/* #ifndef APP-NVUE */
		display: flex;
		/* #endif */
		justify-content: center;
		align-items: center;
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
	}

	.uni-calendar__box-bg-text {
		font-size: 200px;
		font-weight: bold;
		color: $uni-text-color-grey;
		opacity: 0.1;
		text-align: center;
		line-height: 1;
	}

	.uni-swipper {
		height: 500rpx;
	}

	.uni-calendar-item__weeks-box {
		flex: 1;
		/* #ifndef APP-NVUE */
		display: flex;
		/* #endif */
		flex-direction: column;
		justify-content: center;
		align-items: center;
	}

	.uni-input-cal {
		font-weight: bold;
		color: white;
		font-size: 18px;
	}

	.uni-input_down-cal {
		font-weight: bold;
		color: white;
		font-size: 10px;
		margin-top: 5px;
	}
</style>
