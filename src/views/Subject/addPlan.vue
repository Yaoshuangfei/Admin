<template>
	<el-row>
		<el-col :xs="24" :sm="24" :md="24" :lg="24" class="bottom_num">
			<el-row>
				<!-- <el-col :xs="24" :sm="24" :md="24" :lg="24" class="headinfo">
					审核借款信息
				</el-col> -->
				<el-col :xs="24" :sm="24" :md="24" :lg="24" class="namebody">
					<el-form label-position="left" :inline="true" ref="form" :model="form" label-width="150px">
					  <el-form-item label="计划名称：">
					     <el-input v-model="form.title"></el-input>
					  </el-form-item>
					  <el-form-item style="width: 20%" label="列表状态右侧标签内容：">
					     <el-checkbox v-model="isNewer">新人专享</el-checkbox>
					  </el-form-item>
					  <el-form-item style="width: 20%">
					     <el-input v-model="form.rightTopTitle"></el-input>
					  </el-form-item>
					  <el-form-item label="详情页顶部文字描述：">
					     <el-input v-model="form.productDescription"></el-input>
					  </el-form-item>
					  <el-form-item label="预期年化：">
					     <el-input v-model="form.expectedAnnualRate"></el-input>
					  </el-form-item>
					  <el-form-item label="活动加的年华收益：">
					     <el-input v-model="form.addAnnualRate"></el-input>
					  </el-form-item>
					  <el-form-item label="计划可购买时间：">
					  <el-date-picker
				      v-model="form.beginTime"
				      type="date"
				      placeholder="选择日期"
				      :picker-options="pickerOptions">
				    	</el-date-picker>
					     <!-- <el-input v-model="form.beginTime"></el-input> -->
					  </el-form-item>
					  <el-form-item label="融资总金额：">
					     <el-input v-model="form.financingAmount"></el-input>
					  </el-form-item>
					  <el-form-item label="剩余资金：">
					     <el-input v-model="form.remainingAmount"></el-input>
					  </el-form-item>
					  <el-form-item label="计息方式：">
					     <el-select v-model="bearingTheWayId">
				        <el-option v-for="item in repayMentTheWayList" :label="item.title" :value="item.id">
				        </el-option>
				      </el-select>
					  </el-form-item>
					  <el-form-item label="理财期限(天)：">
					     <el-input v-model="form.timeLimit"></el-input>
					  </el-form-item>
					  <el-form-item label="还款方式：">
					      <el-select v-model="repaymentId">
					        <el-option v-for="item in subjectBearingTheWayList" :label="item.title" :value="item.id">
					        </el-option>
					      </el-select>
					      <!-- <el-select v-model="repaymentIdTime">
					        <el-option v-for="item in list2" :label="item.name" :value="item.value">
					        </el-option>
					      </el-select> -->
					  </el-form-item>
					  <el-form-item label="保障信息：">
					     <el-input v-model="form.safeInfomation"></el-input>
					  </el-form-item>
					  <!-- <el-form-item label="产品简述：">
					     <el-input v-model="form.productDescription"></el-input>
					  </el-form-item> -->
					  <el-form-item label="起购金额最低：">
					     <el-input v-model="form.purchaseMinAmount"></el-input>
					  </el-form-item>
					  <el-form-item label="没人购买上线金额,0无上限：">
					     <el-input v-model="form.purchaseLimitPerPeople"></el-input>
					  </el-form-item>
					  <el-form-item label="没人购买上线次数,0无上限：">
					     <el-input v-model="form.purchaseLimitCount"></el-input>
					  </el-form-item>
					  <el-form-item label="合同模板：">
					     <el-select v-model="contractTypeId">
				        <el-option v-for="item in list3" :label="item.name" :value="item.value">
				        </el-option>
				      </el-select>
					  </el-form-item>
					  <el-form-item label="是否可以使用理财券：">
					    <el-radio-group v-model="form.enableCoupon">
					      <el-radio label="是"></el-radio>
					      <el-radio label="否"></el-radio>
					    </el-radio-group>
					  </el-form-item>
					  <el-form-item>
					  <!-- <el-col :xs="24" :sm="24" :md="24" :lg="24" class="bottom_num">
						<el-row :data="table">
							<el-checkbox-group v-model="checkList">
								<el-col :xs="24" :sm="24" :md="24" :lg="24" class="headinfo">
									审核借款标
								</el-col>
								<el-col :xs="24" :sm="24" :md="24" :lg="24" class="namebody">
									<el-col :xs="8" :sm="8" :md="6" :lg="8" >
										<el-checkbox label="复选框1">>柳州-丰田-抵押标 （12期  1300000）</el-checkbox>
									</el-col>
									<el-col :xs="8" :sm="8" :md="8" :lg="8" >
										<el-checkbox label="复选框2">柳州-丰田-抵押标 （12期  1300000）</el-checkbox>
									</el-col>
									<el-col :xs="6" :sm="6" :md="6" :lg="6" >
										<el-checkbox label="复选框3">柳州-丰田-抵押标 （12期  1300000）</el-checkbox>
									</el-col>
								</el-col>
								<el-col :xs="24" :sm="24" :md="24" :lg="24" class="namebody">
									<el-row>
										<el-col :xs="8" :sm="8" :md="8" :lg="8" >
											<el-checkbox label="复选框12">柳州-丰田-抵押标 （12期  1300000）</el-checkbox>
										</el-col>
										<el-col :xs="8" :sm="8" :md="8" :lg="8" >
											<el-checkbox label="复选框13">柳州-丰田-抵押标 （12期  1300000）</el-checkbox>
										</el-col>
										<el-col :xs="8" :sm="8" :md="8" :lg="8" >
											<el-checkbox label="复选框11">柳州-丰田-抵押标 （12期  1300000）</el-checkbox>
										</el-col>
									</el-row>
								</el-col>
								<el-col :xs="24" :sm="24" :md="24" :lg="24" class="namebody">
									<el-row>
										<el-col :xs="8" :sm="8" :md="8" :lg="8" >
											<el-checkbox label="复选框21">柳州-丰田-抵押标 （12期  1300000）</el-checkbox>
										</el-col>
										<el-col :xs="8" :sm="8" :md="8" :lg="8" >
											<el-checkbox label="复选框22">柳州-丰田-抵押标 （12期  1300000）</el-checkbox>
										</el-col>
										<el-col :xs="8" :sm="8" :md="8" :lg="8" >
											<el-checkbox label="复选框23">柳州-丰田-抵押标 （12期  1300000）</el-checkbox>
										</el-col>
									</el-row>
								</el-col>
								<el-col :xs="24" :sm="24" :md="24" :lg="24" class="namebody">
									<el-row>
										<el-col :xs="8" :sm="8" :md="8" :lg="8" >
											<el-checkbox label="复选框31">柳州-丰田-抵押标 （12期  1300000）</el-checkbox>
										</el-col>
										<el-col :xs="8" :sm="8" :md="8" :lg="8" >
											<el-checkbox label="复选框32">柳州-丰田-抵押标 （12期  1300000）</el-checkbox>
										</el-col>
										<el-col :xs="8" :sm="8" :md="8" :lg="8" >
											<el-checkbox label="复选框33">柳州-丰田-抵押标 （12期  1300000）</el-checkbox>
										</el-col>
									</el-row>
								</el-col>
							</el-checkbox-group>
						</el-row>
					  </el-col> -->
					  </el-form-item>
					  <el-col>
					  	<el-form-item style="margin-left: 0%;">
					  	<el-button type="primary" v-if="index === 9" @click="releaseBtn">保存</el-button>
					  	<div v-else>
						  	<div v-if="index === 0">
						  		<el-button type="primary" v-if="index === 0" @click="editBtn">修改</el-button>
						  	</div>
					  		<div v-if="index === 1">
					  			<el-button type="primary" v-if="status === 0" @click="publish">预告</el-button>
						    	<el-button type="primary" v-if="status === 0" @click="uplish">发布</el-button>
						    	<el-button type="primary" v-if="disabled === 0" @click="onSubmit">开启计划</el-button>
						    	<el-button type="primary" v-else @click="onSubmit">关闭计划</el-button>
					  		</div>
					  	</div>
					  	</el-form-item>
					  </el-col>
					</el-form>
				</el-col>
			</el-row>
		</el-col>
	</el-row>
