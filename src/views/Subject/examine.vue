<template>
	<el-row>
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
					  </el-form-item><br>
					  <el-form-item style="margin-left: 20%;">
					    <el-button type="primary" @click="onSubmit">保存</el-button>
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
					sex:'等待初审',
					hun:'短期周转',
					phone:'30天',
					shenfenz:'每月还息到期还本',
					jgdz:'87000元',
					lxdz:'2017-03-01 10:29:48'
				},
				form:{
					resource:'',
					name:'',
					region:'',
					date1:'',
					date2:''
				}

			}
		},
		methods: {
	      onSubmit() {
	        console.log('submit!');
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
