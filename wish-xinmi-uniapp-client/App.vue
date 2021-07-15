<script>
	// const origin = 'http://localhost:3000'
	// const origin = 'http://192.168.24.3:3000'
	// const origin = 'http://192.168.43.35:3000'
	const origin = 'http://159.75.234.119'

	export default {
		// 全局的静态变量
		globalData: {
			origin: origin,
			baseURL: `${origin}/xinmi`,
			socketPath: '/socket.io',
			tokenHeader: 'xinmi-token'
		},
		onLaunch: function() {
			console.log('App Launch')
		},
		onShow: function() {
			console.log('App Show')
		},
		onHide: function() {
			console.log('App Hide')
		}
	}
</script>

<style lang="scss">
	/* 导入阿里矢量字体图标 */
	@import "/static/css/iconfont.css";
	/* 导入uview css */
	@import "uview-ui/index.scss";
	/* 导入公共css类 */
	@import "/common/style.scss";
</style>
