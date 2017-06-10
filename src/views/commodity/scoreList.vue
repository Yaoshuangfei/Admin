<template>
	<section>
		<!--工具条-->
		<el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
			<el-form :inline="true" :model="filters">
				<el-form-item>
					<el-input v-model="filters.name" placeholder="手机号码"></el-input>
				</el-form-item>
				<el-form-item>
					<el-input v-model="filters.name" placeholder="用户名"></el-input>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" v-on:click="getUsers">查询</el-button>
				</el-form-item>
				<!-- <el-form-item>
					<el-button type="primary" @click="handleAdd">新增</el-button>
				</el-form-item> -->
			</el-form>
		</el-col>

		<!--列表-->
		<el-table :data="table" border highlight-current-row v-loading="listLoading" style="width: 100%;min_width:1080px;">
			<el-table-column prop="id" label="ID">
			</el-table-column>
			<el-table-column prop="name" label="用户名">
			</el-table-column>
			<el-table-column prop="number" label="手机号码">
			</el-table-column>
			<el-table-column prop="user_name" label="综合积分">
			</el-table-column>
			<el-table-column prop="loan" label="消费积分">
			</el-table-column>
			<el-table-column prop="loan_number" label="有效积分">
			</el-table-column>
			<el-table-column prop="min_company" label="添加时间">
			</el-table-column>
			<el-table-column prop="interest_rate" label="投资积分">
			</el-table-column>
			<el-table-column prop="data_qx" label="赠送积分">
			</el-table-column>
			<el-table-column label="操作">
				<template scope="scope">
					<el-button size="small" type='text' @click="handleEdit(scope.$index, scope.row)">修改</el-button>
					<el-button type="text" size="small" @click="handleEdit1(scope.$index, scope.row)">查看详情</el-button>
				</template>
			</el-table-column>
		</el-table>

		<!--工具条-->
		<el-col :span="24" class="toolbar">
			<!-- <el-button type="danger" @click="batchRemove" :disabled="this.sels.length===0">批量删除</el-button> -->
			<el-pagination layout="prev, pager, next" @current-change="handleCurrentChange" :page-size="20" :total="total" style="float:right;">
			</el-pagination>
		</el-col>

		<!--编辑界面-->
		<el-dialog title="修改积分" v-model="editFormVisible" :close-on-click-modal="false">
			<el-form :model="editForm" label-width="80px" :rules="editFormRules" ref="editForm">
				<el-form-item label="用户ID：" >{{editForm.name}}</el-form-item>
				<el-form-item label="手机号码：">{{editForm.name}}</el-form-item>
				<el-form-item label="客户姓名：" >{{editForm.name}}</el-form-item>
				<el-form-item label="现有积分：" >{{editForm.name}}</el-form-item>
				<el-form-item label="修改积分：" >
					<el-input v-model="editForm.name" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="备注：">
					<el-input type="textarea" v-model="bzvalue"></el-input>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer" style="text-align: center;">
				<!-- <el-button @click.native="editFormVisible = false">取消</el-button> -->
				<el-button type="primary" @click.native="editSubmit" :loading="editLoading">保存</el-button>
			</div>
		</el-dialog>
		<el-dialog title="积分详情" v-model="editFormVisible1" :close-on-click-modal="false">
			<el-table :data="table" border highlight-current-row v-loading="listLoading" style="width: 100%;min-width: 500px;">
			<el-table-column prop="id" label="ID" >
			</el-table-column>
			<el-table-column prop="name" label="用户名">
			</el-table-column>
			<el-table-column prop="number" label="手机号码">
			</el-table-column>
			<el-table-column prop="user_name" label="积分类型">
			</el-table-column>
			<el-table-column prop="loan" label="积分变动数值">
			</el-table-column>
			<el-table-column prop="loan_number" label="变动类型">
			</el-table-column>
			<el-table-column prop="min_company" label="记录时间">
			</el-table-column>
			<el-table-column prop="" label="备注">
			</el-table-column>
			<el-table-column prop="" label="操作">
			</el-table-column>
		</el-table>

		<!--工具条-->
		<el-col :span="24" class="toolbar">
			<!-- <el-button type="danger" @click="batchRemove" :disabled="this.sels.length===0">批量删除</el-button> -->
			<el-pagination layout="prev, pager, next" @current-change="handleCurrentChange" :page-size="20" :total="total" style="float:right;">
			</el-pagination>
		</el-col>
		</el-dialog>

		<!--新增界面-->
		<el-dialog title="新增" v-model="addFormVisible" :close-on-click-modal="false">
			<el-form :model="addForm" label-width="80px" :rules="addFormRules" ref="addForm">
				<el-form-item label="姓名" prop="name">
					<el-input v-model="addForm.name" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="性别">
					<el-radio-group v-model="addForm.sex">
						<el-radio class="radio" :label="1">男</el-radio>
						<el-radio class="radio" :label="0">女</el-radio>
					</el-radio-group>
				</el-form-item>
				<el-form-item label="年龄">
					<el-input-number v-model="addForm.age" :min="0" :max="200"></el-input-number>
				</el-form-item>
				<el-form-item label="生日">
					<el-date-picker type="date" placeholder="选择日期" v-model="addForm.birth"></el-date-picker>
				</el-form-item>
				<el-form-item label="地址">
					<el-input type="textarea" v-model="addForm.addr"></el-input>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click.native="addFormVisible = false">取消</el-button>
				<el-button type="primary" @click.native="addSubmit" :loading="addLoading">提交</el-button>
			</div>
		</el-dialog>
	</section>
