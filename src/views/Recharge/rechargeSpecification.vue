<template>
	<section>
		<!--工具条-->
		<el-col :span="24" class="toolbar" style="padding-bottom: 0px;background: #fff">
			<el-form :inline="true" :model="filters">
				<el-form-item>
					<el-button type="primary" v-on:click="addshow">增加</el-button>
				</el-form-item>
			</el-form>
		</el-col>
		<!--列表-->
		<el-table :data="table" border highlight-current-row v-loading="listLoading" style="width: 100%;min-width: 1080px;">
			<el-table-column prop="id" label="序号">
			</el-table-column>
			<el-table-column prop="rechargeTypeName" label="充值类型">
			</el-table-column>
			<el-table-column prop="status" :formatter='formatterstatus' label="状态">
			</el-table-column>
			<el-table-column prop="isCommission" :formatter="formCommission" label="是否分佣">
			</el-table-column>
			<el-table-column prop="commissionRate" label="分佣比例%">
			</el-table-column>
			<el-table-column prop="ordinaryDiscount" label="普通会员折扣%">
			</el-table-column>
			<el-table-column prop="customerDiscount" label="创客折扣%">
			</el-table-column>
			<el-table-column prop="merchantDiscount" label="创客商折扣%">
			</el-table-column>
			<el-table-column prop="quota" label="限额/日">
			</el-table-column>
			<el-table-column prop="createTime" :formatter='formatterTime' label="创建时间">
			</el-table-column>
			<el-table-column prop="updateTime" :formatter='formatterTime' label="更新时间">
			</el-table-column>
			<el-table-column label="操作">
				<template scope="scope">
					<el-button type="text" size="small" @click="editBtn(scope.$index, scope.row)">修改</el-button>
					<el-button type="text" size="small" @click="statusBtn(scope.$index, scope.row)" v-if="scope.row.status === 0">启用</el-button>
					<el-button type="text" size="small" @click="statusBtn(scope.$index, scope.row)" v-if="scope.row.status === 1">禁用</el-button>
					<el-button type="text" size="small" @click="deleteBtn(scope.$index, scope.row)">删除</el-button>
				</template>
			</el-table-column>
		</el-table>
		<!--工具条-->
		<!-- <el-col :span="24" class="toolbar" style="background:#fff;">
			<el-pagination layout="prev, pager, next" @current-change="handleCurrentChange" :page-size="10" :total="total" style="float:right;">
			</el-pagination>
		</el-col> -->
		<!-- 充值类型添加 -->
		<el-dialog title="添加充值类型" v-model="addFormVisible" :close-on-click-modal="false" >
			<el-form :model="rechargeList" label-width="100px">
				<el-form-item label="充值类型">
					<el-select v-model="rechargeList.rechargeTypeId" placeholder="请选择">
					 	<el-option v-for="item in option"  :label="item.label" :value="item.value"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="是否分佣">
					 <el-select v-model="rechargeList.isCommission" placeholder="请选择">
					 	<el-option v-for="item in options"  :label="item.label" :value="item.value"></el-option>
					 </el-select>
				</el-form-item>
				<el-form-item label="分佣比例">
					<el-input v-model="rechargeList.commissionRate" type="text" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="普通会员折扣">
					<el-input v-model="rechargeList.ordinaryDiscount" type="text" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="创客折扣">
					<el-input v-model="rechargeList.customerDiscount" type="text" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="创客商折扣">
					<el-input v-model="rechargeList.merchantDiscount" type="text" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="限额/日">
					<el-input v-model="rechargeList.quota" type="text" auto-complete="off"></el-input>
				</el-form-item>
				<el-col :span='24'></el-col>
			</el-form>
			<div slot="footer" class="dialog-footer" style="text-align: center;">
				<el-button type="primary" @click.native="addSubmit" :loading="editLoading">确认</el-button>
				<el-button type="primary" @click.native="addFormVisible = false">取消</el-button>
			</div>
		</el-dialog>
		<!--编辑界面-->
		<el-dialog title="修改" v-model="editFormVisible" :close-on-click-modal="false" >
			<el-form :model="initeditForm" label-width="100px">
				<el-form-item label="充值类型">
					<el-select v-model="initeditForm.rechargeTypeName" placeholder="请选择">
					 	<el-option v-for="item in option"  :label="item.label" :value="item.value"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="是否分佣">
					 <el-select v-model="initeditForm.isCommission" placeholder="请选择">
					 	<el-option v-for="item in options"  :label="item.label" :value="item.value"></el-option>
					 </el-select>
				</el-form-item>
				<el-form-item label="分佣比例">
					<el-input v-model="initeditForm.commissionRate" type="text" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="普通会员折扣">
					<el-input v-model="initeditForm.ordinaryDiscount" type="text" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="创客折扣">
					<el-input v-model="initeditForm.customerDiscount" type="text" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="创客商折扣">
					<el-input v-model="initeditForm.merchantDiscount" type="text" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="限额/日">
					<el-input v-model="initeditForm.quota" type="text" auto-complete="off"></el-input>
				</el-form-item>
				<el-col :span='24'></el-col>
			</el-form>
			<div slot="footer" class="dialog-footer" style="text-align: center;">
				<el-button type="primary" @click.native="editSubmit" :loading="editLoading">保存</el-button>
				<el-button type="primary" @click.native="editFormVisible = false">关闭</el-button>
			</div>
		</el-dialog>
	</section>
