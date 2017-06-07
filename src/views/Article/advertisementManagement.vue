<template>
	<section>
		<!--工具条-->
	<!-- 	<el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
			<el-form :inline="true" :model="filters">
				<el-form-item>
					<el-input v-model="filters.name" placeholder="订单号"></el-input>
				</el-form-item>
				<el-form-item>
					<el-input v-model="filters.name" placeholder="计划名称"></el-input>
				</el-form-item>
				<el-form-item>
					<el-input v-model="filters.name" placeholder="手机号"></el-input>
				</el-form-item>
				<el-form-item>
					<el-input v-model="filters.name" placeholder="姓名"></el-input>
				</el-form-item>
			    <el-select v-model="value" placeholder="订单状态">
			      <el-option v-for="item in list" :label="item.label" :value="item.value">
			      </el-option>
			    </el-select>
			    <el-select v-model="value1" placeholder="处理状态">
			      <el-option v-for="item in list1" :label="item.label" :value="item.value">
			      </el-option>
			    </el-select>
				<el-form-item>
					<el-button type="primary" v-on:click="getUsers">查询</el-button>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" @click="handleAdd">新增</el-button>
				</el-form-item>
			</el-form>
		</el-col> -->

		<!--列表-->
		<el-table :data="table" border highlight-current-row v-loading="listLoading" style="width: 100%;min-width: 1080px;">
			<el-table-column prop="title" label="名称">
			</el-table-column>
			<el-table-column label="图片">
				<template scope="scope">
					<img class="banner_img" :src='scope.row.imageUrl'>
				</template>
			</el-table-column>
			<el-table-column prop="url" label="跳转地址">
			</el-table-column>
			<el-table-column prop="startTime" :formatter = 'formatter' label="开始时间">
			</el-table-column>
			<el-table-column prop="expiredTime" :formatter = 'formatter' label="结束时间">
			</el-table-column>
			<el-table-column prop="delayTime" label="弹窗时间">
			</el-table-column>
			<el-table-column label="操作">
				<template scope="scope">
					<!-- <el-button type='text' size="small" @click="deleteLaunch(scope.$index, scope.row)">删除</el-button> -->
					<!-- <el-button v-else-if='scope.row.index === 0' :disabled="true" type='text' size="small" @click="handleEdit(scope.$index, scope.row)">已处理</el-button> -->
					<el-button type="text" size="small" @click="handleEdit(scope.$index, scope.row)">暂停</el-button>
				</template>
			</el-table-column>
		</el-table>

		<!--工具条-->
		<!-- <el-col :span="24" class="toolbar">
			<el-button type="danger" @click="batchRemove" :disabled="this.sels.length===0">批量删除</el-button>
			<el-pagination layout="prev, pager, next" @current-change="handleCurrentChange" :page-size="20" :total="total" style="float:right;">
			</el-pagination>
		</el-col> -->

		<!--编辑界面-->
		<el-dialog title="启用的弹窗设置" v-model="editFormVisible" :close-on-click-modal="false">
			<el-form :model="editForm" label-width="120px" :rules="editFormRules" ref="editForm">
				<el-form-item label="名称：">
					<el-input v-model="addForm.title" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="开始时间：">
					<el-date-picker v-model="startTime" type="datetime" placeholder="选择日期时间"></el-date-picker>
				</el-form-item>
				<el-form-item label="结束时间：">
					<el-date-picker v-model="expiredTime" type="datetime" placeholder="选择日期时间"></el-date-picker>
				</el-form-item>
				<el-form-item label="弹窗时间：">
					<el-input v-model="delayTime"></el-input>
					<!-- <el-date-picker v-model="delayTime" type="datetime" placeholder="选择日期时间"></el-date-picker> -->
				</el-form-item>
				<el-col :span="24">
					<el-col :span='5' :offset='1'>
						<el-select v-model="enterType" placeholder="请选择链接类型">
					    	<el-option v-for="item in options" :label="item.label" :value="item.value">
					    	</el-option>
					  </el-select>
					</el-col>
					<el-col :span='6' :offset='1'>
						<el-input v-model="value" auto-complete="off"></el-input>
					</el-col>
				</el-col>
				<!-- <el-form-item label="图片：">
					<el-col :span='10'>
						<el-input v-model="addForm.name" auto-complete="off"></el-input>
					</el-col>
					<el-col :span='4'>
						<el-button type='text'>上传图片</el-button>
					</el-col>
				</el-form-item> -->
				<el-col :xs="24" :md="24">
					<el-form-item label="图片:">
						<!-- <img class="goods-image-thumb" :src='editForm.imageUrl'> -->
						<!-- 上传图片 -->
						<form style="position:relative;">
						    <input type="file" style="position:absolute;opacity:0;width:70px;height:30px;margin-right:10px"  @change="upload" id="fileInput">
						    <button type="button" class="el-button el-button--primary el-button--small">
						    	<span>点击上传</span>
						    </button>
						    <button type="button" class="el-button el-button--primary el-button--small" id="btnClear" @click="clear">清空上传</button>
						    <span style="display: block;font-size: 12px">{{ imageChange }}</span>
						</form>
		    		</el-form-item>
				</el-col>
				<!-- <el-button style="margin-left: 43%;" type='primary' @click='addSubmit'>提交</el-button> -->
			</el-form>
			<div slot="footer" class="dialog-footer" style="text-align: center;">
				<!-- <el-button type="primary" @click.native="editSubmit" :loading="editLoading">保存</el-button> -->
				<el-button style="margin-left: 43%;" type='primary' @click='addSubmit'>提交</el-button>
				<el-button type="primary" @click.native="editFormVisible = false">取消</el-button>
			</div>
		</el-dialog>

		<!--新增界面-->
		<!-- <el-dialog title="新增" v-model="addFormVisible" :close-on-click-modal="false">
			<el-form :model="addForm" label-width="80px" :rules="addFormRules" ref="addForm">
				<el-form-item label="姓名" prop="name">
					<el-input v-model="addForm.name" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="性别">
					<el-radio-group v-model="addForm.sex">
						<el-radio class="radio" :label="1">男</el-radio>
						<el-radio class="radio" :label="0">女</el-radio>
					</el-radio-group>
				</el-form-item>
				<el-form-item label="年龄">
					<el-input-number v-model="addForm.age" :min="0" :max="200"></el-input-number>
				</el-form-item>
				<el-form-item label="生日">
					<el-date-picker type="date" placeholder="选择日期" v-model="addForm.birth"></el-date-picker>
				</el-form-item>
				<el-form-item label="地址">
					<el-input type="textarea" v-model="addForm.addr"></el-input>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click.native="addFormVisible = false">取消</el-button>
				<el-button type="primary" @click.native="addSubmit" :loading="addLoading">提交</el-button>
			</div>
		</el-dialog> -->
	</section>
