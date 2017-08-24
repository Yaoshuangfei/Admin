<template>
	<section>
		<!--工具条-->
		<el-col :span="24" class="toolbar" style="padding-bottom: 0px;background: #fff;">
			<el-form :inline="true">
				<el-form-item>
					<el-button  type="primary" @click="getAdminlist">超台记录</el-button>
					<el-button  type="primary" @click="getlist">商台记录</el-button>
				</el-form-item>
			</el-form>
		</el-col>

		<!--超台列表-->
		<el-table v-show="admin" :data="orderInformation" border highlight-current-row v-loading="listLoading" style="width: 100%;min-width: 1080px;">
			<el-table-column type="index" label="序号" >
			</el-table-column>
			<el-table-column prop="userName" label="操作人账户" width="200px;">
			</el-table-column>
			<el-table-column prop="remark" label="操作记录" width="800px;">
			</el-table-column>
			<el-table-column prop="reasons" label="操作原因" width="293px;">
			</el-table-column>
			<el-table-column prop="createTime" :formatter='formatterTime' label="创建时间" width="200px;">
			</el-table-column>
			<el-table-column prop="storeName" label="操作平台" width="100px;">
			</el-table-column>
		</el-table>
		<!--超台工具条-->
		<el-col v-show="admin" :span="24" class="toolbar" style="background:#fff;">
			<el-pagination layout="prev, pager, next" @current-change="handleCurrentChange" :page-size="20" :total="total" style="float:right;">
			</el-pagination>
		</el-col>
		<!--商户列表-->
		<el-table v-show="shanghu" :data="table" border highlight-current-row v-loading="listLoading" style="width: 100%;min-width: 1080px;">
			<el-table-column type="index" label="序号" >
			</el-table-column>
			<el-table-column prop="userName" label="操作人账户" width="150px;">
			</el-table-column>
			<el-table-column prop="nickName" label="操作人昵称" width="150px;">
			</el-table-column>
			<el-table-column prop="realName" label="操作人姓名" width="150px;">
			</el-table-column>
			<el-table-column prop="remark" label="操作记录" width="693px;">
			</el-table-column>
			<el-table-column prop="reasons" label="操作原因" width="150px;">
			</el-table-column>
			<el-table-column prop="createTime" :formatter='formatterTime' label="创建时间" width="200px;">
			</el-table-column>
			<el-table-column prop="storeName" label="操作平台" width="100px;">
			</el-table-column>
		</el-table>
		<!--商户工具条-->
		<el-col v-show="shanghu" :span="24" class="toolbar" style="background:#fff;">
			<el-pagination layout="prev, pager, next" @current-change="handleCurrentChange1" :page-size="20" :total="total1" style="float:right;">
			</el-pagination>
		</el-col>
	</section>
</template>

<script>
	import { state } from '../../vuex/state'
	import util from '../../common/js/util'
	import {baseUrl , editUser, addUser } from '../../api/api';

	export default {
		data() {
			return {
				total: 0,
				page: 1,
				total1: 0,
				page1: 1,
				listLoading: false,
				orderInformation:[],
				table:[],
				admin:true,
				shanghu:false
			}
		},
		methods: {
			getAdminlist(){
				const _this = this
				this.admin = true
				this.shanghu = false
				this.listLoading = true
				const params={
                    pageNum:this.page,
                    size:20
                }
                $.ajax({
                    type:'POST',
                    dataType:'json',
                    url:baseUrl+"/api/operationRecord/find/platform",
                    data:JSON.stringify(params),
                    contentType:'application/json;charset=utf-8',
                    success:function(data){
                        console.log(data)
                        const info = data.data
                        _this.total = info.total
                        _this.orderInformation = info.list
                        _this.listLoading = false
                    }
                })
			},
			getlist(){
				const _this = this
				this.admin = false
				this.shanghu = true
				this.listLoading = true
				const params={
                    pageNum:this.page1,
                    size:20
                }
                $.ajax({
                    type:'POST',
                    dataType:'json',
                    url:baseUrl+"/api/operationRecord/find/store",
                    data:JSON.stringify(params),
                    contentType:'application/json;charset=utf-8',
                    success:function(data){
                        console.log(data)
                        const info = data.data
                        _this.total1 = info.total
                        _this.table = info.list
                        _this.listLoading = false
                    }
                })
			},
			handleCurrentChange(val) {
				this.page = val
				this.getAdminlist()
			},
			handleCurrentChange1(val) {
				this.page1 = val
				this.getlist()
			},
			formatterTime(row,column){
                let curTime = row.createTime
                curTime = new Date(curTime).toLocaleString()
                return curTime
            }
		},
		mounted() {
			this.getAdminlist();
		}
	}

</script>

<style>
	.el-dialog--small {
    	width: 25%;
    	border-radius: 10px
	}	
</style>