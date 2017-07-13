<template>
	<el-form label-width="120px" :model="add">
	  <el-form-item label="所属板块位置">
	    <el-select v-model="add.orderSort" placeholder="请选择">
	    	<el-option  v-for="item in options" :label="item.label" :value="item.value"></el-option>
	    </el-select>
	  </el-form-item>
	  <el-form-item label="icon">
	    <!-- <el-input v-model="add.icon" style="width: 300px;"></el-input> -->
	    <input type="file" style="position:absolute;opacity:0;width:70px;height:30px;margin-right:10px"  @change="upload" id="fileInput">
		<button type="button" class="el-button el-button--primary el-button--small">
			<span>点击上传</span>
		</button>
		<button type="button" class="el-button el-button--primary el-button--small" id="btnClear" @click="clear">清空上传</button>
		<!-- <span style="display: block;font-size: 12px">{{ imageChange }}</span> -->
		
		<el-col>
			<img style="width: 40px;margin-top: 20px"  :src="iconImg">
		</el-col>
		<img style="width:150px;margin-top: 20px;margin-right: 20px" >
	  </el-form-item>
	  <el-form-item label="板块名称">
	    <el-input v-model="add.name" style="width: 300px;"></el-input>
	  </el-form-item>
	  <el-form-item label="板块缩略图">
	  	 <input type="file" style="position:absolute;opacity:0;width:70px;height:30px;margin-right:10px"  @change="upload1" id="fileInput">
		<button type="button" class="el-button el-button--primary el-button--small">
			<span>点击上传</span>
		</button>
	    <!-- <el-input v-model="add.img" style="width: 300px;"></el-input> -->
	    <el-col>
			<img style="width: 40px;margin-top: 20px"  :src="iconImg1">
		</el-col>
	  </el-form-item>
	  <el-form-item label="描述">
	  	 <el-input type="desc" v-model="add.desc"  :rows="10" style="width: 300px;"></el-input>
	  </el-form-item>
	  <el-form-item>
		<el-button type="primary" v-on:click="getlist">确认</el-button>
		<router-link :to="{ name: '千人千面'}">
			<el-button  type="primary">取消</el-button>
		</router-link>
	  </el-form-item>
	</el-form>
</template>

