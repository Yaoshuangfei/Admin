<template>
	<section>
		<!--工具条-->
		<el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
			<el-form :inline="true">
				<el-form-item>
					<el-button type="primary" v-on:click="addGoods">添加</el-button>
				</el-form-item>
			</el-form>
		</el-col>

		<!--列表-->
		<el-table :data="table" border highlight-current-row v-loading="listLoading" style="width: 100%;min-width: 500px;">
			<el-table-column type="index" label="序号" >
			</el-table-column>
			<el-table-column prop="name" label="分类名称">
			</el-table-column>
			<el-table-column prop="sort" label="顺序">
			</el-table-column>
			<el-table-column prop="status" :formatter='formatterType' label="状态">
			</el-table-column>
			<el-table-column prop="pid" :formatter='formatterPid' label="上级分类">
			</el-table-column>
			<!-- <el-table-column prop="loan_number" label="是否有节点">
			</el-table-column> -->
			<el-table-column label="操作" width="150">
				<template scope="scope">
					<!-- <el-button v-if="scope.row.status === 0" type='text' size="small" @click="handleEdit1(scope.$index, scope.row)">启用</el-button> -->
					<!-- <el-button v-if="scope.row.status === 1" type='text' size="small" @click="handleEdit1(scope.$index, scope.row)">禁用</el-button> -->
					<el-button type='text' size="small" @click="seeBtn(scope.row)">查看</el-button>
					<el-button type='text' size="small" @click="editBtn(scope.row)">修改</el-button>
					<el-button type="text" size="small" @click="dleDelBtn(scope.row)">删除</el-button>
				</template>
			</el-table-column>
		</el-table>

		<!--工具条-->
		<el-col :span="24" class="toolbar">
			<!-- <el-button type="danger" @click="batchRemove" :disabled="this.sels.length===0">批量删除</el-button> -->
			<el-pagination layout="prev, pager, next" @current-change="handleCurrentChange" :page-size="10" :total="total" style="float:right;">
			</el-pagination>
		</el-col>

		<!--编辑界面-->
		<el-dialog title="银行卡管理" v-model="editFormVisible" :close-on-click-modal="false">
			<el-form :model="editForm" label-width="100px" :rules="editFormRules" ref="editForm">
				<el-form-item label="用户ID:">{{editForm.name}}</el-form-item>
				<el-form-item label="手机号码:">{{editForm.name}}</el-form-item>
				<el-form-item label="客户姓名:">{{editForm.name}}</el-form-item>
				<el-form-item label="银行:">
					<el-select v-model="value" placeholder="请选择银行">
					    <el-option
					      v-for="item in options"
					      :label="item.label"
					      :value="item.value">
					    </el-option>
				  </el-select>
				</el-form-item>
				<el-form-item label="银行支行:">
					<el-input v-model="editForm.name" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="银行卡号:">
					<el-input v-model="editForm.name" auto-complete="off"></el-input>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<!-- <el-button @click.native="editFormVisible = false">取消</el-button> -->
				<el-button type="primary" @click.native="editSubmit" :loading="editLoading">保存</el-button>
			</div>
		</el-dialog>

		<el-dialog title="客户详情" v-model="editFormVisible1" :close-on-click-modal="false">
			<el-form :model="editForm" label-width="180px" :rules="editFormRules" ref="editForm">
				<el-form-item label="用户ID:">{{editForm.name}}</el-form-item>
				<el-form-item label="手机号码:">{{editForm.name}}</el-form-item>
				<el-form-item label="客户姓名:">{{editForm.name}}</el-form-item>
				<el-form-item label="省份证号:">{{editForm.name}}</el-form-item>
				<el-form-item label="会员等级:">{{editForm.name}}</el-form-item>
				<el-form-item label="账户余额:">{{editForm.name}}</el-form-item>
				<el-form-item label="代收金额:">{{editForm.name}}</el-form-item>
				<el-form-item label="待收利息:">{{editForm.name}}</el-form-item>
				<el-form-item label="邀请人:">{{editForm.name}}</el-form-item>
				<el-form-item label="客户来源:">{{editForm.name}}</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer" style="text-align: left;margin-left: 40%;">
				<!-- <el-button @click.native="editFormVisible = false">取消</el-button> -->
				<el-button type="primary" @click.native="editSubmit" :loading="editLoading">保存</el-button>
			</div>
		</el-dialog>

		<!--新增界面-->
		<el-dialog title="新增商品分类" v-model="addFormVisible" :close-on-click-modal="false">
			<el-form label-width="80px">
				<el-form-item label="分类名称">
					<el-input v-model="addForm.name"></el-input>
				</el-form-item>
				<el-form-item label="分类图标">
					<input type="file" style="position:absolute;opacity:0;width:70px;height:30px;margin-right:10px"  @change="upload" id="fileInput">
					<button type="button" class="el-button el-button--primary el-button--small">
						<span>点击上传</span>
					</button>
					<button type="button" class="el-button el-button--primary el-button--small" id="btnClear" @click="clear">清空上传</button>
					<span style="display: block;font-size: 12px">{{ imageChange }}</span>
					<!--<button type="button" class="el-button el-button&#45;&#45;primary el-button&#45;&#45;small" id="btnClear" @click="clear">清空上传</button>-->
					<!--<span style="display: block;font-size: 12px">{{ imageChange }}</span>-->
				</el-form-item>
				<el-form-item label="上级分类">
					<el-input v-model="addForm.pid"></el-input>
				</el-form-item>
				<el-form-item label="参数名称">
					<el-input style="margin-bottom: 10px" v-for="item in paramData" v-model="item.name"></el-input>
					<el-button type='text' size="small" @click="newparamData">增加</el-button>
				</el-form-item>
				<el-form-item label="规格名称">
					<el-col :span="24" v-for="item in itemData" style="margin-bottom: 10px;">
						<el-input style="width: 80px" v-model="item.name"></el-input><el-input style="width: 150px" v-model="item.value"></el-input>
					</el-col>
					<el-button type='text' size="small" @click="newitemData">增加</el-button>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click.native="addFormVisible = false">取消</el-button>
				<el-button type="primary" @click.native="addSubmit" :loading="addLoading">提交</el-button>
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
				paramData:[
					{name:'',required:'0',value:''}],
				itemData:[
					{name:'',values:''}],
				tableAll:[],
				value22:'',
				options: [{
		          value: '选项1',
		          label: '建设银行'
		        }, {
		          value: '选项2',
		          label: '工商银行'
		        }],
		        value: '',
				filters: {
					name: ''
				},
				users: [],
				total: 0,
				page: 1,
				listLoading: false,
				sels: [],//列表选中列

				editFormVisible: false,//编辑界面是否显示
				editFormVisible1: false,//编辑界面是否显示
				editFormVisible2: false,//编辑界面是否显示
				editFormVisible3: false,//编辑界面是否显示
				editLoading: false,
				editFormRules: {
					name: [
						{ required: true, message: '请输入姓名', trigger: 'blur' }
					]
				},
				//编辑界面数据
				editForm: {
					id: 0,
					name: '',
					sex: -1,
					age: 0,
					birth: '',
					addr: '',
					sex:''
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
				},
				table:[{
					sex:'',
					id:"001",
					number:"18709829122",
					name:"胡红",
					user_name:"4分",
					loan:" 100000",
					loan_number:"450000元",
					min_company:"-",
					interest_rate:"10%",
					data_qx:"1个月",
					time:"2017-04-01 12:12:00",
					toubiao:"0元",
					fs_time:"",
					yhkje:"0元",
					syhkje:"545111元",
					state:"等待初审"
				}],
				url:'',
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
                if (files !== null && files.value) {
                    files.value = "";
                    this.formData = new FormData()
                }
            },
		    //图片上传
            upload (event) {
                this.formData = new FormData()
                let file = event.target.files[0]
                const self = this
                if (file) {
                    console.log('存在file', file)
                    this.fileImg = file.name
                    // console.log(this.formData)
                    this.formData.append('file', file);
                    this.submitUpload()
                    console.log(this.formData);
                } else {
                    this.fileImg = ''
                    console.log('不存在file', file)
                    this.formData = new FormData()
                }
            },
            //添加
            submitUpload(){
                // this.$confirm('确认修改吗？', '提示', {}).then(() => {
                    const _this= this;
                    _this.$http.post(baseUrl+'/api/attachment/upload', _this.formData, {
                        progress(event) {
                        }
                    })
                        .then(response => {
                            const info = JSON.parse(response.bodyText);
                            // const info = response.body
							_this.url = info.data[0].baseUri+info.data[0].uri;
                        }, error => _this.$emit('complete', 500, error.message))
                // });
            },
            newparamData(){
            	const obj = {
            		name:'',
            		required:'',
            		value:''
            	}
            	this.paramData.push(obj)
            },
            newitemData(){
            	const obj = {
            		name:'',
            		value:''
            	}
            	this.itemData.push(obj)
            },
			addGoods(){
				this.addFormVisible = true
			},
            addSubmit(){
            	const _this = this
				_this.table = []
				const params = {
					name:this.addForm.name,
					icon:this.url,
					status:'1',
					pid:'',
					hierarchy:'1',
					paramData:this.paramData,
					itemData:this.itemData
				}
				params.paramData = JSON.stringify(params.paramData)
				params.itemData = JSON.stringify(params.itemData)
				console.log(params)
				$.ajax({
                    type:'POST',
                    dataType:'json',
                    url:baseUrl+"/api/goodsClass/add",
                    data:JSON.stringify(params),
                    contentType:'application/json;charset=utf-8',
                    success:function(data){
                    	console.log(data)
                    }
                });
            },
            // 格式化状态
			formatterType: function (row, column) {
				return row.status == 1 ? '启用' : row.status == 0 ? '禁用' : '删除';
			},
			// 格式化上级
			formatterPid(row, column){
				let name = ''
				for(var i = 0;i<this.tableAll.length;i++){
					if(row.pid === this.tableAll[i].id){
						return name = this.tableAll[i].name
					}else {
						name = "无"
					}
				}
				return name
			},
			getlist(){
				const _this = this
				_this.table = []
				const params = {
					pageNum:this.page,
					size:10,
					name:''
				}
				console.log(params)
				$.ajax({
                    type:'POST',
                    dataType:'json',
                    url:baseUrl+"/api/goodsClass/selectListPC",
                    data:JSON.stringify(params),
                    contentType:'application/json;charset=utf-8',
                    success:function(data){
                    	const info = data.data
                    	console.log(info)
                    	_this.table = info.list
                    	_this.total = info.total
                    	_this.tableAll
                    	for(var i = 0;i<info.list.length;i++){
                    		_this.tableAll.push(info.list[i])
                    	}
                    }
                });
			},
			handleCurrentChange(val) {
				this.page = val;
				this.getlist();
			},
			// 删除
			dleDelBtn(row){
				const _this = this
				const params = {
					id:row.id
				}
				$.ajax({
                    type:'POST',
                    dataType:'json',
                    url:baseUrl+"/api/goodsClass/deleteById",
                    data:JSON.stringify(params),
                    contentType:'application/json;charset=utf-8',
                    success:function(data){
                    	console.log(data)
                    	_this.getlist()
                    }
                });
			},
			seeBtn(row){
				console.log(row)
			},
			editBtn(row){
				console.log(row)
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
			handleEdit: function (index, row) {
				this.editFormVisible = true;
				this.editForm = Object.assign({}, row);
			},
			handleEdit1: function (index, row) {
				this.editFormVisible1 = true;
				this.editForm = Object.assign({}, row);
			},
			handleEdit2: function (index, row) {
				this.editFormVisible2 = true;
				this.editForm = Object.assign({}, row);
			},
			handleEdit3: function (index, row) {
				this.editFormVisible3 = true;
				this.editForm = Object.assign({}, row);
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

<style scoped>

</style>