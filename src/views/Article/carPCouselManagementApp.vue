<template>
	<section>
		<!--工具条-->
		<el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
			<el-form :inline="true" :model="filters">
				<el-form-item>
					<el-select v-model="value" placeholder="轮播状态">
			      <el-option v-for="item in list" :label="item.name" :value="item.value">
			      </el-option>
			    </el-select>
				</el-form-item>
				<el-form-item>
					<el-input v-model="filters.name" placeholder="轮播状态"></el-input>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" v-on:click="getbannerType">查询</el-button>
				</el-form-item><br>
				<el-form-item>
					<el-button type="primary" @click="handleAdd">新增轮播图</el-button>
				</el-form-item>
			</el-form>
		</el-col>

		<!--列表-->
		<el-table :data="bannerList" border highlight-current-row v-loading="listLoading" style="width: 100%;min-width: 1080px;">
			<el-table-column prop="imageUrl"label="轮播">
				<template scope="scope">
					<img class="banner_img" :src='scope.row.imageUrl'>
				</template>
			</el-table-column>
			<el-table-column prop="title" label="名称">
			</el-table-column>
			<el-table-column prop="value" label="跳转地址">
			</el-table-column>
			<el-table-column prop="startTime" :formatter='formatterTime' label="开始时间">
			</el-table-column>
			<el-table-column prop="expiredTime" :formatter='formatterTime' label="结束时间">
			</el-table-column>
			<el-table-column prop="index" label="排序值">
			</el-table-column>
			<el-table-column prop="status" :formatter = 'formatter' label="状态">
			</el-table-column>
			<el-table-column label="操作">
				<template scope="scope">
					<!-- <el-button v-else-if='scope.row.index === 0' :disabled="true" type='text' size="small" @click="handleEdit(scope.$index, scope.row)">已处理</el-button> -->
					<el-button type="text" size="small" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
					<el-button type='text' size="small" @click="handleDel(scope.$index, scope.row)">删除</el-button>
				</template>
			</el-table-column>
		</el-table>
		<!--新增界面-->
		<el-dialog title="新增"  v-model="addFormVisible" :close-on-click-modal="false">
			<el-form class="mo-upload" label-width="120px">
				<el-form-item label="轮播名称：">
					<el-input v-model="title" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="开始时间：">
					<el-date-picker v-model="startTime" type="datetime" placeholder="选择日期时间"></el-date-picker>
				</el-form-item>
				<el-form-item label="结束时间：">
					<el-date-picker v-model="expiredTime" type="datetime" placeholder="选择日期时间"></el-date-picker>
				</el-form-item>
				<el-form-item label="排序值：">
					<el-input v-model="index" auto-complete="off"></el-input>
				</el-form-item>
				<!-- <el-form-item label="轮播类型">
					<el-input v-model="bannerType" auto-complete="off"></el-input>
				</el-form-item> -->
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
				<el-col :xs="24" :md="24">
						<el-form-item label="图片:">
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
				<el-button style="margin-left: 43%;" type='primary' @click='addSubmit'>提交</el-button>
			</el-form>
			<!--  <label class="mo-upload">
		    	<input type="text" v-model='title'>
		    	<input type="text" v-model='startTime'>
		    	<input type="text" v-model='expiredTime'>
		    	<input type="text" v-model='value'>
		    	<input type="text" v-model='index'>
		        <input type="file" @change="upload">
		        <button @click='add'>提交</button>
		    </label> -->
		</el-dialog>
		<!--工具条-->
		<el-col :span="24" class="toolbar">
			<!-- <el-button type="danger" @click="batchRemove" :disabled="this.sels.length===0">批量删除</el-button> -->
			<el-pagination layout="prev, pager, next" @current-change="handleCurrentChange" :page-size="10" :total="total" style="float:right;">
			</el-pagination>
		</el-col>

		<!--编辑界面-->
		<el-dialog title="编辑" v-model="editFormVisible" :close-on-click-modal="false"  enctype="multipart/form-data">
			<el-form :model="editForm" label-width="120px" :rules="editFormRules" ref="editForm">
				<el-form-item label="轮播名称：">
					<el-input v-model="editForm.title" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="开始时间：">
					<el-date-picker
				      v-model="editForm.startTime"
				      type="date"
				      placeholder="选择日期">
				    </el-date-picker>
					<!-- <el-input v-model="editForm.startTime" auto-complete="off"></el-input> -->
				</el-form-item>
				<el-form-item label="结束时间：">
					<el-date-picker
				      v-model="editForm.expiredTime"
				      type="date"
				      placeholder="选择日期">
				    </el-date-picker>
					<!-- <el-input v-model="editForm.startTime" auto-complete="off"></el-input> -->
				</el-form-item>
				<!-- <el-form-item label="结束时间：">
					<el-input v-model="editForm.expiredTime" auto-complete="off"></el-input>
				</el-form-item> -->
				<el-form-item label="排序值：">
					<el-input v-model="editForm.index" auto-complete="off"></el-input>
				</el-form-item>
				<el-col :xs="24" :md="24">
						<el-form-item label="图片:">
							<img class="goods-image-thumb" :src='editForm.imageUrl'>
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
				<el-col :span="24" style=" ">
					<el-col :span='5' :offset='1'>
						<el-select v-model="entryType" placeholder="请选择链接类型">
					    	<el-option v-for="item in options" :label="item.label" :value="item.value">
					    	</el-option>
					  </el-select>
					</el-col>
					<el-col :span='6' :offset='1'>
						<el-input v-model="editForm.value" auto-complete="off"></el-input>
					</el-col>
				</el-col>
				<el-col :span='24'></el-col>
			</el-form>
			<div slot="footer" class="dialog-footer" style="text-align: center;">
				<el-button type="primary" @click.native="submitUpload" :loading="editLoading">保存</el-button>
				<el-button type="primary" @click.native="editFormVisible = false">取消</el-button>
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
				pickerOptions: {
		          disabledDate(time) {
		            return time.getTime() < Date.now() - 8.64e7;
		          }
		        },
		        entryType: '',
		        enterType:'',
				bannerType:'',
				bannerTypeid: '10',
				title:'',
				startTime:'',
				expiredTime:'',
				index:'',
				url:baseUrl+'/admin/banner/addBanner' ,
				checked: true,
				value:'',
				options: [{
		          value: '10',
		          label: '标的ID'
		        }, {
		          value: '20',
		          label: '文章链接'
		        }],
		        list:[{
		        	value: '10',
		            name: '进行中'
		        },{
		        	value: '20',
		            name: '即将开始'
		        },{
		        	value: '30',
		            name: '已结束'
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
				editForm: {
				},
				bannerList:[{
					id:"充值预热",
					state:'进行中',
					phone:"",
					username:"",
					gmje:'',
					index:1
				}],
				formData: new FormData(),
				fileImg: ''
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
			// 添加或编辑上传图片
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
							let stime = this.startTime.getTime()
							let etime = this.expiredTime.getTime()
							const params={
								accountId:'1',
								accessToken:'1',
								resourceType:'',
								// bannerEntity:{
								title:this.title,
								startTime:stime.toString(),
								expiredTime:etime.toString(),
								index:this.index,
								bannerType:_this.bannerTypeid,
								enterType:_this.enterType,//_this.enterType
								value:this.value
								// }
							}
							this.formData.append('param', JSON.stringify(params))
							// console.log(this.formData)
			                _this.$http.post(baseUrl+"/admin/banner/addBanner", _this.formData, {
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
                                _this.addLoading = false;
                                if(info.res === state.HTTPCODE.SUCCEED){
        		                	_this.$message({
        		                		message: info.resMsg,
        		                		type: 'success'
        		                	});
        		                	_this.addFormVisible = false;
        		                	_this.getlist();
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
			formatterTime(row,column){
				let curTime = row.createTime;
				curTime = new Date(curTime).toLocaleString()
				return curTime
			},
			formatter(row,column){
				let statu =''
				if(row.status === 10){
					statu = '进行中'
				}else if(row.status === 20){
					statu = '即将开始'
				}else{
					statu = '已结束'
				}
				return statu
			},
			getlist(){
				const _this = this
				_this.bannerList = []
				const params={
					accountId:'1',
					accessToken:'1',
					page:{
						pageNum:this.page,
						pageSize:'10'
					},
					resourceType:'',
					bannerType:_this.bannerTypeid
				}
				console.log(params)
				$.post(baseUrl+"/admin/banner/getBannerByPage",
	             { param: JSON.stringify(params) },
	             function(data){
	             	const info = eval('(' + data + ')');
	                const response = JSON.parse(info);
	                const list = response.obj.results
	                console.log(response)
	                _this.total = response.obj.totalRecord
	                for(var i = 0;i<list.length;i++){
	                	_this.bannerList.push(list[i])
	                }
	                console.log(_this.bannerList)
	              }
	         	)
			},
			getbannerType(){
				const _this = this
				_this.bannerList = []
				const params={
					accountId:'1',
					accessToken:'1',
					resourceType:'',
					page:{
						pageNum:this.page,
						pageSize:'10'
					},
					title:_this.filters.name,
					bannerType:_this.bannerTypeid,
					status:this.value
				}
				console.log(params)
				$.post(baseUrl+"/admin/banner/findBannerByParam",
	             { param: JSON.stringify(params) },
	             function(data){
	             	const info = eval('(' + data + ')');
	                const response = JSON.parse(info);
	                const list = response.obj.results
	                console.log(response)
	                for(var i = 0;i<list.length;i++){
	                	_this.bannerList.push(list[i])
	                }
	              }
	         	)
			},
			//删除
			handleDel: function (index, row) {
				console.log(row)
				const _this = this
				const params={
					accountId:'1',
					accessToken:'1',
					resourceType:'',
					bannerId:row.id
				}
				console.log(params)
				this.$confirm('确认删除吗?', '提示', {
					type: 'warning'
				}).then(() => {
					$.post(baseUrl+"/admin/banner/deleteBannerById",
	             { param: JSON.stringify(params) },
	             function(data){
	             	const info = eval('(' + data + ')');
	                const response = JSON.parse(info);
	                	if(response.res === 1000000){
	                		_this.$message({
								message: '删除成功',
								type: 'success'
							});
	                	}else{
	                		_this.$message({
							message: '删除失败',
								type: 'error'
							});
	                	}
	                _this.getlist()
	              }
	         	)
				}).catch(() => {

				});
			},
			//显示编辑界面
			handleEdit: function (index, row) {
				this.editFormVisible = true;
				this.entryType = row.entryType.toString()
				console.log(row)
				this.editForm = Object.assign({}, row);
			},
			submitUpload(){
				this.$confirm('确认修改吗？', '提示', {}).then(() => {
							const _this= this
							console.log(this.editForm)
							let stime = this.editForm.startTime
							let etime = this.editForm.expiredTime
							console.log(stime)
							// stime = stime.getTime().toString()
							// etime = etime.getTime()
							const params={
								accountId:'1',
								accessToken:'1',
								resourceType:'',
								bannerEntity:{
									id:this.editForm.id,
									title:this.editForm.title,
									imageUrl:this.editForm.imageUrl,
									startTime:stime,
									expiredTime:etime,
									createTime:this.editForm.createTime,
									index:this.editForm.index,
									bannerType:this.bannerTypeid,
									entryType:_this.entryType,//_this.enterType
									value:this.editForm.value
								}
							}
							console.log(this.editForm)
							console.log(params)
							this.formData.append('param', JSON.stringify(params))
							// console.log(this.formData)
			                _this.$http.post(baseUrl+"/admin/banner/updateBannerById", _this.formData, {
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
                                _this.addLoading = false;
                                if(info.res === state.HTTPCODE.SUCCEED){
        		                	_this.$message({
        		                		message: info.resMsg,
        		                		type: 'success'
        		                	});
        		                	_this.editFormVisible = false;
        		                	_this.getlist();
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
			add(){
				const _this= this
				const flag = this.flag
				let stime = this.startTime.getTime()
				let etime = this.expiredTime.getTime()
				const params={
					accountId:'1',
					accessToken:'1',
					resourceType:'',
					// bannerEntity:{
					title:this.title,
					startTime:stime.toString(),
					expiredTime:etime.toString(),
					index:this.index,
					bannerType:this.bannerTypeid,
					enterType:_this.enterType,//_this.enterType
					value:this.value
					// }
				}
				console.log(stime.toString())
				console.log(etime.toString())
                this.formData.append('param', JSON.stringify(params) )
                _this.$http.post('http://192.168.10.18:8080/shangfu-admin-web-artAct/admin/banner/addBanner', _this.formData, {
                        progress(event) {
                            //传递给父组件的progress方法
                            _this.$emit('progress', parseFloat(event.loaded / event.total * 100), flag)
                        }
                    })
                    .then(response => {
                    	_this.addFormVisible = false;
                    	_this.getlist();
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
			handleCurrentChange(val) {
				this.page = val;
				this.getlist();
			},
			//获取用户列表
			getUsers() {
				let para = {
					page: this.page,
					name: this.filters.name
				};
				this.listLoading = true;
				//NProgress.start();
				getUserListPage(para).then((res) => {
					this.total = res.data.total;
					this.users = res.data.users;
					this.listLoading = false;
					//NProgress.done();
				});
			},
			//显示新增界面
			handleAdd: function () {
				this.addFormVisible = true;
				// this.addForm = {
				// 	name: '',
				// 	sex: -1,
				// 	age: 0,
				// 	birth: '',
				// 	addr: ''
				// };
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
			this.getlist();
		}
	}

</script>

<style>
.banner_img{
	width:100px;
	height:100px;
}
</style>