<script>
	import { state } from '../../vuex/state'
	import util from '../../common/js/util'
	import {baseUrl , editUser, addUser } from '../../api/api';

	export default {
		data() {
			return {
				options: [{
		          value: 1,
		          label: '模块一'
		        },{
		          value: 2,
		          label: '模块二'
		        }],
				add:{
					name:'',
					orderSort:'',
					desc:''
				},
				iconImg:'',
				iconImg1:'',
				formData: new FormData(),
        		fileImg: '',
				labelPosition:'right',
				radio: '0',
				checked: true,
				value:'',
				value1:'',
				value2:'',
				selectSubjectStatus: [
				{
					value:'0',
					label:'全部'
				},{
					value:'1',
					label:'待付款'
				},{
					value:'2',
					label:'待发货'
				},{
					value:'3',
					label:'已发货'
				},{
					value:'4',
					label:'待评价'
				},{
					value:'5',
					label:'退货'
				}],
				users: [],
				total: 100,
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

				addbannerdiv: false,//新增界面是否显示
				addLoading: false,
				//新增界面数据
				orderDetails: {
				}
			}
		},
		computed: {
	        // 实时更新上传图片的名字，仅读取，值只须为函数
	        imageChange: function () {
	            return this.fileImg
	        }
	    },
		methods: {
			//        清空上传
            clear(){
                let btn = document.getElementById("btnClear");
                let files = document.getElementById("fileInput");
                this.fileImg = '';
                // for IE, Opera, Safari, Chrome
                if (files !== null && files.value) {
                    files.value = "";
                    this.formData = new FormData()
                }
            },
        //图片上传
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
                    this.formData.append('file', file);
                    console.log(this.formData);
                    this.submitUpload()
                } else {
                    this.fileImg = ''
                    console.log('不存在file', file)
                    this.formData = new FormData()
                }
            },
            submitUpload(){
                // this.$confirm('确认修改吗？', '提示', {}).then(() => {
                    const _this= this;
                    _this.$http.post(baseUrl+'/api/attachment/upload', _this.formData, {
                        progress(event) {
                        }
                    })
                        .then(response => {
                            const info = JSON.parse(response.bodyText);
                            console.log(info)
                            // const info = response.body
              			_this.iconImg = info.data[0].baseUri+info.data[0].uri;
              				console.log(info.data[0].baseUri+info.data[0].uri)
                        }, error => _this.$emit('complete', 500, error.message))
                // });
            },
            upload1 (event) {
                this.formData = new FormData()
                let file = event.target.files[0]
                // console.log(file)
                const self = this
                // const flag = this.flag
                if (file) {
                    console.log('存在file', file)
                    this.fileImg = file.name
                    // console.log(this.formData)
                    this.formData.append('file', file);
                    console.log(this.formData);
                    this.submitUpload1()
                } else {
                    this.fileImg = ''
                    console.log('不存在file', file)
                    this.formData = new FormData()
                }
            },
            submitUpload1(){
                // this.$confirm('确认修改吗？', '提示', {}).then(() => {
                    const _this= this;
                    _this.$http.post(baseUrl+'/api/attachment/upload', _this.formData, {
                        progress(event) {
                        }
                    })
                        .then(response => {
                            const info = JSON.parse(response.bodyText);
                            console.log(info)
                            // const info = response.body
              			_this.iconImg1 = info.data[0].baseUri+info.data[0].uri;
              				console.log(info.data[0].baseUri+info.data[0].uri)
                        }, error => _this.$emit('complete', 500, error.message))
                // });
            },
			getlist(){
				const _this = this
				_this.table = []
				const params = {
					name:this.add.name,
					icon:this.iconImg,
					picture:this.iconImg1,
					desc:this.add.desc,
					orderSort:this.add.orderSort
				}
				console.log(params)
				$.ajax({
                    type:'POST',
                    dataType:'json',
                    url:baseUrl+"/api/indexStyle/add",
                    data:JSON.stringify(params),
                    contentType:'application/json;charset=utf-8',
                    success:function(data){
                    	console.log(data)
                    	if(data.code === 1){
                    		 _this.$router.push({ path: '/page' });
                    	}
                    }
                });
			},
			handleCurrentChange(val) {
				this.page = val;
				this.getUsers();
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
			//删除
			handleDel: function (index, row) {
				this.$confirm('确认删除该记录吗?', '提示', {
					type: 'warning'
				}).then(() => {
					this.listLoading = true;
					//NProgress.start();
					let para = { id: row.id };
					removeUser(para).then((res) => {
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
			},
			//显示编辑界面
			seeBtn: function (index, row) {
				this.editFormVisible = true;
				this.orderDetails = Object.assign({}, row);
			},
			//显示添加banner页面
			addbanner: function (index, row) {
				this.addbannerdiv = true;
				// this.orderDetails = Object.assign({}, row);
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
			//新增
			addSubmit: function () {
				this.$refs.addForm.validate((valid) => {
					if (valid) {
						this.$confirm('确认提交吗？', '提示', {}).then(() => {
							this.addLoading = true;
							//NProgress.start();
							let para = Object.assign({}, this.addForm);
							para.birth = (!para.birth || para.birth == '') ? '' : util.formatDate.format(new Date(para.birth), 'yyyy-MM-dd');
							addUser(para).then((res) => {
								this.addLoading = false;
								//NProgress.done();
								this.$message({
									message: '提交成功',
									type: 'success'
								});
								this.$refs['addForm'].resetFields();
								this.addFormVisible = false;
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
			// this.getlist();
		}
	}

</script>

<style>
	.el-dialog--small {
    	width: 25%;
    	border-radius: 10px
	}	
	.el-form-item__label{
		text-align: right;
	}
	.el-dialog__body{
		margin-left: 40px ! important ;
	}
</style>