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
			<el-table-column prop="sort" :formatter='formatterSotr' label="商品类型">
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


		<!--新增界面-->
		<el-dialog title="新增商品分类" v-model="addFormVisible" :close-on-click-modal="false">
			<el-form label-width="80px">
				<el-form-item label="分类名称">
					<el-input v-model="addForm.name"></el-input>
				</el-form-item>
				<el-form-item label="商品类型">
					<el-select v-model="addForm.type" placeholder="请选择">
						<el-option  v-for="item in options" :key="item.value" :label="item.label" :value="item.value"></el-option>
					</el-select>
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
						<el-input style="width: 80px" v-model="item.name"></el-input><el-input style="width: 150px" v-model="item.values"></el-input>
					</el-col>
					<el-button type='text' size="small" @click="newitemData">增加</el-button>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click.native="addFormVisible = false">取消</el-button>
				<el-button type="primary" @click.native="addSubmit" :loading="addLoading">提交</el-button>
			</div>
		</el-dialog>
		<!--修改界面-->
		<el-dialog title="修改商品分类" v-model="editFormVisible" :close-on-click-modal="false">
			<el-form label-width="80px">
				<el-form-item label="分类名称">
					<el-input v-model="editForm.name"></el-input>
				</el-form-item>
				<el-form-item label="商品类型">
					<el-select v-model="editForm.type" placeholder="请选择">
						<el-option  v-for="item in options" :key="item.value" :label="item.label" :value="item.value"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="分类图标">
					<input type="file" style="position:absolute;opacity:0;width:70px;height:30px;margin-right:10px"  @change="upload1" id="fileInput">
					<button type="button" class="el-button el-button--primary el-button--small">
						<span>点击上传</span>
					</button>
					<!-- <button type="button" class="el-button el-button--primary el-button--small" id="btnClear" @click="clear1">清空上传</button> -->
					<!-- <span style="display: block;font-size: 12px">{{ imageChange }}</span> -->
					<!--<button type="button" class="el-button el-button&#45;&#45;primary el-button&#45;&#45;small" id="btnClear" @click="clear">清空上传</button>-->
					<!--<span style="display: block;font-size: 12px">{{ imageChange }}</span>-->
					<el-col :span='24'>
						<img style="width: 66px" :src="editForm.icon">
					</el-col>
				</el-form-item>
				<!-- <el-form-item label="上级分类">
					<el-input v-model="editForm.pid"></el-input>
				</el-form-item> -->
				<el-form-item label="参数名称">
					<el-input style="margin-bottom: 10px" v-for="item in paramDataEdit" v-model="item.name"></el-input>
					<el-button type='text' size="small" @click="newEditP">增加</el-button>
				</el-form-item>
				<el-form-item label="规格名称">
					<el-col :span="24" v-for="item in itemDataEdit" style="margin-bottom: 10px;">
						<el-input style="width: 80px" v-model="item.name"></el-input><el-input style="width: 150px" v-model="item.values"></el-input>
					</el-col>
					<el-button type='text' size="small" @click="newEditI">增加</el-button>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click.native="editFormVisible = false">取消</el-button>
				<el-button type="primary" @click.native="editSubmit" :loading="addLoading">提交</el-button>
			</div>
		</el-dialog>
		<!--查看界面-->
		<el-dialog title="查看商品分类" v-model="seeFormVisible" :close-on-click-modal="false">
			<el-form label-width="80px">
				<el-form-item label="分类名称">
					<el-input v-model="seeForm.name"></el-input>
				</el-form-item>
				<el-form-item label="商品类型">
					<el-select v-model="seeForm.type" placeholder="请选择">
						<el-option  v-for="item in options" :key="item.value" :label="item.label" :value="item.value"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="分类图标">
					<!-- <input type="file" style="position:absolute;opacity:0;width:70px;height:30px;margin-right:10px"  @change="upload1" id="fileInput">
					<button type="button" class="el-button el-button--primary el-button--small">
						<span>点击上传</span>
					</button> -->
					<el-col :span='24'>
						<img style="width: 66px" :src="seeForm.icon">
					</el-col>
				</el-form-item>
				<el-form-item label="参数名称">
					<el-col v-for="item in paramDataSee" :span="6">{{item.name}}</el-col>
					<!-- <el-input style="margin-bottom: 10px" v-for="item in paramDataSee" v-model="item.name"></el-input> -->
					<!-- <el-button type='text' size="small" @click="newEditP">增加</el-button> -->
				</el-form-item>
				<el-form-item label="规格名称">
					<el-col :span="24" v-for="item in itemDataSee" style="margin-bottom: 10px;">
						<el-col :span="5">{{item.name}}</el-col><el-col :span="15">{{item.values}}</el-col>
						<!-- <el-input style="width: 80px" v-model="item.name"></el-input><el-input style="width: 150px" v-model="item.values"></el-input> -->
					</el-col>
					<!-- <el-button type='text' size="small" @click="newEditI">增加</el-button> -->
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click.native="seeFormVisible = false">取消</el-button>
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
				paramDataEdit:[],
				itemDataEdit:[],
				paramDataSee: [],
				itemDataSee: [],
				tableAll:[],
				options: [{
		          value: 0,
		          label: '普通商品'
		        }, {
		          value: 1,
		          label: '话费充值'
		        }, {
		          value: 1,
		          label: '流量充值'
		        }, {
		          value: 1,
		          label: '加油卡'
		        }, {
		          value: 1,
		          label: '视频充值'
		        }],
		        value: '',
				filters: {
					name: ''
				},
				users: [],
				total: 0,
				page: 1,
				listLoading: false,
				seeFormVisible: false,
				editFormVisible: false,//编辑界面是否显示
				editLoading: false,
				editFormRules: {
					name: [
						{ required: true, message: '请输入姓名', trigger: 'blur' }
					]
				},
				//编辑界面数据
				editForm: {},
				seeForm: {},
				addFormVisible: false,//新增界面是否显示
				addLoading: false,
				addFormRules: {
					name: [
						{ required: true, message: '请输入姓名', trigger: 'blur' }
					]
				},
				//新增界面数据
				addForm: {
					type:''
				},
				table:[],
				url:'',
                formData: new FormData(),
                formData1: new FormData(),
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
            upload1 (event) {
                this.formData1 = new FormData()
                let file = event.target.files[0]
                const self = this
                if (file) {
                    console.log('存在file', file)
                    this.fileImg = file.name
                    // console.log(this.formData)
                    this.formData1.append('file', file);
                    this.submitUpload1()
                    console.log(this.formData1);
                } else {
                    this.fileImg = ''
                    console.log('不存在file', file)
                    this.formData1 = new FormData()
                }
            },
            //添加
            submitUpload1(){
                // this.$confirm('确认修改吗？', '提示', {}).then(() => {
                    const _this= this;
                    _this.$http.post(baseUrl+'/api/attachment/upload', _this.formData1, {
                        progress(event) {
                        }
                    })
                        .then(response => {
                            const info = JSON.parse(response.bodyText);
                            // const info = response.body
							_this.editForm.icon = info.data[0].baseUri+info.data[0].uri;
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
            		values:''
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
					type:this.addForm.type,
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
                    	if(data.code === 1){
                    		_this.addFormVisible = false
                    		_this.getlist()
                    	}
                    }
                });
            },
            // 格式化状态
			formatterType: function (row, column) {
				return row.status == 1 ? '启用' : row.status == 0 ? '禁用' : '删除';
			},
			formatterSotr: function (row, column) {
				return row.sort == 1 ? '虚拟' :  '实物' ;
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
                    	if(data.code === 1){
                    		_this.getlist()
                    	}else {
                    		alert(data.msg)
                    	}
                    	
                    }
                });
			},
			seeBtn(row){
				this.seeFormVisible = true
				this.seeForm = row
				this.itemDataSee =  eval('(' + row.itemData + ')')
				this.paramDataSee = eval('(' + row.paramData + ')')
				console.log(row)
			},
			editBtn(row){
				console.log(row)
				this.editFormVisible = true
				this.editForm = row
				this.paramDataEdit = eval('(' + row.paramData + ')')
				this.itemDataEdit = eval('(' + row.itemData + ')')
				console.log(this.paramDataEdit)
				console.log(this.itemDataEdit)
			},
			newEditP(){
				const obj = {
            		name:'',
            		required:'',
            		value:''
            	}
            	this.paramDataEdit.push(obj)
			},
			newEditI(){
				const obj = {
            		name:'',
            		value:''
            	}
            	this.itemDataEdit.push(obj)
			},
			editSubmit(){
            	const _this = this
				_this.table = []
				const params = {
					name:this.editForm.name,
					icon:this.editForm.icon,
					id:this.editForm.id,
					paramData:this.paramDataEdit,
					itemData:this.itemDataEdit
				}
				params.paramData = JSON.stringify(params.paramData)
				params.itemData = JSON.stringify(params.itemData)
				console.log(params)
				$.ajax({
                    type:'POST',
                    dataType:'json',
                    url:baseUrl+"/api/goodsClass/update",
                    data:JSON.stringify(params),
                    contentType:'application/json;charset=utf-8',
                    success:function(data){
                    	console.log(data)
                    	if(data.code === 1){
                    		_this.editFormVisible = false
                    		_this.getlist()
                    	}
                    }
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