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
				<view class="uni-calendar__header-btn-box" @click="pre">
					<view class="uni-calendar__header-btn uni-calendar--left"></view>
				</view>
				<text class="uni-calendar__header-text" @click="showPicker">{{ (nowDate.year||'') +'年'+( nowDate.month||'') +'月'}}</text>
				<view class="uni-calendar__header-btn-box" @click="next">
					<view class="uni-calendar__header-btn uni-calendar--right"></view>
				</view>
				<text class="uni-calendar__backtoday" @click="backtoday">回到今天</text>
			</view>
			<view class="uni-calendar__weeks">
				<view class="uni-calendar__weeks-header" v-for="(week,wIndex) in weekHeader" :key="wIndex">{{week}}</view>
			</view>

			<view class="uni-calendar__box">
				<!-- <view class="uni-calendar__box-bg">
					<text class="uni-calendar__box-bg-text">{{nowDate.month}}</text>
				</view> -->
				<swiper class="uni-swipper" :duration="350" :circular="true" :current="currentIndex" @change="swiperChange">
					<!-- <swiper-item v-for="mIndex in 3" :key="mIndex"> -->
					<swiper-item>
						<view class="uni-calendar__weeks" v-for="(item,weekIndex) in preweeks" :key="weekIndex">
							<view class="uni-calendar__weeks-item" v-for="(preweeks,weeksIndex) in item" :key="weeksIndex">
								<uni-calendar-item :weeks="preweeks" :calendar="precalendar" :lunar="lunar" @click="choiceDate"></uni-calendar-item>
							</view>
						</view>
					</swiper-item>

					<swiper-item>
						<view class="uni-calendar__weeks" v-for="(item,weekIndex) in weeks" :key="weekIndex">
							<view class="uni-calendar__weeks-item" v-for="(weeks,weeksIndex) in item" :key="weeksIndex">
								<uni-calendar-item :weeks="weeks" :calendar="calendar" :lunar="lunar" @click="choiceDate"></uni-calendar-item>
							</view>
						</view>
					</swiper-item>

					<swiper-item>
						<view class="uni-calendar__weeks" v-for="(item,weekIndex) in nextweeks" :key="weekIndex">
							<view class="uni-calendar__weeks-item" v-for="(nextweeks,weeksIndex) in item" :key="weeksIndex">
								<uni-calendar-item :weeks="nextweeks" :calendar="nextcalendar" :lunar="lunar" @click="choiceDate"></uni-calendar-item>
							</view>
						</view>
					</swiper-item>
				</swiper>
			</view>

		</view>
		<w-picker mode="yearMonth" endYear="2100" :current="true" @confirm="onConfirm" ref="yearMonth" themeColor="#24CACA"></w-picker>
	</view>
</template>

<script>
	import Calendar from './util.js';
	import uniCalendarItem from './uni-calendar-item.vue';
	import wPicker from "@/components/w-picker/w-picker.vue";
	export default {
		components: {
			uniCalendarItem,
			wPicker
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
			 * 打点日期
			 */
			selected: {
				type: Array,
				default () {
					return []
				}
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
				aniMaskShow: false
			}
		},
		watch: {
			selected(newVal) {
				console.log("selected");
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
			this.init(this.cale.date.fullDate)


		},
		methods: {
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
			confirm() {
				this.setEmit('confirm')
				this.close()
			},
			change() {
				if (!this.insert) return
				this.setEmit('change')
			},
			setEmit(name) {
				let {
					year,
					month,
					date,
					fullDate,
					lunar,
					extraInfo
				} = this.calendar
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
				if (weeks.disable) return

				if (this.currentIndex == 0)
					this.nowDate = this.precalendar = weeks
				if (this.currentIndex == 1)
					this.nowDate = this.calendar = weeks
				if (this.currentIndex == 2)
					this.nowDate = this.nextcalendar = weeks

				// 设置多选
				// this.cale.setMultiple(this.calendar.fullDate)
				// this.preweeks = this.cale.preweeks
				// this.nextweeks = this.cale.nextweeks
				// this.weeks = this.cale.weeks
				this.$nextTick(function() {this.change()});
			},
			backtoday() {
				// this.lastIndex = 1
				// this.currentIndex = 1
				this.setDate(new Date())
				// this.nowDate = this.calendar = this.cale.getInfo(new Date())
				this.choiceDate(this.cale.getInfo(new Date()))
				this.change()
			},
			pre() {
				const {
					fullDate,
					year,
					month,
					date,
					day
				} = this.cale.getDate(this.nowDate.fullDate, -1, 'month')

				const preDate = new Date(year, month - 1, 1)
				this.setDate(preDate)
				// this.change()
			},
			next() {
				const {
					fullDate,
					year,
					month,
					date,
					day
				} = this.cale.getDate(this.nowDate.fullDate, +1, 'month')

				const nextDate = new Date(year, month - 1, 1)
				this.setDate(nextDate)
				// this.change()
			},
			setDate(date) {
				var preweeks = []
				var nextweeks = []
				var weeks = []
				this.cale.setDate(date)
				
				if (this.currentIndex == 1) {
					preweeks = this.cale.preweeks
					nextweeks = this.cale.nextweeks
					weeks = this.cale.weeks
					this.nowDate = this.calendar = this.cale.getInfo(date)
					this.weeks = weeks
					this.$nextTick(function() {
						this.preweeks = preweeks
						this.nextweeks = nextweeks
					})
				} else if (this.currentIndex == 0) {
					preweeks = this.cale.weeks
					nextweeks = this.cale.preweeks
					weeks = this.cale.nextweeks
					this.nowDate= this.precalendar = this.cale.getInfo(date)
					this.preweeks = preweeks
					this.$nextTick(function() {
						this.weeks = weeks
						this.nextweeks = nextweeks
					})
				} else if (this.currentIndex == 2) {
					preweeks = this.cale.nextweeks
					nextweeks = this.cale.weeks
					weeks = this.cale.preweeks
					this.nowDate= this.nextcalendar = this.cale.getInfo(date)
					this.nextweeks = nextweeks
					this.$nextTick(function() {
						this.weeks = weeks
						this.preweeks = preweeks
					})
				}
				
				

			},
			swiperChange(e) {
				let index = e.target.current;
				console.log(index);

				let isPrev = (index - this.lastIndex == -1 || index - this.lastIndex == 2) ? true : false;
				this.currentIndex = index;
				if (isPrev) {
					this.pre();
				} else {
					this.next();
				}
				this.lastIndex = index;
			},
			onConfirm(val) {
				const selectDate = new Date(val.checkArr[0] + '-' + val.checkArr[1] + '-01');
				this.setDate(selectDate)
			},
			showPicker() {
				this.$refs["yearMonth"].show();
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
		color: $uni-text-color;
		background-color: $uni-bg-color-hover;
	}

	.uni-calendar__header-text {
		text-align: center;
		width: 100px;
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
	}

	.uni-calendar--right {
		transform: rotate(135deg);
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
		color: $uni-color-primary;
		margin-bottom: 5px;
		margin-top: 5px;
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
		height: 329px;
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
</style>
