'use strict';
// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV }) // 使用当前云环境
// const APPID = '讯飞星火appid'
const APPID = '2a9b31b9'
const APISecret = 'N2Y4NGRmYTZjNWYzYmM4NTQ3NGExYTA2'
const APIKey = '3308409247b787bbcb93dc4b53174ef8'
const CryptoJS = require('crypto-js')
const base64 = require('base-64')
// 云函数入口函数
exports.main = async (event, context) => {
      var url = "wss://spark-api.xf-yun.com/v2.1/chat";
			const host = "spark-api.xf-yun.com";
			const apiKeyName = "api_key";
			const date = new Date().toGMTString();
			const algorithm = "hmac-sha256";
			const headers = "host date request-line";
			const signatureOrigin = `host: ${host}\ndate: ${date}\nGET /v2.1/chat HTTP/1.1`;
			const signatureSha = CryptoJS.HmacSHA256(signatureOrigin, APISecret);
			const signature = CryptoJS.enc.Base64.stringify(signatureSha);
			const authorizationOrigin =
`${apiKeyName}="${APIKey}", algorithm="${algorithm}", headers="${headers}", signature="${signature}"`;
			const authorization = base64.encode(authorizationOrigin);
			url = `${url}?authorization=${authorization}&date=${encodeURI(date)}&host=${host}`;
			return {APPID,url}; // 主要是返回地址
}
