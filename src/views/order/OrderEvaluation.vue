<template>
	<section>
		<!--工具条-->
		<el-col :span="24" class="toolbar" style="padding-bottom: 0px;background: #fff">
			<el-form :inline="true" :model="filters">
				<el-form-item label="搜索类型">
				    <el-select v-model="filters.type" clearable>
				      <el-option v-for="item in options" :label="item.label" :value="item.value">
				      </el-option>
				    </el-select>
				</el-form-item>
				<el-form-item>
				    <el-input v-model="filters.name"></el-input>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" v-on:click="getlist">查询</el-button>
				</el-form-item>
			</el-form>
		</el-col>

		<!--列表-->
		<el-table :data="orderEvaluate" border highlight-current-row v-loading="listLoading" style="width: 100%;min-width: 1080px;">
			<el-table-column prop="orderId" label="订单号">
			</el-table-column>
			<el-table-column prop="orderGoods.productName" label="商品名">
			</el-table-column>
			<el-table-column prop="coreUser.nickName" label="用户名">
			</el-table-column>
			<el-table-column prop="orderGoods.orderStatus" :formatter='formatterStatus' label="订单状态">
			</el-table-column>
			<el-table-column prop="orderMall.payMethod" :formatter='formatterType' label="支付方式">
			</el-table-column>
			<el-table-column prop="createTime" :formatter='formatterTime' label="评价时间">
			</el-table-column>
			<el-table-column prop="content" label="评价">
			</el-table-column>
			<el-table-column label="操作">
				<template scope="scope">
					<el-button type="text" size="small" @click="handleDelete(scope.row)">删除</el-button>
				</template>
			</el-table-column>
		</el-table>

		<!--工具条-->
		<el-col :span="24" class="toolbar" style="background:#fff;">
			<!-- <el-button type="danger" @click="batchRemove" :disabled="this.sels.length===0">批量删除</el-button> -->
			<el-pagination layout="prev, pager, next" @current-change="handleCurrentChange" :page-size="10" :total="total" style="float:right;">
			</el-pagination>
		</el-col>

		<!--编辑界面-->
		<el-dialog title="订单详情" v-model="editFormVisible" :close-on-click-modal="false" >
			<el-form :model="orderDetails" label-width="160px" :rules="editFormRules" ref="editForm">
				<el-form-item label="订单号">
					<div>{{orderDetails.orderNumber }}</div>
					<!-- <el-input v-model="addForm.name" type="text" auto-complete="off"></el-input> -->
				</el-form-item>
				<el-form-item label="商品名称">
					<div>{{orderDetails.commodityName}}</div>
				</el-form-item>
				<el-form-item label="用户名">
					<div>{{orderDetails.userName }}</div>
				</el-form-item>
				<el-form-item label="实付金额">
					<div>{{orderDetails.amountPaid }}</div>
				</el-form-item>
				<el-form-item label="订单总价">
					<div>{{orderDetails.orderTotal }}</div>
				</el-form-item>
				<el-form-item label="订单状态">
					<div>{{orderDetails.orderStatus }}</div>
				</el-form-item>
				<el-form-item label="支付方式">
					<div>{{orderDetails.paymentMethod }}</div>
				</el-form-item>
				<el-form-item label="创建时间">
					<div>{{orderDetails.evaluateTime}}</div>
				</el-form-item>
				<el-form-item label="发货时间">
					<div>{{orderDetails.evaluate}}</div>
				</el-form-item>
				<el-col :span='24'></el-col>
			</el-form>
			<div slot="footer" class="dialog-footer" style="text-align: center;">
				<!-- <el-button type="primary" @click.native="editSubmit" :loading="editLoading">保存</el-button> -->
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
				radio: '0',
				checked: true,
				value:'',
				value1:'',
				value2:'',
				options: [{
		          value: '0',
		          label: '全部'
		        },{
		          value: '1',
		          label: '昵称'
		        }, {
		          value: '2',
		          label: '订单编号'
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
				editFormRules: {
					name: [
						{ required: true, message: '请输入姓名', trigger: 'blur' }
					]
				},
				//编辑界面数据
				editForm: {
					id: 0,
					username: '',
					sex: -1,
					age: 0,
					birth: '',
					addr: ''
				},

				addFormVisible: false,//新增界面是否显示
				addLoading: false,
				//新增界面数据
				orderDetails: {
				},
				orderEvaluate:[{
					orderNumber :'145877458784524c',
					courierNumber :'145877458784524c',
					userName:'吸引力量',
					amountPaid :'300',
					orderTotal :'900',
					orderStatus :'待付款',
					paymentMethod :'微信支付',
					evaluateTime:'2017-09-08 17:09',
					evaluate:'差评',
					commodityName:'雨花说'
				}]
			}
		},
		methods: {
			formatterTime(row, column){
				let curTime = row.createTime;
                curTime = new Date(curTime).toLocaleString()
                return curTime
			},
			//支付方式
			formatterType(row, column) {
				let type = ''
				if(row.orderMall.payMethod === '0'){
					type = '微信支付'
				}else if(row.orderMall.payMethod === '1'){
					type = '支付宝支付'
				}else if(row.orderMall.payMethod === '2'){
					type = '银联支付'
				}else if(row.orderMall.payMethod === '3'){
					type = '余额支付'
				}else if(row.orderMall.payMethod === '4'){
					type = '余额金豆混合支付'
				}else if(row.orderMall.payMethod === '5'){
					type = '金豆支付'
				}
				return type
			},
			//订单状态 orderStatus
			formatterStatus(row, column) {
				let status = ''
				if(row.orderGoods.orderStatus === 1){
					status = '支付中'
				}else if(row.orderGoods.orderStatus === 2){
					status = '支付成功'
				}else if(row.orderGoods.orderStatus === 3){
					status = '支付失败'
				}else if(row.orderGoods.orderStatus === 4){
					status = '已取消'
				}else if(row.orderGoods.orderStatus === 5){
					status = '卖家已发货'
				}else if(row.orderGoods.orderStatus === 6){
					status = '已收货'
				}else if(row.orderGoods.orderStatus === 7){
					status = '已评价'
				}else if(row.orderGoods.orderStatus === 8){
					status = '交易完成'
				}else if(row.orderGoods.orderStatus === 9){
					status = '售后处理'
				}else if(row.orderGoods.orderStatus === 10){
					status = '已删除'
				}
				return status
			},
			getlist(){
				const _this = this
				_this.orderEvaluate = []
				const params = {
					pageNum:this.page,
					size:10,
					userName:'',
					nickName:'',
					orderId:''
				}
				if(this.filters.type === '1'){
					params.nickName = this.filters.name
				}else if(this.filters.type === '2'){
					params.orderId = this.filters.name
				}
				console.log(params)
				$.ajax({
                    type:'POST',
                    dataType:'json',
                    url:baseUrl+"/api/ordersEvaluate/selectAll",
                    data:JSON.stringify(params),
                    contentType:'application/json;charset=utf-8',
                    error: function (XMLHttpRequest, textStatus, errorThrown) {},
                    success:function(data){
                    	console.log(data.data.list)
                    	_this.orderEvaluate = data.data.list
                    	_this.total = data.data.total
                    }
                });
			},
			handleDelete(row){
				console.log(row)
				const _this = this
				const params = {
					id:row.id
				}
				$.ajax({
                    type:'POST',
                    dataType:'json',
                    url:baseUrl+"/api/ordersEvaluate/delete ",
                    data:JSON.stringify(params),
                    contentType:'application/json;charset=utf-8',
                    error: function (XMLHttpRequest, textStatus, errorThrown) {},
                    success:function(data){
                    	if(data.code === 1){
                    		this.$message({
							message: '删除成功',
								type: 'success'
							});
                    	}else{
                    		this.$message({
							message:data.msg,
								type: 'success'
							});
                    	}
                    }
                });
			},
			handleCurrentChange(val) {
				this.page = val;
				this.getlist();
			},
			//获取用户列表
			getUsers() {
				let para = {
					page: this.page,
					name: this.filters.name
				};
				this.listLoading = true;
				//NProgress.start();
				getUserListPage(para).then((res) => {
					this.total = res.data.total;
					this.users = res.data.users;
					this.listLoading = false;
					//NProgress.done();
				});
			},
			//删除
			handleDel: function (index, row) {
				this.$confirm('确认删除该记录吗?', '提示', {
					type: 'warning'
				}).then(() => {
					this.listLoading = true;
					//NProgress.start();
					let para = { id: row.id };
					removeUser(para).then((res) => {
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
			},
			//显示编辑界面
			seeBtn: function (index, row) {
				this.editFormVisible = true;
				this.orderDetails = Object.assign({}, row);
			},
			//显示新增界面
			handleAdd: function () {
				this.addFormVisible = true;
				this.addForm = {
					name: '',
					sex: -1,
					age: 0,
					birth: '',
					addr: ''
				};
			},
			//编辑
			editSubmit: function () {
				this.$refs.editForm.validate((valid) => {
					if (valid) {
						this.$confirm('确认提交吗？', '提示', {}).then(() => {
							this.editLoading = true;
							//NProgress.start();
							let para = Object.assign({}, this.editForm);
							para.birth = (!para.birth || para.birth == '') ? '' : util.formatDate.format(new Date(para.birth), 'yyyy-MM-dd');
							editUser(para).then((res) => {
								this.editLoading = false;
								//NProgress.done();
								this.$message({
									message: '提交成功',
									type: 'success'
								});
								this.$refs['editForm'].resetFields();
								this.editFormVisible = false;
								this.getUsers();
							});
						});
					}
				});
			},
			//新增
			addSubmit: function () {
				this.$refs.addForm.validate((valid) => {
					if (valid) {
						this.$confirm('确认提交吗？', '提示', {}).then(() => {
							this.addLoading = true;
							//NProgress.start();
							let para = Object.assign({}, this.addForm);
							para.birth = (!para.birth || para.birth == '') ? '' : util.formatDate.format(new Date(para.birth), 'yyyy-MM-dd');
							addUser(para).then((res) => {
								this.addLoading = false;
								//NProgress.done();
								this.$message({
									message: '提交成功',
									type: 'success'
								});
								this.$refs['addForm'].resetFields();
								this.addFormVisible = false;
								this.getUsers();
							});
						});
					}
				});
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