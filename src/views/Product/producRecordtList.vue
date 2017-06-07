<template>
	<section>
		<!--工具条-->
		<el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
			<el-form :inline="true" :model="filters">
				<el-form-item>
					<el-input v-model="filters.name" placeholder="订单号"></el-input>
				</el-form-item>
				<el-form-item>
					<el-input v-model="filters.name" placeholder="产品名称"></el-input>
				</el-form-item>
				<el-form-item>
					<el-input v-model="filters.name" placeholder="客户姓名"></el-input>
				</el-form-item>
				<el-form-item>
					<el-input v-model="filters.name" placeholder="手机号码"></el-input>
				</el-form-item>
				<el-form-item>
					<el-input v-model="filters.name" placeholder="业务员姓名"></el-input>
				</el-form-item>
				<el-select v-model="value" placeholder="订单状态">
			      <el-option v-for="item in list" :label="item.label" :value="item.value">
			      </el-option>
			    </el-select>
				<el-form-item>
					<el-button type="primary" v-on:click="getUsers">查询</el-button>
				</el-form-item>
			</el-form>
		</el-col>

		<!--列表-->
		<el-table :data="product" border highlight-current-row v-loading="listLoading" style="width: 100%;">
			<el-table-column prop="order_no" label="订单号" width="120" >
			</el-table-column>
			<el-table-column prop="title" label="产品名称" width="125">
			</el-table-column>
			<el-table-column prop="mobile_phone" label="手机号码" width="120">
			</el-table-column>
			<el-table-column prop="realname" label="客户姓名" width="120">
			</el-table-column>
			<el-table-column prop="custom_annual_rate" label="年化收益率" width="80">
			</el-table-column>
			<el-table-column prop="expected_income" label="预期收益" width="120">
			</el-table-column>
			<el-table-column prop="limit_time" label="理财天数" width="80">
			</el-table-column>
			<el-table-column prop="create_time" label="购买时间" width="120">
			</el-table-column>
			<el-table-column prop="regular_end_time" label="到期时间" width="120">
			</el-table-column>
			<el-table-column prop="investment_amount" label="总投资金额" width="120">
			</el-table-column>
			<el-table-column prop="employee" label="业务员" width="120">
			</el-table-column>
			<el-table-column label="订单状态" width="120">
				<template scope="scope">
			      <span v-show="scope.row.status === -1">等待</span>
			      <span v-show="scope.row.status === 0">取消</span>
			      <span v-show="scope.row.status === 100">下单失败</span>
			      <span v-show="scope.row.status === 200">下单成功</span>
			      <span v-show="scope.row.status === 300">已完成/关闭</span>
				</template>
			</el-table-column>
			<el-table-column label="匹配记录" width="100" >
				<template scope="scope">
			       <el-button type="text" size="small"  @click="handleEdit(scope.$index, scope.row)">匹配详情</el-button>
				</template>
			</el-table-column>
			<el-table-column label="操作" min-width="100">
				<template scope="scope">
			       <el-button v-if="scope.row.state === 0" type="text" size="small" @click="handleEdit(scope.$index, scope.row)">赠送红包</el-button>
			      <el-button v-else type="text" size="small">已赠送</el-button>
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
		<el-dialog title="赠送红包" v-model="editFormVisible" :close-on-click-modal="false">
			<el-form :model="editForm" :label-position="labelPosition" label-width="100px" :rules="editFormRules" ref="editForm">
				<el-form-item label="客户名称:">
					<span>{{editForm.realname}}</span>
				</el-form-item>
				<el-form-item label="产品名称:">
					<span>{{editForm.title}}</span>
				</el-form-item>
				<el-form-item label="购买总金额:">
					<span>{{editForm.investment_amount}}</span>
				</el-form-item>
				<el-form-item label="赠送红包金额:">
					<el-input v-model="editForm.for_redpacket" auto-complete="off"></el-input>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click.native="editFormVisible = false">取消</el-button>
				<el-button type="primary" @click.native="editSubmit" :loading="editLoading">保存</el-button>
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
				labelPosition: 'left',
				value:'',
				list:[{
					value:'选项1',
					label:'成功'
				},{
					value:'选项1',
					label:'失败'
				},{
					value:'选项1',
					label:'等待'
				},{
					value:'选项1',
					label:'已完成'
				},{
					value:'选项1',
					label:'作废'
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
				editLoading: false,
				editFormRules: {
					name: [
						{ required: true, message: '请输入姓名', trigger: 'blur' }
					]
				},
				//编辑界面数据
				editForm: {
					id: 0,
					realname: '',
					title: '',
					investment_amount: '',
					for_redpacket: ''
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
				product:[{
					order_no: 'FP20161013000005',
					title: '度宝-6',
					mobile_phone: '13616529004',
					realname: '陈海平',
					custom_annual_rate: '7.1%',
					expected_income: '875.34',
					limit_time: '90',
					create_time: '2016-10-13 18:02:08',
					regular_end_time: '2017-01-12 18:02:08',
					investment_amount: '50000',
					employee: '蓝书彬',
					status: 0,
					state: 0
				},{
					order_no: 'FP20161013000005',
					title: '度宝-6',
					mobile_phone: '13616529004',
					realname: '陈海平',
					custom_annual_rate: '7.1%',
					expected_income: '875.34',
					limit_time: '90',
					create_time: '2016-10-13 18:02:08',
					regular_end_time: '2017-01-12 18:02:08',
					investment_amount: '50000',
					employee: '蓝书彬',
					status: -1,
					state: 1
				},{
					order_no: 'FP20161013000005',
					title: '蜜多宝3号-1',
					mobile_phone: '13616529004',
					realname: '陈海平',
					custom_annual_rate: '7.1%',
					expected_income: '875.34',
					limit_time: '90',
					create_time: '2016-10-13 18:02:08',
					regular_end_time: '2017-01-12 18:02:08',
					investment_amount: '50000',
					employee: '蓝书彬',
					status: 200,
					state: 0
				},{
					order_no: 'FP20161013000005',
					title: '蜜多宝3号-1',
					mobile_phone: '13616529004',
					realname: '陈海平',
					custom_annual_rate: '7.1%',
					expected_income: '875.34',
					limit_time: '90',
					create_time: '2016-10-13 18:02:08',
					regular_end_time: '2017-01-12 18:02:08',
					investment_amount: '50000',
					employee: '蓝书彬',
					status: 200,
					state: 0
				},{
					order_no: 'FP20161013000005',
					title: '蜜多宝3号-1',
					mobile_phone: '13616529004',
					realname: '陈海平',
					custom_annual_rate: '7.1%',
					expected_income: '875.34',
					limit_time: '90',
					create_time: '2016-10-13 18:02:08',
					regular_end_time: '2017-01-12 18:02:08',
					investment_amount: '50000',
					employee: '蓝书彬',
					status: 0,
					state: 0
				},{
					order_no: 'FP20161013000005',
					title: '蜜多宝3号-1',
					mobile_phone: '13616529004',
					realname: '陈海平',
					custom_annual_rate: '7.1%',
					expected_income: '875.34',
					limit_time: '90',
					create_time: '2016-10-13 18:02:08',
					regular_end_time: '2017-01-12 18:02:08',
					investment_amount: '50000',
					employee: '蓝书彬',
					status: 0,
					state: 0
				},{
					order_no: 'FP20161013000005',
					title: '蜜多宝3号-1',
					mobile_phone: '13616529004',
					realname: '陈海平',
					custom_annual_rate: '7.1%',
					expected_income: '875.34',
					limit_time: '90',
					create_time: '2016-10-13 18:02:08',
					regular_end_time: '2017-01-12 18:02:08',
					investment_amount: '50000',
					employee: '蓝书彬',
					status: 0,
					state: 0
				},{
					order_no: 'FP20161013000005',
					title: '蜜多宝3号-1',
					mobile_phone: '13616529004',
					realname: '陈海平',
					custom_annual_rate: '7.1%',
					expected_income: '875.34',
					limit_time: '90',
					create_time: '2016-10-13 18:02:08',
					regular_end_time: '2017-01-12 18:02:08',
					investment_amount: '50000',
					employee: '蓝书彬',
					status: 0,
					state: 0
				},{
					order_no: 'FP20161013000005',
					title: '蜜多宝3号-1',
					mobile_phone: '13616529004',
					realname: '陈海平',
					custom_annual_rate: '7.1%',
					expected_income: '875.34',
					limit_time: '90',
					create_time: '2016-10-13 18:02:08',
					regular_end_time: '2017-01-12 18:02:08',
					investment_amount: '50000',
					employee: '蓝书彬',
					status: 0,
					state: 0
				},{
					order_no: 'FP20161013000005',
					title: '蜜多宝3号-1',
					mobile_phone: '13616529004',
					realname: '陈海平',
					custom_annual_rate: '7.1%',
					expected_income: '875.34',
					limit_time: '90',
					create_time: '2016-10-13 18:02:08',
					regular_end_time: '2017-01-12 18:02:08',
					investment_amount: '50000',
					employee: '蓝书彬',
					status: 0,
					state: 0
				},{
					order_no: 'FP20161013000005',
					title: '蜜多宝3号-1',
					mobile_phone: '13616529004',
					realname: '陈海平',
					custom_annual_rate: '7.1%',
					expected_income: '875.34',
					limit_time: '90',
					create_time: '2016-10-13 18:02:08',
					regular_end_time: '2017-01-12 18:02:08',
					investment_amount: '50000',
					employee: '蓝书彬',
					status: 0,
					state: 0
				},{
					order_no: 'FP20161013000005',
					title: '蜜多宝3号-1',
					mobile_phone: '13616529004',
					realname: '陈海平',
					custom_annual_rate: '7.1%',
					expected_income: '875.34',
					limit_time: '90',
					create_time: '2016-10-13 18:02:08',
					regular_end_time: '2017-01-12 18:02:08',
					investment_amount: '50000',
					employee: '蓝书彬',
					status: 0,
					state: 0
				},{
					order_no: 'FP20161013000005',
					title: '蜜多宝3号-1',
					mobile_phone: '13616529004',
					realname: '陈海平',
					custom_annual_rate: '7.1%',
					expected_income: '875.34',
					limit_time: '90',
					create_time: '2016-10-13 18:02:08',
					regular_end_time: '2017-01-12 18:02:08',
					investment_amount: '50000',
					employee: '蓝书彬',
					status: 0,
					state: 0
				},{
					order_no: 'FP20161013000005',
					title: '蜜多宝3号-1',
					mobile_phone: '13616529004',
					realname: '陈海平',
					custom_annual_rate: '7.1%',
					expected_income: '875.34',
					limit_time: '90',
					create_time: '2016-10-13 18:02:08',
					regular_end_time: '2017-01-12 18:02:08',
					investment_amount: '50000',
					employee: '蓝书彬',
					status: 0,
					state: 0
				},{
					order_no: 'FP20161013000005',
					title: '蜜多宝3号-1',
					mobile_phone: '13616529004',
					realname: '陈海平',
					custom_annual_rate: '7.1%',
					expected_income: '875.34',
					limit_time: '90',
					create_time: '2016-10-13 18:02:08',
					regular_end_time: '2017-01-12 18:02:08',
					investment_amount: '50000',
					employee: '蓝书彬',
					status: 0,
					state: 0
				},{
					order_no: 'FP20161013000005',
					title: '蜜多宝3号-1',
					mobile_phone: '13616529004',
					realname: '陈海平',
					custom_annual_rate: '7.1%',
					expected_income: '875.34',
					limit_time: '90',
					create_time: '2016-10-13 18:02:08',
					regular_end_time: '2017-01-12 18:02:08',
					investment_amount: '50000',
					employee: '蓝书彬',
					status: 0,
					state: 0
				},{
					order_no: 'FP20161013000005',
					title: '蜜多宝3号-1',
					mobile_phone: '13616529004',
					realname: '陈海平',
					custom_annual_rate: '7.1%',
					expected_income: '875.34',
					limit_time: '90',
					create_time: '2016-10-13 18:02:08',
					regular_end_time: '2017-01-12 18:02:08',
					investment_amount: '50000',
					employee: '蓝书彬',
					status: 0,
					state: 0
				},{
					order_no: 'FP20161013000005',
					title: '蜜多宝3号-1',
					mobile_phone: '13616529004',
					realname: '陈海平',
					custom_annual_rate: '7.1%',
					expected_income: '875.34',
					limit_time: '90',
					create_time: '2016-10-13 18:02:08',
					regular_end_time: '2017-01-12 18:02:08',
					investment_amount: '50000',
					employee: '蓝书彬',
					status: 0,
					state: 0
				}]
			}
		},
		methods: {
			//状态显示转换
			// formatStatus: function (row, column) {
			// 	return row.status == 300 ? '已完成/关闭' : row.status == 0 ? '取消' : row.status == 100 ? '下单失败' : row.status == 200 ? '下单成功' : '等待';
			// },
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

<style lang="scss" scoped>
	label.el-form-item__label{
		text-align: left;
		width: 120px;
	}

</style>