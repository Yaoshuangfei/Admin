<template>
	<section>
		<!--工具条-->
		<el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
			<el-form :inline="true" :model="filters">
				<el-form-item>
					<el-input v-model="filters.title" placeholder="标题"></el-input>
				</el-form-item>
				<el-form-item label="分组标识:">
					<el-select v-model="filters.mark" placeholder="请选择" clearable>
					    <el-option
					      v-for="item in groupMarks"
					      :label="item.title"
					      :value="item.id">
					    </el-option>
				  	</el-select>
				</el-form-item>
				<span class="demonstration">开始时间：</span>
		        <el-date-picker v-model="filters.startTime" type="date" placeholder="选择日期时间">
		        </el-date-picker>
		        <span class="demonstration">失效时间：</span>
		        <el-date-picker v-model="filters.endTime" type="date" placeholder="选择日期时间">
		        </el-date-picker>
				<el-form-item>
					<el-button type="primary" v-on:click="getCouponList">查询</el-button>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" @click="handleAdd">添加</el-button>
				</el-form-item>
			</el-form>
		</el-col>

		<!--列表-->
		<el-table :data="coupon_list" border highlight-current-row v-loading="listLoading" style="width: 100%;">
			<el-table-column prop="title" label="标题" width="120" >
			</el-table-column>
			<el-table-column prop="detail" label="内容" width="125">
			</el-table-column>
			<el-table-column label="类型" width="120">
				<template scope="scope">
				    <span v-show="scope.row.type === 10">加息券</span>
				    <span v-show="scope.row.type === 30">红包</span>
				    <span v-show="scope.row.type === 40">体验金</span>
				</template>
			</el-table-column>
			<el-table-column label="价值" width="100">
				<template scope="scope">
				    <span v-show="scope.row.type === 10">+{{ scope.row.value }}%</span>
				    <span v-show="scope.row.type === 30">{{ scope.row.value }}元</span>
				    <span v-show="scope.row.type === 40">{{ scope.row.value }}元</span>
				</template>
			</el-table-column>
			<el-table-column prop="getPasswd" label="口令" width="120">
			</el-table-column>
			<el-table-column prop="everyCount" label="每人限领几次" width="120">
			</el-table-column>
			<el-table-column prop="outCount" label="发放数量" width="80">
			</el-table-column>
			<el-table-column prop="leftCount" label="剩余数量" width="80">
			</el-table-column>
			<el-table-column prop="createTime" :formatter = "formatter" label="创建时间" width="150">
			</el-table-column>
			</el-table-column>
			<el-table-column prop="beginTime" :formatter = "formatter" label="开始时间" width="150">
			</el-table-column>
			<el-table-column prop="endTime" :formatter = "formatter" label="失效时间" width="150">
			</el-table-column>
			<el-table-column prop="afterReceiveDays" label="领到后多少天" width="150">
			</el-table-column>
			<el-table-column label="是否直接投放" width="120" >
				<template scope="scope">
					<span v-if="scope.row.autoSend === 1">是</span>
					<span v-else>否</span>
				</template>
			</el-table-column>
			<el-table-column prop="remark" label="营运备注" width="125">
			</el-table-column>
			<el-table-column label="操作" width="170">
				<template scope="scope">
					<el-button type="text" v-if="scope.row.disabled === 1" size="small"  @click="handleOpenOrClose(scope.$index, scope.row)">开启</el-button>
					<el-button type="text" v-if="scope.row.disabled === 0" size="small"  @click="handleOpenOrClose(scope.$index, scope.row)">禁止领用</el-button>
					<el-button type="text" size="small" v-if="scope.row.disabled === 1" @click="handleEdit(scope.$index, scope.row)">查看</el-button>
					<el-button type="text" size="small" v-if="scope.row.disabled === 0" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
					<el-button type="text" @click="handleDel(scope.$index, scope.row)">删除</el-button>
				</template>
			</el-table-column>
		</el-table>

		<!--工具条-->
		<el-col :span="24" class="toolbar">
			<!-- <el-button type="danger" @click="batchRemove" :disabled="this.sels.length===0">批量删除</el-button> -->
			<el-pagination layout="prev, pager, next" @current-change="handleCurrentChange" :page-size="pageSize" :total="total" style="float:right;">
			</el-pagination>
		</el-col>

		<!--编辑界面-->
		<el-dialog title="编辑理财券" v-model="editFormVisible"  size="large" :close-on-click-modal="false">
			<el-form :model="editForm" :label-position="labelPosition" label-width="120px" :rules="editFormRules" ref="editForm">
				<el-row :gutter="10">
					<el-col :xs="24" :md="12">
						<el-form-item label="分组标识:">
							<el-select v-model="editForm.couponGroup.title" filterable="" allow-create placeholder="请选择" clearable :disabled="editForm.couponDisable">
							    <el-option
							      v-for="item in groupMarks"
							      :label="item.title"
							      :value="item.title">
							    </el-option>
						  	</el-select>
						  	<!-- <el-input style="width: auto" v-model="editForm.definedMark" @change="selectEditVal(editForm.couponGroup.title,editForm.definedMark)" :disabled="editForm.disableEditDefinedMark" auto-complete="off"></el-input> -->
						</el-form-item>
					</el-col>
					<el-col :xs="24" :md="12">
						<el-form-item label="是否直接投放:">
							<el-radio-group v-model="editForm.autoSend" :disabled="editForm.couponDisable">
								<el-radio class="radio" :label="1">是</el-radio>
								<el-radio class="radio" :label="0">否</el-radio>
							</el-radio-group>
						</el-form-item>
					</el-col>
		  			<el-col :xs="24" :md="12">
						<el-form-item label="理财券类型:">
							<el-select v-model="editForm.type" placeholder="请选择" :disabled="editForm.couponDisable">
							    <el-option
							      v-for="item in coupon_options"
							      :label="item.label"
							      :value="item.value">
							    </el-option>
							  </el-select>
						</el-form-item>
					</el-col>
					<el-col :xs="24" :md="12">
						<el-form-item label="标题:">
							<el-input v-model="editForm.title" auto-complete="off" :disabled="editForm.couponDisable"></el-input>
						</el-form-item>
					</el-col>
					<el-col :xs="24" :md="12">
						<el-form-item label="内容:">
							<el-input v-model="editForm.detail" auto-complete="off" :disabled="editForm.couponDisable"></el-input>
						</el-form-item>
					</el-col>
					<!-- 理财券为加息券时有 -->
					<el-col :xs="24" :md="12" v-if="editForm.type === 10">
						<el-form-item label="加息比例(%):">
							<el-input v-model="editForm.value" auto-complete="off" :disabled="editForm.couponDisable"></el-input>
						</el-form-item>
					</el-col>
					<el-col :xs="24" :md="12">
						<el-form-item label="发行总数:">
							<el-input v-model="editForm.outCount" auto-complete="off" :disabled="editForm.couponDisable"></el-input>
						</el-form-item>
					</el-col>
					<el-col :xs="24" :md="12">
						<el-form-item label="每人限领次数:">
							<el-input v-model="editForm.everyCount" auto-complete="off" :disabled="editForm.couponDisable"></el-input>
						</el-form-item>
					</el-col>
					<!-- 理财券为红包时有 -->
					<el-col :xs="24" :md="12" v-if="editForm.type === 30">
						<el-form-item label="起购天数限制:">
							<el-input v-model="editForm.maxBuyDays" auto-complete="off" :disabled="editForm.couponDisable"></el-input>
						</el-form-item>
					</el-col>
					<!-- 理财券为红包时有 -->
					<el-col :xs="24" :md="12" v-if="editForm.type === 30">
						<el-form-item label="起购金额:">
							<el-col :xs="4" :md="3">满</el-col>
							<el-col :xs="20" :md="9">
								<el-input type='number' v-model="editForm.minBuyMoney" placeholder="" :disabled="editForm.couponDisable"></el-input>
							</el-col>
							<el-col :xs="4" :md="3">减</el-col>
							<el-col :xs="20" :md="9">
								<el-input type='number' v-model="editForm.value" placeholder="" :disabled="editForm.couponDisable"></el-input>
							</el-col>
						</el-form-item>
					</el-col>
					<!-- 理财券为体验金额时有 -->
					<el-col :xs="24" :md="12" v-if="editForm.type === 40">
						<el-form-item label="体验金额:">
							<el-input v-model="editForm.value" auto-complete="off" :disabled="editForm.couponDisable"></el-input>
						</el-form-item>
					</el-col>
					<!-- 理财券为体验金额时有 -->
					<el-col :xs="24" :md="12" v-if="editForm.type === 40">
						<el-form-item label="体验期限（天）:">
							<el-input v-model="editForm.maxBuyDays" auto-complete="off" :disabled="editForm.couponDisable"></el-input>
						</el-form-item>
					</el-col>
					<!-- 理财券为体验金额时有 -->
					<el-col :xs="24" :md="12" v-if="editForm.type === 40">
						<el-form-item label="起投多少可用:">
							<el-input v-model="editForm.minBuyMoney" auto-complete="off" :disabled="editForm.couponDisable"></el-input>
						</el-form-item>
					</el-col>
					<el-col :xs="24" :sm="24" :md="24" :lg="24">
						<el-row :gutter="10">
							<el-col :xs="24" :md="4">
								<el-radio style="line-height: 36px" class="radio" v-model="editForm.receiveType" :label="20" :disabled="editForm.couponDisable">时间段</el-radio>
							</el-col>
							<el-col :xs="24" :md="10">
						    	<el-form-item label="开始时间:" v-if="editForm.receiveType === 20">
						    		<el-date-picker v-model="editForm.beginTime" type="datetime" placeholder="选择日期时间" :disabled="editForm.couponDisable"></el-date-picker>
						    	</el-form-item>
						    </el-col>
						    <el-col :xs="24" :md="10">
						    	<el-form-item label="失效时间:" v-if="editForm.receiveType === 20">
						    		<el-date-picker v-model="editForm.endTime" type="datetime" placeholder="选择日期时间" :disabled="editForm.couponDisable"></el-date-picker>
						    	</el-form-item>
						    </el-col>
						</el-row>
						<el-row :gutter="10">
							<el-col :xs="24" :md="4">
								<el-radio style="line-height: 36px" class="radio" v-model="editForm.receiveType" :label="10" :disabled="editForm.couponDisable">领到后多少天</el-radio>
							</el-col>
							<el-col :xs="24" :md="10">
								<el-form-item label="领到后多少天:"  v-if="editForm.receiveType === 10">
									<el-input v-model="editForm.afterReceiveDays" auto-complete="off" :disabled="editForm.couponDisable"></el-input>
								</el-form-item>
						    </el-col>
						</el-row>
				 	</el-col>
				 	<el-col :xs="24" :md="12">
						<el-form-item label="领取口令:">
							<el-input v-model="editForm.getPasswd" auto-complete="off" :disabled="editForm.couponDisable"></el-input>
						</el-form-item>
					</el-col>
					<el-col :xs="24" :md="12">
						<el-form-item label="运营备注:">
							<el-input v-model="editForm.remark" auto-complete="off" :disabled="editForm.couponDisable"></el-input>
						</el-form-item>
					</el-col>
				</el-row>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click.native="editFormVisible = false">取消</el-button>
				<el-button type="primary" @click.native="editSubmit" :loading="editLoading">提交</el-button>
			</div>
		</el-dialog>

		<!--新增界面-->
		<el-dialog title="添加理财券" v-model="addFormVisible" size="large" :close-on-click-modal="false">
			<el-form :model="addForm" :label-position="labelPosition" label-width="120px" :rules="addFormRules" ref="addForm">
				<el-row :gutter="10">
					<el-col :xs="24" :md="12">
						<el-form-item label="分组标识:">
							<el-select v-model="addForm.mark" filterable="" allow-create placeholder="请选择" clearable>
							    <el-option
							      v-for="item in groupMarks"
							      :label="item.title"
							      :value="item.title">
							    </el-option>
						  	</el-select>
						  	<!-- <el-input style="width: auto" v-model="addForm.definedMark" @change="selectVal(addForm.mark,addForm.definedMark)" :disabled="disableDefinedMark" auto-complete="off"></el-input> -->
						</el-form-item>
					</el-col>
					<el-col :xs="24" :md="12">
						<el-form-item label="是否直接投放:">
							<el-radio-group v-model="addForm.autoSend">
								<el-radio class="radio" :label="1">是</el-radio>
								<el-radio class="radio" :label="0">否</el-radio>
							</el-radio-group>
						</el-form-item>
					</el-col>
		  			<el-col :xs="24" :md="12">
						<el-form-item label="理财券类型:">
							<el-select v-model="addForm.type" placeholder="请选择">
							    <el-option
							      v-for="item in coupon_options"
							      :label="item.label"
							      :value="item.value">
							    </el-option>
							  </el-select>
						</el-form-item>
					</el-col>
					<el-col :xs="24" :md="12">
						<el-form-item label="标题:">
							<el-input v-model="addForm.title" auto-complete="off"></el-input>
						</el-form-item>
					</el-col>
					<el-col :xs="24" :md="12">
						<el-form-item label="内容:">
							<el-input v-model="addForm.detail" auto-complete="off"></el-input>
						</el-form-item>
					</el-col>
					<!-- 理财券为加息券时有 -->
					<el-col :xs="24" :md="12" v-if="addForm.type === 10">
						<el-form-item label="加息比例(%):">
							<el-input v-model="addForm.value" auto-complete="off"></el-input>
						</el-form-item>
					</el-col>
					<el-col :xs="24" :md="12">
						<el-form-item label="发行总数:">
							<el-input v-model="addForm.outCount" auto-complete="off"></el-input>
						</el-form-item>
					</el-col>
					<el-col :xs="24" :md="12">
						<el-form-item label="每人限领次数:">
							<el-input v-model="addForm.everyCount" auto-complete="off"></el-input>
						</el-form-item>
					</el-col>
					<!-- 理财券为红包时有 -->
					<el-col :xs="24" :md="12" v-if="addForm.type === 30">
						<el-form-item label="起购天数限制:">
							<el-input v-model="addForm.maxBuyDays" auto-complete="off"></el-input>
						</el-form-item>
					</el-col>
					<!-- 理财券为红包时有 -->
					<el-col :xs="24" :md="12" v-if="addForm.type === 30">
						<el-form-item label="起购金额:">
							<el-col :xs="4" :md="3">满</el-col>
							<el-col :xs="20" :md="9">
								<el-input type='number' v-model="addForm.minBuyMoney" placeholder=""></el-input>
							</el-col>
							<el-col :xs="4" :md="3">减</el-col>
							<el-col :xs="20" :md="9">
								<el-input type='number' v-model="addForm.value" placeholder=""></el-input>
							</el-col>
						</el-form-item>
					</el-col>
					<!-- 理财券为体验金额时有 -->
					<el-col :xs="24" :md="12" v-if="addForm.type === 40">
						<el-form-item label="体验金额:">
							<el-input v-model="addForm.value" auto-complete="off"></el-input>
						</el-form-item>
					</el-col>
					<!-- 理财券为体验金额时有 -->
					<el-col :xs="24" :md="12" v-if="addForm.type === 40">
						<el-form-item label="体验期限（天）:">
							<el-input v-model="addForm.maxBuyDays" auto-complete="off"></el-input>
						</el-form-item>
					</el-col>
					<!-- 理财券为体验金额时有 -->
					<el-col :xs="24" :md="12" v-if="addForm.type === 40">
						<el-form-item label="起投多少可用:">
							<el-input v-model="addForm.minBuyMoney" auto-complete="off"></el-input>
						</el-form-item>
					</el-col>
					<el-col :xs="24" :sm="24" :md="24" :lg="24">
						<el-row :gutter="10">
							<el-col :xs="24" :md="4">
								<el-radio style="line-height: 36px" class="radio" v-model="addForm.receiveType" label="20">时间段</el-radio>
							</el-col>
							<el-col :xs="24" :md="10">
						    	<el-form-item label="开始时间:" v-if="addForm.receiveType === '20'">
						    		<el-date-picker v-model="addForm.beginTime" type="datetime" placeholder="选择日期时间"></el-date-picker>
						    	</el-form-item>
						    </el-col>
						    <el-col :xs="24" :md="10">
						    	<el-form-item label="失效时间:" v-if="addForm.receiveType === '20'">
						    		<el-date-picker v-model="addForm.endTime" type="datetime" placeholder="选择日期时间"></el-date-picker>
						    	</el-form-item>
						    </el-col>
						</el-row>
						<el-row :gutter="10">
							<el-col :xs="24" :md="4">
								<el-radio style="line-height: 36px" class="radio" v-model="addForm.receiveType" label="10">领到后多少天</el-radio>
							</el-col>
							<el-col :xs="24" :md="10">
								<el-form-item label="领到后多少天:"  v-if="addForm.receiveType === '10'">
									<el-input v-model="addForm.afterReceiveDays" auto-complete="off"></el-input>
								</el-form-item>
						    </el-col>
						</el-row>
				 	</el-col>
				 	<el-col :xs="24" :md="12">
						<el-form-item label="领取口令:">
							<el-input v-model="addForm.getPasswd" auto-complete="off"></el-input>
						</el-form-item>
					</el-col>
					<el-col :xs="24" :md="12">
						<el-form-item label="运营备注:">
							<el-input v-model="addForm.remark" auto-complete="off"></el-input>
						</el-form-item>
					</el-col>
				</el-row>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click.native="addFormVisible = false">取消</el-button>
				<el-button type="primary" @click.native="addSubmit" :loading="addLoading">保存</el-button>
			</div>
		</el-dialog>
	</section>
