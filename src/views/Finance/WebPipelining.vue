<template>
	<section>
		<!--工具条-->
		<el-col :span="24" class="toolbar" style="padding-bottom: 0px;background: #fff">
			<el-form :inline="true">
				<el-date-picker v-model="startTime" type="date" placeholder="选择日期时间">
		        </el-date-picker>
		        <span class="demonstration">至</span>
		        <el-date-picker v-model="endTime" type="date" placeholder="选择日期时间">
		        </el-date-picker>
				<el-form-item label="支付方式">
					<el-select v-model="payType" clearable>
				      <el-option v-for="item in selectSubjectStatus" :label="item.label" :value="item.value">
				      </el-option>
				    </el-select>
				</el-form-item>
				<el-form-item label="搜索条件">
					<el-input v-model="value" placeholder="订单编号、用户名、手机号"></el-input>
				    <!-- <el-select v-model="type" clearable>
				      <el-option v-for="item in options" :label="item.label" :value="item.value">
				      </el-option>
				    </el-select> -->
				</el-form-item>
				<!-- <el-form-item>
				    <el-input v-model="value"></el-input>
				</el-form-item> -->
				<el-form-item>
					<el-button type="primary" v-on:click="getlist">查询</el-button>
				</el-form-item>
			</el-form>
		</el-col>

		<!--列表-->
		<el-table :data="orderInformation" border highlight-current-row v-loading="listLoading" style="width: 100%;min-width: 1080px;">
			<el-table-column prop="tradeNo" label="订单编号">
			</el-table-column>
			<el-table-column prop="userName" label="用户名">
			</el-table-column>
			<el-table-column prop="mobile" label="手机号">
			</el-table-column>
			<el-table-column prop="quota" label="金额">
			</el-table-column>
			<el-table-column prop="payType" :formatter='formatterType' label="支付方式">
			</el-table-column>
			<el-table-column prop="createTime" :formatter='formatterTime' label="创建时间">
			</el-table-column>
			<el-table-column prop="remark" label="备注">
			</el-table-column>
			<!-- <el-table-column label="操作">
				<template scope="scope">
					<el-button v-if='scope.row.index === 1' type='text' size="small" @click="handleEdit(scope.$index, scope.row)">暂停</el-button>
					<el-button v-else-if='scope.row.index === 0' :disabled="true" type='text' size="small" @click="handleEdit(scope.$index, scope.row)">已处理</el-button>
					<el-button type="text" size="small" @click="seeBtn(scope.$index, scope.row)">查看</el-button>
					<el-button type="text" size="small" @click="handleEdit(scope.$index, scope.row)">删除</el-button>
				</template>
			</el-table-column> -->
		</el-table>

		<!--工具条-->
		<el-col :span="24" class="toolbar" style="background:#fff;">
			<!-- <el-button type="danger" @click="batchRemove" :disabled="this.sels.length===0">批量删除</el-button> -->
			<el-pagination layout="prev, pager, next" @current-change="handleCurrentChange" :page-size="20" :total="total" style="float:right;">
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
				startTime:'',
				endTime:'',
				payType:'',
				type:'',
				value:'',
				selectSubjectStatus: [
				{
					value:'',
					label:'全部'
				},{
					value:'0',
					label:'微信支付'
				},{
					value:'1',
					label:'支付宝支付'
				},{
					value:'2',
					label:'银联支付'
				},{
					value:'3',
					label:'余额支付'
				},{
					value:'4',
					label:'余额金豆混合支付'
				},{
					value:'5',
					label:'金豆支付'
				}],
				options: [{
		          value: '',
		          label: '全部'
		        }, {
		          value: '1',
		          label: '订单编号'
		        }, {
		          value: '2',
		          label: '用户名'
		        }, {
		          value: '3',
		          label: '手机号'
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
				cxparams:{}
			}
		},
		methods: {
			//性别显示转换
			formatSex: function (row, column) {
				return row.sex == 1 ? '男' : row.sex == 0 ? '女' : '未知';
			},
			getlist(){
				const _this = this
				this.listLoading = true;
				if(this.startTime !== ''){
					_this.startTime = state.formatDate(_this.startTime)
				}
				if(this.endTime !== ''){
					_this.endTime = state.formatDate(_this.endTime)
				}
				const params = {
					pageNum:this.page,
					pageSize:20,
					startTime:_this.startTime,
					endTime:_this.endTime,
					payType:_this.payType,
					conditions:this.value,
					sort:'4'
				}
				// if(_this.type === '1'){
				// 	params.tradeNo = this.value
				// }else if(_this.type === '2'){
				// 	params.userName = this.value
				// }else if(_this.type === '3'){
				// 	params.mobile = this.value
				// }
				console.log(params)
				_this.cxparams = params
				$.ajax({
	                type:'POST',
	                dataType:'json',
	                url:baseUrl+'/api/admin/userCashFlow/selectFlowList',
	                data:JSON.stringify(params),
	                contentType:'application/json;charset=utf-8',
	                success:function(data){
	                  	const info = data.data.list
	                  	_this.total = data.data.total
	                  	_this.orderInformation = info
	                  	console.log(info)
	                  	_this.listLoading = false;
	                  	_this.startTime = ''
	                  	_this.endTime = ''
	                  	for (var i = 0; i < _this.orderInformation.length; i++) {
	                  		if(_this.orderInformation[i].pmType === 0){
	                  			_this.orderInformation[i].quota = '-'+_this.orderInformation[i].quota
	                  		}else{
	                  			_this.orderInformation[i].quota = '+'+_this.orderInformation[i].quota
	                  		}
	                  	}
	                }
	            })
			},
			handleCurrentChange(val) {
				this.page = val;
				this.getcxlist();
			},
			getcxlist(){
				const _this = this
				const params = _this.cxparams
				params.pageNum = this.page
				this.listLoading = true
				console.log(_this.cxparams)
				$.ajax({
	                type:'POST',
	                dataType:'json',
	                url:baseUrl+'/api/admin/userCashFlow/selectFlowList',
	                data:JSON.stringify(_this.cxparams),
	                contentType:'application/json;charset=utf-8',
	                success:function(data){
	                  	const info = data.data.list
	                  	_this.total = data.data.total
	                  	_this.orderInformation = info
	                  	console.log(info)
	                  	_this.listLoading = false;
	                  	for (var i = 0; i < _this.orderInformation.length; i++) {
	                  		if(_this.orderInformation[i].pmType === 0){
	                  			_this.orderInformation[i].quota = '-'+_this.orderInformation[i].quota
	                  		}else{
	                  			_this.orderInformation[i].quota = '+'+_this.orderInformation[i].quota
	                  		}
	                  	}
	                }
	            })
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
			//格式化时间
			formatterTime(row,column){
                let curTime = row.createTime;
                curTime = new Date(curTime).toLocaleString()
                return curTime
            },
            //格式化支付类型
            formatterType(row,column){
                let curType = row.payType;
                if(curType === 0){
                	curType = '微信支付'
                }else if(curType === 1){
                	curType = '支付宝支付'
                }else if(curType === 2){
                	curType = '银联支付'
                }else if(curType === 3){
                	curType = '余额支付'
                }else if(curType === 4){
                	curType = '余额金豆混合支付'
                }else if(curType === 5){
                	curType = '金豆支付'
                }
                return curType
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