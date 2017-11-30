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
		this.colorArr = colorArr
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
				if (item) {
					if (!item.left) {
						// 弹幕起始位置
						item.left = this.width
						// 弹幕距离top位置（除去字体高度随机）
						item.top = this._getLimitRandom(30, this.height - 30)
						// 弹幕移动速度
						item.speed = this._getLimitRandom(2, 4)
						// 弹幕颜色
						item.color = this._getRandomColor()
					} else {
						if (item.left < 0) {
							item = null
						} else {
							item.left = parseInt(item.left - item.speed)
							this.ctx.fillStyle = item.color
							this.ctx.fillText(item.text, item.left, item.top)
							this.ctx.restore
						}
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