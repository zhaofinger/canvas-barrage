class Barrage {
	/**
	 * @param {dom} canvasDom canvas dom对象
	 * @param {number} msgStackLength 缓冲区长度，即最多弹幕数量
	 * @param {array} colorArr 弹幕随机色彩
	 * @param {number} quality 流畅度，通过绘制的频率来控制流畅度
	 */
	constructor(canvasDom, msgStackLength = 100, colorArr = ['Yellow', 'Orange', 'Pink', 'Red', 'Blue'], quality = 20) {
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
						item.top = 30 + parseInt(Math.random() * (this.height - 60))
						// 弹幕移动速度
						item.speed = parseInt(Math.random() * (6 - 4) + 2)
						// 弹幕颜色
						item.color = this.colorArr[Math.floor(Math.random() * this.colorArr.length)]
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