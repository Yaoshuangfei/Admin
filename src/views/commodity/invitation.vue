<template>
	<section>
		<!--工具条-->
		<el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
			<el-form :inline="true" :model="filters">
				<el-form-item>
					<el-input v-model="filters.name" placeholder="商品名称"></el-input>
				</el-form-item>
			</el-form>
		</el-col>

		<el-col :span="4">
			<el-tree :data="MenuData" check-strictly  @node-click="handleNodeClick" :expand-on-click-node="false" node-key="id" ref="tree" highlight-current  style="border: none">
			</el-tree>
		</el-col>
		<!--列表-->
		<el-col :span="20">
			<el-table :data="table" border highlight-current-row v-loading="listLoading" style="width: 100%;min-width: 1080px;">
				<el-table-column type="index" label="序号">
				</el-table-column>
				<el-table-column prop="storeName" label="店铺名">
				</el-table-column>
				<el-table-column prop="seller.nickName" label="用户名">
				</el-table-column>
				<el-table-column prop="seller.mobile" label="手机号">
				</el-table-column>
				<el-table-column prop="name" label="商品名称">
				</el-table-column>
				<el-table-column prop="catName" label="分类">
				</el-table-column>
				<el-table-column prop="price" label="售价">
				</el-table-column>
				<el-table-column prop="totalSalesNum" label="销售数量">
				</el-table-column>
				<el-table-column prop="saleStatus" :formatter='statusFun' label="状态">
				</el-table-column>
				<el-table-column label="操作">
					<template scope="scope">
						<!-- <el-button type="text" size="small">查看</el-button> -->
						<el-button type="text" size="small" @click="deleteBtn(scope.row)">下架</el-button>
						<el-button type="text" size="small" @click="violationBtn(scope.row)">违规</el-button>
					</template>
				</el-table-column>
			</el-table>
		</el-col>
		<!--工具条-->
		<el-col :span="24" class="toolbar">
			<el-pagination layout="prev, pager, next" @current-change="handleCurrentChange" :page-size="20" :total="total" style="float:right;">
			</el-pagination>
		</el-col>

		<!--编辑界面-->
		<el-dialog title="违规处理" v-model="violation" :close-on-click-modal="false">
			<el-form :model="editForm" label-width="120px" label-position="left">
				<el-form-item label="商品名称">
					<div>{{editForm.name}}</div>
				</el-form-item>
				<el-form-item label="用户名">
					<div>{{editForm.seller.nickName}}</div>
				</el-form-item>
				<el-form-item label="商品上架时间">
					<div>{{new Date(editForm.shelfTime).toLocaleString()}}</div>
				</el-form-item>
				<el-form-item label="违规原因">
					<el-input type="textarea" v-model="editForm.content"></el-input>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click.native="violation = false">取消</el-button>
				<el-button type="primary" @click.native="violationSubmit">确认</el-button>
			</div>
		</el-dialog>
	</section>
</template>

<script>
	import { state } from '../../vuex/state'
	import util from '../../common/js/util'
	import {baseUrl  } from '../../api/api';

	export default {
		data() {
			return {
				violation:false,//显示违规页面
				MenuData:[],//菜单树数据
				filters: {
					name: ''
				},
				total: 0,
				page: 1,
				listLoading: false,
				//编辑违规数据
				editForm: {
					name:'',
					seller:{
						nickName:''
					},
					shelfTime:''
				},
				table:[],//商品数据
				soltParams:{}//保留分页查询数据
			}
		},
		methods: {
			//查看违规
			violationBtn(row){
				console.log(row)
				this.violation = true
				this.editForm = row
			},
			//提交违规操作
			violationSubmit(){
				const _this = this
				const params = {
					storeId: this.editForm.storeId,
					goodsId: this.editForm.id,
					content: this.editForm.content
				}

				$.ajax({
                    type:'POST',
                    dataType:'json',
                    url:baseUrl+"/api/goodsViolationsRecord/add",
                    data:JSON.stringify(params),
                    contentType:'application/json;charset=utf-8',
                    success:function(data){
                    	console.log(data)
                    	_this.getGoodsList()
                    	_this.this.violation = false
                    }
                })
			},
			// 下架
			deleteBtn(row){
				const _this = this
				console.log(row)
				const params = {
					id: row.id,
					saleStatus: 2
				}
				$.ajax({
                    type:'POST',
                    dataType:'json',
                    url:baseUrl+"/api/goods/updateStatus",
                    data:JSON.stringify(params),
                    contentType:'application/json;charset=utf-8',
                    success:function(data){
                    	console.log(data)
                    	_this.getGoodsList()
                    }
                })
			},
			// 获取标签id及查询商品
			handleNodeClick(data) {
				console.log(data)
				const _this = this
				const params = {
					pageNum:this.page,
					size:10,
					catId:data.id
				}
				this.soltParams = params
				$.ajax({
                    type:'POST',
                    dataType:'json',
                    url:baseUrl+"/api/goods/selectListOfSeller",
                    data:JSON.stringify(params),
                    contentType:'application/json;charset=utf-8',
                    success:function(data){
                    	const info = data.data.list
                    	console.log(data)
                    	_this.table = info
                    	_this.total = data.data.total
                    }
                })
	        },
	        // 分页查询
	        handleCurrentChange(val) {
				this.page = val;
				this.getGoodsList();
			},
			// 分页查询执行函数
	        getGoodsList(){
				const _this = this
				const params = this.soltParams
				params.pageNum = this.page
				$.ajax({
                    type:'POST',
                    dataType:'json',
                    url:baseUrl+"/api/goods/selectListOfSeller",
                    data:JSON.stringify(params),
                    contentType:'application/json;charset=utf-8',
                    success:function(data){
                    	const info = data.data.list
                    	console.log(data)
                    	_this.table = info
                    	_this.total = data.data.total
                    }
                })
	        },
			//获取标签列表
			getLeftLIst() {
				const _this = this
				_this.MenuData = []
				const params = {
					pageNum:1,
					size:100,
					name:''
				}
				$.ajax({
                    type:'POST',
                    dataType:'json',
                    url:baseUrl+"/api/goodsClass/selectListPC",
                    data:JSON.stringify(params),
                    contentType:'application/json;charset=utf-8',
                    success:function(data){
                    	const info = data.data.list
                    	const arry = []
                    	for (var i = 0; i < info.length; i++) {
                    		if(info[i].hierarchy === 1){
	                    		const obj = {}
	                			obj.id = info[i].id
	                			obj.label = info[i].name
	                    		_this.initChildren(info[i].id,info,obj)
                    			arry.push(obj)
                    		}
                    	}
                    	_this.MenuData = arry
                    }
                })
			},
			// 递归
			initChildren(id,row,obj){
				for (var x = 0; x < row.length; x++) {
        			if(id === row[x].pid){
        				obj.children = []
        				const objchi = {}
        				objchi.id = row[x].id
        				objchi.label = row[x].name
        				this.initChildren(row[x].id,row,objchi)
        				obj.children.push(objchi)
        			}
        		}
			},
			// 初始化状态
			statusFun (row, column) {
				if(row.saleStatus === 1){
					return '销售中'
				}else if(row.saleStatus === 2){
					return '已下架'
				}else if(row.saleStatus === 3){
					return '已删除'
				}
			}
		},
		mounted() {
			this.getLeftLIst();
		}
	}

</script>

<style scoped>

</style>