const BindingX = weex.requireModule('bindingx');
const dom = weex.requireModule('dom');
const animation = weex.requireModule('animation');

export default {
	data() {
		return {
			right: 0,
			button: [],
			preventGesture: false
		}
	},
	mounted() {
		this.boxSelector = this.getEl(this.$refs['selector-box-hock']);
		this.selector = this.getEl(this.$refs['selector-content-hock']);
		this.buttonSelector = this.getEl(this.$refs['selector-button-hock']);
		this.position = {}
		this.x = 0
		setTimeout(() => {
			this.getSelectorQuery()
		}, 200)
	},
	beforeDestoy() {
		BindingX.unbind({
			token: this.timing.token,
			eventType: 'timing'
		})
		BindingX.unbind({
			token: this.pan.token,
			eventType: 'pan'
		})
	},
	watch: {
		show(newVal) {
			if (!this.position || JSON.stringify(this.position) === '{}') return;
			if (this.autoClose) return
			if (this.isInAnimation) return
			if (newVal) {
				this.open()
			} else {
				this.close()
			}
		},
	},
	methods: {
		onClick(index, item, listIndex) {
			this.$emit('click', {
				content: item,
				index,
				listIndex
			})
		},
		itemClick(listIndex){
			console.log("aaa",listIndex);
			this.$emit('swipeclick', listIndex)
		}
		touchstart(e) {
			if (this.isInAnimation) return
			if (this.stop) return
			this.stop = true
			let endWidth = this.right
			let boxStep = `(x+${this.x})`
			let pageX = `${boxStep}> ${-endWidth} && ${boxStep} < 0?${boxStep}:(x+${this.x} < 0? ${-endWidth}:0)`

			let props = [{
				element: this.selector,
				property: 'transform.translateX',
				expression: pageX
			}]

			let left = 0
			for (let i = 0; i < this.options.length; i++) {
				let buttonSelectors = this.getEl(this.$refs['button-hock'][i]);
				if (this.button.length === 0 || !this.button[i] || !this.button[i].width) return
				let moveMix = endWidth - left
				left += this.button[i].width
				let step = `(${this.x}+x)/${endWidth}`
				let moveX = `(${step}) * ${moveMix}`
				let pageButtonX = `${moveX}&& (x+${this.x} > ${-endWidth})?${moveX}:${-moveMix}`
				props.push({
					element: buttonSelectors,
					property: 'transform.translateX',
					expression: pageButtonX
				})
			}

			this.eventpan = this._bind(this.boxSelector, props, 'pan', (e) => {
				if (e.state === 'end') {
					this.x = e.deltaX + this.x;
					if (this.x < -endWidth) {
						this.x = -endWidth
					}
					if (this.x > 0) {
						this.x = 0
					}
					this.stop = false
					this.bindTiming();
				}
			})
		},
		touchend(e) {
			this.$nextTick(() => {
				if (this.isopen && !this.isDrag && !this.isInAnimation) {
					this.close()
				}
			})
		},
		bindTiming() {
			if (this.isopen) {
				this.move(this.x, -this.right)
			} else {
				this.move(this.x, -40)
			}
		},
		move(left, value) {
			if (left >= value) {
				this.close()
			} else {
				this.open()
			}
		},
		/**
		 * 开启swipe
		 */
		open() {
			this.animation(true)
		},
		/**
		 * 关闭swipe
		 */
		close() {
			this.animation(false)
		},
		/**
		 * 开启关闭动画
		 * @param {Object} type
		 */
		animation(type) {
			this.isDrag = true
			let endWidth = this.right
			let time = 200
			this.isInAnimation = true;

			let exit = `t>${time}`;
			let translate_x_expression = `easeOutExpo(t,${this.x},${type?(-endWidth-this.x):(-this.x)},${time})`
			let props = [{
				element: this.selector,
				property: 'transform.translateX',
				expression: translate_x_expression
			}]

			let left = 0
			for (let i = 0; i < this.options.length; i++) {
				let buttonSelectors = this.getEl(this.$refs['button-hock'][i]);
				if (this.button.length === 0 || !this.button[i] || !this.button[i].width) return
				let moveMix = endWidth - left
				left += this.button[i].width
				let step = `${this.x}/${endWidth}`
				let moveX = `(${step}) * ${moveMix}`
				let pageButtonX = `easeOutExpo(t,${moveX},${type ? -moveMix + '-' + moveX: 0 + '-' + moveX},${time})`
				props.push({
					element: buttonSelectors,
					property: 'transform.translateX',
					expression: pageButtonX
				})
			}

			this.timing = BindingX.bind({
				eventType: 'timing',
				exitExpression: exit,
				props: props
			}, (e) => {
				if (e.state === 'end' || e.state === 'exit') {
					this.x = type ? -endWidth : 0
					this.isInAnimation = false;
					this.isopen = type
					this.isDrag = false
					this.$emit('change', type)
				}
			});
		},
		/**
		 * 绑定  BindingX
		 * @param {Object} anchor
		 * @param {Object} props
		 * @param {Object} fn
		 */
		_bind(anchor, props, eventType, fn) {
			return BindingX.bind({
				anchor,
				eventType,
				props
			}, (e) => {
				typeof(fn) === 'function' && fn(e)
			});
		},
		/**
		 * 获取ref
		 * @param {Object} el
		 */
		getEl(el) {
			return el.ref
		},
		/**
		 * 获取节点信息
		 */
		getSelectorQuery() {
			dom.getComponentRect(this.$refs['selector-content-hock'], (data) => {
				if (this.position.content) return
				this.position.content = data.size
			})
			for (let i = 0; i < this.options.length; i++) {
				dom.getComponentRect(this.$refs['button-hock'][i], (data) => {
					if (!this.button) {
						this.button = []
					}
					if (this.options.length === this.button.length) return
					this.button.push(data.size)
					this.right += data.size.width
					if (this.autoClose) return
					if (this.show) {
						this.open()
					}
				})
			}
		}
	}
}
