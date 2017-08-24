<template>
	<section>
		<!--工具条-->
		<el-col :span="24" class="toolbar" style="padding-bottom: 0px;background: #fff;">
			<el-form :inline="true">
				<el-form-item>
					<el-button  type="primary" >超台记录</el-button>
					<el-button  type="primary" >商台记录</el-button>
				</el-form-item>
			</el-form>
		</el-col>

		<!--列表-->
		<el-table :data="orderInformation" border highlight-current-row v-loading="listLoading" style="width: 100%;min-width: 1080px;">
			<el-table-column type="index" label="序号" >
			</el-table-column>
			<el-table-column prop="noticeTitle" label="操作人" >
			</el-table-column>
			<el-table-column prop="noticeTitle" label="操作平台" >
			</el-table-column>
			<el-table-column prop="noticeTitle" label="所属用户" >
			</el-table-column>
			<el-table-column prop="noticeTitle" label="操作记录" >
			</el-table-column>
			<el-table-column prop="noticeTitle" label="操作原因" >
			</el-table-column>
			<el-table-column prop="noticeCreateTime" :formatter='formatterTime' label="创建时间" >
			</el-table-column>
			<!-- <el-table-column label="操作">
				<template scope="scope">
					<router-link :to="{ name: '系统推送查看' ,params: { id: scope.row.noticeId }}"   style="margin: 0 10px;">
						<el-button  type="text" size="small">查看</el-button>
					</router-link>
					<el-button type="text" size="small" @click="handleDel(scope.$index , scope.row)">删除</el-button>
				</template>
			</el-table-column> -->
		</el-table>

		<!--工具条-->
		<el-col :span="24" class="toolbar" style="background:#fff;">
			<el-pagination layout="prev, pager, next" @current-change="handleCurrentChange" :page-size="20" :total="total" style="float:right;">
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
				listLoading: false,
				orderInformation:[]
			}
		},
		methods: {
			getlist(){
				const _this = this
				const params={
                    pageNum:this.page,
                    size:20
                }
                $.ajax({
                    type:'POST',
                    dataType:'json',
                    url:baseUrl+"/api/notice/selectListSys",
                    data:JSON.stringify(params),
                    contentType:'application/json;charset=utf-8',
                    success:function(data){
                        console.log(data)
                        const info = data.data
                        _this.total = info.total
                        _this.orderInformation = info.list
                    }
                })
			},
			handleCurrentChange(val) {
				this.page = val
				this.getlist()
			},
			formatterTime(row,column){
                let curTime = row.noticeCreateTime
                curTime = new Date(curTime).toLocaleString()
                return curTime
            }
		},
		mounted() {
			this.getlist();
		}
	}

</script>

<style>
	.el-dialog--small {
    	width: 25%;
    	border-radius: 10px
	}	
</style>