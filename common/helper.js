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

export default {  
    getStorage,  
    setStorage,  
    clearStorage  
}