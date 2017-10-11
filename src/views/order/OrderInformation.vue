<template>
	<section>
		<!--工具条-->
		<el-col :span="24" class="toolbar" style="padding-bottom: 0px;background: #fff">
			<el-form :inline="true" :model="filters">
				<!-- <el-form-item>
					<el-input v-model="filters.name" placeholder="支付银行"></el-input>
				</el-form-item> -->
				<el-form-item label="状态">
					<el-select v-model="filters.status" clearable>
				      <el-option v-for="item in selectSubjectStatus" :label="item.label" :value="item.value">
				      </el-option>
				    </el-select>
				</el-form-item>
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
		<el-table :data="orderInformation" border highlight-current-row v-loading="listLoading" style="width: 100%;min-width: 1080px;">
			<el-table-column prop="ddbh" label="订单编号">
			</el-table-column>
			<el-table-column prop="expno" label="快递单号">
			</el-table-column>
			<el-table-column prop="coreUser" label="用户名">
			</el-table-column>
			<el-table-column prop="sfje" label="实付金额">
			</el-table-column>
			<el-table-column prop="ddzj" label="订单总价">
			</el-table-column>
			<el-table-column prop="orderStatus" :formatter='formatterStatus' label="订单状态">
			</el-table-column>
			<el-table-column prop="payMethod" :formatter='formatterType' label="支付方式">
			</el-table-column>
			<el-table-column prop="createTime" :formatter='formatterTime' label="创建时间">
			</el-table-column>
			<el-table-column prop="deliveryTime" :formatter='deliveTime'  label="发货时间">
			</el-table-column>
			<el-table-column label="操作">
				<template scope="scope">
					<!-- <el-button v-if='scope.row.index === 1' type='text' size="small" @click="handleEdit(scope.$index, scope.row)">暂停</el-button> -->
					<!-- <el-button v-else-if='scope.row.index === 0' :disabled="true" type='text' size="small" @click="handleEdit(scope.$index, scope.row)">已处理</el-button> -->
					<el-button type="text" size="small" @click="seeBtn(scope.$index, scope.row)">查看</el-button>
					<el-button type="text" size="small" @click="deldetSubmit(scope.row)">删除</el-button>
				</template>
			</el-table-column>
		</el-table>

		<!--工具条-->
		<el-col :span="24" class="toolbar" style="background:#fff;">
			<!-- <el-button type="danger" @click="batchRemove" :disabled="this.sels.length===0">批量删除</el-button> -->
			<el-pagination layout="prev, pager, next" @current-change="handleCurrentChange" :page-size="20" :total="total" style="float:right;">
			</el-pagination>
		</el-col>

		<!--编辑界面-->
		<el-dialog title="订单详情" v-model="editFormVisible" :close-on-click-modal="false" >
			<el-form :model="seeForm" label-width="100px">
				<el-form-item label="订单号">
					<div>{{seeForm.ddbh }}</div>
					<!-- <el-input v-model="addForm.name" type="text" auto-complete="off"></el-input> -->
				</el-form-item>
				<el-form-item label="商品名称">
					<div>{{seeForm.productName}}</div>
				</el-form-item>
				<el-form-item label="用户名">
					<div>{{seeForm.coreUser }}</div>
				</el-form-item>
				<el-form-item label="实付金额">
					<div>{{seeForm.sfje }}</div>
				</el-form-item>
				<el-form-item label="订单总价">
					<div>{{seeForm.ddzj }}</div>
				</el-form-item>
				<el-form-item label="订单状态">
					<div>{{seeForm.orderStatus }}</div>
				</el-form-item>
				<el-form-item label="支付方式">
					<div>{{seeForm.payMethod }}</div>
				</el-form-item>
				<el-form-item label="创建时间">
					<div v-if="seeForm.createTime !== null">{{ new Date(seeForm.createTime).toLocaleString()}}</div>
					<div v-else>\</div>
				</el-form-item>
				<el-form-item label="发货时间">
					<div v-if="seeForm.deliveryTime !== null">{{new Date(seeForm.deliveryTime).toLocaleString()}}</div>
					<div v-else>\</div>
				</el-form-item>
				<el-form-item label="交易完成时间">
					<div v-if="seeForm.deliveryTime !== null">{{new Date(seeForm.evaluateTime).toLocaleString()}}</div>
					<div v-else>\</div>
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
				selectSubjectStatus: [
				{
					value:'0',
					label:'全部'
				},{
					value:'1',
					label:'待付款'
				},{
					value:'2',
					label:'待发货'
				},{
					value:'5',
					label:'待收货'
				},{
					value:'6',
					label:'待评价'
				},{
					value:'7',
					label:'已评价'
				},{
					value:'8',
					label:'已完成'
				},{
					value:'4',
					label:'已取消'
				}],
				options: [{
		          value: '0',
		          label: '订单商品编号'
		        }, {
		          value: '1',
		          label: '订单编号'
		        }, {
		          value: '2',
		          label: '快递单号'
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
				orderInformation:[],
				seeForm:[]
			}
		},
		methods: {
			// 删除订单
			deldetSubmit(row){
				console.log(row)
				const _this = this
				const params = [{
					id:row.ddbh
				}]
				console.log(params)
				$.ajax({
                    type:'POST',
                    dataType:'json',
                    url:baseUrl+"/api/orderMall/deleteBySys",
                    data:JSON.stringify(params),
                    contentType:'application/json;charset=utf-8',
                    success:function(data){
                    	console.log(data)
                    	if(data.code === 1){
                    		_this.getlist()
                    	}else{
                    		alert(data.msg)
                    	}
                    }
                })
			},
			getlist(){
				const _this = this
				_this.orderInformation = []
				const params = {
					pageNum:this.page,
					size:20,
					orderStatus:this.filters.status,
					orderId:'',
					expno:''
				}
				if(this.filters.type === '1'){
					params.orderId = this.filters.name
				}else if(this.filters.type === '2'){
					params.expno = this.filters.name
				}else if(this.filters.type === '0'){
					params.orderGoodsId = this.filters.name
				}
				console.log(params)
				$.ajax({
                    type:'POST',
                    dataType:'json',
                    url:baseUrl+"/api/orderMall/selectListAll",
                    data:JSON.stringify(params),
                    contentType:'application/json;charset=utf-8',
                    error: function (XMLHttpRequest, textStatus, errorThrown) {},
                    success:function(data){
                    	const info = data.data
                    	console.log(info)
                    	_this.total = info.total
                    	// _this.orderInformation = info.list
                    	for(var i = 0;i<info.list.length;i++){
                    		for(var x = 0;x<info.list[i].orderGoods.length;x++){
                    			info.list[i].orderGoods[0].ddbh = info.list[i].id
                    			info.list[i].orderGoods[0].sfje = info.list[i].totalMoney
                    			info.list[i].orderGoods[0].coreUser = info.list[i].coreUser.nickName
                    			info.list[i].orderGoods[0].payMethod = info.list[i].payMethod
                    			info.list[i].orderGoods[0].ddzj =  info.list[i].productValue+ info.list[i].expressValue
                    			_this.orderInformation.push(info.list[i].orderGoods[x])
                    		}
                    	}
                    	console.log(_this.orderInformation)
                    }
                })
			},
			handleCurrentChange(val) {
				this.page = val;
				this.getlist();
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
				this.seeForm = row
				console.log(row)
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
			},
			formatterTime(row, column){
				let curTime = row.createTime;
				if(curTime !== null){
	                curTime = new Date(curTime).toLocaleString()
	                return curTime
				}
			},
			deliveTime(row, column){
				let curTime = row.deliveryTime;
                if(curTime !== null){
	                curTime = new Date(curTime).toLocaleString()
	                return curTime
				}else{
					return '/'
				}
			},
			//支付方式
			formatterType: function (row, column) {
				let type = ''
				if(row.payMethod === '0'){
					type = '微信支付'
				}else if(row.payMethod === '1'){
					type = '支付宝支付'
				}else if(row.payMethod === '2'){
					type = '银联支付'
				}else if(row.payMethod === '3'){
					type = '余额支付'
				}else if(row.payMethod === '4'){
					type = '余额金豆混合支付'
				}else if(row.payMethod === '5'){
					type = '金豆支付'
				}
				return type
			},
			//订单状态 orderStatus
			formatterStatus: function (row, column) {
				let status = ''
				if(row.orderStatus === 1){
					status = '待付款'
				}else if(row.orderStatus === 2){
					status = '待发货'
				}else if(row.orderStatus === 3){
					status = '支付失败'
				}else if(row.orderStatus === 4){
					status = '已取消'
				}else if(row.orderStatus === 5){
					status = '待收货'
				}else if(row.orderStatus === 6){
					status = '待评价'
				}else if(row.orderStatus === 7){
					status = '已评价'
				}else if(row.orderStatus === 8){
					status = '已完成'
				}else if(row.orderStatus === 9){
					status = '未通过'
				}else if(row.orderStatus === 10){
					status = '已删除'
				}else if(row.orderStatus === 11){
					status = '已完成'
				}
				return status
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