<template>
	<el-row>
		<el-col :xs="24" :sm="24" :md="24" :lg="24" class="bottom_num">
			<el-row :data="table">
				<el-col :xs="24" :sm="24" :md="24" :lg="24" class="headinfo">
					借款人信息
				</el-col>
				<el-col :xs="24" :sm="24" :md="24" :lg="24" class="namebody">
					<el-col :xs="8" :sm="8" :md="6" :lg="8" >
						姓名：<span>{{table.name}}</span>
					</el-col>
					<el-col :xs="8" :sm="8" :md="8" :lg="8" >
						性别：<span>{{table.sex}}</span>
					</el-col>
					<el-col :xs="6" :sm="6" :md="6" :lg="6" >
						婚否：<span>{{table.hun}}</span>
					</el-col>
				</el-col>
				<el-col :xs="24" :sm="24" :md="24" :lg="24" class="namebody">
					<el-row>
						<el-col :xs="8" :sm="8" :md="8" :lg="8" >
							手机号码：<span>{{table.phone}}</span>
						</el-col>
						<el-col :xs="8" :sm="8" :md="8" :lg="8" >
							省份证号码：<span>{{table.shenfenz}}</span>
						</el-col>
					</el-row>
				</el-col>
				<el-col :xs="24" :sm="24" :md="24" :lg="24" class="namebody">
					籍贯地址：<span>{{table.jgdz}}</span>
				</el-col>
				<el-col :xs="24" :sm="24" :md="24" :lg="24" class="namebody">
					联系地址：<span>{{table.lxdz}}</span>
				</el-col>
			</el-row>
		</el-col>
		<el-col :xs="24" :sm="24" :md="24" :lg="24" class="bottom_num">
			<el-row :data="carinfo">
				<el-col :xs="24" :sm="24" :md="24" :lg="24" class="headinfo">
					车辆信息
				</el-col>
				<el-col :xs="24" :sm="24" :md="24" :lg="24" class="namebody">
					<el-col :xs="8" :sm="8" :md="6" :lg="8" >
						车辆品牌：<span>{{carinfo.name}}</span>
					</el-col>
					<el-col :xs="8" :sm="8" :md="8" :lg="8" >
						车辆型号：<span>{{carinfo.sex}}</span>
					</el-col>
					<el-col :xs="6" :sm="6" :md="6" :lg="6" >
						车辆牌照：<span>{{carinfo.number}}</span>
					</el-col>
				</el-col>
				<el-col :xs="24" :sm="24" :md="24" :lg="24" class="namebody">
					<el-row>
						<el-col :xs="8" :sm="8" :md="8" :lg="8" >
							购车时间：<span>{{carinfo.time}}</span>
						</el-col>
						<el-col :xs="8" :sm="8" :md="8" :lg="8" >
							购车价格：<span>{{carinfo.money}}</span>
						</el-col>
					</el-row>
				</el-col>
				<el-col :xs="24" :sm="24" :md="24" :lg="24" class="namebody">
					<el-row>
						<el-col :xs="8" :sm="8" :md="8" :lg="8" >
							评估金额：<span>{{carinfo.assessment}}</span>
						</el-col>
						<el-col :xs="8" :sm="8" :md="8" :lg="8" >
							评估人员：<span>{{carinfo.user}}</span>
						</el-col>
						<el-col :xs="8" :sm="8" :md="8" :lg="8" >
							评估时间：<span>{{carinfo.userTime}}</span>
						</el-col>
					</el-row>
				</el-col>
				<el-col :xs="24" :sm="24" :md="24" :lg="24" class="namebody">
					评估说明：<span>{{carinfo.address}}</span>
				</el-col>
			</el-row>
		</el-col>
		<el-col :xs="24" :sm="24" :md="24" :lg="24" class="bottom_num">
			<el-row :data="table">
				<el-col :xs="24" :sm="24" :md="24" :lg="24" class="headinfo">
					贷款信息
				</el-col>
				<el-col :xs="24" :sm="24" :md="24" :lg="24" class="namebody">
					<el-col :xs="8" :sm="8" :md="6" :lg="8" >
						贷款金额：<span>{{table.name}}</span>
					</el-col>
					<el-col :xs="8" :sm="8" :md="8" :lg="8" >
						贷款类型：<span>{{table.sex}}</span>
					</el-col>
					<el-col :xs="6" :sm="6" :md="6" :lg="6" >
						还款保障：<span>{{table.hun}}</span>
					</el-col>
				</el-col>
				<el-col :xs="24" :sm="24" :md="24" :lg="24" class="namebody">
					<el-row>
						<el-col :xs="8" :sm="8" :md="8" :lg="8" >
							借款用途：<span>{{table.phone}}</span>
						</el-col>
						<el-col :xs="8" :sm="8" :md="8" :lg="8" >
							GPS设备ID：<span>{{table.shenfenz}}</span>
						</el-col>
						<el-col :xs="8" :sm="8" :md="8" :lg="8" >
							借款天数：<span>{{table.shenfenz}}</span>
						</el-col>
					</el-row>
				</el-col>
			</el-row>
		</el-col>
		<el-col :xs="24" :sm="24" :md="24" :lg="24" class="bottom_num">
			<el-row :data="table">
				<el-col :xs="24" :sm="24" :md="24" :lg="24" class="headinfo">
					后台上传的借款人资料
				</el-col>
				<el-col :xs="24" :sm="24" :md="24" :lg="24" class="namebody">
					<el-row>
						<el-col :xs="8" :sm="8" :md="8" :lg="8" >
							省份证正面：<span>{{}}</span>
						</el-col>
						<el-col :xs="8" :sm="8" :md="8" :lg="8" >
							抵押情况说明：<span>{{}}</span>
						</el-col>
					</el-row>
				</el-col>
				<el-col :xs="24" :sm="24" :md="24" :lg="24" class="namebody">
					<el-row>
						<el-col :xs="8" :sm="8" :md="8" :lg="8" >
							省份证反面：<span>{{}}</span>
						</el-col>
						<el-col :xs="8" :sm="8" :md="8" :lg="8" >
							申请表<span>{{}}</span>
						</el-col>
					</el-row>
				</el-col>
				<el-col :xs="24" :sm="24" :md="24" :lg="24" class="namebody">
					<el-row>
						<el-col :xs="8" :sm="8" :md="8" :lg="8" >
							省份证正面-打码<span>{{}}</span>
						</el-col>
						<el-col :xs="8" :sm="8" :md="8" :lg="8" >
							委托书：<span>{{}}</span>
						</el-col>
					</el-row>
				</el-col>
				<el-col :xs="24" :sm="24" :md="24" :lg="24" class="namebody">
					<el-row>
						<el-col :xs="8" :sm="8" :md="8" :lg="8" >
							省份证反面-打码：<span>{{}}</span>
						</el-col>
						<el-col :xs="8" :sm="8" :md="8" :lg="8" >
							借款合同一：<span>{{table.shenfenz}}</span>
						</el-col>
					</el-row>
				</el-col>
				<el-col :xs="24" :sm="24" :md="24" :lg="24" class="namebody">
					<el-row>
						<el-col :xs="8" :sm="8" :md="8" :lg="8" >
							行驶证：<span>{{table.phone}}</span>
						</el-col>
						<el-col :xs="8" :sm="8" :md="8" :lg="8" >
							借款合同二：<span>{{table.shenfenz}}</span>
						</el-col>
					</el-row>
				</el-col>
				<el-col :xs="24" :sm="24" :md="24" :lg="24" class="namebody">
					<el-row>
						<el-col :xs="8" :sm="8" :md="8" :lg="8" >
							行驶证-打码：<span>{{table.phone}}</span>
						</el-col>
						<el-col :xs="8" :sm="8" :md="8" :lg="8" >
							借条：<span>{{table.shenfenz}}</span>
						</el-col>
					</el-row>
				</el-col>
				<el-col :xs="24" :sm="24" :md="24" :lg="24" class="namebody">
					<el-row>
						<el-col :xs="8" :sm="8" :md="8" :lg="8" >
							登记证<span>{{table.phone}}</span>
						</el-col>
						<el-col :xs="8" :sm="8" :md="8" :lg="8" >
							客户材料确认书：<span>{{table.shenfenz}}</span>
						</el-col>
					</el-row>
				</el-col>
				<el-col :xs="24" :sm="24" :md="24" :lg="24" class="namebody">
					<el-row>
						<el-col :xs="8" :sm="8" :md="8" :lg="8" >
							登记证-打码：<span>{{table.phone}}</span>
						</el-col>
						<el-col :xs="8" :sm="8" :md="8" :lg="8" >
							车辆买卖合同：<span>{{table.shenfenz}}</span>
						</el-col>
					</el-row>
				</el-col>
				<el-col :xs="24" :sm="24" :md="24" :lg="24" class="namebody">
					<el-row>
						<el-col :xs="8" :sm="8" :md="8" :lg="8" >
							抵押登记页：<span>{{table.phone}}</span>
						</el-col>
						<el-col :xs="8" :sm="8" :md="8" :lg="8" >
							交通强制保险单：<span>{{table.shenfenz}}</span>
						</el-col>
					</el-row>
				</el-col>
				<el-col :xs="24" :sm="24" :md="24" :lg="24" class="namebody">
					<el-row>
						<el-col :xs="8" :sm="8" :md="8" :lg="8" >
							抵押证等级页-打码<span>{{table.phone}}</span>
						</el-col>
						<el-col :xs="8" :sm="8" :md="8" :lg="8" >
							购车发票：<span>{{table.shenfenz}}</span>
						</el-col>
					</el-row>
				</el-col>
				<el-col :xs="24" :sm="24" :md="24" :lg="24" class="namebody">
					<el-row>
						<el-col :xs="8" :sm="8" :md="8" :lg="8" >
							财务放款凭证：<span>{{table.phone}}</span>
						</el-col>
						<el-col :xs="8" :sm="8" :md="8" :lg="8" >
							暂住证：<span>{{table.shenfenz}}</span>
						</el-col>
					</el-row>
				</el-col>
				<el-col :xs="24" :sm="24" :md="24" :lg="24" class="namebody">
					<el-row>
						<el-col :xs="8" :sm="8" :md="8" :lg="8" >
							财务放款凭证：<span>{{table.phone}}</span>
						</el-col>
						<el-col :xs="8" :sm="8" :md="8" :lg="8" >
							户口本：<span>{{table.shenfenz}}</span>
						</el-col>
					</el-row>
				</el-col>
				<el-col :xs="24" :sm="24" :md="24" :lg="24" class="namebody">
					<el-row>
						<el-col :xs="8" :sm="8" :md="8" :lg="8" >
							车头照：<span>{{table.phone}}</span>
						</el-col>
						<el-col :xs="8" :sm="8" :md="8" :lg="8" >
							结婚证：<span>{{table.shenfenz}}</span>
						</el-col>
					</el-row>
				</el-col>
				<el-col :xs="24" :sm="24" :md="24" :lg="24" class="namebody">
					<el-row>
						<el-col :xs="8" :sm="8" :md="8" :lg="8" >
							车头照-打码：<span>{{table.phone}}</span>
						</el-col>
						<el-col :xs="8" :sm="8" :md="8" :lg="8" >
							担保人省份证正面：<span>{{table.shenfenz}}</span>
						</el-col>
					</el-row>
				</el-col>
				<el-col :xs="24" :sm="24" :md="24" :lg="24" class="namebody">
					<el-row>
						<el-col :xs="8" :sm="8" :md="8" :lg="8" >
							车尾照：<span>{{table.phone}}</span>
						</el-col>
						<el-col :xs="8" :sm="8" :md="8" :lg="8" >
							担保人省份证反面：<span>{{table.shenfenz}}</span>
						</el-col>
					</el-row>
				</el-col>
				<el-col :xs="24" :sm="24" :md="24" :lg="24" class="namebody">
					<el-row>
						<el-col :xs="8" :sm="8" :md="8" :lg="8" >
							车尾照-打码：<span>{{table.phone}}</span>
						</el-col>
						<el-col :xs="8" :sm="8" :md="8" :lg="8" >
							营业执照：<span>{{table.shenfenz}}</span>
						</el-col>
					</el-row>
				</el-col>
				<el-col :xs="24" :sm="24" :md="24" :lg="24" class="namebody">
					税务登记证：<span>{{table.lxdz}}</span>
				</el-col>
			</el-row>
		</el-col>
		<el-col :xs="24" :sm="24" :md="24" :lg="24" class="bottom_num">
			<el-row :data="table">
				<el-col :xs="24" :sm="24" :md="24" :lg="24" class="headinfo">
					审核借款标
				</el-col>
				<el-col :xs="24" :sm="24" :md="24" :lg="24" class="namebody">
					<el-col :xs="8" :sm="8" :md="6" :lg="8" >
						借款人：<span>{{table.name}}</span>
					</el-col>
					<el-col :xs="8" :sm="8" :md="8" :lg="8" >
						状态：<span>{{table.sex}}</span>
					</el-col>
					<el-col :xs="6" :sm="6" :md="6" :lg="6" >
						借款用途：<span>{{table.hun}}</span>
					</el-col>
				</el-col>
				<el-col :xs="24" :sm="24" :md="24" :lg="24" class="namebody">
					<el-row>
						<el-col :xs="8" :sm="8" :md="8" :lg="8" >
							借款期限：<span>{{table.phone}}</span>
						</el-col>
						<el-col :xs="8" :sm="8" :md="8" :lg="8" >
							还款方式：<span>{{table.shenfenz}}</span>
						</el-col>
						<el-col :xs="8" :sm="8" :md="8" :lg="8" >
							借款总金额：<span>{{table.shenfenz}}</span>
						</el-col>
					</el-row>
				</el-col>
				<el-col :xs="24" :sm="24" :md="24" :lg="24" class="namebody">
					借款开始时间：<span>{{table.jgdz}}</span>
				</el-col>
			</el-row>
		</el-col>
		<el-col :xs="24" :sm="24" :md="24" :lg="24" class="bottom_num">
			<el-row :data="table">
				<el-col :xs="24" :sm="24" :md="24" :lg="24" class="headinfo">
					审核借款信息
				</el-col>
				<el-col :xs="24" :sm="24" :md="24" :lg="24" class="namebody">
					<el-form :inline="true" ref="form" :model="form" label-width="80px">
					  <el-form-item label="特殊资源">
					    <el-radio-group v-model="form.resource">
					      <el-radio label="通过"></el-radio>
					      <el-radio label="不通过退回"></el-radio>
					    </el-radio-group>
					  </el-form-item>
					  <el-form-item>
					    <el-input type="textarea" style="min-width: 400px;" v-model="form.name" placeholder="请输入审核备注"></el-input>
					  </el-form-item><br>
					  <el-form-item  label="标的使用去向">
					    <el-select  v-model="form.region">
					      <el-option label="平台自用" value="shanghai"></el-option>
					      <el-option label="微钱进" value="beijing"></el-option>
					      <el-option label="平台计划" value="beijing"></el-option>
					    </el-select>
					  </el-form-item>
					  <el-form-item  label="标的类型">
					    <el-select  v-model="form.region">
					      <el-option label="普通标" value="shanghai"></el-option>
					      <el-option label="定向标" value="beijing"></el-option>
					      <el-option label="手机专享" value="beijing"></el-option>
					      <el-option label="理财产品匹配专用" value="beijing"></el-option>
					    </el-select>
					  </el-form-item>
					  <el-form-item label="定向标：">
					     <el-input v-model="form.name" type="password" placeholder="请输入6位支付密码"></el-input>
					  </el-form-item><br>
					  <el-form-item label="预期年化：">
					     <el-input v-model="form.name"></el-input>
					  </el-form-item>
					  <el-form-item label="活动加息：">
					     <el-input v-model="form.name"></el-input>
					  </el-form-item>
					  <el-form-item  label="计息方式">
					    <el-select  v-model="form.region">
					      <el-option label="次日计息" value="shanghai"></el-option>
					      <el-option label="满标计息" value="beijing"></el-option>
					    </el-select>
					  </el-form-item><br>
					  <el-form-item label="蜜分比例:">
					     <el-input v-model="form.name"></el-input>
					  </el-form-item>
					  <el-form-item label="最低投标金额元:">
					     <el-input v-model="form.name" placeholder="0代表无限制"></el-input>
					  </el-form-item>
					  <el-form-item label="最多投标总金额:">
					     <el-input v-model="form.name" placeholder="0代表无限制"></el-input>
					  </el-form-item>
					</el-form>
				</el-col>
			</el-row>
		</el-col>
	</el-row>
</template>
<script type="text/javascript">
	export default {
		data(){
			return{
				table:{
					name:'徐升杰',
					sex:'男',
					hun:'未婚',
					phone:'13616546756',
					shenfenz:'331331121212122131',
					jgdz:'浙江省杭州市拱墅区祥园路108号1-1-03',
					lxdz:'浙江省杭州市拱墅区祥园路108号1-1-03'
				},
				carinfo:{
					name:'东风日产-尼桑',
					sex:'天籁',
					number:'这A1NC69',
					time:'2016-08-23 00:00:00',
					money:'200000',
					assessment:'150000',
					user:'张德华',
					userTime:'2017-02-25 00:00:00',
					address:'  '
				},
				form:{
					resource:'',
					name:'',
					region:'',
					date1:'',
					date2:''
				}
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