</template>
<script type="text/javascript">
	import { state } from '../../vuex/state'
	import util from '../../common/js/util'
	import { baseUrl , editUser, addUser } from '../../api/api';
	export default {
		data(){
			return{
				index:0,
				status:1,
				disabled:1,
				pickerOptions: {
		          disabledDate(time) {
		            return time.getTime() < Date.now() - 8.64e7;
		          }
		        },
				checkList:[],
				isNewer:false,
				repayMentTheWayList:[],
				subjectBearingTheWayList:[],
				table:{
					name:'徐升杰',
					sex:'等待初审',
					hun:'短期周转',
					phone:'30天',
					shenfenz:'每月还息到期还本',
					jgdz:'87000元',
					lxdz:'2017-03-01 10:29:48'
				},
				form:{
					title:'',
	            	rightTopTitle:'',
	            	expectedAnnualRate:'',
	            	addAnnualRate:'',
	            	beginTime:'',
	            	financingAmount:'',
	            	remainingAmount:'',
	            	safeInfomation:'',
	            	productDescription:'',
	            	timeLimit:'',
	            	purchaseMinAmount:'',
	            	purchaseLimitPerPeople:'',
	            	purchaseLimitCount:'',
	            	enableCoupon:''
				},
				bearingTheWayId:'',
				repaymentId:'',
				// repaymentIdTime:'',
				contractTypeId:'',
				list3:[{
					value:1,
					name:'计划购买授权协议'
				},{
					value:2,
					name:'汽车贷款V1'
				},{
					value:3,
					name:'汽车贷款V2'
				}]
			}
		},
		methods:{
			releaseBtn(){
				const _this = this
				let newer
				let url = '/admin/beePlan/save'
				if(_this.isNewer === true){
					newer = 1
				}else {
					newer = 0
				}
				let enableCoupon = ''
				if(_this.form.enableCoupon === '是'){
					enableCoupon = '1'
				}else {
					enableCoupon = '0'
				}
				console.log(this.form.beginTime)
				const time = _this.form.beginTime.getTime()
				const params = {
		            accountId:"1",
		            accessToken:"1",
		            resourcesType:'',
		            beePlan:{
		            	title:_this.form.title,
		            	isNewer:newer,
		            	rightTopTitle:_this.form.rightTopTitle,
		            	productDescription:_this.form.productDescription,
		            	expectedAnnualRate:_this.form.expectedAnnualRate,
		            	addAnnualRate:_this.form.addAnnualRate,
		            	beginTime:time.toString(),
		            	financingAmount:_this.form.financingAmount,
		            	remainingAmount:_this.form.remainingAmount,
		            	bearingTheWayId:_this.bearingTheWayId,
		            	timeLimit:_this.form.timeLimit,
		            	repaymentId:_this.repaymentId,
		            	safeInfomation:_this.form.safeInfomation,
		            	productDescription:_this.form.productDescription,
		            	purchaseMinAmount:_this.form.purchaseMinAmount,
		            	purchaseLimitPerPeople:_this.form.purchaseLimitPerPeople,
		            	purchaseLimitCount:_this.form.purchaseLimitCount,
		            	contractTypeId:_this.contractTypeId,
		            	enableCoupon:enableCoupon
		            }
		        }
		        console.log(params)
		        console.log(_this.checkList)
				this.$confirm('确认发布吗?', '提示', {
					type: 'warning'
				}).then(() => {
					$.post(baseUrl+url,
		             { param: JSON.stringify(params) },
		             function(data){
		             	const info = eval('(' + data + ')');
		                const response = JSON.parse(info);
		                console.log(response)
		             	if(response.res === 1000000){
							_this.$message({
								message: '保存成功',
								type: 'success'
							});
							_this.$router.push({ path: '/subjectPlanList' })
		             	}else{
							_this.$message({
								message: response.resMsg,
								type: 'success'
							});
		             	}
						_this.editFormVisible1 = true;
		              }
		         	)
				}).catch(() => {

				});
			},
			//editBtn
			editBtn(){
				const _this = this
				let newer
				let url = '//admin/beePlan/update'
				if(_this.isNewer === true){
					newer = 1
				}else {
					newer = 0
				}
				let enableCoupon = ''
				if(_this.form.enableCoupon === '是'){
					enableCoupon = '1'
				}else {
					enableCoupon = '0'
				}
				console.log(this.$route.params.id)
				const time = _this.form.beginTime.getTime()
				const params = {
		            accountId:"1",
		            accessToken:"1",
		            resourcesType:'',
		            beePlan:{
		            	id:this.$route.params.id,
		            	title:_this.form.title,
		            	isNewer:newer,
		            	rightTopTitle:_this.form.rightTopTitle,
		            	productDescription:_this.form.productDescription,
		            	expectedAnnualRate:_this.form.expectedAnnualRate,
		            	addAnnualRate:_this.form.addAnnualRate,
		            	beginTime:time.toString(),
		            	financingAmount:_this.form.financingAmount,
		            	remainingAmount:_this.form.remainingAmount,
		            	bearingTheWayId:_this.bearingTheWayId,
		            	timeLimit:_this.form.timeLimit,
		            	repaymentId:_this.repaymentId,
		            	safeInfomation:_this.form.safeInfomation,
		            	productDescription:_this.form.productDescription,
		            	purchaseMinAmount:_this.form.purchaseMinAmount,
		            	purchaseLimitPerPeople:_this.form.purchaseLimitPerPeople,
		            	purchaseLimitCount:_this.form.purchaseLimitCount,
		            	contractTypeId:_this.contractTypeId,
		            	enableCoupon:enableCoupon
		            }
		        }
		        console.log(params)
		        console.log(_this.checkList)
				this.$confirm('确认发布吗?', '提示', {
					type: 'warning'
				}).then(() => {
					$.post(baseUrl+url,
		             { param: JSON.stringify(params) },
		             function(data){
		             	const info = eval('(' + data + ')');
		                const response = JSON.parse(info);
		                console.log(response)
		             	if(response.res === 1000000){
							_this.$message({
								message: '修改成功',
								type: 'success'
							});
							_this.$router.push({ path: '/subjectPlanList' })
		             	}else{
							_this.$message({
								message: response.resMsg,
								type: 'error'
							});
		             	}
						_this.editFormVisible1 = true;
		              }
		         	)
				}).catch(() => {

				});
			},
			publish(){
				const params = {
		            accountId:"1",
		            accessToken:"1",
		            resourcesType:'',
		            beePlan:{
		            	id:this.$route.params.id,
		            	title:100
		            }
		        }
		        this.up(params)
			},
			uplish(){
				const params = {
		            accountId:"1",
		            accessToken:"1",
		            resourcesType:'',
		            beePlan:{
		            	id:this.$route.params.id,
		            	status:200
		            }
		        }
		        this.up(params)
			},
			up(params){
				console.log(params)
				$.post(baseUrl+"/admin/beePlan/publish",
	             { param: JSON.stringify(params) },
	             function(data){
	             	const info = eval('(' + data + ')');
	                const response = JSON.parse(info);
	                console.log(response)
	              }
	         	)
			},
			onSubmit() {
	        	console.log('submit!');
	    	},
	    	init(){
	    		console.log(this.$route.params.id)
	    		const _this = this
	    		const params = {
	    			accountId:'',
	    			accessToken:'',
	    			resourcesType:'',
	    			id:_this.$route.params.id
	    		}
	    		console.log(params)
	    		$.post(baseUrl+"/admin/beePlan/detail",
	             { param: JSON.stringify(params) },
	             function(data){
	             	const info = eval('(' + data + ')');
	                const response = JSON.parse(info);
	                const list = response.obj
	                _this.status = list.status
	                console.log(_this.disabled)
	                _this.disabled = list.disabled
	                // if(list === null){
	                // 	_this.listLoading = false
	                // 	return
	                // }
	                console.log(response)
	                // for(var i = 0;i<list.length;i++){
	                	// var obj = {}
	                let statu = false
	                if(list.isNewer === 1){
	                	statu = true
	                }else{
	                	statu = false
	                }
	                	_this.form.id = list.id
	                	_this.form.title = list.title
	                	_this.isNewer = statu
	                	_this.form.rightTopTitle = list.rightTopTitle
	                	_this.form.productDescription = list.productDescription
	                	_this.form.expectedAnnualRate = list.expectedAnnualRate
	                	_this.form.addAnnualRate = list.addAnnualRate
	                	//时间戳转化成new data //new Date(1494565839317)    parseInt('1494565839317')
	                	// _this.form.beginTime = list.beginTime
	                	_this.form.beginTime =new Date(1494565839317)
	                	_this.form.financingAmount = list.financingAmount
	                	_this.form.remainingAmount = list.remainingAmount
	                	_this.form.timeLimit = list.timeLimit
	                	_this.form.safeInfomation = list.safeInfomation
	                	_this.form.productDescription = list.productDescription
	                	_this.form.purchaseMinAmount = list.purchaseMinAmount
	                	_this.form.purchaseLimitPerPeople = list.purchaseLimitPerPeople
	                	_this.form.purchaseLimitCount = list.purchaseLimitCount
	                	_this.bearingTheWayId = list.bearingTheWayId
	                	_this.repaymentId = list.repaymentId
	                	_this.contractTypeId = list.contractTypeId
	                	if(list.enableCoupon === '1' ){
	                		_this.form.enableCoupon = '是'
	                	}else{
	                		_this.form.enableCoupon = '否'
	                	}
	                	//时间戳转正常时间格式
	                	// console.log(new Date(parseInt('1494565839317')).toLocaleString())
	              }
	         	)
	    	},
	    	getlist(){
	    		const _this = this
	    		_this.repayMentTheWayList = []
	    		_this.subjectBearingTheWayList = []
	    		const params={
	    			accountId:'1',
	    			accessToken:'1'
	    		}
	    		$.post(baseUrl+"/admin/beePlan/getType",
	             { param: JSON.stringify(params) },
	             function(data){
	             	const info = eval('(' + data + ')');
	                const response = JSON.parse(info);
	                const list = response.obj
	                for(var i =0;i<list.repayMentTheWayList.length;i++){
	                	_this.subjectBearingTheWayList.push(list.repayMentTheWayList[i])
	                }
	                for(var i =0;i<list.subjectBearingTheWayList.length;i++){
	                	_this.repayMentTheWayList.push(list.subjectBearingTheWayList[i])
	                }
	                console.log(response)
	              }
	         	)
	    	}
		},
		mounted() {
			this.index = this.$route.params.index
			this.getlist();
			const status = this.$route.params.id
			if(parseInt(status) === 10101010101){
				return
			}else{
				this.init();
			}
		}
	}
</script>
<style type="text/css">
	.bottom_num{
		margin-bottom: 40px;
	}
	.headinfo{
		background: #20a0ff;
		height: 36px;
		line-height: 36px;
		font-size: 1.2em;
		color: #fff;
	}
	.namebody{
		margin-top: 10px;
		font-size: 1.2em;
	}
</style>
