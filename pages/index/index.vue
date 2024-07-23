<template>
	<!-- 自定义导航栏 -->
	<view class="nav_bar_custom">
		
		<!-- 填充状态栏高度 -->
		<view class="top_height"></view>
		
		<!-- 自定义导航栏内容 -->
		<view class="nav_content">
			
			<image src="/static/logo-a.png" mode="widthFix" ></image>
			
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
	<view v-if="messageData.length <= 0" class="Sent_information backdrop your-element" >
		<view class="nav_content problem_top">
			<image src="/static/wenwo.png" mode="widthFix"></image>
			<text>你可以这样问我</text>
		</view>
		
		<view class="default_problem" v-for="(item,index) in problemData" :key="index"> 
			{{item}}
		</view>
	</view>

	<!-- 用户发送消息的布局 -->
	<view class="user_backdrop">
		<!-- 用户输入的投降 -->
		<view>
			<image src="/static/avatar.png" mode="widthFix"></image>
		</view>
		<!-- 用户发送的消息 -->
		<view>
			你好，我是你的人工智能大模型，现在的我能够学习和理解人类的语言，进行多轮对话，回答问题，高效帮助人们获取信息，知识和灵感~快和我聊聊吧！如果你不确定从哪里开始，可以试试这样问我:
		</view>
	</view>
	
	<!-- ai回复消息的布局 -->
	<view class="Sent_information backdrop">
		<!-- 思考中布局 -->
		<!-- <view class="loading">
			<view class="loader"></view>
			<view>AI正在思考中</view>
		</view> -->
		
		<!-- 回复内容的布局 -->
		<view class="ai_content">
			<text>我觉得您说的非常有道理, 说饿哭好像啊还是对巴萨荒诞不经啊胡说八道就哈身边发生布局</text>
			<image src="/static/fuzhi.png" mode="widthFix"></image>
		</view>
	</view>

	
	<!-- 底部输入框 -->
	<view class="input_field">
		<!-- 左侧清空输入内容图标 -->
		<view>
			<image src="/static/qingkong.png" mode="widthFix"></image>
		</view>
		
		<input type="text" placeholder="你可以问任何问题" />
		
		<!-- 右侧发送内容图标 -->
		<view>
			<image src="/static/fasong.png" mode="widthFix"></image>
		</view>
	</view>

</template>

<script setup>
import {ref} from "vue"
import {getNavInfo} from "@/utils/navInfo.js"	

// 进入页面默认提示语
const greetSb = ref('你好，我是你的人工智能大模型，现在的我能够学习和理解人类的语言，进行多轮对话，回答问题，高效帮助人们获取信息，知识和灵感~快和我聊聊吧！如果你不确定从哪里开始，可以试试这样问我:')
// 提示可以提问的问题
const problemData = ref([
	'给我一份关于数字经济的毕业论文大纲',
	'帮我推荐几个送给女朋友的生日礼物',
	'帮我推荐几款好用的国货口红',
	'我要在夏天去云南旅游，有什么美食推荐吗',
	'帮我推荐几款流行的家装风格'	
])

// 存储用户和ai的对话：临时存储
const messageData = ref([
"11"
])

// websocket实例对象
let SocketTask = ref(null)

// 连接讯飞星火大模型
const connentWSServer = async () => {
	// 调用云函数, 获取到后端返回的大模型接口地址以及appid
	const res = await uniCloud.callFunction({name: "ai_index"})
	console.log("Res=>", res)
	
	// 使用websocket 连接 星火大模型接口
	 SocketTask.value = uni.connectSocket({
		 url : res.result.url,
		 success (res){
			 console.log(res, "连接成功")
		 }
		})
	
	// 监听websocket是否连接成功
	SocketTask.value.onOpen = () => {
		console.log("websocket连接成功")
	}
	
	//  监听websocket是否连接失败
	SocketTask.value.onClose = () => {
		console.log("websocket连接成功")
	}
	
	//  监听websocket是否连接错误
	SocketTask.value.onError = () => {
		console.log("websocket连接错误")
	}
}


// 初始化调用
connentWSServer()
</script>

<style lang="scss">
// 页面背景色
page{
	background-color: #f6f8fe;
}

