<template>
	<uni-index-layout>
		<uni-navbar title="新的朋友"></uni-navbar>

		<uni-cell-group :border="false">
			<template v-for="(item, index) in list">
				<uni-cell-item :item-style="{padding: `${$style.uniSpacingColLg} ${$style.uniPaddingHorizontal}`}"
					:key="index" :title="item.name" :label="item.validateMsg" :arrow="false" @click="onItemClick(item)">
					<template slot="icon">
						<uni-avatar class="avatar" :src="item.avatarUrl"></uni-avatar>
					</template>

					<template slot="right-icon">
						<u-button v-if="item.status===2" type="primary" size="mini" :loading="acceptLoading"
							@click="onAccept(item)">接受
						</u-button>
						<text v-else-if="item.status===3" class="u-tips-color">已添加</text>
						<text v-else-if="item.status===1" class="u-tips-color">等待对方验证</text>
					</template>
				</uni-cell-item>
			</template>
		</uni-cell-group>
	</uni-index-layout>
</template>

<script>
	import {
		mapGetters
	} from 'vuex'
	import {
		setAllContactCheckedRequest,
		fetchConfirmContactListRequest,
		confirmContactRequest
	} from '@/api/contact.js'

	export default {
		data() {
			return {
				list: [],
				acceptLoading: false
			}
		},
		computed: {
			...mapGetters(['userInfo'])
		},
		onLoad() {
			this.fetchData()
		},
		onUnload() {
			const params = {
				userId: this.userInfo.userId
			}
			setAllContactCheckedRequest(params).then(() => {
				this.$store.commit('SET_CONTACT_WARN_NUM', 0)
			})
		},
		methods: {
			onItemClick(item) {
				this.$navigateTo({
					url: '/pages/contact-people/contact-people',
					params: {
						userId: item.contactId
					}
				})
			},
			fetchData() {
				const params = {
					userId: this.userInfo.userId
				}
				fetchConfirmContactListRequest(params)
					.then(res => {
						this.list = res.data

					})
			},
			onAccept(item) {
				this.acceptLoading = true
				const params = {
					userId: this.userInfo.userId,
					contactId: item.contactId
				}
				confirmContactRequest(params)
					.then(() => {
						return this.fetchData()
					}).finally(() => {
						this.acceptLoading = false
					})
			}
		}
	}
</script>

<style scoped lang="scss">
	.avatar {
		margin-right: $uni-spacing-row-lg;
	}

	.cell-item {
		padding: $uni-spacing-col-lg 0;
	}
</style>
