<template>
	<section>
		<!--工具条-->
		<el-col :span="24" class="toolbar" style="padding-bottom: 0px;background: #fff;text-align: right;">
			<el-form :inline="true" :model="filters">
				<el-form-item>
					<router-link :to="{ path: '/releaseAdd'}"   style="margin: 0 10px;">
						<el-button  type="primary" >添加</el-button>
					</router-link>
				</el-form-item>
			</el-form>
		</el-col>

		<!--列表-->
		<el-table :data="orderInformation" border highlight-current-row v-loading="listLoading" style="width: 100%;min-width: 1080px;">
			<el-table-column type="index" label="序号" >
			</el-table-column>
			<el-table-column prop="noticeImage" label="图片">
				<template scope="scope">
					<img width="50px" :src="scope.row.noticeImage" alt="">
				</template>
			</el-table-column>
			<el-table-column prop="noticeTitle" label="标题" >
			</el-table-column>
			<el-table-column prop="noticeCreateTime" :formatter='formatterTime' label="创建时间" >
			</el-table-column>
			<el-table-column label="操作">
				<template scope="scope">
					<!-- <el-button type="text" size="small" @click="releaseText(scope.$index , scope.row)">发布</el-button> -->
					<router-link :to="{ name: '系统推送查看' ,params: { id: scope.row.noticeId }}"   style="margin: 0 10px;">
						<el-button  type="text" size="small">查看</el-button>
					</router-link>
					<!-- <router-link :to="{ name: '修改推送' ,params: { id: scope.row.noticeId }}" style="margin: 0 10px;">
						<el-button  type="text" size="small">修改</el-button>
					</router-link> -->
					<el-button type="text" size="small" @click="handleDel(scope.$index , scope.row)">删除</el-button>
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
					<div>{{orderDetails.creationTime}}</div>
				</el-form-item>
				<el-form-item label="发货时间">
					<div>{{orderDetails.deliveryTime}}</div>
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
		          label: '快递单号'
		        }, {
		          value: '3',
		          label: '用户名'
		        }],
				filters: {
					name: '',
					status:'',
					type:''
				},
				users: [],
				total: 100,
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
				orderInformation:[]
			}
		},
		methods: {
			//性别显示转换
			formatSex: function (row, column) {
				return row.sex == 1 ? '男' : row.sex == 0 ? '女' : '未知';
			},
			getlist(){
				const _this = this
				const params={
                    pageNum:this.page,
                    size:10
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
                });
			},
			handleCurrentChange(val) {
				this.page = val;
				this.getlist();
			},
//			查看系统推送
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
				const _this = this
				const params = [row.noticeId]
				console.log(params)
				this.$confirm('确认删除该记录吗?', '提示', {
					type: 'warning'
				}).then(() => {
					$.ajax({
		                type:'POST',
		                dataType:'json',
		                url:baseUrl+"/api/notice/delete",
		                data:JSON.stringify(params),
		                contentType:'application/json;charset=utf-8',
		                success:function(data){
		                    console.log(data)
		                    if(data.code === 1){
			     //                _this.$message({
								// 	message: '删除成功',
								// 	type: 'success'
								// });
		                    	_this.getlist()	
		                    }else{
		                    	alert( code.msg)
		      //               	_this.$message({
								// 	message: code.msg,
								// 	type: 'error'
								// });
		                    }
		                }
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
			formatterTime(row,column){
                let curTime = row.noticeCreateTime;
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