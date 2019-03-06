//格式化时间
const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('-') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

//生成随机订单号, 收货码
const getCode = () => {
	let arr = ['1234567890', 'qwertyuiopasdfghjklzxcvbnm1234567890']
	let length = 0
	let str = ''
	let codeStr = ''
	return ['goodsCode', 'orderNo'].map(item => {
		if (item.startsWith('g')) {
			length = 4
			str = arr[0]
			codeStr = ''
		}
		if (item.startsWith('o')) {
			length = 20
			str = arr[1]
			codeStr = ''
		}
		for (let i = 0; i < length; i++) {
			let index = Math.floor(Math.random() * str.length)
			codeStr += str.charAt(index)
		}
		return codeStr
	})
}

//验证手机号
const checkPhone = phone => {
	let reg = /^1[3|4|5|7|8|9][0-9]{9}$/;
	return reg.test(phone);
}

/**
 * debounce：空闲的时间间隔(防抖函数)
 * @param delay {Number}  延迟时间，也就是阈值，单位ms
 * @return {Function}     返回一个“去弹跳”了的函数
*/
const debounce = function (delay, fn) {
	let timer
	// 返回一个函数，这个函数会在一个时间区间结束后的 delay 毫秒时执行 fn 函数
	return function () {
		// 保存函数调用时参数，传递给 resolve
		let context = this
		let args = arguments
		// 每次这个返回的函数被调用，就清除定时器，以保证不执行 fn
		clearTimeout(timer)
		// 当返回的函数被最后一次调用后（也就是用户停止了某个连续的操作），
		// 再过 delay 毫秒就执行 fn
		timer = setTimeout(() => {
			fn.apply(context, args)
		}, delay)
	}
}

module.exports = {
	// 防抖
	debounce: debounce,
  formatTime: formatTime,
	checkPhone: checkPhone,
	getCode: getCode
}