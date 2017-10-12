<template>
	<section>
		<!--工具条-->
		<el-col :span="24" class="toolbar" style="padding-bottom: 0px;background: #fff" v-show="centertable">
			<el-form :inline="true">
				<el-form-item label="身份">
				    <el-select v-model="userType" clearable>
				      <el-option v-for="item in options" :label="item.label" :value="item.value">
				      </el-option>
				    </el-select>
				</el-form-item>
				<el-form-item label="条件">
					<el-input v-model="value" placeholder="姓名、昵称、手机、邮箱、身份证"></el-input>
				    <!-- <el-select v-model="type" clearable>
				      <el-option v-for="item in option" :label="item.label" :value="item.value">
				      </el-option>
				    </el-select> -->
				</el-form-item>
				<!-- <el-form-item>
				    <el-input v-model="value"></el-input>
				</el-form-item> -->
				<el-form-item>
					<el-button type="primary" v-on:click="getlistinit">查询</el-button>
				</el-form-item>
			</el-form>
		</el-col>
		<el-col :span="24" v-show="notgo" style="margin-bottom: 10px;">
			<el-col :span="4">
				<el-button type="primary" v-on:click="ungo">返回</el-button>
			</el-col>
			<el-col :span="6" v-show="accountFlowtable">
				<el-select v-model="typeFlow" clearable>
				      <el-option v-for="item in optionFlow" :label="item.label" :value="item.value">
				      </el-option>
				    </el-select>
				<el-button type="primary" v-on:click="showAccouont">查询</el-button>
			</el-col>
			<el-col :span="8" v-show="accountFlowtable" style="margin-top: 10px;">
				<el-col :span="3">昵称：</el-col>
				<el-col :span="4">{{userName}}</el-col>
				<el-col :span="3">手机号：</el-col>
				<el-col :span="5" style="margin-top:2px;">{{Phone}}</el-col>
				<el-col :span="4">总提现金额：</el-col>
				<el-col :span="4" style="margin-top:2px;">{{allMoney}}</el-col>
			</el-col>
		</el-col>
		<!--列表-->
		<el-table v-show="centertable" :data="table"  highlight-current-row v-loading="listLoading" style="width: 100%;min-width: 1080px;">
			<el-table-column prop="nickName" label="昵称">
			</el-table-column>
			<el-table-column prop="headImg" label="头像">
				<template scope="scope">
					<img class="img" v-if="scope.row.headImg === null" src="http://resources.51att.cn/ATTACHMENT/ATTACHMENT/1bccc3cf-8d44-4482-84e1-82d84d56e25c.png" alt="">
					<img v-else class="img" :src="scope.row.headImg" alt="">
				</template>
			</el-table-column>
			<el-table-column prop="realName" label="真实姓名">
			</el-table-column>
			<el-table-column prop="mobile" label="手机号">
			</el-table-column>
			<el-table-column prop="gender" :formatter='formatSex' label="性别">
			</el-table-column>
			<el-table-column prop="crade" :formatter='formatType'  label="会员身份">
			</el-table-column>
			<el-table-column prop="identityCard" label="身份证">
			</el-table-column>
			<el-table-column prop="email" label="邮箱">
			</el-table-column>
			<el-table-column prop="availableIncome" label="账户余额">
				<template scope="scope">
					<el-col style="cursor: pointer;">{{scope.row.availableIncome}}</el-col>
				</template>
			</el-table-column>
			<el-table-column prop="totalIncome"  label="扫码付收益">
				<template scope="scope">
					<el-col style="margin-left: 30px">/</el-col>
				</template>
			</el-table-column>
			<el-table-column prop="frozenIncome" label="冻结金额">
			</el-table-column>
			<el-table-column prop="availableIncome" label="可提金额">
			</el-table-column>
			<el-table-column prop="withdrawals" label="已提现">
			</el-table-column>
			<el-table-column prop="integral" label="金豆">
			</el-table-column>
			<el-table-column prop="bfTicket" label="便付券">
			</el-table-column>
			<!-- <el-table-column prop="quota" label="修改记录">
			</el-table-column> -->
			<el-table-column label="操作">
				<template scope="scope">
					<el-button type="text" @click="seeEditBtn(scope.row)" size="small">查看修改</el-button>
					<el-button type="text" size="small" @click="inviterBtn(scope.row)">查看上级</el-button>
					<el-button type="text" size="small" @click="downinviterBtn(scope.row)">查看下级</el-button>
					<el-button type="text" size="small" @click="evaluateBtn(scope.row)">商品评价</el-button>
					<el-button type="text" size="small" @click="accountFlowBtn(scope.row)">用户流水</el-button>
				</template>
			</el-table-column>
		</el-table>
		<!-- 查看上级 -->
		<el-table v-show="seeFormVisible" :data="rechargeList"  highlight-current-row v-loading="listLoading" style="width: 100%;min-width: 1080px;">
			<el-table-column prop="nickName" label="昵称">
			</el-table-column>
			<el-table-column prop="headImg" label="头像">
				<template scope="scope">
					<img style="width: 50px" :src="scope.row.headImg">
				</template>
			</el-table-column>
			<el-table-column prop="mobile" label="手机号码">
			</el-table-column>
			<el-table-column prop="crade" :formatter='formatterVip' label="会员等级">
			</el-table-column>
			<el-table-column prop="isAgent" :formatter='formatterType' label="是否是代理商">
			</el-table-column>
			<el-table-column prop="gender" :formatter='formatSex' label="性别">
			</el-table-column>
			<el-table-column prop="inviteTotal"  label="累计邀请人数">
			</el-table-column>
			<el-table-column label="操作">
				<template scope="scope">
					<el-button type="text" size="small" @click="inviterBtn(scope.row)">查看上级</el-button>
				</template>
			</el-table-column>
		</el-table>
		<!-- 下级   subordinatetable -->
		<el-table v-show="subordinatetable" :data="downList"  highlight-current-row v-loading="listLoading" style="width: 100%;min-width: 1080px;">
			<el-table-column prop="nickName" label="昵称">
			</el-table-column>
			<el-table-column prop="headImg" label="头像">
				<template scope="scope">
					<img style="width: 50px" :src="scope.row.headImg">
				</template>
			</el-table-column>
			<el-table-column prop="mobile" label="手机号码">
			</el-table-column>
			<el-table-column prop="crade" :formatter='formatterVip' label="会员等级">
			</el-table-column>
			<el-table-column prop="isAgent" :formatter='formatterType' label="是否是代理商">
			</el-table-column>
			<el-table-column prop="gender" :formatter='formatSex' label="性别">
			</el-table-column>
			<el-table-column prop="inviteTotal"  label="累计邀请人数">
			</el-table-column>
		</el-table>
		<!-- 佣金记录   commissiontable -->
		<el-table v-show="commissiontable" :data="commisTable"  highlight-current-row v-loading="listLoading" style="width: 100%;min-width: 1080px;">
			<el-table-column prop="orderGoodsId" label="订单商品编号">
			</el-table-column>
			<el-table-column prop="coreUserId" label="用户编号">
			</el-table-column>
			<el-table-column prop="totalMoney" label="分佣金额">
			</el-table-column>
			<el-table-column prop="createTime" :formatter='formatterTime' label="创建时间">
			</el-table-column>
			<el-table-column prop="updateTime" :formatter='formatterTime1' label="更新时间">
			</el-table-column>
			<el-table-column prop="thawingTime" :formatter='formatterTime2' label="解冻时间">
			</el-table-column>
			<el-table-column prop="remarks" label="备注信息">
			</el-table-column>
			<el-table-column prop="status" :formatter='formatterStatus' label="提现状态">
			</el-table-column>
		</el-table>
		<!-- 商品评价   evaluatetable -->
		<el-table v-show="evaluatetable" :data="evaltable"  highlight-current-row v-loading="listLoading" style="width: 100%;min-width: 1080px;">
			<el-table-column prop="userName" label="用户名">
			</el-table-column>
			<el-table-column prop="userHeadImg" label=" 评价人头像">
				<template scope="scope">
					<img style="width: 100px" :src="scope.row.userHeadImg">
				</template>
			</el-table-column>
			<el-table-column prop="content" label="评价内容">
			</el-table-column>
			<el-table-column prop="goodsScore" label="宝贝描述评分">
			</el-table-column>
			<el-table-column prop="sellerScore" label="卖家服务评分">
			</el-table-column>
			<el-table-column prop="logisticsScore" label="物流服务评分">
			</el-table-column>
			<el-table-column prop="crate" :formatter='formatCrate' label="评价等级">
			</el-table-column>
		</el-table>
		<!-- 用户流水   accountFlowtable -->
		<el-table v-show="accountFlowtable" :data="grlsTable"  highlight-current-row v-loading="listLoading" style="width: 100%;min-width: 1080px;">
			<el-table-column prop="orderMallId" label="编号">
			</el-table-column>
			<el-table-column prop="quota" label="金额">
			</el-table-column>
			<el-table-column prop="payType" :formatter='payTypeStr' label="支付方式">
			</el-table-column>
			<el-table-column prop="type" :formatter='pmTypeStr' label="类型">
			</el-table-column>
			<el-table-column prop="remark" label="备注">
			</el-table-column>
			<el-table-column prop="createTime" :formatter='formatterTime3' label="创建时间">
			</el-table-column>
		</el-table>
		<!--工具条-->
		<el-col :span="24" v-show="centertable" class="toolbar" style="background:#fff;">
			<el-pagination layout="prev, pager, next" @current-change="handleCurrentChange" :page-size="10" :total="total" style="float:right;">
			</el-pagination>
		</el-col>
		<el-col :span="24" v-show="commissiontable" class="toolbar" style="background:#fff;">
			<el-pagination layout="prev, pager, next" @current-change="handleCurrentChange1" :page-size="10" :total="total1" style="float:right;">
			</el-pagination>
		</el-col>
		<el-col :span="24" v-show="evaluatetable" class="toolbar" style="background:#fff;">
			<el-pagination layout="prev, pager, next" @current-change="handleCurrentChange2" :page-size="10" :total="total2" style="float:right;">
			</el-pagination>
		</el-col>
		<el-col v-if="accountFlowtable" :span="24" class="toolbar" style="background:#fff;">
			<el-pagination layout="prev, pager, next" @current-change="handleCurrentChange3" :page-size="10" :total="total3" style="float:right;">
			</el-pagination>
		</el-col>
		
		<el-dialog v-model="seeEditDis" title="查看修改" :close-on-click-modal="false" >
			<el-form label-width="100px">
				<el-form-item label="头像">
					<img v-if="seeEditDisFrom.headImg !== null" class="img" :src="seeEditDisFrom.headImg">
					<img v-else class="img" src="http://resources.51att.cn/ATTACHMENT/ATTACHMENT/1bccc3cf-8d44-4482-84e1-82d84d56e25c.png">
				</el-form-item>
				<el-form-item label="昵称">
					{{seeEditDisFrom.nickName}}
				</el-form-item>
				<el-form-item label="用户名">
					{{seeEditDisFrom.userName}}
				</el-form-item>
				<el-form-item label="手机号">
					{{seeEditDisFrom.mobile}}
				</el-form-item>
				<el-form-item label="邮箱">
					{{seeEditDisFrom.email}}
				</el-form-item>
				<el-form-item label="账户余额">
					<el-input style="width: 100px" v-model="seeEditDisFrom.availableIncome"></el-input>
				</el-form-item>
				<el-form-item label="冻结金额">
					{{seeEditDisFrom.frozenIncome}}
				</el-form-item>
				<el-form-item label="已提现金额">
					{{seeEditDisFrom.withdrawals}}
				</el-form-item>
				<el-form-item label="平台身份">
					<el-select v-model="seeEditDisFrom.crade" placeholder="请选择">
						<el-option
					      v-for="item in cradeList"
					      :key="item.value"
					      :label="item.label"
					      :value="item.value">
					    </el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="修改原因">
					<el-input type="textarea" :rows="2" v-model="reasons"></el-input>
				</el-form-item>
				<el-col :span='24'></el-col>
			</el-form>
			<div slot="footer" class="dialog-footer" style="text-align: center;">
				<el-button type="primary" @click="userMonEdit">修改</el-button>
				<el-button type="primary" @click.native="seeEditDis = false">关闭</el-button>
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
				Phone:'',
				allMoney:'',
				userName:'',
				reasons:'',
				crade:'',
				Compared_availableIncome:'',
				Compared_crade:'',
				cradeList:[
					{
						value:1,
						label:'普通'
					},
					{
						value:2,
						label:'创客'
					},
					{
						value:3,
						label:'创客商'
					}
				],
				downList:[],
				grlsTable:[],
				typeFlow:'',
				userType:'',
				type:'',
				value:'',
				seeEditDis:false,
				seeEditDisFrom:{},
				rechargeList:[],
				centertable:true,//主体table
				seeFormVisible: false,//上级
				subordinatetable:false,//下级

				commissiontable:false,//佣金
				evaluatetable:false,//评价
				accountFlowtable:false,//流水
				notgo:false,
				optionFlow:[
					{
						value: 1,
		          		label: '提现'
					},{
						value: 2,
		          		label: '分佣'
					},{
						value: 3,
		          		label: '业务充值'
					},{
						value: 4,
		          		label: '余额充值'
					},{
						value: 5,
		          		label: '商品购买'
					},{
						value: 6,
		          		label: '店铺身份购买'
					},{
						value: 7,
		          		label: '平台身份购买'
					},{
						value: 8,
		          		label: '补货'
					},{
						value: 9,
		          		label: '金豆充值'
					},{
						value: 10,
		          		label: '金豆支出'
					}
				],
				option:[{
		          value: 0,
		          label: '全部'
		        },{
		          value: 1,
		          label: '昵称'
		        },{
		          value: 2,
		          label: '真实姓名'
		        },{
		          value: 3,
		          label: '手机号'
		        },{
		          value: 4,
		          label: '身份证'
		        },{
		          value: 5,
		          label: '邮箱'
		        }],
				options: [{
		          value: 1,
		          label: '普通'
		        },{
		          value: 2,
		          label: '创客'
		        },{
		          value: 3,
		          label: '创客商'
		        }],                     
				total: 0,
				page: 1,
				total1: 0,
				page1:1,
				listLoading: false,
				table:[],
				commisTable:[],
				evaltable:[],
				yjid:'',
				pjid:'',
				lsid:'',
				page2:1,
				total2:0,
				page3:1,
				total3:0
			}
		},
		methods: {
			formatSex: function (row, column) {
				return row.gender == 1 ? '男' : row.gender == 2 ? '女' : '未知';
			},
			formatterVip: function (row, column) {
				console.log(row.crade)
				return row.crade == 2 ? '创客' : row.crade == 3 ? '创客商' : '普通';
			},
			formatterType: function (row, column) {
				return row.isAgent == 1 ? '是' : row.isAgent == 0 ? '否' : '未知';
			},
			// 修改账户余额
			userMonEdit(){
				const _this = this
				const params = {
					id:this.seeEditDisFrom.id,
					reasons:this.reasons,
					crade:null,
					availableIncome:null
				}
				if(this.Compared_availableIncome !== this.seeEditDisFrom.availableIncome){
					params.availableIncome = this.seeEditDisFrom.availableIncome
				}
				if(this.Compared_crade !== this.seeEditDisFrom.crade){
					params.crade = this.seeEditDisFrom.crade
				}
				console.log(params)
				if(this.Compared_availableIncome === this.seeEditDisFrom.availableIncome && this.Compared_crade === this.seeEditDisFrom.crade){
					return
				}
				$.ajax({
	                type:'POST',
	                dataType:'json',
	                url:baseUrl+"/api/admin/userInfo/update/userInfo",
	                data:JSON.stringify(params),
	                contentType:'application/json;charset=utf-8',
	                success:function(data){
	                  	console.log(data)
	                  	if(data.code === 1){
	                  		alert(data.msg)
	                  		_this.seeEditDis = false
	                  	}else{
	                  		alert(data.msg)
	                  	}
	                }
	            });
			},
			seeEditBtn(row){
				console.log(row)
				this.seeEditDis = true
				this.seeEditDisFrom = row
				this.Compared_availableIncome = row.availableIncome
				this.Compared_crade = row.crade
			},
			ungo(){
				this.centertable = true
				this.notgo = false
				this.commissiontable = false//佣金
				this.evaluatetable = false//评价
				this.accountFlowtable = false//流水
				this.seeFormVisible = false//上级
				this.subordinatetable = false//下级
				this.typeFlow = ''
			},
			formatType(row, column){
				let type =''
				if(row.crade === 1){
					 type = '普通' 
				}else if(row.crade === 2){
					 type = '创客'
				}else if(row.crade === 3){
					 type = '创客商'
				}
				return type
			},
			payTypeStr(row, column){
				let type =''
				if(row.payType === 0){
					 type = '微信支付' 
				}else if(row.payType === 1){
					 type = '支付宝支付'
				}else if(row.payType === 2){
					 type = '银联支付'
				}else if(row.payType === 3){
					 type = '余额支付'
				}else if(row.payType === 4){
					 type = '余额金豆混合支付'
				}else if(row.payType === 5){
					 type = '金豆支付'
				}
				return type
			},
			pmTypeStr(row, column){
				let type =''
				if(row.type === 1){
					 type = '提现' 
				}else if(row.type === 2){
					 type = '分佣'
				}else if(row.type === 3){
					 type = '业务充值'
				}else if(row.type === 4){
					 type = '余额充值'
				}else if(row.type === 5){
					 type = '商品购买'
				}else if(row.type === 6){
					 type = '店铺身份购买'
				}else if(row.type === 7){
					 type = '平台身份购买 '
				}else if(row.type === 8){
					 type = '补货'
				}else if(row.type === 9){
					 type = '金豆充值'
				}else if(row.type === 10){
					 type = '金豆支出'
				}else if(row.type === 11){
					 type = '店铺收入'
				}
				return type
			},
			formatterTime(row,column){
                let curTime = row.createTime;
                if(curTime !== null){
	                curTime = new Date(curTime).toLocaleString()
	                return curTime
                }
            },
            formatterTime1(row,column){
                let curTime = row.updateTime;
                if(curTime !== null){
	                curTime = new Date(curTime).toLocaleString()
	                return curTime
                }
            },
            formatterTime2(row,column){
                let curTime = row.thawingTime;
                if(curTime !== null){
	                curTime = new Date(curTime).toLocaleString()
	                return curTime
                }
            },
            formatterTime3(row,column){
                let curTime = row.createTime;
                if(curTime !== null){
	                curTime = new Date(curTime).toLocaleString()
	                return curTime
                }
            },
            formatterStatus(row,column){
            	return row.status == 1 ? '冻结中' : row.status == 2 ? '已解冻 ' : '退款作废';
            },
            formatCrate(row,column){
            	return row.crate == 1 ? '好评' : row.crate == 2 ? '中评 ' : '差评';
            },
            // 搜索
			getlistinit(){
				this.page = 0
				this.getlist()
			},
			// 初始化列表
			getlist(){
				const _this = this
				const params = {
					pageNum:this.page,
					size:10,
					crade:_this.userType,
					conditions:_this.value
				}
				console.log(params)
				$.ajax({
	                type:'POST',
	                dataType:'json',
	                url:baseUrl+"/api/admin/userInfo/find/member",
	                data:JSON.stringify(params),
	                contentType:'application/json;charset=utf-8',
	                success:function(data){
	                  	console.log(data)
	                 	_this.table = data.data.list
	                 	_this.total = data.data.total
	                }
	            });
			},
			// 查看上级
			inviterBtn(row) {
				const _this = this
				
				_this.rechargeList = []
				console.log(row)
				if(row.inviterId === null){
					alert('没有上级')
					return
				}
				this.centertable = false
				this.seeFormVisible = true
				this.notgo = true
				_this.rechargeList = []
				const params = {
					inviterId:row.inviterId
				}
				console.log(row.inviterId)
				$.ajax({
	                type:'POST',
	                dataType:'json',
	                url:baseUrl+"/api/admin/userInfo/person/superior",
	                data:JSON.stringify(params),
	                contentType:'application/json;charset=utf-8',
	                success:function(data){
	                  	console.log(data)
	                  	if(data.data !== null){
	                  		_this.rechargeList.push(data.data) 
	                  	}

	                }
	            });
			},
			// 查看下级
			downinviterBtn(row) {
				const _this = this
				_this.subordinatetable = true
				_this.centertable = false
				_this.notgo = true
				// _this.downList = []
				const params = {
					userId:row.id,
					pageNum:this.page,
					size:10
				}
				$.ajax({
	                type:'POST',
	                dataType:'json',
	                url:baseUrl+"/api/admin/userInfo/person/subordinate",
	                data:JSON.stringify(params),
	                contentType:'application/json;charset=utf-8',
	                success:function(data){
	                  	console.log(data)
	                  	_this.downList = data.data.list
	                  	console.log(_this.downList)
	                }
	            });
			},
			//佣金记录
			commissionBtn(row) {
				this.yjid = row.id
				this.notgo = true
				this.showCommiss()
			},
			showCommiss(){
				const _this = this
				const params = {
					userId:this.yjid,
					pageNum:this.page1,
					size:10
				}
				console.log(params)
				$.ajax({
	                type:'POST',
	                dataType:'json',
	                url:baseUrl+"/api/admin/userInfo/person/commission",
	                data:JSON.stringify(params),
	                contentType:'application/json;charset=utf-8',
	                success:function(data){
	                  	console.log(data)
	                  	_this.centertable = false
	                  	_this.commissiontable = true
	                  	_this.commisTable = data.data.list
	                  	_this.total1 = data.data.total
	                  	console.log(_this.commisTable)
	                }
	            });
			},
			//商品评价记录
			evaluateBtn(row) {
				this.pjid = row.id
				this.notgo = true
				this.showEvaluat()
			},
			showEvaluat(){
				const _this = this
				const params = {
					userId:this.pjid,
					pageNum:this.page2,
					size:10
				}
				$.ajax({
	                type:'POST',
	                dataType:'json',
	                url:baseUrl+"/api/admin/userInfo/person/evaluate",
	                data:JSON.stringify(params),
	                contentType:'application/json;charset=utf-8',
	                success:function(data){
	                  	console.log(data)
	                  	_this.total2 = data.data.total
	                  	_this.evaltable = data.data.list
	                  	_this.centertable = false
	                  	_this.evaluatetable = true
	                }
	            });
			},
			//个人流水记录
			accountFlowBtn(row) {
				console.log(row)
				this.lsid = row.id
				this.notgo = true
				this.userName = row.nickName
				this.Phone = row.mobile
				this.allMoney = row.withdrawals

				this.showAccouont()
			},
			showAccouont() {
				const _this = this
				const params = {
					userId:this.lsid,
					pageNum:this.page3,
					size:10,
					type:null
				}
				if(this.typeFlow !== ''){
					params.type = this.typeFlow
				}
				console.log(params)
				$.ajax({
	                type:'POST',
	                dataType:'json',
	                url:baseUrl+"/api/admin/userInfo/person/accountFlow",
	                data:JSON.stringify(params),
	                contentType:'application/json;charset=utf-8',
	                success:function(data){
	                  	console.log(data)
	                  	_this.centertable = false
	                  	_this.accountFlowtable = true
	                  	_this.total3 = data.data.total
	                  	_this.grlsTable = data.data.list
	                  	for (var i = 0; i < _this.grlsTable.length; i++) {
	                  		if(_this.grlsTable[i].pmType === 0){
	                  			_this.grlsTable[i].quota = '-'+_this.grlsTable[i].quota
	                  		}else{
	                  			_this.grlsTable[i].quota = '+'+_this.grlsTable[i].quota
	                  		}
	                  	}
	                }
	            });
			},
			//分页
			handleCurrentChange(val) {
				this.page = val;
				this.getlist();
			},
			handleCurrentChange1(val) {
				this.page1 = val;
				this.showCommiss();
			},
			handleCurrentChange2(val) {
				this.page2 = val;
				this.showEvaluat();
			},
			handleCurrentChange3(val) {
				this.page3 = val;
				this.showAccouont();
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
	.img {
		width:70px;
		height:70px;
	}
</style>