</template>

<script>
	import util from '../../common/js/util'
	//import NProgress from 'nprogress'
	import { getUserListPage, removeUser, batchRemoveUser, editUser, addUser, baseUrl } from '../../api/api';
	import { state } from '../../vuex/state'

	export default {
		data() {
			return {
				labelPosition: 'left',
				value1:'',
				value2:'',
				filters: {
					title: '',
					mark: '',
					endTime:'',
					startTime:''
				},
				groupMarks: [],
				// package_options: [{
		  //         value: 10,
		  //         label: '计划礼包'
		  //       }, {
		  //         value: 20,
		  //         label: '标的礼包'
		  //       }],
				users: [],
				total: 0,
				page: 1,
				pageSize: 10,
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
				// editForm: {
				// 	id: 0,
				// 	name: '',
				// 	sex: -1,
				// 	age: 0,
				// 	birth: '',
				// 	addr: ''
				// },
				editForm: {
					id: '',
					couponGroup: {
						title: ''
					},
					// mark: '',
					definedMark: '',
					autoSend: 1,
					type: '',
					title: '',
					value: '',
					detail: '',
					// description: '',
					outCount: '',
					everyCount: '',
					maxBuyDays: '',
					minBuyMoney: '',
					receiveType: 10,
					beginTime: '',
					endTime: '',
					afterReceiveDays: '',
					remark: '',
					getPasswd: '',
					disableEditMark: false,
					disableEditDefinedMark: true,
					couponDisable: false
				},
				edit_coupon_options: [{
		          value: 30,
		          label: '红包'
		        }, {
		          value: 40,
		          label: '体验金'
		        }, {
		          value: 10,
		          label: '加息券'
		        }],
				addFormVisible: false,//新增界面是否显示
				addLoading: false,
				addFormRules: {
					name: [
						{ required: true, message: '请输入姓名', trigger: 'blur' }
					]
				},
				//新增界面数据
				addForm: {
					mark: '',
					definedMark: '',
					autoSend: 1,
					type: 30,
					title: '',
					value: '',
					detail: '',
					// description: '',
					outCount: '',
					everyCount: '',
					maxBuyDays: '',
					minBuyMoney: '',
					receiveType: '20',
					beginTime: '',
					endTime: '',
					afterReceiveDays: '',
					remark: '',
					getPasswd: '',
					disableMark: false,
					disableDefinedMark: false,
				},
				disableMark: false,
				disableDefinedMark: false,
				coupon_options: [{
		          value: 30,
		          label: '红包'
		        }, {
		          value: 40,
		          label: '体验金'
		        }, {
		          value: 10,
		          label: '加息券'
		        }],
		        checkFormVisible: false,//查看界面是否显示
				//理财列表显示
				coupon_list:[]
			}
		},
		methods: {
			// 选择分组标识
			selectVal(mark1,mark2) {
				if( mark1 === '' && mark2 === '') {
					this.disableMark = false
					this.disableDefinedMark = false
					console.log(1,mark1,mark2)
				} else if(mark2 !== '') {
					this.disableMark = true
					this.disableDefinedMark = false
					console.log(2,mark1,mark2)
				} else if(mark1 !== '') {
					this.disableMark = false
					this.disableDefinedMark = true
					console.log(3,mark1,mark2)
				} else {
					this.disableMark = false
					this.disableDefinedMark = false
					console.log(4,mark1,mark2)
				}
			},
			// 编辑选择分组标识
			selectEditVal(mark1,mark2) {
				if( mark1 === '' && mark2 === '') {
					this.editForm.disableEditMark = false
					this.editForm.disableEditDefinedMark = false
					console.log(1,mark1,mark2)
				} else if(mark2 !== '') {
					this.editForm.disableEditMark = true
					this.editForm.disableEditDefinedMark = false
					console.log(2,mark1,mark2)
				} else if(mark1 !== '') {
					this.editForm.disableEditMark = false
					this.editForm.disableEditDefinedMark = true
					console.log(3,mark1,mark2)
				} else {
					this.editForm.disableEditMark = false
					this.editForm.disableEditDefinedMark = false
					console.log(4,mark1,mark2)
				}
			},
			// selectVal() {
			// 	if( this.addForm.definedMark === '' && this.addForm.mark === '') {
			// 		this.disableMark = false
			// 		this.disableDefinedMark = false
			// 		console.log(1,this.addForm.mark,this.addForm.definedMark)
			// 	} else if(this.addForm.definedMark !== '') {
			// 		this.disableMark = true
			// 		this.disableDefinedMark = false
			// 		console.log(2,this.addForm.mark,this.addForm.definedMark)
			// 	} else if(this.addForm.mark !== '') {
			// 		this.disableMark = false
			// 		this.disableDefinedMark = true
			// 		console.log(3,this.addForm.mark,this.addForm.definedMark)
			// 	} else {
			// 		this.disableMark = false
			// 		this.disableDefinedMark = false
			// 		console.log(4,this.addForm.mark,this.addForm.definedMark)
			// 	}
			// },
			// 时间格式转换
			formatter(row,column){
				const curTime = row[column.property];
				if(curTime === null || curTime === '') {
					return null
				}
				return new Date(parseInt(curTime)).toLocaleString();
			},
			handleCurrentChange(val) {
				this.page = val;
				this.getCouponList();
			},
			//删除
			handleDel: function (index, row) {
				this.$confirm('确认删除该记录吗?', '提示', {
					type: 'warning'
				}).then(() => {
					this.listLoading = true;
					const params = {
			        	accountId: '',
			        	accessToken: '',
			            id: row.id
			        }
			        let that = this
		         	$.post(baseUrl+"/admin/coupon/deleteCouponById",
			            { param: JSON.stringify(params) },function(data){
			              	const info = JSON.parse(eval('(' + data + ')'));
			              	console.log(info)
			              	if(info.res === state.HTTPCODE.SUCCEED){
			              		that.$message({
			              			message: info.resMsg,
			              			type: 'success'
			              		});
			              		that.getCouponList()
			              	}else if(info.res === state.HTTPCODE.LOGINFAIL){
			                	that.$message({
			              			message: info.resMsg,
			              			type: 'error'
			              		});
			              	}else if(info.res === state.HTTPCODE.FAIL){
			              		that.$message({
			              			message: info.resMsg,
			              			type: 'error'
			              		});
			              	}
			            }
			       );
		         	that.listLoading = false;
					// NProgress.start();
					// let para = { id: row.id };
					// removeUser(para).then((res) => {
					// 	this.listLoading = false;
					// 	//NProgress.done();
					// 	this.$message({
					// 		message: '删除成功',
					// 		type: 'success'
					// 	});
					// 	this.getUsers();
					// });
				}).catch(() => {

				});
			},
			// 开启或禁止令用
			handleOpenOrClose: function (index, row) {
					this.listLoading = true;
					const params = {
			        	accountId: '',
			        	accessToken: '',
			            id: row.id,
			            disabled: row.disabled
			        }
			        let that = this
		         	$.post(baseUrl+"/admin/coupon/updateCouponDisabledById",
			            { param: JSON.stringify(params) },function(data){
			              	const info = JSON.parse(eval('(' + data + ')'));
			              	console.log(info)
			              	that.listLoading = false;
			              	if(info.res === state.HTTPCODE.SUCCEED){
			              		that.$message({
			              			message: info.resMsg,
			              			type: 'success'
			              		});
			              		that.getCouponList()
			              	}else if(info.res === state.HTTPCODE.LOGINFAIL){
			                	that.$message({
			              			message: info.resMsg,
			              			type: 'error'
			              		});
			              	}else if(info.res === state.HTTPCODE.FAIL){
			              		that.$message({
			              			message: info.resMsg,
			              			type: 'error'
			              		});
			              	}
			            }
			       );
			},
			//显示编辑界面
			handleEdit: function (index, row) {
				console.log('编辑',index,row)
				this.editFormVisible = true;
				this.editForm = Object.assign({}, row);
				if(row.disabled === 1) {
					this.editForm.couponDisable = true
				} else {
					this.editForm.couponDisable = false
				}
				// this.editForm.beginTime = new Date(parseInt(row.beginTime))
				this.editForm.beginTime = new Date(row.beginTime)
				this.editForm.endTime = new Date(row.endTime)
				console.log(this.editForm.beginTime)
			},
			//显示查看界面
			handleCheck: function (index, row) {
				this.checkFormVisible = true;
				this.editForm = Object.assign({}, row);
			},
			//显示新增界面
			handleAdd: function () {
				this.addFormVisible = true;
			},
			//编辑
			editSubmit: function () {
				this.$refs.editForm.validate((valid) => {
					if (valid) {
						this.$confirm('确认提交吗？', '提示', {}).then(() => {
							this.editLoading = true;
							let beginTime = '', endTime = ''
							if(this.editForm.beginTime === '' || this.editForm.beginTime === undefined) {
								beginTime = ''
							} else {
								beginTime = this.editForm.beginTime.getTime()
								console.log(beginTime)
							}
							if(this.editForm.endTime === '' || this.editForm.endTime === undefined) {
								endTime = ''
							} else {
								endTime = this.editForm.endTime.getTime()
								console.log(endTime)
							}
							const params = {
					        	accountId: '',
					        	accessToken: '',
					        	resourceType: '',
					        	title: this.editForm.couponGroup.title,
					            couponEntity: {
					            	id: parseInt(this.editForm.id),
				            	  	title: this.editForm.title,		//String
				            	  	detail: this.editForm.detail,		//String
				            	  	type: this.editForm.type,	//30=红包，10=加息，40=体验金	Integer
				            	  	value: parseFloat(this.editForm.value),		//Float
				            	  	beginTime: beginTime,	//使用起始时间	Date
				            	  	getPasswd: this.editForm.getPasswd,	//获取口令	String
				            	  	everyCount: parseInt(this.editForm.everyCount),	//每人领取次数	Integer
				            	  	autoSend: this.editForm.autoSend,	//是否自动发放	Integer
				            	  	endTime: endTime,	//结束时间	Date
				            	  	receiveType: this.editForm.receiveType,	//领取类型	String
				            	  	afterReceiveDays: this.editForm.afterReceiveDays,
				            	  	remark: this.editForm.remark, //运营备注
				            	  	outCount: parseInt(this.editForm.outCount),	//一共发多少张	Integer
				            	  	minBuyMoney: parseInt(this.editForm.minBuyMoney),	//最低购买金额,0为不限制	Integer
				            		maxBuyDays: parseInt(this.editForm.maxBuyDays)	//最大购买天数	Integer
					            }
					        }
					        console.log(params)
					        let that = this
				         	$.post(baseUrl+"/admin/coupon/updateCouponById",
					            { param: JSON.stringify(params) },function(data){
					              	const info = JSON.parse(eval('(' + data + ')'));
					              	console.log(info)
					              	that.editLoading = false;
					              	if(info.res === state.HTTPCODE.SUCCEED){
					              		// console.log(info.resMsg)
					              		that.editVisible = false;
					              		that.$message({
					              			message: info.resMsg,
					              			type: 'success'
					              		});
					              		that.getCouponList();
					                	// that.$router.push({ name: '审核标的', params: { borrowId: row.borrowId }})
					              	}else if(info.res === state.HTTPCODE.LOGINFAIL){
					                	that.$message({
					              			message: info.resMsg,
					              			type: 'error'
					              		});
					              	}else if(info.res === state.HTTPCODE.FAIL){
					              		that.$message({
					              			message: info.resMsg,
					              			type: 'error'
					              		});
					              	}
					            }
					       );
						});
							//NProgress.start();
						// 	let para = Object.assign({}, this.editForm);
						// 	para.birth = (!para.birth || para.birth == '') ? '' : util.formatDate.format(new Date(para.birth), 'yyyy-MM-dd');
						// 	editUser(para).then((res) => {
						// 		this.editLoading = false;
						// 		//NProgress.done();
						// 		this.$message({
						// 			message: '提交成功',
						// 			type: 'success'
						// 		});
						// 		this.$refs['editForm'].resetFields();
						// 		this.editFormVisible = false;
						// 		this.getUsers();
						// 	});
						// });
					}
				});
			},
			//新增
			addSubmit: function () {
				this.$refs.addForm.validate((valid) => {
					if (valid) {
						this.$confirm('确认提交吗？', '提示', {}).then(() => {
							// this.addLoading = true;
							// let markTitle = ''
							// if(this.disableMark === false && this.disableDefinedMark === true) {
							// 	markTitle = this.addForm.mark
							// } else if(this.disableMark === true && this.disableDefinedMark === false) {
							// 	markTitle = this.addForm.definedMark
							// } else {
							// 	this.$message({
							// 		message: '分组标识不能为空',
							// 		type: 'error'
							// 	});
							// 	return false
							// }
							let beginTime = '', endTime = ''
							if(this.addForm.beginTime === '' || this.addForm.beginTime === undefined) {
								beginTime = ''
							} else {
								beginTime = this.addForm.beginTime.getTime()
								console.log(beginTime)
							}
							if(this.addForm.endTime === '' || this.addForm.endTime === undefined) {
								endTime = ''
							} else {
								endTime = this.addForm.endTime.getTime()
								console.log(endTime)
							}
							// let params = {}
							// if(this.addForm.type === 30) {
							// 	params = {
							// 		accountId: '',
							// 		accessToken: '',
							// 		resourceType: '',
							// 		title: markTitle,
							// 	    couponEntity: {
							// 	      	title: this.addForm.title,		//String
							// 	      	detail: this.addForm.detail,		//String
							// 	      	type: this.addForm.type,	//30=红包，10=加息，40=体验金	Integer
							// 	      	value: parseFloat(this.addForm.value),		//Float
							// 	      	beginTime: beginTime,	//使用起始时间	Date
							// 	      	getPasswd: this.addForm.getPasswd,	//获取口令	String
							// 	      	everyCount: parseInt(this.addForm.everyCount),	//每人领取次数	Integer
							// 	      	autoSend: this.addForm.autoSend,	//是否自动发放	Integer
							// 	      	endTime: endTime,	//结束时间	Date
							// 	      	receiveType: this.addForm.receiveType,	//领取类型	String
							// 	      	afterReceiveDays: this.addForm.afterReceiveDays,
							// 	      	remark: this.addForm.remark, //运营备注
							// 	      	outCount: parseInt(this.addForm.outCount),	//一共发多少张	Integer
							// 	      	minBuyMoney: parseInt(this.addForm.minBuyMoney),	//最低购买金额,0为不限制	Integer
							// 	    	maxBuyDays: parseInt(this.addForm.maxBuyDays)	//最大购买天数	Integer
							// 	    }
							// 	}
							// } else if(this.addForm.type === 10) {
							// 	params = {
							// 		accountId: '',
							// 		accessToken: '',
							// 		resourceType: '',
							// 		title: markTitle,
							// 	    couponEntity: {
							// 	      	title: this.addForm.title,		//String
							// 	      	detail: this.addForm.detail,		//String
							// 	      	type: this.addForm.type,	//30=红包，10=加息，40=体验金	Integer
							// 	      	value: parseFloat(this.addForm.value),		//Float
							// 	      	beginTime: beginTime,	//使用起始时间	Date
							// 	      	getPasswd: this.addForm.getPasswd,	//获取口令	String
							// 	      	everyCount: parseInt(this.addForm.everyCount),	//每人领取次数	Integer
							// 	      	autoSend: this.addForm.autoSend,	//是否自动发放	Integer
							// 	      	endTime: endTime,	//结束时间	Date
							// 	      	receiveType: this.addForm.receiveType,	//领取类型	String
							// 	      	afterReceiveDays: this.addForm.afterReceiveDays,
							// 	      	remark: this.addForm.remark, //运营备注
							// 	      	outCount: parseInt(this.addForm.outCount)	//一共发多少张	Integer
							// 	    }
							// 	}

							// } else if(this.addForm.type === 40) {
							// 	params = {
							// 		accountId: '',
							// 		accessToken: '',
							// 		resourceType: '',
							// 		title: markTitle,
							// 	    couponEntity: {
							// 	      	title: this.addForm.title,		//String
							// 	      	detail: this.addForm.detail,		//String
							// 	      	type: this.addForm.type,	//30=红包，10=加息，40=体验金	Integer
							// 	      	value: parseFloat(this.addForm.value),		//Float
							// 	      	beginTime: beginTime,	//使用起始时间	Date
							// 	      	getPasswd: this.addForm.getPasswd,	//获取口令	String
							// 	      	everyCount: parseInt(this.addForm.everyCount),	//每人领取次数	Integer
							// 	      	autoSend: this.addForm.autoSend,	//是否自动发放	Integer
							// 	      	endTime: endTime,	//结束时间	Date
							// 	      	receiveType: this.addForm.receiveType,	//领取类型	String
							// 	      	afterReceiveDays: this.addForm.afterReceiveDays,
							// 	      	remark: this.addForm.remark, //运营备注
							// 	      	outCount: parseInt(this.addForm.outCount),	//一共发多少张	Integer
							// 	      	minBuyMoney: parseInt(this.addForm.minBuyMoney),	//最低购买金额,0为不限制	Integer
							// 	    	maxBuyDays: parseInt(this.addForm.maxBuyDays)	//最大购买天数	Integer
							// 	    }
							// 	}

							// } else {
							// 	this.$message({
							// 		message: '理财券类型不能为空',
							// 		type: 'error'
							// 	});
							// 	return false
							// }
							const params = {
					        	accountId: '',
					        	accessToken: '',
					        	resourceType: '',
					        	title: this.addForm.mark,
					            couponEntity: {
				            	  	title: this.addForm.title,		//String
				            	  	detail: this.addForm.detail,		//String
				            	  	type: this.addForm.type,	//30=红包，10=加息，40=体验金	Integer
				            	  	value: parseFloat(this.addForm.value),		//Float
				            	  	beginTime: beginTime,	//使用起始时间	Date
				            	  	getPasswd: this.addForm.getPasswd,	//获取口令	String
				            	  	everyCount: parseInt(this.addForm.everyCount),	//每人领取次数	Integer
				            	  	autoSend: this.addForm.autoSend,	//是否自动发放	Integer
				            	  	endTime: endTime,	//结束时间	Date
				            	  	receiveType: this.addForm.receiveType,	//领取类型	String
				            	  	afterReceiveDays: this.addForm.afterReceiveDays,
				            	  	remark: this.addForm.remark, //运营备注
				            	  	outCount: parseInt(this.addForm.outCount),	//一共发多少张	Integer
				            	  	minBuyMoney: parseInt(this.addForm.minBuyMoney),	//最低购买金额,0为不限制	Integer
				            		maxBuyDays: parseInt(this.addForm.maxBuyDays)	//最大购买天数	Integer
					              	// title: this.addForm.title,		//String
					              	// detail: this.addForm.detail,		//String
					              	// // description: this.addForm.description,		//String
					              	// // marketType: this.addForm.marketType,		//Integer
					              	// type: this.addForm.type,	//30=红包，10=加息，40=体验金	Integer
					              	// value: parseFloat(this.addForm.value),		//Float
					              	// minBuyMoney: parseInt(this.addForm.minBuyMoney),	//最低购买金额,0为不限制	Integer
					              	// beginTime: beginTime,	//使用起始时间	Date
					              	// // subjectId: this.addForm.subjectId,	//适用于什么产品	Integer
					              	// maxBuyDays: parseInt(this.addForm.maxBuyDays),	//最大购买天数	Integer
					              	// getPasswd: this.addForm.getPasswd,	//获取口令	String
					              	// everyCount: parseInt(this.addForm.everyCount),	//每人领取次数	Integer
					              	// outCount: parseInt(this.addForm.outCount),	//一共发多少张	Integer
					              	// // leftCount: this.addForm.leftCount,	//剩余多少张	Integer
					              	// // createTime: this.addForm.createTime,		//Date
					              	// autoSend: this.addForm.autoSend,	//是否自动发放	Integer
					              	// // disabled: this.addForm.disabled,		//Integer
					              	// endTime: endTime,	//结束时间	Date
					              	// receiveType: this.addForm.receiveType,	//领取类型	String
					              	// afterReceiveDays: this.addForm.afterReceiveDays
					            }
					        }
					        console.log(params)
					        let that = this
				         	$.post(baseUrl+"/admin/coupon/addCoupon",
					            { param: JSON.stringify(params) },function(data){
					              	const info = JSON.parse(eval('(' + data + ')'));
					              	console.log(info)
					              	that.addLoading = false;
					              	if(info.res === state.HTTPCODE.SUCCEED){
					              		// console.log(info.resMsg)
					              		that.addFormVisible = false;
					              		that.$message({
					              			message: info.resMsg,
					              			type: 'success'
					              		});
					              		that.getCouponList();
					              		this.disableMark = false
										this.disableDefinedMark = false
					                	// that.$router.push({ name: '审核标的', params: { borrowId: row.borrowId }})
					              	}else if(info.res === state.HTTPCODE.LOGINFAIL){
					                	that.$message({
					              			message: info.resMsg,
					              			type: 'error'
					              		});
					              	}else if(info.res === state.HTTPCODE.FAIL){
					              		that.$message({
					              			message: info.resMsg,
					              			type: 'error'
					              		});
					              	}
					            }
					       );
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
			// 获得分组标识
			getAllGroupList() {
				this.listLoading = true
				const params = {
		        	accountId: '',
		        	accessToken: '',
		        	resourceType: ''
		        }
		        let that = this
	         	$.post(baseUrl+"/admin/activity/getAllGroup",
		            { param: JSON.stringify(params) },function(data){
		              	const info = JSON.parse(eval('(' + data + ')'));
		              	console.log(info)
	                	that.groupMarks = info.obj
		            }
		       );
	         	that.listLoading = false
         	},
			// 请求礼包管理列表
			getCouponList() {
				this.listLoading = true
				let startTime = '', endTime = ''
				if(this.filters.startTime === '' || this.filters.startTime === undefined) {
					startTime = ''
				} else {
					startTime = this.filters.startTime.getTime()
					console.log(startTime)
				}
				if(this.filters.endTime === '' || this.filters.endTime === undefined) {
					endTime = ''
				} else {
					endTime = this.filters.endTime.getTime()
					console.log(endTime)
				}
		        const params = {
		        	accountId: '',
		        	accessToken: '',
		        	resourceType: '',
		            page: {
		              pageSize: this.pageSize,
		              pageNum: this.page
		            },
		            couponEntity: {
		            	title: this.filters.title,
		            	couponGroupId: this.filters.mark,
		            	beginTime: startTime.toString(),
		            	endTime: endTime.toString()
		            	// toLocaleString()
		            }
		        }
		        console.log(baseUrl)
		        let that = this
	         	$.post(baseUrl+"/admin/coupon/getCouponByParams",
		            { param: JSON.stringify(params) },function(data){
		            	// console.log(data)
		              	const info = JSON.parse(eval('(' + data + ')'));
		              	console.log(info)
		              	that.listLoading = false
		              	if(info.res === state.HTTPCODE.SUCCEED){
		                	console.log(info.obj.results)
		                	that.coupon_list = info.obj.results
		                	that.page = info.obj.pageNum
		                	that.total = info.obj.totalRecord
		                	that.pageSize = info.obj.pageSize
		                	// console.log(_this.table)
		              	}else if(info.res === state.HTTPCODE.LOGINFAIL){
		                	that.$message({
		                		message: info.resMsg,
		                		type: 'error'
		                	});
		              	}else if(info.res === state.HTTPCODE.FAIL){
		              		that.$message({
		              			message: info.resMsg,
		              			type: 'error'
		              		});
		              	}
		            }
		       );
         	},
		},
		mounted() {
			this.getAllGroupList();
			this.getCouponList();
		}
	}

</script>

<style scoped>

</style>
