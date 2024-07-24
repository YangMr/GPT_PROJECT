<template>
	<!-- 自定义导航栏 -->
	<view class="nav_bar_custom">

		<!-- 填充状态栏高度 -->
		<view class="top_height"></view>

		<!-- 自定义导航栏内容 -->
		<view class="nav_content">

			<image src="/static/logo-a.png" mode="widthFix"></image>

			<view class="nav_text">
				<text>AI助手</text>
				<text>你的智能助手,帮助你获取知识</text>
			</view>

		</view>

	</view>

	<!-- 填充自定义导航高度的盒子 -->
	<view :style="{height : getNavInfo().setViewHeight}"></view>

	<!-- 进入页面的默认文本 -->
	<view v-if="messageData.length <= 0" class="Sent_information backdrop your-element">{{greetSb}}</view>

	<!-- 提问信息 -->
	<view v-if="messageData.length <= 0" class="Sent_information backdrop your-element">
		<view class="nav_content problem_top">
			<image src="/static/wenwo.png" mode="widthFix"></image>
			<text>你可以这样问我</text>
		</view>

		<view @click="selectQuestion(item)" class="default_problem" v-for="(item,index) in problemData" :key="index">
			{{item}}
		</view>
	</view>



	<!-- ai回复消息的布局 -->
	<block v-for="(item,index) in messageData" :key="index">
		<!-- 用户发送消息的布局 -->
		<view class="user_backdrop" v-if="item.role === 'user'">
			<!-- 用户输入的投降 -->
			<view>
				<image src="/static/avatar.png" mode="widthFix"></image>
			</view>
			<!-- 用户发送的消息 -->
			<view>
				<text user-select>{{item.content}}</text>
				
			</view>
		</view>

		<view class="Sent_information backdrop" v-else>
			<!-- 思考中布局 -->
			<view class="loading" v-if="item.loadShow">
				<view class="loader"></view>
				<view>AI正在思考中</view>
			</view>

			<!-- 回复内容的布局 -->
			<view class="ai_content">
				<text user-select>{{item.content}}</text>
				<image @click="handleCopy(item.content)" v-if="item.copyIcon" src="/static/fuzhi.png" mode="widthFix"></image>
			</view>
		</view>
	</block>



	<!-- 底部输入框 -->
	<view class="input_field">
		<!-- 左侧清空输入内容图标 -->
		<view>
			<image @click="clearMessage" src="/static/qingkong.png" mode="widthFix"></image>
		</view>

		<input v-model="text" auto-blur confirm-type="send" @confirm="sendMessage" type="text" placeholder="你可以问任何问题" />

		<!-- 右侧发送内容图标 -->
		<view>
			<image @click="sendMessage" src="/static/fasong.png" mode="widthFix"></image>
		</view>
	</view>
	
	<view style="height:400rpx;"></view>
</template>

