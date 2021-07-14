<template>
	<uni-index-layout>
		<uni-navbar title="发现" :isBack="false">
			<template slot="right">
				<uni-popover-add></uni-popover-add>
			</template>
		</uni-navbar>

		<uni-cell-group :border="false">
			<uni-cell-item title="朋友圈" to="/pages/thought-common/thought-common">
				<template slot="icon">
					<u-image :width="$style.uniImgSizeMini" :height="$style.uniImgSizeMini"
						:style="{marginRight: $style.uniPaddingHorizontal}" src="/static/img/circle.png"></u-image>
				</template>
			</uni-cell-item>
		</uni-cell-group>

	</uni-index-layout>
</template>

<script>
	import {
		mapGetters
	} from 'vuex'
	export default {
		data() {
			return {

			}
		},
		computed: {
			...mapGetters(['userInfo', 'tabbar'])
		},
		methods: {

		}
	}
</script>

<style>

</style>