</template>

<script>
	import util from '../../common/js/util'
	//import NProgress from 'nprogress'
	import { getUserListPage, removeUser, batchRemoveUser, editUser, addUser } from '../../api/api';

	export default {
		data() {
			return {
				filters: {
					name: ''
				},
				users: [],
				total: 0,
				page: 1,
				listLoading: false,
				sels: [],//列表选中列

				editFormVisible: false,//编辑界面是否显示
				editFormVisible1: false,//编辑界面是否显示
				editLoading: false,
				editFormRules: {
					name: [
						{ required: true, message: '请输入姓名', trigger: 'blur' }
					]
				},
				//编辑界面数据
				editForm: {
					id: 0,
					name: '',
					sex: -1,
					age: 0,
					birth: '',
					addr: ''
				},
				bzvalue:'',
				editForm1: {
					id: 0,
					name: '',
					sex: -1,
					age: 0,
					birth: '',
					addr: ''
				},

				addFormVisible: false,//新增界面是否显示
				addLoading: false,
				addFormRules: {
					name: [
						{ required: true, message: '请输入姓名', trigger: 'blur' }
					]
				},
				//新增界面数据
				addForm: {
					name: '',
					sex: -1,
					age: 0,
					birth: '',
					addr: ''
				},
				table:[{
					id:"001",
					number:"18709829122",
					name:"胡红",
					user_name:"4分",
					loan:" 抵押标 【东阳】大众抵押标，感谢支持！（续）",
					loan_number:"450000元",
					min_company:"-",
					interest_rate:"10%",
					data_qx:"1个月",
					time:"2017-04-01 12:12:00",
					toubiao:"0元",
					fs_time:"",
					yhkje:"0元",
					syhkje:"545111元",
					state:"等待初审"
				},{
					id:"001",
					number:"18709829122",
					name:"胡红",
					user_name:"4分",
					loan:" 抵押标 【东阳】大众抵押标，感谢支持！（续）",
					loan_number:"450000元",
					min_company:"-",
					interest_rate:"10%",
					data_qx:"1个月",
					time:"2017-04-01 12:12:00",
					toubiao:"0元",
					fs_time:"",
					yhkje:"0元",
					syhkje:"545111元",
					state:"等待初审"
				},{
					id:"001",
					number:"18709829122",
					name:"胡红",
					user_name:"4分",
					loan:" 抵押标 【东阳】大众抵押标，感谢支持！（续）",
					loan_number:"450000元",
					min_company:"-",
					interest_rate:"10%",
					data_qx:"1个月",
					time:"2017-04-01 12:12:00",
					toubiao:"0元",
					fs_time:"",
					yhkje:"0元",
					syhkje:"545111元",
					state:"等待初审"
				},{
					id:"001",
					number:"18709829122",
					name:"胡红",
					user_name:"4分",
					loan:" 抵押标 【东阳】大众抵押标，感谢支持！（续）",
					loan_number:"450000元",
					min_company:"-",
					interest_rate:"10%",
					data_qx:"1个月",
					time:"2017-04-01 12:12:00",
					toubiao:"0元",
					fs_time:"",
					yhkje:"0元",
					syhkje:"545111元",
					state:"等待初审"
				},{
					id:"001",
					number:"18709829122",
					name:"胡红",
					user_name:"4分",
					loan:" 抵押标 【东阳】大众抵押标，感谢支持！（续）",
					loan_number:"450000元",
					min_company:"-",
					interest_rate:"10%",
					data_qx:"1个月",
					time:"2017-04-01 12:12:00",
					toubiao:"0元",
					fs_time:"",
					yhkje:"0元",
					syhkje:"545111元",
					state:"等待初审"
				},{
					id:"001",
					number:"18709829122",
					name:"胡红",
					user_name:"4分",
					loan:" 抵押标 【东阳】大众抵押标，感谢支持！（续）",
					loan_number:"450000元",
					min_company:"-",
					interest_rate:"10%",
					data_qx:"1个月",
					time:"2017-04-01 12:12:00",
					toubiao:"0元",
					fs_time:"",
					yhkje:"0元",
					syhkje:"545111元",
					state:"等待初审"
				},{
					id:"001",
					number:"18709829122",
					name:"胡红",
					user_name:"4分",
					loan:" 抵押标 【东阳】大众抵押标，感谢支持！（续）",
					loan_number:"450000元",
					min_company:"-",
					interest_rate:"10%",
					data_qx:"1个月",
					time:"2017-04-01 12:12:00",
					toubiao:"0元",
					fs_time:"",
					yhkje:"0元",
					syhkje:"545111元",
					state:"等待初审"
				},{
					id:"001",
					number:"18709829122",
					name:"胡红",
					user_name:"4分",
					loan:" 抵押标 【东阳】大众抵押标，感谢支持！（续）",
					loan_number:"450000元",
					min_company:"-",
					interest_rate:"10%",
					data_qx:"1个月",
					time:"2017-04-01 12:12:00",
					toubiao:"0元",
					fs_time:"",
					yhkje:"0元",
					syhkje:"545111元",
					state:"等待初审"
				},{
					id:"001",
					number:"18709829122",
					name:"胡红",
					user_name:"4分",
					loan:" 抵押标 【东阳】大众抵押标，感谢支持！（续）",
					loan_number:"450000元",
					min_company:"-",
					interest_rate:"10%",
					data_qx:"1个月",
					time:"2017-04-01 12:12:00",
					toubiao:"0元",
					fs_time:"",
					yhkje:"0元",
					syhkje:"545111元",
					state:"等待初审"
				},{
					id:"001",
					number:"18709829122",
					name:"胡红",
					user_name:"4分",
					loan:" 抵押标 【东阳】大众抵押标，感谢支持！（续）",
					loan_number:"450000元",
					min_company:"-",
					interest_rate:"10%",
					data_qx:"1个月",
					time:"2017-04-01 12:12:00",
					toubiao:"0元",
					fs_time:"",
					yhkje:"0元",
					syhkje:"545111元",
					state:"等待初审"
				},{
					id:"001",
					number:"18709829122",
					name:"胡红",
					user_name:"4分",
					loan:" 抵押标 【东阳】大众抵押标，感谢支持！（续）",
					loan_number:"450000元",
					min_company:"-",
					interest_rate:"10%",
					data_qx:"1个月",
					time:"2017-04-01 12:12:00",
					toubiao:"0元",
					fs_time:"",
					yhkje:"0元",
					syhkje:"545111元",
					state:"等待初审"
				},{
					id:"001",
					number:"18709829122",
					name:"胡红",
					user_name:"4分",
					loan:" 抵押标 【东阳】大众抵押标，感谢支持！（续）",
					loan_number:"450000元",
					min_company:"-",
					interest_rate:"10%",
					data_qx:"1个月",
					time:"2017-04-01 12:12:00",
					toubiao:"0元",
					fs_time:"",
					yhkje:"0元",
					syhkje:"545111元",
					state:"等待初审"
				},{
					id:"001",
					number:"18709829122",
					name:"胡红",
					user_name:"4分",
					loan:" 抵押标 【东阳】大众抵押标，感谢支持！（续）",
					loan_number:"450000元",
					min_company:"-",
					interest_rate:"10%",
					data_qx:"1个月",
					time:"2017-04-01 12:12:00",
					toubiao:"0元",
					fs_time:"",
					yhkje:"0元",
					syhkje:"545111元",
					state:"等待初审"
				},{
					id:"001",
					number:"18709829122",
					name:"胡红",
					user_name:"4分",
					loan:" 抵押标 【东阳】大众抵押标，感谢支持！（续）",
					loan_number:"450000元",
					min_company:"-",
					interest_rate:"10%",
					data_qx:"1个月",
					time:"2017-04-01 12:12:00",
					toubiao:"0元",
					fs_time:"",
					yhkje:"0元",
					syhkje:"545111元",
					state:"等待初审"
				},{
					id:"001",
					number:"18709829122",
					name:"胡红",
					user_name:"4分",
					loan:" 抵押标 【东阳】大众抵押标，感谢支持！（续）",
					loan_number:"450000元",
					min_company:"-",
					interest_rate:"10%",
					data_qx:"1个月",
					time:"2017-04-01 12:12:00",
					toubiao:"0元",
					fs_time:"",
					yhkje:"0元",
					syhkje:"545111元",
					state:"等待初审"
				},{
					id:"001",
					number:"18709829122",
					name:"胡红",
					user_name:"4分",
					loan:" 抵押标 【东阳】大众抵押标，感谢支持！（续）",
					loan_number:"450000元",
					min_company:"-",
					interest_rate:"10%",
					data_qx:"1个月",
					time:"2017-04-01 12:12:00",
					toubiao:"0元",
					fs_time:"",
					yhkje:"0元",
					syhkje:"545111元",
					state:"等待初审"
				},{
					id:"001",
					number:"18709829122",
					name:"胡红",
					user_name:"4分",
					loan:" 抵押标 【东阳】大众抵押标，感谢支持！（续）",
					loan_number:"450000元",
					min_company:"-",
					interest_rate:"10%",
					data_qx:"1个月",
					time:"2017-04-01 12:12:00",
					toubiao:"0元",
					fs_time:"",
					yhkje:"0元",
					syhkje:"545111元",
					state:"等待初审"
				},{
					id:"001",
					number:"18709829122",
					name:"胡红",
					user_name:"4分",
					loan:" 抵押标 【东阳】大众抵押标，感谢支持！（续）",
					loan_number:"450000元",
					min_company:"-",
					interest_rate:"10%",
					data_qx:"1个月",
					time:"2017-04-01 12:12:00",
					toubiao:"0元",
					fs_time:"",
					yhkje:"0元",
					syhkje:"545111元",
					state:"等待初审"
				},{
					id:"001",
					number:"18709829122",
					name:"胡红",
					user_name:"4分",
					loan:" 抵押标 【东阳】大众抵押标，感谢支持！（续）",
					loan_number:"450000元",
					min_company:"-",
					interest_rate:"10%",
					data_qx:"1个月",
					time:"2017-04-01 12:12:00",
					toubiao:"0元",
					fs_time:"",
					yhkje:"0元",
					syhkje:"545111元",
					state:"等待初审"
				}]
			}
		},
		methods: {
			//性别显示转换
			formatSex: function (row, column) {
				return row.sex == 1 ? '男' : row.sex == 0 ? '女' : '未知';
			},
			handleCurrentChange(val) {
				this.page = val;
				this.getUsers();
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
			handleEdit: function (index, row) {
				this.editFormVisible = true;
				this.editForm = Object.assign({}, row);
			},
			handleEdit1: function (index, row) {
				this.editFormVisible1 = true;
				this.editForm = Object.assign({}, row);
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
			this.getUsers();
		}
	}

</script>

<style scoped>

</style>