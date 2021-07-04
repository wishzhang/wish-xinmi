<template>
	<u-cell-group :title="title" :border="border">
		<slot></slot>
	</u-cell-group>
</template>

<script>
	export default {
		props: {
			title: {
				type: String,
			},
			border: {
				type: Boolean,
				default: true
			}
		}
	}
</script>

<style>
</style>
