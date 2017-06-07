<template>
	<section>
		<el-form :model="borrow" label-width="150px" ref="addForm">
			<el-row>
				<el-col :xs="24" :sm="24" :md="24" :lg="24" class="headinfo">
					借款人信息
				</el-col>
				<el-col :xs="12" :sm="12" :md="8" :lg="8" >
					姓名：<span>{{borrow.borrowerName}}</span>
				</el-col>
				<el-col :xs="12" :sm="12" :md="8" :lg="8" >
					性别：
					<span v-if="borrow.gender === 1">男</span>
					<span v-else-if="borrow.gender === 0">女</span>
					<span v-else-if="borrow.gender === -1">未知</span>
					<span v-else></span>
				</el-col>
				<el-col :xs="12" :sm="12" :md="8" :lg="8" >
					婚否：
					<span v-if="borrow.marriage === 1">未婚</span>
					<span v-else-if="borrow.marriage === 2">已婚</span>
					<span v-else-if="borrow.marriage === 3">离异</span>
					<span v-else-if="borrow.marriage === 4">丧偶</span>
					<span v-else></span>
				</el-col>
				<el-col :xs="12" :sm="12" :md="8" :lg="8" >
					手机号码：<span>{{borrow.mobilePhone}}</span>
				</el-col>
				<el-col :xs="12" :sm="12" :md="8" :lg="8" >
					 身份证号码：<span>{{borrow.idCard}}</span>
				</el-col>
				<el-col :xs="24" :sm="24" :md="24" :lg="24">
					籍贯地址：<span>{{borrow.register}}</span>
				</el-col>
				<el-col :xs="24" :sm="24" :md="24" :lg="24">
					联系地址：<span>{{borrow.address}}</span>
				</el-col>
				<el-col :xs="24" :sm="24" :md="24" :lg="24" class="headinfo">
					车辆信息
				</el-col>
				<el-col :xs="12" :sm="12" :md="8" :lg="8" >
					车辆品牌：<span>{{borrow.brand}}</span>
				</el-col>
				<el-col :xs="12" :sm="12" :md="8" :lg="8" >
					车辆型号：<span>{{borrow.vehicleModel}}</span>
				</el-col>
				<el-col :xs="12" :sm="12" :md="6" :lg="8" >
					车辆牌照：<span>{{borrow.plate}}</span>
				</el-col>
				<el-col :xs="12" :sm="12" :md="8" :lg="8" >
					购车时间：<span>{{borrow.buyTime}}</span>
				</el-col>
				<el-col :xs="12" :sm="12" :md="8" :lg="8" >
					购车价格：<span>{{borrow.buyMoney}}</span>
				</el-col>
				<el-col :xs="12" :sm="12" :md="8" :lg="8" >
					评估金额：<span>{{borrow.valuationPrice}}</span>
				</el-col>
				<el-col :xs="12" :sm="12" :md="8" :lg="8" >
					评估人员：<span>{{borrow.evaluatorName}}</span>
				</el-col>
				<el-col :xs="12" :sm="12" :md="8" :lg="8" >
					评估时间：<span>{{borrow.evaluationTime}}</span>
				</el-col>
				<el-col :xs="24" :sm="24" :md="24" :lg="24">
					评估说明：<span>{{borrow.evaluationInstructions}}</span>
				</el-col>
				<el-col :xs="24" :sm="24" :md="24" :lg="24" class="headinfo">
					贷款信息
				</el-col>
				<el-col :xs="12" :sm="12" :md="6" :lg="8" >
					合同编号：<span>{{borrow.contractNo}}</span>
				</el-col>
				<el-col :xs="12" :sm="12" :md="6" :lg="8" >
					贷款金额：<span>{{borrow.price}}</span>
				</el-col>
				<el-col :xs="12" :sm="12" :md="6" :lg="8" >
					借款天数：<span>{{borrow.instalmentDays}}</span>
				</el-col>
				<el-col :xs="12" :sm="12" :md="8" :lg="8" >
					贷款类型：
					<span v-if="borrow.repaymentTheWay === 1">质押</span>
					<span v-else-if="borrow.repaymentTheWay === 2">抵押</span>
					<span v-else></span>
				</el-col>
				<el-col :xs="12" :sm="12" :md="8" :lg="8" >
					借款用途：<span>{{borrow.borrowingPurposes}}</span>
				</el-col>
				<el-col :xs="12" :sm="12" :md="8" :lg="8" >
					借款类型：
					<span v-if="borrow.loanType === 100">抵押</span>
					<span v-else>质押</span>
				</el-col>
				<el-col :xs="12" :sm="12" :md="8" :lg="8" >
					还款保障：<span>{{borrow.repaymentGuarantee}}</span>
				</el-col>
				<el-col :xs="12" :sm="12" :md="8" :lg="8" >
					GPS设备ID：<span>{{borrow.gpsList}}</span>
				</el-col>
				<el-col :xs="24" :sm="24" :md="24" :lg="24" class="headinfo">
					后台上传的借款人资料
				</el-col>
				<el-col :xs="24" :sm="24" :md="12" :lg="12" >
					<span class="imgLabel">身份证正面：</span>
					<img class="imgStyle" :src="borrow.idCardFront" alt="" align="middle" @click="imgDialog.dialogVisible1 = true">
				</el-col>
				<!-- <el-col :xs="24" :sm="24" :md="12" :lg="12" >
					<span class="imgLabel">抵押情况说明：</span>
					<img class="imgStyle" :src="imgUrl" alt="" align="middle" @click="imgDialog.dialogVisible2 = true">
				</el-col> -->
				<el-col :xs="24" :sm="24" :md="12" :lg="12" >
					<span class="imgLabel">身份证反面：</span>
					<img class="imgStyle" :src="borrow.idCardBehind" alt="" align="middle" @click="imgDialog.dialogVisible3 = true">
				</el-col>
				<el-col :xs="24" :sm="24" :md="12" :lg="12" >
					<span class="imgLabel">借条：</span>
					<img class="imgStyle" :src="borrow.receiptForALoan" alt="" align="middle" @click="imgDialog.dialogVisible4 = true">
				</el-col>
				<el-col :xs="24" :sm="24" :md="12" :lg="12" >
					<span class="imgLabel">行驶证：</span>
					<img class="imgStyle" :src="borrow.drivingLicense" alt="" align="middle" @click="imgDialog.dialogVisible5 = true">
				</el-col>
				<el-col :xs="24" :sm="24" :md="12" :lg="12" >
					<span class="imgLabel">购车发票：</span>
					<img class="imgStyle" :src="borrow.purchaseInvoice" alt="" align="middle" @click="imgDialog.dialogVisible6 = true">
				</el-col>
				<el-col :xs="24" :sm="24" :md="12" :lg="12" >
					<span class="imgLabel">登记证：</span>
					<img class="imgStyle" :src="borrow.motorVehicleRegistrationCertificate1stPage" alt="" align="middle" @click="imgDialog.dialogVisible7 = true">
				</el-col>
				<el-col :xs="24" :sm="24" :md="12" :lg="12" >
					<span class="imgLabel">暂住证：</span>
					<img class="imgStyle" :src="borrow.temporaryResidentialPermit" alt="" align="middle" @click="imgDialog.dialogVisible8 = true">
				</el-col>
				<el-col :xs="24" :sm="24" :md="12" :lg="12" >
					<span class="imgLabel">抵押登记页：</span>
					<img class="imgStyle" :src="borrow.motorVehicleRegistrationCertificateMortgagePage" alt="" align="middle" @click="imgDialog.dialogVisible9 = true">
				</el-col>
				<el-col :xs="24" :sm="24" :md="12" :lg="12" >
					<span class="imgLabel">户口本：</span>
					<img class="imgStyle" :src="borrow.householdRegistration" alt="" align="middle" @click="imgDialog.dialogVisible10 = true">
				</el-col>
				<el-col :xs="24" :sm="24" :md="12" :lg="12" >
					<span class="imgLabel">财务放款凭证：</span>
					<img class="imgStyle" :src="borrow.financialDisbursementVoucher" alt="" align="middle" @click="imgDialog.dialogVisible11 = true">
				</el-col>
				<el-col :xs="24" :sm="24" :md="12" :lg="12" >
					<span class="imgLabel">结婚证：</span>
					<img class="imgStyle" :src="borrow.marriageCertificate" alt="" align="middle" @click="imgDialog.dialogVisible12 = true">
				</el-col>
				<el-col :xs="24" :sm="24" :md="12" :lg="12" >
					<span class="imgLabel">车头照：</span>
					<img class="imgStyle" :src="borrow.carFront" alt="" align="middle" @click="imgDialog.dialogVisible13 = true">
				</el-col>
				<el-col :xs="24" :sm="24" :md="12" :lg="12" >
					<span class="imgLabel">担保人身份证正面：</span>
					<img class="imgStyle" :src="borrow.cautionerIdCardBehind" alt="" align="middle" @click="imgDialog.dialogVisible14 = true">
				</el-col>
				<el-col :xs="24" :sm="24" :md="12" :lg="12" >
					<span class="imgLabel">车尾照：</span>
					<img class="imgStyle" :src="borrow.carBehind" alt="" align="middle" @click="imgDialog.dialogVisible15 = true">
				</el-col>
				<el-col :xs="24" :sm="24" :md="12" :lg="12" >
					<span class="imgLabel">担保人身份证反面：</span>
					<img class="imgStyle" :src="borrow.cautionerIdCardFront" alt="" align="middle" @click="imgDialog.dialogVisible16 = true">
				</el-col>
				<el-col :xs="24" :sm="24" :md="12" :lg="12" >
					<span class="imgLabel">抵押情况申明：</span>
					<img class="imgStyle" :src="borrow.mortgageStatusDeclare" alt="" align="middle" @click="imgDialog.dialogVisible17 = true">
				</el-col>
				<el-col :xs="24" :sm="24" :md="12" :lg="12" >
					<span class="imgLabel">营业执照：</span>
					<img class="imgStyle" :src="borrow.businessLicence" alt="" align="middle" @click="imgDialog.dialogVisible18 = true">
				</el-col>
				<el-col :xs="24" :sm="24" :md="12" :lg="12" >
					<span class="imgLabel">申请表：</span>
					<img class="imgStyle" :src="borrow.applySheet" alt="" align="middle" @click="imgDialog.dialogVisible19 = true">
				</el-col>
				<el-col :xs="24" :sm="24" :md="12" :lg="12" >
					<span class="imgLabel">税务登记证：</span>
					<img class="imgStyle" :src="borrow.taxRegistrationCertificate" alt="" align="middle" @click="imgDialog.dialogVisible20 = true">
				</el-col>
				<el-col :xs="24" :sm="24" :md="12" :lg="12" >
					<span class="imgLabel">委托书：</span>
					<img class="imgStyle" :src="borrow.powerOfAttorney" alt="" align="middle" @click="imgDialog.dialogVisible21 = true">
				</el-col>
				<el-col :xs="24" :sm="24" :md="12" :lg="12" >
					<span class="imgLabel">借款合同一：</span>
					<img class="imgStyle" :src="borrow.loanContract1" alt="" align="middle" @click="imgDialog.dialogVisible22 = true">
				</el-col>
				<el-col :xs="24" :sm="24" :md="12" :lg="12" >
					<span class="imgLabel">借款合同二：</span>
					<img class="imgStyle" :src="borrow.loanContract2" alt="" align="middle" @click="imgDialog.dialogVisible23 = true">
				</el-col>
				<el-col :xs="24" :sm="24" :md="12" :lg="12" >
					<span class="imgLabel">客户材料确认书：</span>
					<img class="imgStyle" :src="borrow.customerMaterialConfirmation" alt="" align="middle" @click="imgDialog.dialogVisible24 = true">
				</el-col>
				<el-col :xs="24" :sm="24" :md="12" :lg="12" >
					<span class="imgLabel">车辆买卖合同：</span>
					<img class="imgStyle" :src="borrow.vehicleSalesContracts" alt="" align="middle" @click="imgDialog.dialogVisible25 = true">
				</el-col>
				<el-col :xs="24" :sm="24" :md="12" :lg="12" >
					<span class="imgLabel">交通强制保险单：</span>
					<img class="imgStyle" :src="borrow.compulsoryTrafficInsurancePolicy" alt="" align="middle" @click="imgDialog.dialogVisible26 = true">
				</el-col>
				<el-col :xs="24" :sm="24" :md="24" :lg="24" class="headinfo">
					审核借款信息
				</el-col>
				<el-col>
					<el-row :gutter="40">
						<el-col :xs="24" :sm="24" :md="24" :lg="24">
							<el-radio class="radio" v-model="form.status" :label="1" :disabled="disable">通过</el-radio>
						  	<el-select  v-model="form.subjectPlatformId" placeholder="请选择标的使用去向" :disabled="disable">
						    	<el-option
										v-for="item in subjectPlatformList"
										:key="item.platformId"
										:label="item.platform"
										:value="item.platformId">
								</el-option>
					    	</el-select>
					 	</el-col>
					 	<el-col :xs="24" :sm="24" :md="24" :lg="24">
					 		<el-radio class="radio" v-model="form.status" :label="-1" :disabled="disable">不通过退回</el-radio>
						    <el-input style="display: inline-block;width: 80%" type="textarea" :rows="2" v-model="form.refuseReason" placeholder="请输入审核备注" :disabled="disable"></el-input>
					 	</el-col>
					 	<el-col :xs="24" :sm="24" :md="24" :lg="24" v-if="form.status === 1 && form.subjectPlatformId === privatePlatformId">
					 		<el-row>
							  	<el-col :xs="12" :sm="12" :md="8" :lg="8" >
								  	<el-form-item label="标的名称：">
								     	<el-input v-model="form.title" :disabled="disable"></el-input>
								  	</el-form-item>
							  	</el-col>
							  	<el-col :xs="12" :sm="12" :md="8" :lg="8" >
								  	<el-form-item  label="标的类型">
									    <el-select  v-model="form.subjectType" clearable placeholder="请选择标的类型" :disabled="disable">
									    	<el-option
													v-for="item in subjectTypeList"
													:key="item.id"
													:label="item.title"
													:value="item.id">
											</el-option>
									    </el-select>
							  		</el-form-item>
								</el-col>
								<el-col :xs="12" :sm="12" :md="8" :lg="8" >
								  	<el-form-item  label="计息方式" clearable placeholder="请选择计息方式">
									    <el-select  v-model="form.bearingTheWay" :disabled="disable">
									    	<el-option
													v-for="item in subjectBearingTheWayList"
													:key="item.id"
													:label="item.title"
													:value="item.id">
											</el-option>
									    </el-select>
								  	</el-form-item>
							  	</el-col>
							  	<el-col :xs="12" :sm="12" :md="8" :lg="8" >
								  	<el-form-item  label="还款方式" placeholder="请选择还款方式">
									    <el-select  v-model="form.repaymentId" :disabled="disable">
									    	<el-option
													v-for="item in repayMentTheWayList"
													:key="item.id"
													:label="item.title"
													:value="item.id">
											</el-option>
									    </el-select>
								  	</el-form-item>
							  	</el-col>
							  	<el-col :xs="12" :sm="12" :md="8" :lg="8" >
								  	<el-form-item label="预期年化(%)：">
								     	<el-input type="number" v-model="form.expectedAnnualRate" :disabled="disable"></el-input>
								  	</el-form-item>
							  	</el-col>
							  	<el-col :xs="12" :sm="12" :md="8" :lg="8" >
								  	<el-form-item label="活动加息(%)：">
								     	<el-input type="number" v-model="form.addAnnualRate" :disabled="disable"></el-input>
								  	</el-form-item>
							  	</el-col>
							  	<el-col :xs="12" :sm="12" :md="8" :lg="8" >
								  	<el-form-item label="标的可购买时间:">
										<el-date-picker v-model="form.beginTime" type="datetime" placeholder="选择日期时间" :disabled="disable"></el-date-picker>
								</el-form-item>
								  	</el-form-item>
							  	</el-col>
							  	<el-col :xs="12" :sm="12" :md="8" :lg="8" >
								  	<el-form-item label="最低投标金额（元）:">
								     	<el-input type="number" v-model="form.purchaseMinAmount" placeholder="0代表无限制" :disabled="disable"></el-input>
								  	</el-form-item>
						  		</el-col>
							  	<el-col :xs="12" :sm="12" :md="8" :lg="8" >
								  	<el-form-item label="最多投标金额（元）:">
								     	<el-input type="number" v-model="form.purchaseMaxAmount" placeholder="0代表无限制" :disabled="disable"></el-input>
								  	</el-form-item>
							  	</el-col>
							  	<!-- <el-col :xs="12" :sm="12" :md="8" :lg="8" >
							     	<el-checkbox v-model="form.checked" :disabled="disable">是否APP消息推送</el-checkbox>
							  	</el-col> -->
						  	</el-row>
					  	</el-col>
					  	<el-col :xs="24" :sm="24" :md="24" :lg="24" >
						  	<el-form-item style="margin-left: 40%;">
							    <el-button type="primary" @click="onSubmit" v-if="isChecking === true && borrow.state === 0">保存</el-button>
							    <el-button type="primary" @click="onRelease" v-if="isRelease === true && status === 0 && disabled === 0">发布</el-button>
							    <el-button type="primary" @click="onAdvance" v-if="isRelease === true && status === 0 && disabled === 0">预告</el-button>
						  	</el-form-item>
						</el-col>
					</el-row>
				</el-col>
			</el-row>
		</el-form>
		<!-- 借款人资料大图片弹框 -->
		<el-dialog title="身份证正面" v-model="imgDialog.dialogVisible1">
		  	<img :src="borrow.idCardFront" alt="" class="bigImgStyle">
		</el-dialog>
		<!-- <el-dialog title="抵押情况说明" v-model="imgDialog.dialogVisible2">
		  	<img src="http://img05.tooopen.com/images/20150531/tooopen_sy_127457023651.jpg" alt="" class="bigImgStyle">
		</el-dialog> -->
		<el-dialog title="身份证反面" v-model="imgDialog.dialogVisible3">
		  	<img :src="borrow.idCardBehind" alt="" class="bigImgStyle">
		</el-dialog>
		<el-dialog title="借条" v-model="imgDialog.dialogVisible4">
		  	<img :src="borrow.receiptForALoan" alt="" class="bigImgStyle">
		</el-dialog>
		<el-dialog title="行驶证" v-model="imgDialog.dialogVisible5">
		  	<img :src="borrow.drivingLicense" alt="" class="bigImgStyle">
		</el-dialog>
		<el-dialog title="购车发票" v-model="imgDialog.dialogVisible6">
		  	<img :src="borrow.purchaseInvoice" alt="" class="bigImgStyle">
		</el-dialog>
		<el-dialog title="登记证" v-model="imgDialog.dialogVisible7">
		  	<img :src="borrow.motorVehicleRegistrationCertificate1stPage" alt="" class="bigImgStyle">
		</el-dialog>
		<el-dialog title="暂住证" v-model="imgDialog.dialogVisible8">
		  	<img :src="borrow.temporaryResidentialPermit" alt="" class="bigImgStyle">
		</el-dialog>
		<el-dialog title="抵押登记页" v-model="imgDialog.dialogVisible9">
		  	<img :src="borrow.motorVehicleRegistrationCertificateMortgagePage" alt="" class="bigImgStyle">
		</el-dialog>
		<el-dialog title="户口本" v-model="imgDialog.dialogVisible10">
		  	<img :src="borrow.householdRegistration" alt="" class="bigImgStyle">
		</el-dialog>
		<el-dialog title="财务放款凭证" v-model="imgDialog.dialogVisible11">
		  	<img :src="borrow.financialDisbursementVoucher" alt="" class="bigImgStyle">
		</el-dialog>
		<el-dialog title="结婚证" v-model="imgDialog.dialogVisible12">
		  	<img :src="borrow.marriageCertificate" alt="" class="bigImgStyle">
		</el-dialog>
		<el-dialog title="车头照" v-model="imgDialog.dialogVisible13">
		  	<img :src="borrow.carFront" alt="" class="bigImgStyle">
		</el-dialog>
		<el-dialog title="担保人身份证正面" v-model="imgDialog.dialogVisible14">
		  	<img :src="borrow.cautionerIdCardFront" alt="" class="bigImgStyle">
		</el-dialog>
		<el-dialog title="车尾照" v-model="imgDialog.dialogVisible15">
		  	<img :src="borrow.carBehind" alt="" class="bigImgStyle">
		</el-dialog>
		<el-dialog title="担保人身份证反面" v-model="imgDialog.dialogVisible16">
		  	<img :src="borrow.cautionerIdCardFront" alt="" class="bigImgStyle">
		</el-dialog>
		<el-dialog title="抵押情况申明" v-model="imgDialog.dialogVisible17">
		  	<img :src="borrow.mortgageStatusDeclare" alt="" class="bigImgStyle">
		</el-dialog>
		<el-dialog title="营业执照" v-model="imgDialog.dialogVisible18">
		  	<img :src="borrow.businessLicence" alt="" class="bigImgStyle">
		</el-dialog>
		<el-dialog title="申请表" v-model="imgDialog.dialogVisible19">
		  	<img :src="borrow.applySheet" alt="" class="bigImgStyle">
		</el-dialog>
		<el-dialog title="税务登记证" v-model="imgDialog.dialogVisible20">
		  	<img :src="borrow.taxRegistrationCertificate" alt="" class="bigImgStyle">
		</el-dialog>
		<el-dialog title="委托书" v-model="imgDialog.dialogVisible21">
		  	<img :src="borrow.powerOfAttorney" alt="" class="bigImgStyle">
		</el-dialog>
		<el-dialog title="借款合同一" v-model="imgDialog.dialogVisible22">
		  	<img :src="borrow.loanContract1" alt="" class="bigImgStyle">
		</el-dialog>
		<el-dialog title="借款合同二" v-model="imgDialog.dialogVisible23">
		  	<img :src="borrow.loanContract2" alt="" class="bigImgStyle">
		</el-dialog>
		<el-dialog title="客户材料确认书" v-model="imgDialog.dialogVisible24">
		  	<img :src="borrow.customerMaterialConfirmation" alt="" class="bigImgStyle">
		</el-dialog>
		<el-dialog title="车辆买卖合同" v-model="imgDialog.dialogVisible25">
		  	<img :src="borrow.vehicleSalesContracts" alt="" class="bigImgStyle">
		</el-dialog>
		<el-dialog title="交通强制保险单" v-model="imgDialog.dialogVisible26">
		  	<img :src="borrow.compulsoryTrafficInsurancePolicy" alt="" class="bigImgStyle">
		</el-dialog>
	</section>