// 固定顶部自定义导航栏
.nav_bar_custom{
	height: v-bind('getNavInfo().setViewHeight');
	background-color: red;
	position: fixed;
	top : 0;
	left : 0;
	right : 0;
	z-index: 99;
	background: linear-gradient(to bottom, #b3cffa, #f6f8fe);
}

// 固定顶部自定义导航栏左边的图标
.nav_bar_custom image{
	width : 50rpx;
	display: block;
	margin: 0 20rpx;
}

// 顶部导航栏距离手机顶部的高度
.top_height{
	height : v-bind("getNavInfo().top")
}
// flex布局
.nav_content{
	display: flex;
	align-items: center;
}
// 顶部导航栏里的两段文本上下排列
.nav_text{
	display: flex;
	flex-direction: column;
}

// 顶部导航栏里的第一段文本样式
.nav_text text:nth-child(1){
	font-weight: bold;
	font-size: 28rpx;
}
// 顶部导航栏里的第二段文本样式
.nav_text text:nth-child(2){
	font-size: 25rpx;
	color :#798189;
}
// 主要用于聊天区的文字内容区域
.Sent_information{
	padding : 10px;
	margin: 20rpx;
	border-radius: 10rpx;
	line-height: 1.5;
	font-size: 29rpx;
}
// 公用的卡片的背景颜色
.backdrop{
	background-color: #fefefe;
}

// 设置页面的动画
.your-element{
	animation-name : fadeInFromTop; // 动画名称
	animation-duration: 2s; // 动画的执行时间 0.7s
	animation-timing-function: ease-in; // 动画在每个周期的持续时间内如何进行
	animation-fill-mode: forwards; // 设置 CSS 动画在执行之前和之后如何将样式应用于其目标。
}
@keyframes fadeInFromTop{
	0%{
		opacity: 0;
		transform: translateY(30px);
	}
	
	100%{
		opacity: 1;
		transform: translateY(0);
	}
}

.problem_top image{
	width: 35rpx;
	display: block;
	margin-right: 10rpx;
}
.problem_top  text{
	font-weight: bold;
}
.default_problem{
	color : #3875f6;
	border:1rpx solid #e8f0fc;
	padding:15rpx 0;
	text-align: center;
	font-weight: bold;
	border-radius: 40rpx;
	margin: 20rpx 0;
}

// 用户发送消息的布局
.user_backdrop{
	display: flex;
	margin: 20rpx;
	color : #555d92;
}

.user_backdrop image{
	width: 38rpx;
	display: block;
	border-radius: 50%;
}

.user_backdrop view:nth-child(1){
	margin-right: 10rpx;
	height: 48rpx;
	display: flex;
	align-items: center;
}

.user_backdrop view:nth-child(2){
	line-height: 1.5;
	align-self: center;
}

// AI回复的布局
.loading{
	display: flex;
	align-items: center;
}
.loader{
	width: 40rpx;
	height: 40rpx;
	border:5rpx solid #f3f3f3;
	border-radius: 50%;
	margin-right: 10rpx;
	border-top:5rpx solid #3498db;
	animation: spin 1s linear infinite;
}
@keyframes spin{
	0%{
		transform: rotate(0deg)
	}
	100%{
		transform: rotate(360deg)
	}
}
.ai_content{
	display: flex;
	flex-direction: column;
	
}
.ai_content text{
	padding-bottom:10rpx;
	border-bottom: 1rpx solid #f3f3f4;
}
.ai_content image{
	width: 29rpx;
	margin-top: 10rpx;
	align-self: flex-end;
}
// 底部数据框最外层盒子样式
.input_field{
	display: flex;
	align-items: center;
	justify-content: space-between;
	position: fixed;
	bottom : 0;
	left : 0;
	right : 0;
	border-top:1rpx solid #eee;
	padding-top: 10rpx;
	padding-bottom: 70rpx;
	background-color: #f6f8fe;
}
.input_field  input{
	width: 100%;
	background-color: #fff;
	padding:20rpx;
	border-radius: 10rpx;
}

.input_field view{
	width: 80rpx;
	height: 80rpx;
	display: flex;
	align-items: center;
	justify-content: center;
	padding:0 10rpx;
}
.input_field image{
	width: 50rpx;
	height: 50rpx;
	display: block;
}
</style>
