<template>
	<section>
		<el-row :gutter="20">
		  	<el-col :xs="24" :md="12">
		  		<label>产品名称:</label>
		  		<el-input v-model="product.title" placeholder=""></el-input>
	  		</el-col>
		  	<el-col :xs="24" :md="12">
		  		<label>列表状态右侧标签内容:</label>
		  		<el-input v-model="product.rightTag" placeholder=""></el-input>
	  		</el-col>
		</el-row>
		<el-row :gutter="20">
			<el-col :xs="24" :md="12">
		  		<label>产品分类:</label>
		  		<el-select v-model="product.category" placeholder="请选择">
		  		    <el-option
		  		      v-for="item in categorylist"
		  		      :label="item.label"
		  		      :value="item.value">
		  		    </el-option>
		  		</el-select>
	  		</el-col>
	  		<el-col :xs="24" :md="12">
		  		<label>图标URL:</label>
		  		<el-input v-model="product.iconUrl" placeholder=""></el-input>
	  		</el-col>
		</el-row>
		<el-row :gutter="20">
	  		<el-col :xs="24" :md="12">
		  		<label>产品密码:</label>
		  		<el-input v-model="product.fpPassword" placeholder=""></el-input>
	  		</el-col>
	  		<el-col :xs="24" :md="12">
		  		<label>合同模板:</label>
		  		<el-select v-model="product.contractTypeId" placeholder="请选择">
		  		    <el-option
		  		      v-for="item in contractTypeIdlist"
		  		      :label="item.label"
		  		      :value="item.value">
		  		    </el-option>
		  		</el-select>
	  		</el-col>
		</el-row>
		<el-row :gutter="20">
		  	<el-col :xs="24" :md="12">
		  		<label>预期的年化收益:</label>
		  		<el-input type='number' v-model="product.expectedAnnualRate" placeholder=""></el-input>
	  		</el-col>
		  	<el-col :xs="24" :md="12">
		  		<label>活动加的年华收益:</label>
		  		<el-input type='number' v-model="product.addAnnualRate" placeholder=""></el-input>
	  		</el-col>
		</el-row>
		<el-row :gutter="20">
		  	<el-col :xs="24" :md="12">
		  		<label>每人购买上限金额, 0无上限:</label>
		  		<el-input type='number' v-model="product.purchaseLimitPerPeople" placeholder=""></el-input>
	  		</el-col>
		  	<el-col :xs="24" :md="12">
		  		<label>每人购买上限次数,0无上限:</label>
		  		<el-input type='number' v-model="product.purchaseLimitCount" placeholder=""></el-input>
	  		</el-col>
		</el-row>
		<el-row :gutter="20">
		  	<el-col :xs="24" :md="12">
		  		<label>起购金额最低,0不限制:</label>
		  		<el-input type='number' v-model="product.purchaseMinAmount" placeholder=""></el-input>
	  		</el-col>
		  	<el-col :xs="24" :md="12">
		  		<label>起购金额最高,0不限制:</label>
		  		<el-input type='number' v-model="product.purchaseMaxAmount" placeholder=""></el-input>
	  		</el-col>
		</el-row>
		<el-row :gutter="20">
		  	<el-col :xs="24" :md="12">
		  		<label>理财期限（天）:</label>
		  		<el-input type='number' v-model="product.timeLimit" placeholder=""></el-input>
	  		</el-col>
		  	<el-col :xs="24" :md="12">
		  		<label>还款方式:</label>
		  		<el-select v-model="product.repaymentId" placeholder="请选择">
		  		    <el-option
		  		      v-for="item in repaymentIdlist"
		  		      :label="item.label"
		  		      :value="item.value">
		  		    </el-option>
		  		</el-select>
	  		</el-col>
		</el-row>
		<el-row :gutter="20">
	  	<el-col :xs="24" :md="12">
	  		<label>计息方式:</label>
	  		<el-select v-model="product.bearingTheWayId" placeholder="请选择">
	  		    <el-option
	  		      v-for="item in bearingTheWayIdlist"
	  		      :label="item.label"
	  		      :value="item.value">
	  		    </el-option>
	  		</el-select>
  		</el-col>
		  	<el-col :xs="24" :md="12">
		  		<label>融资金额:</label>
		  		<el-input type='number' v-model="product.financingAmount" placeholder=""></el-input>
	  		</el-col>
		</el-row>
		<el-row :gutter="20">
		  	<el-col :xs="24" :md="12">
		  		<label>产品系数:</label>
		  		<el-input type='number' v-model="product.productModulus" placeholder=""></el-input>
	  		</el-col>
	  		<el-col :xs="24" :md="12">
	  			<el-checkbox v-model="enableContinueBid">是否缓存</el-checkbox>
	  		</el-col>
	  		<el-col :xs="24" :md="12">
	  			<el-checkbox v-model="isNewer">是否新手</el-checkbox>
	  		</el-col>
		</el-row>
		<el-row>
			<el-col :xs="24">
				<label>选择可销售地区:</label>
				<el-checkbox-group class="checkbox-style" v-model="checkList">
				    <el-checkbox class="check-style" v-for="package in packages" :label="package">{{package}}</el-checkbox>
				 </el-checkbox-group>
			</el-col>
		</el-row>
		<div slot="footer" class="dialog-footer">
			<el-button type="primary" @click="addSubmit" v-if="isEdit === false">保存</el-button>
			<el-button type="primary" @click="addSubmit" v-else>保存修改</el-button>
			<el-button type="primary" @click="addSubmit" v-if="isEdit === true">售罄</el-button>
			<el-button type="primary" @click="addSubmit" v-if="isEdit === true">关闭</el-button>
			<el-button type="primary" @click="addSubmit" v-if="isEdit === true">删除</el-button>

			<!-- <el-button @click.native="editFormVisible = false">取消</el-button>
			<el-button type="primary" @click.native="editSubmit" :loading="editLoading">提交</el-button> -->
		</div>

	</section>
