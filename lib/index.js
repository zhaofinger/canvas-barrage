'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * @Author: zhaofinger
 * @Date: 2017-11-30 20:13:51
 * @Last Modified by: zhaoFinger
 * @Last Modified time: 2017-11-30 20:32:07
 */

/**
 * 弹幕发射
 * @class
 */

var Barrage = function () {
	/**
  * @param {dom} canvasDom canvas dom对象
  * @param {number} msgStackLength 缓冲区长度，即最多弹幕数量
  * @param {array} colorArr 弹幕随机色彩
  * @param {number} quality 流畅度，通过绘制的频率来控制流畅度
  */
	function Barrage(canvasDom) {
		var msgStackLength = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 100;
		var quality = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 20;

		_classCallCheck(this, Barrage);

		this.ctx = canvasDom.getContext('2d');
		this.ctx.font = '30px 微软雅黑';
		this.width = canvasDom.width;
		this.height = canvasDom.height;
		this.msgs = new Array(msgStackLength);
		this.msgStackLength = msgStackLength;
		this.intervalId = '';
		this.quality = quality;
	}

	/**
  * 获取范围内随机数 包括min 不包括max
  * @param {number} min 下限
  * @param {number} max 上限
  */


	_createClass(Barrage, [{
		key: '_getLimitRandom',
		value: function _getLimitRandom(min, max) {
			return Math.floor(Math.random() * (max - min) + min);
		}

		/**
   * 获取随机色
   */

	}, {
		key: '_getRandomColor',
		value: function _getRandomColor() {
			var baseColor = ['00', '33', '66', '99', 'cc', 'ff'];
			var len = baseColor.length;
			return '#' + baseColor[this._getLimitRandom(0, len)] + baseColor[this._getLimitRandom(0, len)] + baseColor[this._getLimitRandom(0, len)];
		}

		/**
   * 绘制
   */

	}, {
		key: '_draw',
		value: function _draw() {
			var _this = this;

			if (this.intervalId) return;
			/* 定时器绘制弹幕 */
			this.intervalId = setInterval(function () {
				_this.ctx.clearRect(0, 0, _this.width, _this.height);
				_this.ctx.save();
				_this.msgs.map(function (item) {
					if (!item) return;
					if (!item.left && typeof item.left !== 'number') {
						// 弹幕起始位置
						item.left = _this.width;
						// 弹幕距离top位置（除去字体高度随机）
						item.top = item.top || _this._getLimitRandom(30, _this.height - 30);
						// 弹幕移动速度
						item.speed = item.speed || _this._getLimitRandom(2, 4);
						// 弹幕颜色
						item.color = item.color || _this._getRandomColor();
					} else {
						if (item.left < 0 - item.width) {
							// 清除弹幕
							item = null;
						} else {
							// 弹幕运行绘制
							item.left = parseInt(item.left - item.speed);
							_this.ctx.fillStyle = item.color;
							_this.ctx.fillText(item.text, item.left, item.top);
							var text = _this.ctx.measureText(item.text);
							// 文本长度
							item.width = text.width;
							_this.ctx.restore;
						}
					}
				});
			}, this.quality);
		}

		/**
   * 添加弹幕
   * @param {object} msg push 的信息对象 {text: '这是一个弹幕'}
   */

	}, {
		key: 'pushMessage',
		value: function pushMessage(msg) {
			/**
    * msg 可选参数
    * text * 弹幕文字
    * speed 弹幕移动速度
    * color 弹幕颜色
    */
			for (var i = 0; i < this.msgStackLength; i++) {
				if (!this.msgs[i]) {
					this.msgs[i] = msg;
					break;
				}
			}
			this._draw();
		}
	}, {
		key: 'clear',
		value: function clear() {
			if (this.intervalId) {
				clearInterval(this.intervalId);
				this.intervalId = '';
			}
			this.ctx.clearRect(0, 0, this.width, this.height);
			this.msgs.map(function (item) {
				return null;
			});
		}
	}]);

	return Barrage;
}();