</template>

<script type="text/javascript">
	import { baseUrl } from '../../api/api'
	import { state } from '../../vuex/state'
	export default {
		data(){
			return{
				listLoading: false,
				get_borrowId: this.$route.params.borrowId,
				get_subjectId: this.$route.params.subjectId,
				isChecking: false,
				isRelease: false,
				alreadyChecking: false,
				borrow: {},
				form:{
					status: 0,
					subjectPlatformId: '',
					refuseReason: '',
					title: '',
					subjectType: '',
					bearingTheWay: '',
					repaymentId: '',
					beginTime: '',
					expectedAnnualRate: '',
					addAnnualRate: '',
					purchaseMinAmount: '',
					purchaseMaxAmount: '',
					disabled: true,
					checked: true
				},
				// 标的隐藏状态
				disabled: 0,
				// 标的类型
				status: 100,
				// 文本框不可用
				disable: false,
				// 标的类型列表
		        subjectTypeList: [],
		        repayMentTheWayList: [],
		        // 标的使用去向列表
		        subjectPlatformList: [],
		        // 自用平台
		        privatePlatformId: '',
		        // 计息方式列表
		        subjectBearingTheWayList: [],
		        imgDialog:{
		        	dialogVisible1: false,
		        	dialogVisible2: false,
		        	dialogVisible3: false,
		        	dialogVisible4: false,
		        	dialogVisible5: false,
		        	dialogVisible6: false,
		        	dialogVisible7: false,
		        	dialogVisible8: false,
		        	dialogVisible9: false,
		        	dialogVisible10: false,
		        	dialogVisible11: false,
		        	dialogVisible12: false,
		        	dialogVisible13: false,
		        	dialogVisible14: false,
		        	dialogVisible15: false,
		        	dialogVisible16: false,
		        	dialogVisible17: false,
		        	dialogVisible18: false,
		        	dialogVisible19: false,
		        	dialogVisible20: false,
		        	dialogVisible21: false,
		        	dialogVisible22: false,
		        	dialogVisible23: false,
		        	dialogVisible24: false,
		        	dialogVisible25: false,
		        	dialogVisible26: false
		        }
			}
		},
		methods: {
	    	// 获得待审标的详情
	    	jsonpIdPost() {
	    		this.listLoading = true
		        const params = {
		        	accountId: '',
		        	accessToken: '',
		            id: parseInt(this.get_borrowId)
		        }
		        let _this = this
	         	$.post(baseUrl+"/admin/borrow/detail",
		            { param: JSON.stringify(params) },function(data){
		            	// console.log(data)
		              	const info = JSON.parse(eval('(' + data + ')'));
		              	console.log(info)
		              	if(info.res === state.HTTPCODE.SUCCEED){
		                	console.log(info.obj)
		                	_this.repayMentTheWayList = info.obj.repayMentTheWayList
		                	_this.subjectBearingTheWayList = info.obj.subjectBearingTheWayList
		                	_this.subjectTypeList = info.obj.subjectTypeList
		                	_this.subjectPlatformList = info.obj.subjectPlatformList
		                	_this.privatePlatformId = info.obj.privatePlatformId
		                	_this.borrow = info.obj.borrow
		                	if(_this.alreadyChecking === true) {
		                		_this.form.status = info.obj.borrow.state
		                		_this.form.subjectPlatformId = info.obj.borrow.subjectPlatformId
		                		_this.form.refuseReason = info.obj.borrow.refuseReason
		                		_this.privatePlatformId = -1
		                		_this.disable = true
		                	}
		                	// console.log(_this.borrow.gender)
		              	}else if(info.res === state.HTTPCODE.LOGINFAIL){
		                	_this.$message({
		                		message: info.resMsg,
		                		type: 'error'
		                	});
		              	}else if(info.res === state.HTTPCODE.FAIL){
		              		_this.$message({
		              			message: info.resMsg,
		              			type: 'error'
		              		});
		              	}
		            }
		       );
	           _this.listLoading = false
	    	},
	    	// 保存审核信息
	    	onSubmit() {
	        	this.listLoading = true
	        	let params = {}
	        	console.log(this.form.status)
	        	if( this.form.status === 0 ) {
	        		this.$message({
              			message: '请选择是否通过审核',
              			type: 'error'
              		});
        			return false
	        	} else if( this.form.status === -1) {
	        		params = {
			        	accountId: '1',
			        	accessToken: '1',
			        	subject: {
			        		borrow: {
			        			id: parseInt(this.get_borrowId),
			            		state: this.form.status,
			            		refuseReason: this.form.refuseReason
			        		}
		        		}
	        		}
	        	}else if( this.form.status === 1 && this.form.subjectPlatformId !== this.privatePlatformId) {
	        		if(this.form.subjectPlatformId === '') {
	        			this.$message({
	              			message: '请选择标的的使用去向',
	              			type: 'error'
	              		});
	        			return false
	        		}
	        		params = {
			        	accountId: '1',
			        	accessToken: '1',
			        	subject: {
			        		borrow: {
			        			id: parseInt(this.get_borrowId),
			        	    	state: this.form.status,
			        	    	subjectPlatformId: this.form.subjectPlatformId
			        		}
		        		}
		        	}
	        	}else {
	        		if(this.form.title === '' ||this.form.title === undefined) {
	        			this.$message({
	              			message: '请填写标的名称',
	              			type: 'error'
	              		});
	        			return false
	        		}
	        		if(this.form.subjectType === '' ||this.form.subjectType === undefined) {
	        			this.$message({
	              			message: '请填写标的类型',
	              			type: 'error'
	              		});
	        			return false
	        		}
	        		if(this.form.bearingTheWay === '' ||this.form.bearingTheWay === undefined) {
	        			this.$message({
	              			message: '请选择计息方式',
	              			type: 'error'
	              		});
	        			return false
	        		}
	        		if(this.form.repaymentId === '' ||this.form.repaymentId === undefined) {
	        			this.$message({
	              			message: '请选择还款方式',
	              			type: 'error'
	              		});
	        			return false
	        		}
	        		if(this.form.expectedAnnualRate === '' ||this.form.expectedAnnualRate === undefined) {
	        			this.$message({
	              			message: '请填写预期年化',
	              			type: 'error'
	              		});
	        			return false
	        		}
	        		if(this.form.beginTime === '' ||this.form.beginTime === undefined) {
	        			this.$message({
	              			message: '请填写时间',
	              			type: 'error'
	              		});
	        			return false
	        		}
	        		params = {
			        	accountId: '1',
			        	accessToken: '1',
			        	subject: {
			        		borrow: {
			        			id: parseInt(this.get_borrowId),
			        	    	state: parseInt(this.form.status),
			        	    	subjectPlatformId: this.form.subjectPlatformId,
			        	    	refuseReason: this.form.refuseReason
			        		},
			        	    title: this.form.title,
			        	    subjectType: this.form.subjectType,
			        	    bearingTheWay: this.form.bearingTheWay,
			        	    beginTime: this.form.beginTime.getTime(),
			        	    expectedAnnualRate: parseFloat(this.form.expectedAnnualRate),
			        	    addAnnualRate: parseFloat(this.form.addAnnualRate),
			        	    purchaseMinAmount: parseFloat(this.form.purchaseMinAmount),
			        	    purchaseMaxAmount: parseFloat(this.form.purchaseMaxAmount)
			        	}
		        	}
	        	}
		        let _this = this
	         	$.post(baseUrl+"/admin/subject/save",
		            { param: JSON.stringify(params) },function(data){
		            	// console.log(data)
		              	const info = JSON.parse(eval('(' + data + ')'));
		              	console.log(info)
		              	if(info.res === state.HTTPCODE.SUCCEED){
		                	_this.$message({
		                		message: info.resMsg,
		                		type: 'success'
		                	});
		                	_this.$router.push({ name: '已审核标的列表' })
		              	}else if(info.res === state.HTTPCODE.LOGINFAIL){
		                	_this.$message({
		                		message: info.resMsg,
		                		type: 'error'
		                	});
		              	}else if(info.res === state.HTTPCODE.FAIL){
		              		_this.$message({
		              			message: info.resMsg,
		              			type: 'error'
		              		});
		              	}
		            }
	            );
	           	_this.listLoading = false
	    	},
	    	// 获得发布标的信息
	    	jsonpSubjectIdPost() {
	    		this.listLoading = true
		        const params = {
		        	accountId: '',
		        	accessToken: '',
		            subjectId: parseInt(this.get_subjectId)
		        }
		        let _this = this
	         	$.post(baseUrl+"/admin/subject/check",
		            { param: JSON.stringify(params) },function(data){
		            	// console.log(data)
		              	const info = JSON.parse(eval('(' + data + ')'));
		              	console.log(info)
		              	if(info.res === state.HTTPCODE.SUCCEED){
		                	console.log(info.obj)
		                	_this.subjectBearingTheWayList = info.obj.subjectBearingTheWayList
		                	_this.subjectTypeList = info.obj.subjectTypeList
		                	_this.subjectPlatformList = info.obj.subjectPlatformList
		                	_this.privatePlatformId = info.obj.privatePlatformId
		                	_this.borrow = info.obj.subject.borrow
		                	// 审核借款信息
		                	_this.form.status = info.obj.subject.borrow.state
		                	_this.form.subjectPlatformId = info.obj.subject.borrow.subjectPlatformId
		                	_this.form.refuseReason = info.obj.subject.refuseReason
		                	_this.form.title = info.obj.subject.title
		                	_this.form.subjectType = info.obj.subject.subjectType
		                	_this.form.repaymentId = info.obj.subject.repaymentId
		                	_this.repayMentTheWayList = info.obj.repayMentTheWayList
		                	_this.form.bearingTheWay = info.obj.subject.bearingTheWay
		                	_this.form.beginTime = new Date(parseInt(info.obj.subject.beginTime))
		                	_this.form.expectedAnnualRate = info.obj.subject.expectedAnnualRate
		                	_this.form.addAnnualRate = info.obj.subject.addAnnualRate
		                	_this.form.purchaseMinAmount = info.obj.subject.purchaseMinAmount
		                	_this.form.purchaseMaxAmount = info.obj.subject.purchaseMaxAmount
		                	_this.form.disabled = info.obj.subject.disabled
		                	_this.disable = true
		                	_this.status = info.obj.subject.status
		                	console.log(_this.form.beginTime)
		              	}else if(info.res === state.HTTPCODE.LOGINFAIL){
		                	_this.$message({
		                		message: info.resMsg,
		                		type: 'error'
		                	});
		              	}else if(info.res === state.HTTPCODE.FAIL){
		              		_this.$message({
		              			message: info.resMsg,
		              			type: 'error'
		              		});
		              	}
		            }
		       );
	           _this.listLoading = false
	    	},
	    	//发布标的
	    	onRelease() {
	        	this.listLoading = true
	        	const params = {
		        	accountId: '',
		        	accessToken: '',
		        	subject: {
		        		id: parseInt(this.get_subjectId),
		        		status: 200
		        	}
		        }
		        let _this = this
	         	$.post(baseUrl+"/admin/subject/publish",
		            { param: JSON.stringify(params) },function(data){
		            	// console.log(data)
		              	const info = JSON.parse(eval('(' + data + ')'));
		              	console.log(info)
		              	if(info.res === state.HTTPCODE.SUCCEED){
		                	_this.$message({
		                		message: info.resMsg,
		                		type: 'success'
		                	});
		                	_this.$router.push({ name: '标的管理列表' })
		              	}else if(info.res === state.HTTPCODE.LOGINFAIL){
		                	_this.$message({
		                		message: info.resMsg,
		                		type: 'error'
		                	});
		              	}else if(info.res === state.HTTPCODE.FAIL){
		              		_this.$message({
		              			message: info.resMsg,
		              			type: 'error'
		              		});
		              	}
		            }
	            );
	           	_this.listLoading = false
	    	},
	    	onAdvance() {
	        	this.listLoading = true
	        	const params = {
		        	accountId: '',
		        	accessToken: '',
		            subject: {
		        		id: parseInt(this.get_subjectId),
		        		status: 100
		        	}
		        }
		        let _this = this
	         	$.post(baseUrl+"/admin/subject/publish",
		            { param: JSON.stringify(params) },function(data){
		            	// console.log(data)
		              	const info = JSON.parse(eval('(' + data + ')'));
		              	console.log(info)
		              	if(info.res === state.HTTPCODE.SUCCEED){
		                	_this.$message({
		                		message: info.resMsg,
		                		type: 'success'
		                	});
		                	_this.$router.push({ name: '标的管理列表' })
		              	}else if(info.res === state.HTTPCODE.LOGINFAIL){
		                	_this.$message({
		                		message: info.resMsg,
		                		type: 'error'
		                	});
		              	}else if(info.res === state.HTTPCODE.FAIL){
		              		_this.$message({
		              			message: info.resMsg,
		              			type: 'error'
		              		});
		              	}
		            }
	            );
	           	_this.listLoading = false
	    	}
    	},
    	mounted() {
    		console.log(this.get_borrowId);
    		console.log(this.$route.params.checked)
    		if (this.$route.params.subjectId === ':subjectId' && this.$route.params.checked === ':checked' && this.$route.params.borrowId) {
                this.jsonpIdPost()
                this.alreadyChecking = true
            }else if(this.$route.params.borrowId && this.$route.params.subjectId) {
                this.jsonpSubjectIdPost()
                this.isRelease = true
            }else if(this.$route.params.borrowId) {
                this.jsonpIdPost()
                this.isChecking = true
            }
    	}
	}
</script>
<style type="text/css">
	.headinfo{
		background: #20a0ff;
		height: 36px;
		line-height: 36px;
		font-size: 1.2em;
		color: #fff;
	}
	.imgLabel{
		display: inline-block;
		width: 150px;
	}
	.imgStyle{
		width: 100px;
		height: 50px;
		cursor: pointer;
	}
	.bigImgStyle{
		width: 100%;
		height: auto;
	}
	.el-col{
		margin-top: 10px;
	}
</style>
