<template>
	<section>
		<!--工具条-->
		<el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
			<el-form :inline="true" :model="filters">
				<el-form-item>
					<el-input v-model="filters.contractNo" placeholder="合同号"></el-input>
				</el-form-item>
				<el-form-item>
					<el-input v-model="filters.mobilePhone" placeholder="手机号码"></el-input>
				</el-form-item>
				<el-form-item>
					<el-input v-model="filters.borrowerName" placeholder="姓名"></el-input>
				</el-form-item>
				<el-select v-model="filters.subjectPlatformId" clearable placeholder="请选择标的使用去向">
			      <el-option v-for="item in subjectPlatformList" :label="item.platform" :value="item.platformId">
			      </el-option>
			    </el-select>
			    <el-select v-model="filters.state" clearable placeholder="请选择标的状态">
			      <el-option v-for="item in selectSubjectStatus" :label="item.label" :value="item.value">
			      </el-option>
			    </el-select>
				<el-form-item>
					<el-button type="primary" v-on:click="getList">查询</el-button>
				</el-form-item>
			</el-form>
		</el-col>

		<!--列表-->
		<el-table :data="checkSubject" border highlight-current-row v-loading="listLoading" style="width: 100%;">
			<el-table-column prop="id" label="序号" width="150" >
			</el-table-column>
			<el-table-column prop="contractNo" label="合同号" width="150" >
			</el-table-column>
			<el-table-column prop="mobilePhone" label="借款人手机" width="125">
			</el-table-column>
			<el-table-column prop="borrowerName" label="真实姓名" width="120">
			</el-table-column>
			<el-table-column prop="idCard" label="借款人身份证" width="120">
			</el-table-column>
			<el-table-column prop="address" label="借款人地址" width="250">
			</el-table-column>
			<el-table-column prop="price" label="借款金额" width="120">
			</el-table-column>
			<el-table-column prop="instalmentDays" label="借款天数" width="100">
			</el-table-column>
			<el-table-column prop="repaymentTheWay" label="还款方式" width="100">
			</el-table-column>
			<el-table-column prop="payTime" :formatter = "formatter" label="放款时间" width="150">
			</el-table-column>
			<el-table-column prop="subjectPlatform" label="使用去向" width="150">
			</el-table-column>
			<el-table-column label="操作">
				<template scope="scope">
					<router-link class="routerColor" :to="{ name: '查看已审核标的', params: { borrowId: scope.row.id, subjectId: ':subjectId', checked: ':checked' }}" >查看</router-link>
				</template>
			</el-table-column>
		</el-table>

		<!--工具条-->
		<el-col :span="24" class="toolbar">
			<el-pagination layout="prev, pager, next" @current-change="handleCurrentChange" :page-size="pageSize" :total="total" style="float:right;">
			</el-pagination>
		</el-col>
	</section>
</template>

<script>
	import util from '../../common/js/util';
	//import NProgress from 'nprogress'
	import { getUserListPage, removeUser, batchRemoveUser, editUser, addUser, baseUrl } from '../../api/api';
	import { state } from '../../vuex/state'
	export default {
		// vuex: {
		// 	getters: {
  //       	},
  //           actions: {
  //           }
  //       },
		data() {
			return {
				filters: {
					contractNo: '',
					borrowerName: '',
					mobilePhone: '',
					subjectPlatformId: '',
					state: ''
				},
				total: 0,
				page: 1,
				pageSize: 10,
				listLoading: false,
				checkSubject: [],
				subjectPlatformList: [],
				selectSubjectStatus: [{
				// 	value:'',
				// 	label:'请选择标的状态'
				// },{
					value:'1',
					label:'已通过'
				},{
					value:'-1',
					label:'未通过'
				}]
			}
		},
		methods: {
			// 时间格式转换
			formatter(row,column){
				const curTime = row[column.property];
				if(curTime === null || curTime === '') {
					return null
				}
				return new Date(parseInt(curTime)).toLocaleString();
			},
			// 分页请求
			handleCurrentChange(val) {
				this.page = val;
				this.getList();
			},
			// 标的发布渠道
			getSubjectPlatformList() {
				this.listLoading = true
		        let that = this
	         	$.post(baseUrl+"/admin/borrow/getSubjectPlatformList",
		            function(data){
		              	const info = JSON.parse(eval('(' + data + ')'));
		              	console.log(info)
	                	that.subjectPlatformList = info
		            }
		       );
	         	that.listLoading = false
         	},
			//请求待审核标的列表
			getList() {
				this.listLoading = true
		        const params = {
		        	accountId: '111',
		        	accessToken: '111',
		            page: {
		              pageSize: this.pageSize,
		              pageNum: this.page
		            },
		            borrow: {
		            	contractNo: this.filters.contractNo,
		            	borrowerName: this.filters.borrowerName,
		            	mobilePhone: this.filters.mobilePhone,
		            	state: parseInt(this.filters.state),
						subjectPlatformId: parseInt(this.filters.subjectPlatformId)
		            }
		        }
		        console.log(baseUrl+"/admin/borrow/getList")
		        let that = this
	         	$.post(baseUrl+"/admin/borrow/getList",
		            { param: JSON.stringify(params) },function(data){
		            	// console.log(data)
		              	const info = JSON.parse(eval('(' + data + ')'));
		              	console.log(info)
		              	if(info.res === state.HTTPCODE.SUCCEED){
		                	console.log(info.obj.results)
		                	that.checkSubject = info.obj.results
		                	that.page = info.obj.pageNum
		                	that.total = info.obj.totalRecord
		                	that.pageSize = info.obj.pageSize
		                	// console.log(_this.table)
		              	}else if(info.res === state.HTTPCODE.LOGINFAIL){
		                	that.$message({
		                		message: info.resMsg,
		                		type: 'error'
		                	});
		              	}else if(info.res === state.HTTPCODE.FAIL){
		              		that.$message({
		              			message: info.resMsg,
		              			type: 'error'
		              		});
		              	}
		            }
		       );
	         	that.listLoading = false
         	}
		},
		mounted() {
			this.getSubjectPlatformList()
			this.getList();
		}
	}

</script>

<style scoped>
	.routerColor{
		color: #20a0ff;
		text-decoration: none;
	}
</style>