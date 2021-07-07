const getStorage = function(key) {
	if (key.length === 0) {
		return null;
	} else {
		uni.getStorage({
			key: key,
			success: (res) => {
				console.log('getStorage success:', res.data);
				return 'res.data';
			},
			fail: () => {
				return null;
			}
		})
	}
}

const setStorage = function(key, data) {
	if (key.length === 0) {
		uni.showModal({
			title: '保存数据失败',
			content: 'key 不能为空',
			showCancel: false
		})
	} else {
		uni.setStorage({
			key: key,
			data: data,
			success: (res) => {

			},
			fail: () => {
				uni.showModal({
					title: '储存数据失败!',
					showCancel: false
				})
			}
		})
	}
}

const clearStorage = function() {
	uni.clearStorageSync()
	uni.showModal({
		title: '清除数据成功',
		content: ' ',
		showCancel: false
	})
}

const getDate = function(date, AddDayCount = 0, str = 'day') {
	if (!date) {
		date = new Date()
	}
	if (typeof date !== 'object') {
		date = date.replace(/-/g, '/')
	}
	const dd = new Date(date)
	switch (str) {
		case 'day':
			dd.setDate(dd.getDate() + AddDayCount) // 获取AddDayCount天后的日期
			break
		case 'month':
			if (dd.getDate() === 31) {
				dd.setDate(dd.getDate() + AddDayCount)
			} else {
				dd.setMonth(dd.getMonth() + AddDayCount) // 获取AddDayCount天后的日期
			}
			break
		case 'year':
			dd.setFullYear(dd.getFullYear() + AddDayCount) // 获取AddDayCount天后的日期
			break
	}
	const y = dd.getFullYear()
	const m = dd.getMonth() + 1 < 10 ? '0' + (dd.getMonth() + 1) : dd.getMonth() + 1 // 获取当前月份的日期，不足10补0
	const d = dd.getDate() < 10 ? '0' + dd.getDate() : dd.getDate() // 获取当前几号，不足10补0
	return {
		fullDate: y + '-' + m + '-' + d,
		year: y,
		month: m,
		date: d,
		day: dd.getDay()
	}
}

export default {
	getStorage,
	setStorage,
	clearStorage,
	getDate
}
