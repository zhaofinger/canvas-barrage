/**
 * @Author: zhaofinger
 * @Date: 2017-11-30 20:13:51
 * @Last Modified by: zhaoFinger
 * @Last Modified time: 2017-12-01 00:29:13
 */

/**
 * 弹幕发射
 * @class
 */

class Barrage {
	/**
	 * @param {dom} canvasDom canvas dom对象
	 * @param {number} msgStackLength 缓冲区长度，即最多弹幕数量
	 * @param {array} colorArr 弹幕随机色彩
	 * @param {number} quality 流畅度，通过绘制的频率来控制流畅度
	 */
	constructor(canvasDom, msgStackLength = 100, quality = 20) {
		this.ctx = canvasDom.getContext('2d')
		this.ctx.font = '30px 微软雅黑'
		this.width = canvasDom.width
		this.height = canvasDom.height
		this.msgs = new Array(msgStackLength)
		this.msgStackLength = msgStackLength
		this.intervalId = ''
		this.quality = quality
	}

	/**
	 * 获取范围内随机数 包括min 不包括max
	 * @param {number} min 下限
	 * @param {number} max 上限
	 */
	_getLimitRandom(min, max) {
		return Math.floor(Math.random() * (max - min) + min)
	}

	/**
	 * 获取随机色
	 */
	_getRandomColor() {
		const baseColor = ['00','33','66','99','cc','ff']
		let len = baseColor.length
		return `#${baseColor[this._getLimitRandom(0, len)]}${baseColor[this._getLimitRandom(0, len)]}${baseColor[this._getLimitRandom(0, len)]}`
	}

	/**
	 * 绘制
	 */
	_draw() {
		if (this.intervalId) return
		/* 定时器绘制弹幕 */
		this.intervalId = setInterval(() => {
			this.ctx.clearRect(0, 0, this.width, this.height)
			this.ctx.save()
			this.msgs.map(item => {
				if (!item) return
				if (!item.left && typeof item.left !== 'number') {
					// 弹幕起始位置
					item.left = this.width
					// 弹幕距离top位置（除去字体高度随机）
					item.top = item.top || this._getLimitRandom(30, this.height - 30)
					// 弹幕移动速度
					item.speed =  item.speed || this._getLimitRandom(2, 4)
					// 弹幕颜色
					item.color = item.color || this._getRandomColor()
				} else {
					if (item.left < 0 - item.width) {
						// 清除弹幕
						item = null
					} else {
						// 弹幕运行绘制
						item.left = parseInt(item.left - item.speed)
						this.ctx.fillStyle = item.color
						this.ctx.fillText(item.text, item.left, item.top)
						let text = this.ctx.measureText(item.text)
						// 文本长度
						item.width = text.width
						this.ctx.restore
					}
				}
			})
		}, this.quality);
	}

	/**
	 * 添加弹幕
	 * @param {object} msg push 的信息对象 {text: '这是一个弹幕'}
	 */
	pushMessage(msg) {
		/**
		 * msg 可选参数
		 * text * 弹幕文字
		 * speed 弹幕移动速度
		 * color 弹幕颜色
		 */
		for (let i = 0; i < this.msgStackLength; i++) {
			if (!this.msgs[i]) {
				this.msgs[i] = msg
				break
			}
		}
		this._draw()
	}

	clear() {
		if (this.intervalId) {
			clearInterval(this.intervalId)
			this.intervalId = ''
		}
		this.ctx.clearRect(0, 0, this.width, this.height)
		this.msgs.map(item => null)
	}
}