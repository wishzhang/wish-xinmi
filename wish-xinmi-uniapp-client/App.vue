<script>
	export default {
		// 全局的静态变量
		globalData: {
			baseURL: 'http://159.75.234.119/xinmi',
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
