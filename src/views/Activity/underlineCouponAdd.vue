<template>
	<section>
		<el-row :gutter="20">
		  	<el-col :xs="24" :md="12">
		  		<label>标题:</label>
		  		<el-input v-model="product.title" placeholder=""></el-input>
	  		</el-col>
		  	<el-col :xs="24" :md="12">
		  		<label>内容:</label>
		  		<el-input v-model="product.detail" placeholder=""></el-input>
	  		</el-col>
		</el-row>
		<el-row :gutter="20">
		  	<el-col :xs="24" :md="12">
		  		<label>描述:</label>
		  		<el-input v-model="product.description" placeholder=""></el-input>
	  		</el-col>
		  	<el-col :xs="24" :md="12">
		  		<label>券类型:</label>
		  		<el-select v-model="product.type" placeholder="请选择">
		  		    <el-option
		  		      v-for="item in couponTypes"
		  		      :label="item.label"
		  		      :value="item.value">
		  		    </el-option>
		  		</el-select>
	  		</el-col>
		</el-row>
		<el-row :gutter="20">
		  	<el-col :xs="24" :md="12">
		  		<label>最低购买金额:</label>
		  		<el-input type='number' v-model="product.min_buy_money" placeholder=""></el-input>
	  		</el-col>
		  	<el-col :xs="24" :md="12">
		  		<label>最高购买金额, 0无上限:</label>
		  		<el-input v-model="product.max_buy_money" placeholder=""></el-input>
	  		</el-col>
		</el-row>
		<el-row :gutter="20">
			<el-col :xs="24" :md="12">
				<label>使用起始时间:</label>
					<el-date-picker v-model="product.begin_time" type="datetime" placeholder="选择日期时间"></el-date-picker>
			</el-col>
			<el-col :xs="24" :md="12">
				<label>使用结束时间:</label>
					<el-date-picker v-model="product.end_time" type="datetime" placeholder="选择日期时间"></el-date-picker>
			</el-col>
		</el-row>
		<el-row :gutter="20">
		  	<el-col :xs="24" :md="12">
		  		<label>利率:</label>
		  		<el-input type='number' v-model="product.value" placeholder=""></el-input>
	  		</el-col>
		  	<el-col :xs="24" :md="12">
		  		<label>适用产品:</label>
		  		<el-select v-model="product.product_id" placeholder="请选择">
		  		    <el-option
		  		      v-for="item in productNames"
		  		      :label="item.label"
		  		      :value="item.value">
		  		    </el-option>
		  		</el-select>
	  		</el-col>
		</el-row>
		<el-row :gutter="20">
		  	<el-col :xs="24" :md="12">
		  		<label>获取口令:</label>
		  		<el-input type='number' v-model="product.get_passwd" placeholder=""></el-input>
	  		</el-col>
		  	<el-col :xs="24" :md="12">
		  		<label>限领次数:</label>
		  		<el-input type='number' v-model="product.every_count" placeholder=""></el-input>
	  		</el-col>
		</el-row>
		<el-row :gutter="20">
		  	<el-col :xs="24" :md="12">
		  		<label>共发数量:</label>
		  		<el-input type='number' v-model="product.out_count" placeholder=""></el-input>
	  		</el-col>
		  	<el-col :xs="24" :md="12">
		  		<label>剩余数量:</label>
		  		<el-input type='number' v-model="product.left_count" placeholder=""></el-input>
	  		</el-col>
		</el-row>
		<el-row :gutter="20">
		  	<el-col :xs="24" :md="12">
		  		<el-checkbox v-model="product.disabled">是否关闭</el-checkbox>
	  		</el-col>
		</el-row>
		<div slot="footer" class="dialog-footer">
			<el-button type="primary" @click="addSubmit" v-if="isEdit === false">保存</el-button>
			<el-button type="primary" @click="addSubmit" v-else>保存修改</el-button>
			<router-link  v-if="isEdit === true" :to="{ name: '分派线下理财券', params: { id: get_id}}">
				<el-button size="small">分派理财券</el-button>
			</router-link>
		</div>

	</section>
</template>

<script>
	import util from '../../common/js/util'
	//import NProgress from 'nprogress'
	import { getUserListPage, removeUser, batchRemoveUser, editUser, addUser } from '../../api/api';
	const cityOptions = ['嘉兴分公司', '嘉兴分公司', '嘉兴分公司', '嘉兴分公司', '嘉兴分公司', '嘉兴分公司', '嘉兴分公司', '嘉兴分公司'];
	export default {
		data() {
			return {
				get_id: this.$route.params.id,
				isEdit: false,
				product: {
                    title: '',
                    detail: '',
                    description: '',
                    type: 10,
                    value: '',
                    min_buy_money: '',
                    max_buy_money: '',
                    begin_time: '',
                    end_time: '',
                    product_id: '',
                    get_passwd: '',
                    every_count: '',
                    out_count: '',
                    disabled: false,
                    left_count: ''
                },
				couponTypes: [{
		          value: 10,
		          label: '加息券'
		        }],
		        productNames: [{
		          value: '',
		          label: ''
		        }],
		    }
		},
		methods: {
			//新增
			addSubmit: function () {

			}
		},
		mounted() {
			if (this.$route.params.id) {
                console.log(this.$route.params.id)
                this.isEdit = true
            }
		}
	}

</script>

<style lang="scss" scoped>
	.el-row {
	    margin-bottom: 20px;
	    &:last-child {
	      margin-bottom: 0;
	    }
	  }
	  // .el-col {
	  //   border-radius: 4px;
	  // }
	  // .bg-purple-dark {
	  //   background: #99a9bf;
	  // }
	  // .bg-purple {
	  //   background: #d3dce6;
	  // }
	  // .bg-purple-light {
	  //   background: #e5e9f2;
	  // }
	  .grid-content {
	    border-radius: 4px;
	    min-height: 36px;
	  }
	  // .row-bg {
	  //   padding: 10px 0;
	  //   background-color: #f9fafc;
	  // }
</style>