<template>
	<section>
		<!--工具条-->
		<el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
			<el-form :inline="true">
				<el-form-item>
					<el-button type="primary" v-on:click="addShow">添加</el-button>
				</el-form-item>
			</el-form>
		</el-col>

		<!--列表-->
		<el-table :data="table" border highlight-current-row v-loading="listLoading" style="width: 100%;min_width:1080px;">
			<el-table-column type="index" label="序号">
			</el-table-column>
			<el-table-column prop="name" label="标签名称">
			</el-table-column>
			<el-table-column prop="synopsis" label="标签简介">
			</el-table-column>
			<el-table-column prop="icon" label="标签图标">
				<template scope="scope">
					<img class="img" :src="scope.row.icon" alt="">
				</template>
			</el-table-column>
			<el-table-column prop="createTime" :formatter='formatterTime' label="创建时间">
			</el-table-column>
			<el-table-column label="操作">
				<template scope="scope">
					<!-- <el-button size="small" type='text' @click="seeBtn(scope.row)">查看</el-button> -->
					<el-button size="small" type='text' @click="editBtn(scope.row)">修改</el-button>
					<el-button type="text" size="small" @click="deldetBtn(scope.row)">删除</el-button>
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
		<el-dialog title="修改商品标签" v-model="editFormVisible" :close-on-click-modal="false">
			<el-form :model="editForm" label-width="80px">
				<el-form-item label="标签名称">
					<el-input v-model="editForm.name" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="标签图标">
					<input type="file" style="position:absolute;opacity:0;width:70px;height:30px;margin-right:10px"  @change="uploadEdit" id="fileInput">
					<button type="button" class="el-button el-button--primary el-button--small">
						<span>点击上传</span>
					</button>
					<!-- <button type="button" class="el-button el-button--primary el-button--small" id="btnClear" @click="clear">清空上传</button> -->
					<!-- <span style="display: block;font-size: 12px">{{ imageChange }}</span> -->
					<!--<button type="button" class="el-button el-button&#45;&#45;primary el-button&#45;&#45;small" id="btnClear" @click="clear">清空上传</button>-->
					<!--<span style="display: block;font-size: 12px">{{ imageChange }}</span>-->
					<!-- <el-input v-model="addForm.name" auto-complete="off"></el-input> -->
				</el-form-item>
				<el-col :span="24">
					<img style="margin-left: 80px;margin-bottom: 20px;" class="img" :src="editForm.icon" alt="">
				</el-col>
				<el-form-item label="标签详情">
					<el-input v-model="editForm.synopsis" auto-complete="off"></el-input>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer" style="text-align: center;">
				<el-button type="primary" @click.native="editFormVisible = false">取消</el-button>
				<el-button type="primary" @click.native="editSubmit" :loading="editLoading">保存</el-button>
			</div>
		</el-dialog>

		<!--新增界面-->
		<el-dialog title="新增" v-model="addFormVisible" :close-on-click-modal="false">
			<el-form :model="addForm" label-width="80px">
				<el-form-item label="标签名称">
					<el-input v-model="addForm.name" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="标签图标">
					<input type="file" style="position:absolute;opacity:0;width:70px;height:30px;margin-right:10px"  @change="upload" id="fileInput">
					<button type="button" class="el-button el-button--primary el-button--small">
						<span>点击上传</span>
					</button>
					<button type="button" class="el-button el-button--primary el-button--small" id="btnClear" @click="clear">清空上传</button>
					<span style="display: block;font-size: 12px">{{ imageChange }}</span>
					<!--<button type="button" class="el-button el-button&#45;&#45;primary el-button&#45;&#45;small" id="btnClear" @click="clear">清空上传</button>-->
					<!--<span style="display: block;font-size: 12px">{{ imageChange }}</span>-->
					<!-- <el-input v-model="addForm.name" auto-complete="off"></el-input> -->
				</el-form-item>
				<el-form-item label="标签详情">
					<el-input v-model="addForm.synopsis" auto-complete="off"></el-input>
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
	import {baseUrl , editUser, addUser } from '../../api/api'

	export default {
		data() {
			return {
				total: 0,
				page: 1,
				listLoading: false,
				editFormVisible: false,//编辑界面是否显示
				editLoading: false,
				//编辑界面数据
				editForm: {},
				addFormVisible: false,//新增界面是否显示
				addLoading: false,
				//新增界面数据
				addForm: {},
				table:[],
				url:'',
				editurl:'',
                formData: new FormData(),
                formDataEdit: new FormData(),
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
			uploadEdit (event) {
                this.formDataEdit = new FormData()
                let file = event.target.files[0]
                const self = this
                if (file) {
                    console.log('存在file', file)
                    this.fileImg = file.name
                    // console.log(this.formData)
                    this.formDataEdit.append('file', file);
                    this.editUpload()
                    console.log(this.formDataEdit);
                } else {
                    this.fileImg = ''
                    console.log('不存在file', file)
                    this.formDataEdit = new FormData()
                }
            },
            editUpload(){
                // this.$confirm('确认修改吗？', '提示', {}).then(() => {
                    const _this= this;
                    _this.$http.post(baseUrl+'/api/attachment/upload', _this.formDataEdit, {
                        progress(event) {
                        }
                    })
                        .then(response => {
                            const info = JSON.parse(response.bodyText);
                            // const info = response.body
							_this.editurl = info.data[0].baseUri+info.data[0].uri;
							_this.editForm.icon = _this.editurl
                        }, error => _this.$emit('complete', 500, error.message))
                // });
            },
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
            addSubmit: function () {
				const _this = this
				_this.table = []
				const params = {
					name:this.addForm.name,
					icon:this.url,
					synopsis:this.addForm.synopsis
				}
				console.log(params)
				$.ajax({
                    type:'POST',
                    dataType:'json',
                    url:baseUrl+"/api/goodsTag/add",
                    data:JSON.stringify(params),
                    contentType:'application/json;charset=utf-8',
                    success:function(data){
                    	const info = data.data
                    	console.log(data)
                    	_this.addFormVisible = false
                    	_this.getlist()
                    }
                });
			},
			// 删除
			deldetBtn(row){
				console.log(row)
				const _this = this
				_this.table = []
				const params = {
					id:row.id
				}
				console.log(params)
				$.ajax({
                    type:'POST',
                    dataType:'json',
                    url:baseUrl+"/api/goodsTag/delete",
                    data:JSON.stringify(params),
                    contentType:'application/json;charset=utf-8',
                    success:function(data){
                    	console.log(data)
                    	_this.getlist()
                    }
                });
			},
			// 修改
			editBtn(row){
				this.editFormVisible = true
				this.editForm = row
			},
			// 保存修改
			editSubmit(){
				const _this = this
				const params = {
					id:this.editForm.id,
					name:this.editForm.name,
					icon:this.editForm.icon,
					synopsis:this.editForm.synopsis,
					status:0
				}
				console.log(params)
				$.ajax({
                    type:'POST',
                    dataType:'json',
                    url:baseUrl+"/api/goodsTag/update",
                    data:JSON.stringify(params),
                    contentType:'application/json;charset=utf-8',
                    success:function(data){
                    	console.log(data)
                    	_this.editFormVisible = false
                    	_this.getlist()
                    }
                });
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
                    url:baseUrl+"/api/goodsTag/selectList",
                    data:JSON.stringify(params),
                    contentType:'application/json;charset=utf-8',
                    success:function(data){
                    	const info = data.data
                    	console.log(data)
                    	_this.table = info.list
                    	_this.total = info.total
                    }
                });
			},
			handleCurrentChange(val) {
				this.page = val;
				this.getlist();
			},
			addShow(){
				this.addFormVisible = true
			},
			formatterTime(row,column){
                let curTime = row.createTime;
                curTime = new Date(curTime).toLocaleString()
                return curTime
            }
		},
		mounted() {
			this.getlist();
		}
	}

</script>

<style scoped>

</style>