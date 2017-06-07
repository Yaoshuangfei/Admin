<template>
	<section>
		<!--工具条-->
		<el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
			<el-form :inline="true" :model="filters">
				<el-form-item>
					<el-input v-model="filters.name" placeholder="转让人姓名"></el-input>
				</el-form-item>
				<el-form-item>
					<el-input v-model="filters.name" placeholder="标的名称"></el-input>
				</el-form-item>
				<el-select v-model="value" placeholder="标的类型">
			      <el-option v-for="item in list" :label="item.label" :value="item.value">
			      </el-option>
			    </el-select>
				<el-form-item>
					<el-button type="primary" v-on:click="getUsers">查询</el-button>
				</el-form-item>
				<!-- <el-form-item>
					<el-button type="primary" @click="handleAdd">新增</el-button>
				</el-form-item> -->
			</el-form>
		</el-col>

		<!--列表-->
		<el-table :data="table" border highlight-current-row v-loading="listLoading" style="width: 100%;min-width: 1000px">
			<el-table-column prop="phone" label="转让人手机"  >
			</el-table-column>
			<el-table-column prop="user" label="转让人"  >
			</el-table-column>
			<el-table-column prop="bdname" label="标的名称"  >
			</el-table-column>
			<el-table-column prop="yjnhsy" label="预计年化收益率"  >
			</el-table-column>
			<el-table-column prop="gmtime" label="购买时间"  >
			</el-table-column>
			<el-table-column prop="lcqx" label="理财期限"  >
			</el-table-column>
			<el-table-column prop="syqx" label="剩余期限"  >
			</el-table-column>
			<el-table-column prop="zrje" label="转让金额"  >
			</el-table-column>
			<el-table-column prop="time" label="倒计时时间" >
			</el-table-column>
			<el-table-column label="操作" >
				<template scope="scope">
					<el-button type="text" size="small" @click="handleEdit(scope.$index, scope.row)">金额匹配</el-button>
					<!-- <el-button type="danger" size="small" @click="handleDel(scope.$index, scope.row)">删除</el-button> -->
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
		<el-dialog title="金额匹配" v-model="editFormVisible" :close-on-click-modal="false">
			<el-form :model="editForm" label-width="160px" :rules="editFormRules" ref="editForm">
				<el-form-item label="标的名称：">
					{{editForm.bdname}}
				</el-form-item>
				<el-form-item label="总金额（元）：">
					{{editForm.bdname}}
				</el-form-item>
				<el-form-item label="剩余可投金额（元）：">
					{{editForm.bdname}}
				</el-form-item>
				<el-col :span='24' style='margin-bottom: 20px;'>
					<el-col :span='3' :offset="1">庞统：6909</el-col>
					<el-col :span='8'>
						<el-input v-model="editForm.bdname"></el-input>
					</el-col>
					<el-col :span='8' :offset="1">
						<el-button type='primary' >删除</el-button>
					</el-col>
				</el-col>
				<el-col :span='24' style='margin-bottom: 20px;'>
					<el-col :span='3' :offset="1">庞统：6909</el-col>
					<el-col :span='8'>
						<el-input v-model="editForm.bdname"></el-input>
					</el-col>
					<el-col :span='8' :offset="1">
						<el-button type='primary' >删除</el-button>
					</el-col>
				</el-col>
				<el-col :span='24' style='font-size: 2em;margin-bottom:5%'>
					<el-col :span='10' :offset="1" >手动匹配投资金额（元）：</el-col>
					<el-col :span='4' style='color: red;'>500</el-col>
				</el-col>
			</el-form>
			<div slot="footer" class="dialog-footer" style="text-align: left;
    margin-left: 32%;">
				<el-button type="primary" @click="handleEdit1" :loading="editLoading">+添加投资人</el-button>
				<el-button type="primary" @click.native="editSubmit" :loading="editLoading">保存</el-button>
				<el-button type="primary" @click.native="editFormVisible = false">取消</el-button>
			</div>
		</el-dialog>

		<el-dialog title="选择匹配用户" v-model="editFormVisible1" :close-on-click-modal="false">
			<el-form :model="editForm" label-width="160px" :rules="editFormRules" ref="editForm">
				<el-col :span='24' style='margin-bottom: 20px;'>
					<el-col :span='8'>
						<el-input v-model="editForm.bdname" auto-complete="off"></el-input>
					</el-col>
					<el-col :span='8' :offset="1">
						<el-button type='primary' >查询</el-button>
					</el-col>
				</el-col>
				<el-col :span='24' style='margin-bottom: 20px;'>
					<el-table :data="table1" border highlight-current-row v-loading="listLoading" style="width: 100%;min-width: 600px">
						<el-table-column prop="user" label="用户姓名"  >
						</el-table-column>
						<el-table-column prop="tzje" label="投资金额"  >
						</el-table-column>
						<el-table-column prop="sytzje" label="剩余投资金额"  >
						</el-table-column>
						<el-table-column prop="sytzqx" label="剩余投资期限(天)"  >
						</el-table-column>
						<el-table-column type='selection' label="选择"  >
						</el-table-column>
					</el-table>
				</el-col>
			</el-form>
			<div slot="footer" class="dialog-footer" style="text-align: left;
    margin-left: 40%;">
				<el-button type="primary" @click.native="editSubmit" :loading="editLoading">保存</el-button>
				<el-button type="primary" @click.native="editFormVisible1 = false">取消</el-button>
			</div>
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
				value:'',
				value1:'',
				value2:'',
				list:[{
					value:'选项1',
					label:'新手标'
				},{
					value:'选项2',
					label:'普通标'
				},{
					value:'选项3',
					label:'定向标'
				},{
					value:'选项4',
					label:'手机专享标'
				}],
				table1:[{
					user:'张三',
					tzje:'120000',
					sytzje:'20000',
					sytzqx:'100',
				},{
					user:'徐三',
					tzje:'170000',
					sytzje:'30000',
					sytzqx:'50',
				}],
				filters: {
					name: ''
				},
				users: [],
				total: 0,
				page: 1,
				listLoading: false,
				sels: [],//列表选中列

				editFormVisible: false,//编辑界面是否显示
				editFormVisible1: false,
				editLoading: false,
				editFormRules: {
					name: [
						{ required: true, message: '请输入姓名', trigger: 'blur' }
					]
				},
				//编辑界面数据
				editForm: {
					bdname: '',
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
					phone:"18709829122",
					user:"胡红",
					bdname:"杭州-丰田-抵押标",
					yjnhsy:"10%",
					gmtime:"2017-04-01 12:12:00",
					lcqx:"90",
					syqx:"30",
					zrje:"22310",
					time:"20小时12分"
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