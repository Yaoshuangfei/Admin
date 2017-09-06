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
			<el-table-column prop="orderId" label="订单编号">
			</el-table-column>
			<el-table-column prop="orderGoods.productName" label="商品名称">
			</el-table-column>
			<el-table-column prop="coreUser.nickName" label="用户名">
			</el-table-column>
			<el-table-column prop="coreUser.mobile" label="手机号">
			</el-table-column>
			<el-table-column prop="orderGoods.orderStatus"  label="订单状态">
			</el-table-column>
			<el-table-column prop="refundType" :formatter='refunType'  label="退款类型">
			</el-table-column>
			<el-table-column prop="refundStatus" :formatter='refunStatu'  label="退款状态">
			</el-table-column>
			<el-table-column prop="causeType" :formatter='causType'  label="退款原因">
			</el-table-column>
			<el-table-column label="操作">
				<template scope="scope">
					<!-- <el-button type="text" size="small" @click="seeBtn(scope.$index, scope.row)">查看</el-button> -->
					<el-button type="text" size="small" @click="pass(scope.row)">通过</el-button>
					<el-button type="text" size="small" @click="nopass(scope.row)">不通过</el-button>
					<el-button type="text" size="small" @click="deldetBtn(scope.row)">删除</el-button>
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
		<el-dialog title="审核" v-model="editFormVisible" :close-on-click-modal="false" >
			<el-form label-width="80px" >
				<el-form-item label="密码">
					<el-input v-model="password" type="text" auto-complete="off"></el-input>
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
				password: '',
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
					value:'3',
					label:'已发货'
				},{
					value:'4',
					label:'待评价'
				},{
					value:'5',
					label:'退货'
				}],
				options: [{
		          value: '0',
		          label: '全部'
		        }, {
		          value: '1',
		          label: '订单编号'
		        }, {
		          value: '2',
		          label: '用户名'
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
					orderGoods:{
						productName:'',
						orderStatus:''
					},
					coreUser:{
						userName:'',
						mobile:''
					}
				}]
			}
		},
		methods: {
			getlist(){
				const _this = this
				_this.table = []
				const params = {
					pageNum:_this.page,
					size:10
				}
				$.ajax({
                    type:'POST',
                    dataType:'json',
                    url:baseUrl+"/api/refundOrder/selectAllList",
                    data:JSON.stringify(params),
                    contentType:'application/json;charset=utf-8',
                    success:function(data){
                        console.log(data)
                        const info = data.data
                        _this.total = info.total
                        _this.orderEvaluate = info.list
                    }
                })
			},
			handleCurrentChange(val) {
				this.page = val;
				this.getlist();
			},
			//删除
			pass(row){
				this.editFormVisible = true
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
			refunType(row, column){
				let type = ''
				if(row.refundType === '1'){
					type = '仅退款'
				}else if(row.refundType === '2'){
					type = '退款退货'
				}
				return type
			},
			refunStatu(row, column){
				let type = ''
				if(row.refundStatus === 1){
					type = '退款中'
				}else if(row.refundStatus === 2){
					type = '退款成功'
				}else if(row.refundStatus === 3){
					type = '退款失败'
				}else if(row.refundStatus === 4){
					type = '商家同意买家填写退货物流信息'
				}
				return type
			},
			causType(row, column){
				let type = ''
				if(row.causeType === '1'){
					type = '无理由退款'
				}else if(row.causeType === '2'){
					type = '商品质量问题'
				}else if(row.causeType === '3'){
					type = '收到商品与描述不符'
				}else if(row.causeType === '4'){
					type = '商品错发、漏发'
				}
				return type
			},
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