</template>

<script>
	import { state } from '../../vuex/state'
	import util from '../../common/js/util'
	import {baseUrl , editUser, addUser } from '../../api/api';

	export default {
		data() {
			return {
				rechargeList:{
					rechargeTypeId:'',
					isCommission:'',
					commissionRate:'',
					ordinaryDiscount:'',
					customerDiscount:'',
					merchantDiscount:'',
					quota:''
				},
				//编辑界面数据
				editForm: {},
				initeditForm: {},
				startTime:'',
				endTime:'',
				addFormVisible: false,
				value:'',
				value1:'',
				value2:'',
				selectSubjectStatus: [
				{
					value:'0',
					label:'全部'
				},{
					value:'1',
					label:'微信支付'
				},{
					value:'2',
					label:'余额支付'
				},{
					value:'3',
					label:'支付宝支付'
				},{
					value:'4',
					label:'微信APP支付'
				},{
					value:'5',
					label:'退货'
				},{
					value:'6',
					label:'扫码付'
				}],
				option:[],
				options: [{
		          value: '0',
		          label: '否'
		        }, {
		          value: '1',
		          label: '是'
		        }],
				filters: {
					name: '',
					status:'',
					type:''
				},
				users: [],
				total: 0,
				page: 1,
				listLoading: false,
				sels: [],//列表选中列

				editFormVisible: false,//编辑界面是否显示
				editLoading: false,
				addFormVisible: false,//新增界面是否显示
				addLoading: false,
				//新增界面数据
				orderDetails: {
				},
				table:[]
			}
		},
		methods: {
			getlist(){
				const _this = this
				const params = {
				}
				console.log(params)
				$.ajax({
	                type:'POST',
	                dataType:'json',
	                url:baseUrl+"/api/rechargeConfig/selectList",
	                data:JSON.stringify(params),
	                contentType:'application/json;charset=utf-8',
	                success:function(data){
	                  	console.log(data)
	                 	_this.table = data.data
	                 	console.log(_this.table)
	                }
	            });
			},
			addshow() {
				this.getBox()
				this.addFormVisible = true
			},
			// 获取充值类型下拉列表
			getBox() {
				const _this = this
				const params = {}
				_this.option = []
				$.ajax({
	                type:'POST',
	                dataType:'json',
	                url:baseUrl+"/api/rechargeConfig/getBox",
	                data:JSON.stringify(params),
	                contentType:'application/json;charset=utf-8',
	                success:function(data){
	                  	console.log(data)
	                  	const info = data.data
	                  	for(var i = 0;i<info.length;i++){
	                  		const obj ={}
	                  		obj.value = info[i].id
		          			obj.label = info[i].name
		          			_this.option.push(obj)
	                  	}
	                  	  	
	                }
	            });
			},
			//添加商品
			addSubmit() {
				console.log(this.rechargeList)
				const _this = this
				$.ajax({
	                type:'POST',
	                dataType:'json',
	                url:baseUrl+"/api/rechargeConfig/add",
	                data:JSON.stringify(this.rechargeList),
	                contentType:'application/json;charset=utf-8',
	                success:function(data){
	                  	console.log(data)
	                  	if(data.code === 1){
	                  		_this.addFormVisible = false
	                  		_this.getlist()
	                  		alert(data.msg)
	                  	}else{
							alert(data.msg)
							_this.addFormVisible = false
	                  	}
	                  	
	                }
	            });
			},
			//删除
			deleteBtn: function (index, row) {
				const _this = this
				const params = {
					id:row.id
				}
				console.log(row)
				this.$confirm('确认删除该记录吗?', '提示', {
					type: 'warning'
				}).then(() => {
					$.ajax({
		                type:'POST',
		                dataType:'json',
		                url:baseUrl+"/api/rechargeConfig/delete/one",
		                data:JSON.stringify(params),
		                contentType:'application/json;charset=utf-8',
		                success:function(data){
		                  	console.log(data)
		                  	if(data.code === 1){
		                  		_this.getlist()
		                  		// alert(data.msg)
		                  	}else{
								alert(data.msg)
		                  	}
		                }
		            });
				}).catch(() => {

				});
			},
			//状态修改
			statusBtn(index, row) {
				const _this = this
				const params = {
					id:row.id
				}
				let url = ''
				if(row.status === 1){
					url = '/api/rechargeConfig/disable'
				}else if(row.status === 0) {
					url = '/api/rechargeConfig/enable'
				}
				$.ajax({
	                type:'POST',
	                dataType:'json',
	                url:baseUrl+url,
	                data:JSON.stringify(params),
	                contentType:'application/json;charset=utf-8',
	                success:function(data){
	                  	console.log(data)
	                  	if(data.code === 1){
	                  		_this.getlist()
	                  		// alert(data.msg)
	                  	}else{
							alert(data.msg)
	                  	}
	                }
	            });
			},
			//显示编辑界面
			editBtn: function (index, row) {
				this.initeditForm = []
				this.editFormVisible = true;
				this.getBox()
				// console.log(row)
				this.initeditForm = row
				this.initeditForm.isCommission = this.initeditForm.isCommission.toString()
				// console.log(row)
			},
			//确认修改
			editSubmit: function () {
				const _this = this
				$.ajax({
	                type:'POST',
	                dataType:'json',
	                url:baseUrl+'/api/rechargeConfig/update',
	                data:JSON.stringify(this.initeditForm),
	                contentType:'application/json;charset=utf-8',
	                success:function(data){
	                  	console.log(data)
	                  	if(data.code === 1){
	                  		_this.getlist()
	                  		// alert(data.msg)
	                  		_this.editFormVisible = false
	                  	}else{
							alert(data.msg)
	                  	}
	                }
	            });
			},
			formatterTime(row,column){
                let curTime = row.createTime;
                curTime = new Date(curTime).toLocaleString()
                return curTime
            },
            formatterstatus(row,column){
            	let status = row.status;
            	if(status === 0){
            		status = '禁用'
            	}else if(status ===1){
            		status = '启用'
            	}
                return status
            },
            formCommission(row,column){
            	let comm = row.isCommission;
            	if(comm === 0){
            		comm = '否'
            	}else if(comm ===1){
            		comm = '是'
            	}
                return comm
            },
			handleCurrentChange(val) {
				this.page = val;
				this.getUsers();
			},
			
			selsChange: function (sels) {
				this.sels = sels;
			},
			//批量删除
			batchRemove: function () {
				var ids = this.sels.map(item => item.id).toString();
				this.$confirm('确认删除选中记录吗？', '提示', {
					type: 'warning'
				}).then(() => {
					this.listLoading = true;
					//NProgress.start();
					let para = { ids: ids };
					batchRemoveUser(para).then((res) => {
						this.listLoading = false;
						//NProgress.done();
						this.$message({
							message: '删除成功',
							type: 'success'
						});
						this.getUsers();
					});
				}).catch(() => {

				});
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