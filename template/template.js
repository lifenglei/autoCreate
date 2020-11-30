/*
 * @Author: lifenglei
 * @Date: 2020-07-21 11:04:42
 * @Last Modified by: lifenglei
 * @Last Modified time: 2020-07-21 17:48:19
 */
module.exports = {
  vueTemplate: compoenntName => {
    return `<template>
		<div class="page-${compoenntName}">
			<div>创建成功 ${compoenntName} 页面</div>
		</div>
	</template>
	
	<script>
	export default {
		name: 'page-${compoenntName}',
		data() {
			return {

			}
		},
		components: {

		},
	
		mixins: [],
	
		props: {

		},
	
		methods: {

		},
	
		computed: {

		},
	
		watch: {

		},
	
		created() {
	
		},
	
		mounted() {
		},
		destroyed() {

		}
	}
	</script>
	
	<style lang="less" scoped>
	.page-${compoenntName} {
	
	}
	</style>`
  }
}