</template>

<script>
	import { state } from '../../vuex/state'
	import util from '../../common/js/util'
	import { baseUrl , editUser, addUser } from '../../api/api';
	const cityOptions = ['嘉兴分公司', '嘉兴分公司', '嘉兴分公司', '嘉兴分公司', '嘉兴分公司', '嘉兴分公司', '嘉兴分公司', '嘉兴分公司'];
	const packageOptions = ['红包理财券', '嘉兴分公司', '嘉兴分公司', '嘉兴分公司', '嘉兴分公司', '嘉兴分公司'];
	export default {
		data() {
			return {
				isEdit: false,
				enableContinueBid:false,
				isNewer:false,
				product: {
					title: '',
					rightTag: '',
					category: '',
					iconUrl: '',
					fpPassword: '',
					contractTypeId: '',
					repaymentId:'',
					expectedAnnualRate: '',
					addAnnualRate: '',
					purchaseLimitPerPeople:'',
					purchaseLimitCount: '',
					purchaseMinAmount: '',
					purchaseMaxAmount: '',
					timeLimit: '',
					bearingTheWayId: '',
					financingAmount: '',
					productModulus: ''
				},
				categorylist:[{
		          value: 1,
		          label: '聚财宝'
		        },{
		          value: 2,
		          label: '月息通'
		        }],
				contractTypeIdlist:[{
		          value: 1,
		          label: '线下理财V1'
		        }],
				bearingTheWayIdlist:[{
		          value: 1,
		          label: '次日计息'
		        }],
				repaymentIdlist:[{
		          value: 1,
		          label: '一次性到期还本付息到余额'
		        },{
		          value: 2,
		          label: '每月还息到期还本'
		        },{
		          value: 3,
		          label: '等额每月还本还息'
		        }],
		        checkList: [],
				packages: packageOptions
		    }
		},
		methods: {
			//新增
			addSubmit: function () {
				const _this = this
				let enableContinueBid
				let isNewer
				if(_this.enableContinueBid === true){
						enableContinueBid = 1
				}else{
						enableContinueBid = 0
				}
				if(_this.isNewer === true){
						isNewer = 1
				}else{
						isNewer = 0
				}

				const params = {
					accountId:'1',
					accessToken:'1',
					resourcesType:'',
					financialProduct: {
						title: _this.product.title,
						rightTag:_this.product.rightTag,
						category: _this.product.category,
						iconUrl: _this.product.iconUrl,
						fpPassword:_this.product.fpPassword,
						contractTypeId: _this.product.contractTypeId,
						expectedAnnualRate: _this.product.expectedAnnualRate,
						addAnnualRate:_this.product.addAnnualRate,
						purchaseLimitPerPeople:_this.product.purchaseLimitPerPeople,
						purchaseLimitCount:_this.product.purchaseLimitCount,
						purchaseMinAmount:_this.product.purchaseMinAmount,
						purchaseMaxAmount:_this.product.purchaseMaxAmount,
						timeLimit: _this.product.timeLimit,
						repaymentId:_this.product.repaymentId,
						bearingTheWayId: _this.product.bearingTheWayId,
						financingAmount:_this.product.financingAmount,
						productModulus:_this.product.productModulus,
						enableContinueBid:enableContinueBid,
						isNewer:isNewer
					}
				}
				console.log(params)
				$.post(baseUrl+"/admin/financialProduct/save",
	             { param: JSON.stringify(params) },
	             function(data){
	             	const info = eval('(' + data + ')');
	                const response = JSON.parse(info);
	                console.log(response)
	              }
	         	)
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