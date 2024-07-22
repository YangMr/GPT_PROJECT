<script setup>
	import {onLaunch} from "@dcloudio/uni-app"
	
	onLaunch(() => {
		
		initSystemNavInfo()
		
	})
	
	
	// 获取手机上小程序右上角的胶囊按钮坐标(大小) 以及 状态栏的高度
	const initSystemNavInfo = () => {
		// 先获取本地的导航栏信息
		let navInfo = uni.getStorageSync("navInfo")
		
		// 判断是否获取到本地的导航栏信息
		if(!navInfo){
			// 调用系统的API获取导航栏以及胶囊的信息
			navInfo = uni.getMenuButtonBoundingClientRect()
			// 获取到之后存储到本地
			uni.setStorageSync("navInfo",navInfo)
		}
	}
</script>

<style>
	/*每个页面公共css */
</style>