</template>

<script>
	import { state } from '../../vuex/state'
	import util from '../../common/js/util'
	import {baseUrl , editUser, addUser } from '../../api/api';

	export default {
		data() {
			return {
				fileImg:'',
				checked: true,
				formData: new FormData(),
				startTime:'',
				expiredTime:'',
				delayTime:'',
				enterType:'',
				value:'',
				options: [{
		          value: '10',
		          label: '标的ID'
		        }, {
		          value: '20',
		          label: '文章链接'
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
					username: '',
					sex: -1,
					age: 0,
					birth: '',
					addr: ''
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
				table:[{
					id:"充值预热",
					jhnane:'',
					phone:"",
					username:"",
					gmje:'',
					index:1
				}]
			}
		},
		computed: {
		    // 实时更新上传图片的名字，仅读取，值只须为函数
		    imageChange: function () {
		      return this.fileImg
		    }
	    },
		methods: {
			clear(){
				let btn = document.getElementById("btnClear");
     			let files = document.getElementById("fileInput");
     			this.fileImg = '';
				// for IE, Opera, Safari, Chrome
		        if (files !== null && files.value) {
		        //     files.outerHTML = files.outerHTML;
		        // } else { // FF(包括3.5)
	            	files.value = "";
	            	this.formData = new FormData()
		        }
			},
			upload (event) {
				this.formData = new FormData()
                let file = event.target.files[0]
                // console.log(file)
                const self = this
                // const flag = this.flag
                if (file) {
                	console.log('存在file', file)
                	this.fileImg = file.name
                    // console.log(this.formData)
                    this.formData.append('file', file)
                } else {
                	this.fileImg = ''
                	console.log('不存在file', file)
                	this.formData = new FormData()
                }
            },
            addSubmit: function () {
						this.$confirm('确认提交吗？', '提示', {}).then(() => {
							const _this= this
							const flag = this.flag
							let stime = this.startTime.getTime()
							let etime = this.expiredTime.getTime()
							let delay = this.delayTime
							const params={
								accountId:'1',
								accessToken:'1',
								resourceType:'',
								launchImageEntity:{
									imageUrl:this.imageUrl,
									platform:'10',
									title:this.addForm.title,
									delayTime:delay,
									startTime:stime.toString(),
									expiredTime:etime.toString(),
									entryType:this.enterType,
									url:this.value,
									id: this.editForm.id
								}
							}
							console.log(params)
							this.formData.append('param', JSON.stringify(params))
							// console.log(this.formData)
			                _this.$http.post(baseUrl+"/admin/launchImage/updateLaunchImage", _this.formData, {
	                        	progress(event) {
		                            //传递给父组件的progress方法
		                            // _this.$emit('progress', parseFloat(event.loaded / event.total * 100), flag)
		                        }
                            })
                            .then(response => {
                            	console.log(response)
                            	const info = JSON.parse(eval('(' + response.bodyText + ')'));
                                // const info = response.body
                                console.log(info.res)
                                // _this.addLoading = false;
                                if(info.res === state.HTTPCODE.SUCCEED){
        		                	_this.$message({
        		                		message: info.resMsg,
        		                		type: 'success'
        		                	});
        		                	_this.editFormVisible = false;
        		                	_this.getList();
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
                            }, error => _this.$emit('complete', 500, error.message))
						});
			},
			formatter(row,column){
				let curTime = row.createTime;
				curTime = new Date(curTime).toLocaleString()
				return curTime
			},
			getList(){
				const _this = this
				_this.table = []
				const params={
					accountId:'1',
					accessToken:'1',
					page:{
						pageNum:this.page,
						pageSize:'10'
					}
				}
				$.post(baseUrl+'/admin/launchImage/getAllLaunchImage',
					{param: JSON.stringify(params)},
					function(data){
						const info = eval('(' + data + ')');
		                const response = JSON.parse(info);
		                const list = response.obj.results
		                console.log(response)
		                for(var i = 0;i<list.length;i++){
		                	_this.table.push(list[i])
		                }
					})
			},
			handleCurrentChange(val) {
				this.page = val;
				this.getUsers();
			},
			add(){
				const _this= this
				const flag = this.flag
				let stime = this.startTime.getTime()
				let etime = this.expiredTime.getTime()
				let delay = this.delayTime
				const params={
					accountId:'1',
					accessToken:'1',
					resourceType:'',
					launchImageEntity:{
						imageUrl:this.imageUrl,
						platform:'10',
						title:this.addForm.title,
						delayTime:delay,
						startTime:stime.toString(),
						expiredTime:etime.toString(),
						entryType:this.enterType,
						url:this.value,
						id: this.editForm.id
					}
				}
				console.log(params)
                this.formData.append('param', JSON.stringify(params) )
                _this.$http.post(baseUrl+'/admin/launchImage/updateLaunchImage', _this.formData, {
                        progress(event) {
                            //传递给父组件的progress方法
                            _this.$emit('progress', parseFloat(event.loaded / event.total * 100), flag)
                        }
                    })
                    .then(response => {
                    	console.log(response)
                        const result = response.body
                        if (result.hash && result.key) {
                            //传递给父组件的complete方法
                            _this.$emit('complete', 200 , result, flag)
                            //让当前target可以重新选择
                            event.target.value = null
                        } else {
                            _this.$emit('complete', 500, result, flag)
                        }
                    }, error => _this.$emit('complete', 500, error.message), flag)
			},
			// upload (event) {
   //              let file = event.target.files[0]
   //              console.log(file)
   //              const self = this
   //              const flag = this.flag
   //              if (file) {
   //                  console.log(this.formData)
   //                  self.formData.append('file', file)
   //              }
   //          },
			//删除
			deleteLaunch: function (index, row) {
				console.log(row)
				const _this = this
				const params ={
					accountId:"1",
		            accessToken:"1",
		            resourceType:'',
		            id:row.id
				}
				console.log(params)
				this.$confirm('确认删除该记录吗?', '提示', {
					type: 'warning'
				}).then(() => {
					$.post(baseUrl+"/admin/launchImage/deleteLaunchImageById",
		             { param: JSON.stringify(params) },
		             function(data){
		             	const info = eval('(' + data + ')');
		                const response = JSON.parse(info);
		                console.log(response)
		             	if(response.res === 1000000){
							_this.$message({
								message: '删除成功',
								type: 'success'
							});
		             	}else{
							_this.$message({
								message: response.resMsg,
								type: 'error'
							});
		             	}
		             	_this.getList();
		              }
		         	)
				}).catch(() => {

				});
			},
			//显示编辑界面
			handleEdit: function (index, row) {
				this.editFormVisible = true;
				this.editForm = Object.assign({}, row);
				console.log(row)
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
			// //新增
			// addSubmit: function () {
			// 	this.$refs.addForm.validate((valid) => {
			// 		if (valid) {
			// 			this.$confirm('确认提交吗？', '提示', {}).then(() => {
			// 				this.addLoading = true;
			// 				//NProgress.start();
			// 				let para = Object.assign({}, this.addForm);
			// 				para.birth = (!para.birth || para.birth == '') ? '' : util.formatDate.format(new Date(para.birth), 'yyyy-MM-dd');
			// 				addUser(para).then((res) => {
			// 					this.addLoading = false;
			// 					//NProgress.done();
			// 					this.$message({
			// 						message: '提交成功',
			// 						type: 'success'
			// 					});
			// 					this.$refs['addForm'].resetFields();
			// 					this.addFormVisible = false;
			// 					this.getUsers();
			// 				});
			// 			});
			// 		}
			// 	});
			// },
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
			this.getList();
		}
	}

</script>

<style scoped>

</style>