<template>
	<section>
		<el-col :span="24" class="toolbar" style="padding-bottom: 0px;background: #fff;text-align: right;">
			<el-form :inline="true">
				<el-form-item>
					<el-button type="primary" v-on:click="AddUsers">添加</el-button>
				</el-form-item>
			</el-form>
		</el-col>
        
		<!--列表-->
		<el-table :data="orderInformation" border highlight-current-row v-loading="listLoading" style="width: 100%;min-width: 1080px;">
			<el-table-column type="index" label="序号">
			</el-table-column>
			<el-table-column prop="userName" label="用户名">
			</el-table-column>
			<!-- <el-table-column prop="amountPaid" label="描述">
			</el-table-column> -->
			<el-table-column prop="createTime" :formatter='formatterTime' label="创建时间">
			</el-table-column>
			<el-table-column label="操作">
				<template scope="scope">
					<!-- <el-button type="text" size="small" @click="seeBtn(scope.$index, scope.row)">编辑</el-button> -->
					<el-button type="text" size="small" @click="deldetBtn(scope.row)">删除</el-button>
				</template>
			</el-table-column>
		</el-table>

		<!--工具条-->
		<el-col :span="24" class="toolbar" style="background:#fff;">
			<el-pagination layout="prev, pager, next" @current-change="handleCurrentChange" :page-size="10" :total="total" style="float:right;">
			</el-pagination>
		</el-col>

		<!--添加用户-->
		<el-dialog title="添加用户" v-model="adduserVisible" :close-on-click-modal="false" >
            <el-form :model="yanzma" label-width="100px" :rules="passwdForm" ref="yanzma">
                <el-form-item label="用户名">
                    <el-input v-model="yanzma.userName" style="width:250px;"></el-input>
                </el-form-item>
                <el-form-item label="密码" type="password" prop="password">
                    <el-input type="password" v-model="yanzma.password" style="width:250px;"></el-input>
                </el-form-item>
                <el-form-item label="确认密码" type="password" prop="checkPass">
                    <el-input type="password" v-model="yanzma.checkPass" style="width:250px;"></el-input>
                </el-form-item>
            </el-form>
            <div>
                <el-button type="primary" style="width: 300px;margin-left: 60px;margin-top: 20px;" @click.native="yanzSubmit" >确认添加</el-button>
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
                var validatePass3 = (rule, value, callback) => {
                    if (value === '') {
                      callback(new Error('请输入密码'));
                    } else {
                      if (this.yanzma.password !== '') {
                        this.$refs.yanzma.validateField('checkPass');
                      }
                      callback();
                    }
                };
                var validatePass1 = (rule, value, callback) => {
                    if (value === '') {
                      callback(new Error('请再次输入密码'));
                    } else if (value !== this.yanzma.password) {
                      callback(new Error('两次输入密码不一致!'));
                    } else {
                      callback();
                    }
                };
            return {
                yanzma:{
                    userName:'',
                    password:'',
                    checkPass:''
                },
                passwdForm:{
                    password: [
                        { validator: validatePass3, trigger: 'blur' }
                      ],
                  checkPass: [
                    { validator: validatePass1, trigger: 'blur' }
                  ]
                },
                adduserVisible:false,
                total: 0,
                page: 1,
                listLoading: false,
                //新增界面数据
                orderInformation:[]
            }
        },
        methods: {
            deldetBtn(row){

            },
            yanzSubmit(){
                const _this = this
                const params = {
                    userName:this.yanzma.userName,
                    password:this.yanzma.password
                }
                console.log(params)
                $.ajax({
                    type:'POST',
                    dataType:'json',
                    url:baseUrl+"/api/admin/coreAdmin/add",
                    data:JSON.stringify(params),
                    contentType:'application/json;charset=utf-8',
                    success:function(data){
                        console.log(data)
                        if(data.code === 1){
                            _this.adduserVisible = false
                        }
                    }
                })
            },
            getlist(){
                const _this = this
                const params = {}
                $.ajax({
                    type:'POST',
                    dataType:'json',
                    url:baseUrl+"/api/admin/coreAdmin/findChildAdminList",
                    data:JSON.stringify(params),
                    contentType:'application/json;charset=utf-8',
                    success:function(data){
                        console.log(data)
                        _this.orderInformation = data.data
                    }
                })
            },
            handleCurrentChange(val) {
                this.page = val;
                this.getlist();
            },
            //显示新增界面
            AddUsers: function () {
                this.adduserVisible = true;
            },
            formatterTime(row,column){
                let curTime = row.createTime;
                if(curTime !== null){
                    curTime = new Date(curTime).toLocaleString()
                    return curTime
                }
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