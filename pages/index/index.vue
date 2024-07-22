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
	<view class="Sent_information backdrop your-element">{{greetSb}}</view>
	
	

</template>

<script setup>
import {ref} from "vue"
import {getNavInfo} from "@/utils/navInfo.js"	


const greetSb = ref('你好，我是你的人工智能大模型，现在的我能够学习和理解人类的语言，进行多轮对话，回答问题，高效帮助人们获取信息，知识和灵感~快和我聊聊吧！如果你不确定从哪里开始，可以试试这样问我:')
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
	background-color: #fff;
	margin: 20rpx;
	border-radius: 10rpx;
	line-height: 1.5;
	font-size: 29rpx;
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
</style>
