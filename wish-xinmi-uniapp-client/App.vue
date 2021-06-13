<script>
	export default {
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
	};
</script>

<style lang="scss">
		@import "uview-ui/index.scss";
	@import "./common/style.scss";

	/*每个页面公共css */
	body {
		font-size: $uni-font-size-base;
	}
</style>
