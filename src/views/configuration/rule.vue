<template>
	<section>
		<!--列表-->
		<div class="top_text">平台三级分佣</div>
		<el-table :data="platform" border highlight-current-row v-loading="listLoading" style="width: 100%;min-width: 1080px;">
			<el-table-column prop="lvel" label="等级">
			</el-table-column>
			<el-table-column prop="percentage" label="分佣比">
				<template scope="scope">
					<el-input style="width: 100px" v-model="scope.row.percentage"></el-input>
				</template>
			</el-table-column>
		</el-table>
		<div class="top_text">团队分佣</div>
		<el-table :data="team" border highlight-current-row v-loading="listLoading" style="width: 100%;min-width: 1080px;">
			<el-table-column prop="lvel" label="邀请人数">
			</el-table-column>
			<el-table-column prop="percentage" label="分佣比">
				<template scope="scope">
					<el-input style="width: 100px" v-model="scope.row.percentage"></el-input>
				</template>
			</el-table-column>
		</el-table>
		<div class="top_text">创客商平级分佣</div>
		<el-table :data="same" border highlight-current-row v-loading="listLoading" style="width: 100%;min-width: 1080px;">
			<el-table-column prop="lvel" label="创客商">
			</el-table-column>
			<el-table-column prop="percentage" label="分佣比">
				<template scope="scope">
					<el-input style="width: 100px" v-model="scope.row.percentage"></el-input>
				</template>
			</el-table-column>
		</el-table>
		<el-col :span="24">
			<div class="bottom_btn">
				<el-button type="primary" @click="addSubmit">确认</el-button>
				<el-button type="primary" @click="reset">重置</el-button>
			</div>
		</el-col>
	</section>
</template>

<script>
	import { state } from '../../vuex/state'
	import util from '../../common/js/util'
	import {baseUrl , editUser, addUser } from '../../api/api';

	export default {
		data() {
			return {
				listLoading:false,
				platform:[{
					lvel :'一级',
					percentage:''
				},{
					lvel :'二级',
					percentage:''
				},{
					lvel :'三级',
					percentage:''
				}],
				team:[{
					lvel :'100人以内',
					percentage:''
				},{
					lvel :'100-200人',
					percentage:''
				},{
					lvel :'200-300人',
					percentage:''
				},{
					lvel :'300人以上',
					percentage:''
				}],
				same:[{
					lvel :'一级',
					percentage:''
				},{
					lvel :'二级',
					percentage:''
				},{
					lvel :'三级',
					percentage:''
				}],
				url:'',
				id:''
			}
		},
		methods: {
			getlist(){
				const _this = this
				$.ajax({
                    type:'POST',
                    dataType:'json',
                    url:baseUrl+"/api/corePlaConfig/find/proportion/platform",
                    data:JSON.stringify({}),
                    contentType:'application/json;charset=utf-8',
                    success:function(data){
                    	if(data.code !== 1){
                        	alert(data.msg)
                        }
                        if(data.data === null){
                        	_this.url = baseUrl+"/api/corePlaConfig/add/platform/proportion"
                        }else{
                        	if(data.data.id === null){
                        		_this.url = baseUrl+"/api/corePlaConfig/add/platform/proportion"
                        	}else{
                        		_this.url = baseUrl+"/api/corePlaConfig/update/platform/proportion"
                        		_this.id = data.data.id
                        	}
                        }
                        _this.platform[0].percentage = data.data.one
                        _this.platform[1].percentage = data.data.two
                        _this.platform[2].percentage = data.data.three

                        _this.team[0].percentage = data.data.teamOne
                        _this.team[1].percentage = data.data.teamTwo
                        _this.team[2].percentage = data.data.teamThree
                        _this.team[3].percentage = data.data.teamFour

                        _this.same[0].percentage = data.data.peersOne
                        _this.same[1].percentage = data.data.peersTwo
                        _this.same[2].percentage = data.data.peersThree
                    }
                })
			},
			addSubmit(){
				const _this = this
				const params = {
					one:this.platform[0].percentage,
					two:this.platform[1].percentage,
					three:this.platform[2].percentage,
					teamOne:this.team[0].percentage,
					teamTwo:this.team[1].percentage,
					teamThree:this.team[2].percentage,
					teamFour:this.team[3].percentage,
					peersOne:this.same[0].percentage,
					peersTwo:this.same[1].percentage,
					peersThree:this.same[2].percentage
				}
				if(_this.id !== ''){
					params.id = this.id
				}
				$.ajax({
                    type:'POST',
                    dataType:'json',
                    url:_this.url,
                    data:JSON.stringify(params),
                    contentType:'application/json;charset=utf-8',
                    success:function(data){
                        if(data.code === 1){
                        	alert('成功')
                        }else{
                        	alert(data.msg)
                        }
                    }
                })
			},
			reset(){
				for (var i = 0; i < this.platform.length; i++) {
					this.platform[i].percentage = 0
				}
				for (var i = 0; i < this.team.length; i++) {
					this.team[i].percentage = 0
				}
				for (var i = 0; i < this.same.length; i++) {
					this.same[i].percentage = 0
				}
				this.addSubmit()
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
	.top_text {
		font-size: 18px;
		margin-top: 20px;
		margin-bottom: 20px;
		font-weight: 900
	}
	.bottom_btn {
		margin-top: 20px;
		margin-left: 90%;
		width: 200px;
	}
</style>