// 定义公共的获取导航栏信息的方法
export const getNavInfo = () => {
	let navInfo = uni.getStorageSync("navInfo")
	
	// 状态栏的高度
	const top  = navInfo.top + "px"
	const height =  navInfo.height + "px"
	const width =  navInfo.width + "px"
	const right =  navInfo.right + "px"
	const bottom =  navInfo.bottom + "px"
	const left =  navInfo.left + "px"
	
	// 自定义导航栏的高度
	const setViewHeight = navInfo.top + navInfo.height + 10 + "px"
	
	return {
		top,
		height,
		width,
		right,
		bottom,
		left,
		setViewHeight
	}
}