<script setup>
	import {
		getNavInfo
	} from "@/utils/navInfo.js"
	import {
		ref
	} from "vue"

	// 进入页面的默认文本
	const greetSb = ref("你好，我是你的人工智能大模型，现在的我能够学习和理解人类的语言，进行多轮对话，回答问题，高效帮助人们获取信息，知识和灵感~快和我聊聊吧！如果你不确定从哪里开始，可以试试这样问我:")

	// 默认提示的问题
	const problemData = ref([
		'给我一份关于数字经济的毕业论文大纲',
		'帮我推荐几个送给女朋友的生日礼物',
		'帮我推荐几款好用的国货口红',
		'我要在夏天去云南旅游，有什么美食推荐吗',
		'帮我推荐几款流行的家装风格'
	])

	// 临时存储:用户与ai的对话
	const messageData = ref([])

	// 定义输入框输入的内容
	const text = ref("")

	// AI回复的状态  false 未开始 已回复 出现错误 true: 正在回复中
	const sendIngState = ref(false)

	// appid
	let appid = ref("")

	// 保存websocket实例对象
	let SocketTask = ref(null)

	// 初始化一个变量,保存完整的(用户发送消息与ai回复)历史聊天记录
	const historyTextList = ref([])
	
	// 初始化一个变量,临时存储保存ai回复的内容
	const sparkResult = ref("")
	

	// 点击发送按钮触发的方法
	const sendMessage = async () => {
		// 处理输入框输入的内容
		if (text.value.trim().length > 0) {
			text.value = text.value.trim()
		} else {
			uni.showToast({
				title: '请输入询问内容',
				icon: 'none'
			})
			return false
		}

		// AI回复的状态
		if (sendIngState.value) {
			uni.showToast({
				title: '等待AI回复完毕',
				icon: 'none'
			})
			return false
		}

		// 临时存储与ai对话的内容(包含用户发送的消息与ai回复的内容)
		messageData.value.push(
			// 用户给ai发送的消息
			{
				role: "user",
				content: text.value
			}
		)

		messageData.value.push(
			// ai给用户回复的消息
			{
				role: "assistant",
				content: "",
				loadShow: true, // 展示
				copyIcon: false // 不展示
			}
		)

		// 清除临时存储的上一次ai回复 的内容
		sparkResult.value = ""

		// 点击发送的时候,这个就变成ai回复中的状态
		sendIngState.value = true

		// 1. 获取到后端返回的appid与服务器的url
		const res = await uniCloud.callFunction({
			name: "ai_index"
		})

		// 保存后台返回的appid, 发送消息的需要appid
		appid.value = res.result.APPID

		// 获取模型的接口地址
		const url = res.result.url

		// 连接AI大模型接口
		SocketTask.value = uni.connectSocket({
			url,
			success: (res) => {
				console.log("连接成功", res)
			},
			fail: (error) => {
				console.log(error, 'ws连接失败');
				uni.showToast({
					title: '出现异常错误',
					icon: 'none'
				})

				// ai回复的状态修改为不在回复中的状态
				sendIngState.value = false
			}
		})

		// 监听socket是否连接成功
		SocketTask.value.onOpen(() => {
			console.log('连接成功,接下来可以发送消息了');


			// 发送消息前创建一个变量,保存当前的发送的消息
			historyTextList.value.push({
				role: "user",
				content: text.value
			})

			// 清空输入的内容
			text.value = ""


			// 准备后端需要的参数
			const params = {
				"header": {
					"app_id": appid.value,
				},
				"parameter": {
					"chat": {
						"domain": "generalv3",
						"temperature": 1,
					}
				},
				"payload": {
					"message": {
						text : historyTextList.value
					}
				}
			}
			
			// 将数据发送给后台
			SocketTask.value.send({
				data : JSON.stringify(params),
				success : (res) => {
					console.log("发送数据成功", res)
				},
				fail : (error) => {
					console.log('发送消息失败');
					uni.showToast({title: '出现异常错误',icon: 'none'})
					// 清空聊天记录
					messageData.value = []
					//  ai回复的状态修改为不在回复中的状态
					sendIngState.value = false
				}
			})
			
			// 调用获取ai回复的内容方法
			getServerMessage()
		})
		// 监听后端socket是否关闭连接
		SocketTask.value.onClose(() => {
			console.log("websocket断开连接")
			// 清空消息记录
			// messageData.value = []
			// ai回复的状态修改为不在回复中的状态
			// sendIngState.value = false
		})
		// 监听socket是否发生错误
		SocketTask.value.onError(() => {
			console.log("websocket连接错误")
			// 清空消息记录
			messageData.value = []
			// ai回复的状态修改为不在回复中的状态
			sendIngState.value = false
		})
	}
	
	
	// 获取ai回复的内容
	const getServerMessage = () => {
		SocketTask.value.onMessage(res => {
			// 在接受后端返回的消息的时候, 取下ai回复中的状态
			messageData.value[messageData.value.length - 1].loadShow = false
			
			// 获取后端返回的数据, 由于后端返回的json字符串, 所以需要json,parse进行解析
			const obj = JSON.parse(res.data) 
			// 回复出现错误
			if(obj.header.code != 0){
				sparkResult.value += obj.header.message.replace(/↵/g,'\n')
				messageData.value[messageData.value.length - 1].content = sparkResult.value
				sendIngState.value = false
				messageData.value[messageData.value.length - 1].copyIcon = true
				return false
			}
			
			
			console.log("message", obj)
			// 获取ai回复的所有内容
			const dataArray = obj.payload.choices.text
			// 拼接ai回复的完整内容
			dataArray.forEach(item => {
				 sparkResult.value += item.content.replace(/↵/g,'\n')
				 messageData.value[messageData.value.length - 1].content = sparkResult.value
			})
			
			uni.pageScrollTo({
				scrollTop:3000
			})
			
			// 在AI回复完毕的时候,进行处理
			if(obj.header.code === 0 && obj.header.status === 2){
				
				// 将ai回复的记录也保存在历史记录中
				historyTextList.value.push({
					role : "assistant",
					content : sparkResult.value
				})
				
				// 将状态修改为回复完毕的状态
				sendIngState.value = false
				
				// messageData.value[messageData.value.length - 1].copyIcon = true
			}
		})
	}

	// 点击默认提问的问题
	const selectQuestion = (item) => {
		text.value = item
		sendMessage()
	}
	
	// 清空聊天的记录以及输入的内容
	const clearMessage = () => {
		// 判断是否是正在回复中
		if(sendIngState.value){
			uni.showToast({
				title : "等待AI回复完毕",
				icon : "none"
			})
			return false
		}
		
		sparkResult.value = ""
		messageData.value = []
		historyTextList.value = []
		text.value = []
	}

	// 复制文本内容
	const handleCopy = (value) => {
		uni.setClipboardData({
			data : value
		})
	}
