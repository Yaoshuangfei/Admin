<template>
	<section>
		<!--工具条-->
		<el-col :span="24" class="toolbar" style="padding-bottom: 0px;background: #fff">
			<el-form :inline="true" :model="filters">
				<el-form-item>
					<el-button type="primary" v-on:click="addbanner">添加</el-button>
				</el-form-item>
			</el-form>
		</el-col>
		<!--列表-->
		<el-table :data="orderInformation" border highlight-current-row v-loading="listLoading" style="width: 100%;min-width: 1080px;">
			<el-table-column type="index" label="序号">
			</el-table-column>
			<el-table-column prop="sharedName"  label="名称">
			</el-table-column>
			<el-table-column prop="picture" label="图片">
				<template scope="scope">
					<img class="img" :src="scope.row.sharedUrl" alt="">
				</template>
			</el-table-column>
			<el-table-column prop="sharedCarde" :formatter='typePO'  label="位置">
			</el-table-column>
			<el-table-column prop="sharedStatus" :formatter='statusForm' label="状态">
			</el-table-column>
			<el-table-column prop="remarks" label="备注">
			</el-table-column>
			<el-table-column label="操作">
				<template scope="scope">
					<el-button type="text" size="small" v-if="scope.row.sharedStatus === 2" @click="upBtn(scope.row)">启用</el-button>
					<el-button type="text" size="small" v-if="scope.row.sharedStatus === 1" @click="nupBtn(scope.row)">禁用</el-button>
					<el-button type="text" size="small" @click="editBtn(scope.row)">修改</el-button>
					<el-button type="text" size="small" @click="deldetBtn(scope.row)">删除</el-button>
				</template>
			</el-table-column>
		</el-table>

		<!--工具条-->
		<el-col :span="24" class="toolbar" style="background:#fff;">
			<el-pagination layout="prev, pager, next" @current-change="handleCurrentChange" :page-size="10" :total="total" style="float:right;">
			</el-pagination>
		</el-col>
		<!--新增banner-->
		<el-dialog title="添加banner" v-model="addbannerdiv" :close-on-click-modal="false" >
			<el-form :model="banner" label-width="80px" :rules="editFormRules" ref="editForm">
				<el-form-item label="名称">
					<el-input v-model="banner.link" type="text" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="分享图">
					<input type="file" style="position:absolute;opacity:0;width:70px;height:30px;margin-right:10px"  @change="upload" id="fileInput">
					<button type="button" class="el-button el-button--primary el-button--small">
						<span>点击上传</span>
					</button>
					<button type="button" class="el-button el-button--primary el-button--small" id="btnClear" @click="clear">清空上传</button>
					<span style="display: block;font-size: 12px">{{ imageChange }}</span>
				</el-form-item>
				<!-- <el-form-item label="序号">
					<el-input v-model="banner.orderSort" type="text" auto-complete="off"></el-input>
				</el-form-item> -->
				<el-form-item label="使用者身份">
					<el-select v-model="banner.poType" placeholder="请选择">
				    <el-option
				      v-for="item in options"
				      :key="item.value"
				      :label="item.label"
				      :value="item.value">
				    </el-option>
				  </el-select>
				</el-form-item>
				<el-form-item label="备注">
					<el-input v-model="banner.desc" type="text" auto-complete="off"></el-input>
				</el-form-item>
				<el-col :span='24'></el-col>
			</el-form>
			<div slot="footer" class="dialog-footer" style="text-align: center;">
				<el-button type="primary" @click="uploadBanner" :loading="editLoading">添加</el-button>
				<el-button type="primary" @click="addbannerdiv = false">取消</el-button>
			</div>
		</el-dialog>
		<!--编辑界面-->
		<el-dialog title="修改banner" v-model="editFormVisible" :close-on-click-modal="false" >
			<el-form :model="orderDetails" label-width="80px" :rules="editFormRules" ref="editForm">
				<el-form-item label="名称">
					<el-input v-model="orderDetails.sharedName" type="text" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="分享图">
					<input type="file" style="position:absolute;opacity:0;width:70px;height:30px;margin-right:10px"  @change="uploadnoe" id="fileInput">
					<button type="button" class="el-button el-button--primary el-button--small">
						<span>上传新图片</span>
					</button>
				</el-form-item>
				<el-col :span="24">
					<img style="margin-left: 80px;margin-bottom: 20px;" class="img" :src="orderDetails.sharedUrl" alt="">
				</el-col>
				<el-form-item label="图片位置">
					<el-select v-model="orderDetails.sharedCarde" placeholder="请选择">
				    <el-option
				      v-for="item in options"
				      :key="item.value"
				      :label="item.label"
				      :value="item.value">
				    </el-option>
				  </el-select>
				</el-form-item>
				<el-form-item label="备注">
					<el-input v-model="orderDetails.remarks" type="text" auto-complete="off"></el-input>
				</el-form-item>
				<el-col :span='24'></el-col>
			</el-form>
			<div slot="footer" class="dialog-footer" style="text-align: center;">
				<el-button type="primary" @click.native="upBanner" :loading="editLoading">保存</el-button>
				<el-button type="primary" @click.native="editFormVisible = false">关闭</el-button>
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
				banner:{
					link:'',
					orderSort:'',
					poType:'',
					desc:''
				},
				url:'',
				editurl:'',
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
				options: [{
		          value: 1,
		          label: '普通'
		        }, {
		          value: 2,
		          label: '创客'
		        }, {
		          value: 3,
		          label: '创客商'
		        }],
				filters: {
					name: '',
					status:'',
					type:''
				},
				users: [],
				total: 1,
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
				},
				orderInformation:[],
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
			formatterTime(row,column){
                let curTime = row.createTime;
                if(curTime !== null){
                	return new Date(curTime).toLocaleString()
                }
            },
            formatterType(row,column){
            	return row.status == 0 ? '禁用' : '启用 ' ;
            },
            typePO(row,column){
            	if(row.sharedCarde === 3){
            		return '创客商'
            	}else if(row.sharedCarde === 2){
            		return '创客'
            	}else{
            		return '普通'
            	}
            },
            statusForm(row,column){
            	if(row.sharedStatus === 1){
            		return '启用'
            	}else if(row.sharedStatus === 2){
            		return '禁用'
            	}
            },
			//清空上传
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
                } else {
                    this.fileImg = ''
                    console.log('不存在file', file)
                    this.formData = new FormData()
                }
            },
			uploadBanner(){
				this.$confirm('确认添加吗？', '提示', {}).then(() => {
                    const _this= this;
                    _this.$http.post(baseUrl+'/api/attachment/upload', _this.formData, {
                        progress(event) {
                        }
                    })
                        .then(response => {
                        	console.log(response)
                            const info = JSON.parse(response.bodyText);
							_this.url = info.data[0].baseUri+info.data[0].uri;
							_this.getUrl()
                        }, error => _this.$emit('complete', 500, error.message))
                });
			},
			uploadnoe (event) {
                this.formData1 = new FormData()
                let file = event.target.files[0]
                // console.log(file)
                const self = this
                // const flag = this.flag
                if (file) {
                    console.log('存在file', file)
                    this.formData1.append('file', file);
                    this.uploadBannerone()
                } else {
                    this.fileImg = ''
                    console.log('不存在file', file)
                    this.formData1 = new FormData()
                }
            },
			uploadBannerone(){
				 this.$confirm('确认修改吗？', '提示', {}).then(() => {
                    const _this= this;
                    _this.$http.post(baseUrl+'/api/attachment/upload', _this.formData1, {
                        progress(event) {
                        }
                    })
                        .then(response => {
                        	console.log(response)
                            const info = JSON.parse(response.bodyText);
							_this.editurl = info.data[0].baseUri+info.data[0].uri;
							// _this.getUrl()
							_this.orderDetails.sharedUrl = _this.editurl
                        }, error => _this.$emit('complete', 500, error.message))
                 });
			},
			getUrl(){
				const _this = this
				const params = {
					sharedName:this.banner.link,
					sharedUrl:this.url,
					sharedCarde:this.banner.poType,
					remarks:this.banner.desc
				}
				console.log(params)
				$.ajax({
                    type:'POST',
                    dataType:'json',
                    url:baseUrl+"/api/shared/add",
                    data:JSON.stringify(params),
                    contentType:'application/json;charset=utf-8',
                    success:function(data){
                    	console.log(data)
                    	if(data.code === 1){
                    		_this.addbannerdiv = false
                    		_this.getlist()
                    	}
                    }
                });
            },
			getlist(){
				const _this = this
				const params = {
					pageNum:this.page,
					size:10,
					sharedName:'',
					sharedCarde:''
				}
				console.log(params)
				$.ajax({
                    type:'POST',
                    dataType:'json',
                    url:baseUrl+"/api/shared/selectListSys",
                    data:JSON.stringify(params),
                    contentType:'application/json;charset=utf-8',
                    success:function(data){
                    	console.log(data)
                    	const info = data.data
                    	_this.total = info.total
                    	_this.orderInformation = info.list
                    }
                });
			},
			handleCurrentChange(val) {
				this.page = val;
				this.getUsers();
			},
			upBtn(row){
				console.log(row)
				const _this = this
				const params = {
					sharedId:row.sharedId,
					sharedStatus:1
				}
				console.log(params)
				$.ajax({
                    type:'POST',
                    dataType:'json',
                    url:baseUrl+"/api/shared/updateStatus",
                    data:JSON.stringify(params),
                    contentType:'application/json;charset=utf-8',
                    success:function(data){
                    	console.log(data)
                    	_this.getlist()
                    }
                });
			},
			nupBtn(row){
				console.log(row)
				const _this = this
				const params = {
					sharedId:row.sharedId,
					sharedStatus:2
				}
				console.log(params)
				$.ajax({
                    type:'POST',
                    dataType:'json',
                    url:baseUrl+"/api/shared/updateStatus",
                    data:JSON.stringify(params),
                    contentType:'application/json;charset=utf-8',
                    success:function(data){
                    	console.log(data)
                    	_this.getlist()
                    }
                });
			},
			editBtn(row){
				this.editFormVisible = true;
				console.log(row)
				this.orderDetails = row
			},
			upBanner(){
				const _this = this
				const params = {
					sharedId:_this.orderDetails.sharedId,
					sharedName:_this.orderDetails.sharedName,
					sharedUrl:_this.orderDetails.sharedUrl,
					sharedCarde:_this.orderDetails.sharedCarde,
					remarks:_this.orderDetails.remarks
				}
				console.log(params)
				$.ajax({
                    type:'POST',
                    dataType:'json',
                    url:baseUrl+"/api/shared/update",
                    data:JSON.stringify(params),
                    contentType:'application/json;charset=utf-8',
                    success:function(data){
                    	console.log(data)
                    	_this.editFormVisible = false
                    	_this.getlist()
                    }
                });
			},
			deldetBtn(row){
				const _this = this
				console.log(row)
				const params = [
					row.sharedId
				]
				console.log(params)
				$.ajax({
                    type:'POST',
                    dataType:'json',
                    url:baseUrl+"/api/shared/deleteByIds",
                    data:JSON.stringify(params),
                    contentType:'application/json;charset=utf-8',
                    success:function(data){
                    	console.log(data)
                    	_this.getlist()
                    }
                });
			},
			//显示添加banner页面
			addbanner: function (index, row) {
				this.addbannerdiv = true;
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
	.el-form-item__label{
		text-align: left;
	}
	.el-dialog__body{
		margin-left: 40px ! important ;
	}
</style>