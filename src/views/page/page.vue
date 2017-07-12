<template>
	<section>
		<!--工具条-->
		<el-col :span="24" class="toolbar" style="padding-bottom: 0px;background: #fff">
			<el-form :inline="true" :model="filters">
				<!-- <template scope="scope"> -->
					
				<!-- </template> -->
				<el-form-item>
					<router-link :to="{ name: '添加千人千面', params: { id:1 }}">
							<el-button  type="primary">添加</el-button>
					</router-link>
				</el-form-item>
				
			</el-form>
		</el-col>

		<!--列表-->
		<el-table :data="orderInformation" border highlight-current-row v-loading="listLoading" style="width: 100%;min-width: 1080px;">
			<el-table-column prop="id" label="样式编号">
			</el-table-column>
			<el-table-column prop="name" label="所属板块名称">
			</el-table-column>
			<el-table-column prop="status" :formatter='formatterStatus' label="状态">
			</el-table-column>
			<el-table-column prop="desc" label="描述">
			</el-table-column>
			<el-table-column prop="createTime" :formatter='formatterTime' label="创建时间">
			</el-table-column>
			<el-table-column prop="updateTime" :formatter='formatterTime' label="更新时间">
			</el-table-column>
			<el-table-column label="操作">
				<template scope="scope">
					<el-button type="text" size="small" @click="seeBtn(scope.$index, scope.row)">查看</el-button>
					<el-button type="text" size="small" @click="editBtn(scope.$index, scope.row)">修改</el-button>
					<el-button type="text" size="small" @click="seeBtn(scope.$index, scope.row)">启用</el-button>
					<!-- <el-button type="text" size="small" @click="handleEdit(scope.$index, scope.row)">删除</el-button> -->
				</template>
			</el-table-column>
		</el-table>

		<!--工具条-->
		<el-col :span="24" class="toolbar" style="background:#fff;">
			<el-pagination layout="prev, pager, next" @current-change="handleCurrentChange" :page-size="10" :total="total" style="float:right;">
			</el-pagination>
		</el-col>
		<!--新增banner-->
		<el-dialog title="修改" v-model="addbannerdiv" :close-on-click-modal="false" >
			<el-form  label-width="100px" >
				<el-form-item label="所属板块名称">
					<el-input v-model="editForm.name" type="text" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="店铺样式表">
					<el-input v-model="editForm.icon" type="text" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="描述">
					<el-input v-model="editForm.desc" type="text" auto-complete="off"></el-input>
				</el-form-item>
				<el-col :span='24'></el-col>
			</el-form>
			<div slot="footer" class="dialog-footer" style="text-align: center;">
				<el-button type="primary" @click.native="editSubmit" :loading="editLoading">确定</el-button>
				<el-button type="primary" @click.native="addbannerdiv = false">取消</el-button>
			</div>
		</el-dialog>
		<!--编辑界面-->
		<el-dialog title="详情" v-model="editFormVisible" :close-on-click-modal="false" >
			<el-form label-width="100px">
				<el-form-item label="所属模块名称">
					<div>{{seetable.name }}</div>
					<!-- <el-input v-model="addForm.name" type="text" auto-complete="off"></el-input> -->
				</el-form-item>
				<el-form-item label="店铺样式表">
					<div>{{seetable.icon}}</div>
				</el-form-item>
				<el-form-item label="描述">
					<div>{{seetable.desc }}</div>
				</el-form-item>
				<el-col :span='24'></el-col>
			</el-form>
			<div slot="footer" class="dialog-footer" style="text-align: center;">
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
				seetable:[],
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
				editForm: {},

				addbannerdiv: false,//新增界面是否显示
				addLoading: false,
				//新增界面数据
				orderDetails: {
				},
				orderInformation:[{
					orderNumber :'145877458784524c',
					courierNumber :'145877458784524c',
					userName:'吸引力量',
					amountPaid :'300',
					orderTotal :'900',
					orderStatus :'待付款',
					paymentMethod :'微信支付',
					creationTime:'2017-09-08 17:09',
					deliveryTime:'2017-09-08 17:09',
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
			formatterStatus(row, column){
				let status = ''
				if(row.status === 0){
					status = '关闭'
				}else if(row.status === 1){
					status = '开启'
				}
                return status
			},
			getlist(){
				const _this = this
				$.ajax({
	              type:'POST',
	              dataType:'json',
	              url:baseUrl+"/api/indexStyle/find/page?pageNum="+this.page+"&pageSize=110",
	              data:{},
	              contentType:'application/json;charset=utf-8',
	              error: function (XMLHttpRequest, textStatus, errorThrown) {},
	              success:function(data){
	                const info = data.data
	                console.log(info)
	                _this.orderInformation = info.list
	                _this.total = info.total
	              }
	          });
			},
			//显示查看界面
			seeBtn: function (index, row) {
				this.editFormVisible = true;
				this.seetable = row
				console.log(row)
			},
			editBtn(index, row){
				this.addbannerdiv = true;
				this.editForm = row
			},
			//修改
			editSubmit: function () {
				const _this = this
				const params = {
		            id:this.editForm.id,
		            name:this.editForm.name,
		            icon:this.editForm.icon,
		            picture:this.editForm.picture,
		            desc:this.editForm.desc
		          }
				console.log(params)
				$.ajax({
		              type:'POST',
		              dataType:'json',
		              url:baseUrl+"/api/indexStyle/update",
		              data:{},
		              contentType:'application/json;charset=utf-8',
		              error: function (XMLHttpRequest, textStatus, errorThrown) {},
		              success:function(data){
		                const info = data.data
		                console.log(data)
		                // _this.orderInformation = info.list
		                // _this.total = info.total
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
			//显示添加banner页面
			addbanner: function (index, row) {
				this.addbannerdiv = true;
				// this.orderDetails = Object.assign({}, row);
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
	.el-form-item__label{
		text-align: left;
	}
	.el-dialog__body{
		margin-left: 40px ! important ;
	}
</style>