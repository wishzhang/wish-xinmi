<script>
	// const origin = 'http://localhost:3000'
	// const origin = 'http://192.168.24.6:3000'
	const origin = 'http://192.168.43.35:3000'

	export default {
		// 全局的静态变量
		globalData: {
			origin: origin,
			baseURL: `${origin}`,
			socketPath: '/socket.io',
			tokenHeader: 'xinmi-token'
		},
		onLaunch: function() {
			console.log('App Launch');

			setTimeout(() => {
				uni.setTabBarBadge({
					index: 1,
					text: '31'
				});
				uni.showTabBarRedDot({
					index: 3
				});
			}, 1000);
		},
		onShow: function() {
			console.log('App Show');
		},
		onHide: function() {
			console.log('App Hide');
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
