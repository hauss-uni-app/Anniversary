<template>
	<view class="uni-calendar-item__weeks-box" :class="{
		'uni-calendar-item--disable':weeks.disable,
		'uni-calendar-item--isDay':calendar.fullDate === weeks.fullDate && weeks.isDay,
		'uni-calendar-item--checked': isChecked,
		'uni-calendar-item--multiple': weeks.multiple
		}"
	 @click="choiceDate(weeks)">
		<view class="uni-calendar-item__weeks-box-item">
			<text v-if="selected&&weeks.extraInfo" class="uni-calendar-item__weeks-box-circle"></text>
			<text class="uni-calendar-item__weeks-box-text" :class="{
				'uni-calendar-item--isDay-text': weeks.isDay,
				'uni-calendar-item--isDay':calendar.fullDate === weeks.fullDate && weeks.isDay,
				'uni-calendar-item--checked':isChecked,
				'uni-calendar-item--multiple': weeks.multiple,
				'uni-calendar-item--disable':weeks.disable,
				}">{{weeks.date}}</text>
			<text v-if="!lunar && weeks.isDay" class="uni-calendar-item__weeks-lunar-text" :class="{
				'uni-calendar-item--isDay-text':weeks.isDay,
				'uni-calendar-item--isDay':calendar.fullDate === weeks.fullDate && weeks.isDay,
				'uni-calendar-item--checked':isChecked,
				'uni-calendar-item--multiple': weeks.multiple,
				'uni-calendar-item--extra':weeks.extraInfo ,
				}">今天</text>
			<text v-if="lunar" class="uni-calendar-item__weeks-lunar-text" :class="{
				'uni-calendar-item--isDay-text':weeks.isDay,
				'uni-calendar-item--isDay':calendar.fullDate === weeks.fullDate && weeks.isDay,
				'uni-calendar-item--checked':isChecked,
				'uni-calendar-item--multiple': weeks.multiple,
				'uni-calendar-item--disable':weeks.disable,
				'uni-calendar-item--extra':weeks.extraInfo,
				}">{{weeks.isDay?'今天': weeks.lunar.IDayCn}}</text>
		</view>
	</view>
</template>

<script>
	export default {
		props: {
			weeks: {
				type: Object,
				default () {
					return {}
				}
			},
			calendar: {
				type: Object,
				default: () => {
					return {}
				}
			},
			selected: {
				type: Array,
				default: () => {
					return []
				}
			},
			lunar: {
				type: Boolean,
				default: false
			}
		},
		data() {
			return {
				isChecked: false
			}
		},
		watch: {
			calendar() {
				console.log('calendar')
				this.isChecked = false
				if (this.calendar.fullDate === this.weeks.fullDate && !this.weeks.isDay)
					this.isChecked = true
			}
			
		},
		methods: {
			choiceDate(weeks) {
				// console.log(weeks)
				
				this.$emit('change', weeks)
			}
		}
	}
</script>

<style lang="scss" scoped>
	.uni-calendar-item__weeks-box {
		flex: 1;
		/* #ifndef APP-NVUE */
		display: flex;
		/* #endif */
		flex-direction: column;
		justify-content: center;
		align-items: center;
	}

	.uni-calendar-item__weeks-box-text {
		font-size: $uni-font-size-base;
		color: $uni-text-color;
	}

	.uni-calendar-item__weeks-lunar-text {
		font-size: $uni-font-size-sm;
		color: $uni-text-color;
	}

	.uni-calendar-item__weeks-box-item {
		position: relative;
		/* #ifndef APP-NVUE */
		display: flex;
		/* #endif */
		flex-direction: column;
		justify-content: center;
		align-items: center;
		width: 100rpx;
		height: 100rpx;
	}

	.uni-calendar-item__weeks-box-circle {
		position: absolute;
		top: 5px;
		right: 5px;
		width: 8px;
		height: 8px;
		border-radius: 8px;
		background-color: $uni-color-error;

	}

	.uni-calendar-item--disable {
		background-color: rgba(249, 249, 249, $uni-opacity-disabled);
		color: $uni-text-color-disable;
	}

	.uni-calendar-item--isDay-text {
		color: $uni-color-primary;
		font-size: $uni-font-size-sm-today;
	}

	.uni-calendar-item--isDay {
		background-color: $uni-color-primary;
		opacity: 0.8;
		color: #fff;
		border-radius: 50% 0 50% 0;
		// transition: all 0.1s ease 0.05s;
	}

	.uni-calendar-item--isDay:hover {
		border-radius: 50% 0 50% 0;
	}

	.uni-calendar-item--extra {
		color: $uni-color-error;
		opacity: 0.8;
	}

	.uni-calendar-item--checked {
		background-color: $uni-color-primary;
		color: #fff;
		opacity: 0.8;
		border-radius: 50% 0 50% 0;
		// transition: all 0.1s ease 0.05s;
	}

	.uni-calendar-item--checked:hover {
		border-radius: 50% 0 50% 0;
	}

	.uni-calendar-item--multiple {
		background-color: $uni-color-primary;
		color: #fff;
		opacity: 0.8;
	}
</style>
