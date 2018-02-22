/**
 * @Author: zhaofinger
 * @Date: 2017-11-30 20:13:51
 * @Last Modified by: zhaofinger
 * @Last Modified time: 2018-02-22 11:28:38
 */

/**
 * 弹幕发射
 * @class
 */
class Barrage {
	/**
	 * @param {dom} canvasDom canvas dom对象
	 * @param {number} msgStackLength 缓冲区长度，即最多弹幕数量
	 * @param {number} quality 流畅度，通过绘制的频率来控制流畅度
	 */
	constructor(canvasDom, msgStackLength = 100, quality = 20) {
		this.ctx = canvasDom.getContext('2d')
		this.width = canvasDom.width
		this.height = canvasDom.height
		this.msgs = new Array(msgStackLength)
		this.msgStackLength = msgStackLength
		this.quality = quality
		this.intervalId = ''
		this.isRunning = false
		this.isClose = false

		this.ctx.font = '30px "PingFang SC", "Microsoft JhengHei", "Microsoft YaHei", "sans-serif"'
		this.ctx.shadowBlur = 2
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
		if (this.isRunning) return
		/* 定时器绘制弹幕 */
		this.intervalId = setInterval(() => {
			this.ctx.clearRect(0, 0, this.width, this.height)
			this.ctx.save()
			let counter = 0
			for (let i = 0; i < this.msgStackLength; i++) {
				if (!this.msgs[i]) {
					/* 当前项不存在弹幕 */
					counter += 1
					if (counter === this.msgStackLength) {
						clearInterval(this.intervalId)
						this.isRunning = false
					}
				} else {
					/* 当前项存在弹幕 */
					this.isRunning = true
					if (!this.msgs[i].left && typeof this.msgs[i].left !== 'number') {
						/* 初始化弹幕位置颜色以及速度等 */
						this.msgs[i].left = this.width															// 弹幕起始位置
						this.msgs[i].top = this.msgs[i].top || this._getLimitRandom(30, this.height - 30)		// 弹幕距离top位置（除去字体高度随机）
						this.msgs[i].speed =  this.msgs[i].speed || this._getLimitRandom(2, 4)					// 弹幕移动速度
						this.msgs[i].color = this.msgs[i].color || this._getRandomColor()						// 弹幕颜色
					} else {
						/* 绘制弹幕移动 */
						if (this.msgs[i].left < 0 - this.msgs[i].width) {
							/* 弹幕消失，清除 */
							this.msgs[i] = null
						} else {
							// 弹幕运行绘制
							this.msgs[i].left = parseInt(this.msgs[i].left - this.msgs[i].speed)
							this.ctx.shadowColor = this.msgs[i].color
							this.ctx.fillStyle = this.msgs[i].color
							this.ctx.fillText(this.msgs[i].text, this.msgs[i].left, this.msgs[i].top)
							let text = this.ctx.measureText(this.msgs[i].text)
							this.msgs[i].width = text.width														// 文本长度
							this.ctx.restore
						}
					}
				}

			}
		}, this.quality);
	}

	/**
	 * 添加弹幕
	 * @param {object} msg push 的信息对象 {text: '这是一个弹幕'}
	 */
	pushMessage(msg) {
		console.log(this.isClose)
		if (this.isClose) return
		/**
		 * msg 可选参数
		 * text 弹幕文字
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
		if (this.isRunning) {
			clearInterval(this.intervalId)
			this.isRunning = false
		}
		this.ctx.clearRect(0, 0, this.width, this.height)
		this.msgs = this.msgs.map(item => null)
	}

	close() {
		if (this.isClose) return
		this.isClose = true
		this.clear()
		clearInterval(this.intervalId)
	}

	open() {
		this.isClose = false
		this._draw()
	}
}

// @if env='ES6'
export default Barrage
// @endif