</script>

<style lang="scss">
	// 页面背景色
	page {
		background-color: #f6f8fe;
	}

	// 固定顶部自定义导航栏
	.nav_bar_custom {
		height: v-bind('getNavInfo().setViewHeight');
		background-color: red;
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		z-index: 99;
		background: linear-gradient(to bottom, #b3cffa, #f6f8fe);
	}

	// 固定顶部自定义导航栏左边的图标
	.nav_bar_custom image {
		width: 50rpx;
		display: block;
		margin: 0 20rpx;
	}

	// 顶部导航栏距离手机顶部的高度
	.top_height {
		height: v-bind("getNavInfo().top")
	}

	// flex布局
	.nav_content {
		display: flex;
		align-items: center;
	}

	// 顶部导航栏里的两段文本上下排列
	.nav_text {
		display: flex;
		flex-direction: column;
	}

	// 顶部导航栏里的第一段文本样式
	.nav_text text:nth-child(1) {
		font-weight: bold;
		font-size: 28rpx;
	}

	// 顶部导航栏里的第二段文本样式
	.nav_text text:nth-child(2) {
		font-size: 25rpx;
		color: #798189;
	}

	// 主要用于聊天区的文字内容区域
	.Sent_information {
		padding: 10px;
		margin: 20rpx;
		border-radius: 10rpx;
		line-height: 1.5;
		font-size: 29rpx;
	}

	// 公用的卡片的背景颜色
	.backdrop {
		background-color: #fefefe;
	}

	// 设置页面的动画
	.your-element {
		animation-name: fadeInFromTop; // 动画名称
		animation-duration: 2s; // 动画的执行时间 0.7s
		animation-timing-function: ease-in; // 动画在每个周期的持续时间内如何进行
		animation-fill-mode: forwards; // 设置 CSS 动画在执行之前和之后如何将样式应用于其目标。
	}

	@keyframes fadeInFromTop {
		0% {
			opacity: 0;
			transform: translateY(30px);
		}

		100% {
			opacity: 1;
			transform: translateY(0);
		}
	}

	.problem_top image {
		width: 35rpx;
		display: block;
		margin-right: 10rpx;
	}

	.problem_top text {
		font-weight: bold;
	}

	.default_problem {
		color: #3875f6;
		border: 1rpx solid #e8f0fc;
		padding: 15rpx 0;
		text-align: center;
		font-weight: bold;
		border-radius: 40rpx;
		margin: 20rpx 0;
	}

	// 用户发送消息的布局
	.user_backdrop {
		display: flex;
		margin: 20rpx;
		color: #555d92;
	}

	.user_backdrop image {
		width: 38rpx;
		display: block;
		border-radius: 50%;
	}

	.user_backdrop view:nth-child(1) {
		margin-right: 10rpx;
		height: 48rpx;
		display: flex;
		align-items: center;
	}

	.user_backdrop view:nth-child(2) {
		line-height: 1.5;
		align-self: center;
	}

	// AI回复的布局
	.loading {
		display: flex;
		align-items: center;
	}

	.loader {
		width: 40rpx;
		height: 40rpx;
		border: 5rpx solid #f3f3f3;
		border-radius: 50%;
		margin-right: 10rpx;
		border-top: 5rpx solid #3498db;
		animation: spin 1s linear infinite;
	}

	@keyframes spin {
		0% {
			transform: rotate(0deg)
		}

		100% {
			transform: rotate(360deg)
		}
	}

	.ai_content {
		display: flex;
		flex-direction: column;

	}

	.ai_content text {
		padding-bottom: 10rpx;
		border-bottom: 1rpx solid #f3f3f4;
	}

	.ai_content image {
		width: 29rpx;
		margin-top: 10rpx;
		align-self: flex-end;
	}

	// 底部数据框最外层盒子样式
	.input_field {
		display: flex;
		align-items: center;
		justify-content: space-between;
		position: fixed;
		bottom: 0;
		left: 0;
		right: 0;
		border-top: 1rpx solid #eee;
		padding-top: 10rpx;
		padding-bottom: 70rpx;
		background-color: #f6f8fe;
	}

	.input_field input {
		width: 100%;
		background-color: #fff;
		padding: 20rpx;
		border-radius: 10rpx;
	}

	.input_field view {
		width: 80rpx;
		height: 80rpx;
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 0 10rpx;
	}

	.input_field image {
		width: 50rpx;
		height: 50rpx;
		display: block;
	}
</style>