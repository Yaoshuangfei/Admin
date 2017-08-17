<template>
	<section>
		<!--工具条-->
		<el-col :span="24" class="toolbar" style="padding-bottom: 0px;background: #fff">
			<el-form :inline="true" :model="filters">
				<el-form-item>
					<el-button type="primary" v-on:click="addshow">发布</el-button>
				</el-form-item>
			</el-form>
		</el-col>
		<!--列表-->
		<el-table :data="table" border highlight-current-row v-loading="listLoading" style="width: 100%;min-width: 1080px;">
			<el-table-column prop="id" label="序号">
			</el-table-column>
			<el-table-column prop="rechargeTypeName" label="图片">
			</el-table-column>
			<el-table-column prop="rechargeTypeName" label="充值类型">
			</el-table-column>
			<el-table-column prop="status" :formatter='formatterstatus' label="充值名称">
			</el-table-column>
			<el-table-column prop="ordinaryDiscount" label="价格">
			</el-table-column>
			<el-table-column prop="customerDiscount" label="状态">
			</el-table-column>
			<el-table-column prop="createTime" :formatter='formatterTime' label="发布时间">
			</el-table-column>
			<el-table-column prop="updateTime" :formatter='formatterTime' label="更新时间">
			</el-table-column>
			<el-table-column label="操作">
				<template scope="scope">
					<el-button type="text" size="small" @click="editBtn(scope.$index, scope.row)">修改</el-button>
					<el-button type="text" size="small" @click="statusBtn(scope.$index, scope.row)" v-if="scope.row.status === 0">启用</el-button>
					<el-button type="text" size="small" @click="statusBtn(scope.$index, scope.row)" v-if="scope.row.status === 1">禁用</el-button>
					<el-button type="text" size="small" @click="deleteBtn(scope.$index, scope.row)">删除</el-button>
				</template>
			</el-table-column>
		</el-table>
		<!--工具条-->
		<!-- <el-col :span="24" class="toolbar" style="background:#fff;">
			<el-pagination layout="prev, pager, next" @current-change="handleCurrentChange" :page-size="10" :total="total" style="float:right;">
			</el-pagination>
		</el-col> -->
		<!-- 充值类型添加 -->
		<el-dialog title="添加充值类型" v-model="addFormVisible" :close-on-click-modal="false" >
			<el-form :model="rechargeList" label-width="80px">
				<el-form-item label="充值类别">
					<el-select v-model="rechargeList.rechargeTypeId" placeholder="请选择" @change="commodityRelease">
					 	<el-option v-for="item in option"  :label="item.label" :value="item.value" :type="item.type"></el-option>
					</el-select>
				</el-form-item>
				<div class="sort" id="shouji">
					<el-form-item label="充值类型">
						<el-input v-model="sjinput" placeholder="手机充值" :disabled="true" style="width: 80%;"></el-input>
					</el-form-item>

					<el-form-item label="价格">
						<el-input v-model="inputMoney" placeholder="请输入你要发布的价格"  style="width: 80%;"></el-input>
					</el-form-item>
				</div>
				<div class="sort" id="liuliang" style="display: none;">
					<el-form-item label="充值类型">
						<el-input v-model="sjinput" placeholder="流量充值" :disabled="true" style="width: 80%;"></el-input>
					</el-form-item>
					<el-form-item label="价格">
						<el-input v-model="inputMoney" placeholder="请输入你要发布的价格"  style="width: 80%;"></el-input>
					</el-form-item>
				</div>
				<div class="sort" id="youka" style="display: none;">
					<el-form-item label="油卡种类">
						<el-select v-model="rechargeList.rechargeTypeIdyk" placeholder="请选择" @change="commodityReleaseyk">
							<el-option v-for="item in optionyk"  :label="item.label" :value="item.value"></el-option>
						</el-select>
					</el-form-item>
					<el-form-item label="价格">
						<el-input v-model="inputMoney" placeholder="请输入你要发布的价格"  style="width: 80%;"></el-input>
						<span>元</span>
					</el-form-item>
				</div>
				<div class="sort" id="yingshi" style="display: none;">
					<el-form-item label="视频种类">
						<el-select v-model="rechargeList.rechargeTypeIdsp" placeholder="请选择" @change="commodityReleasesp">
							<el-option v-for="item in optionsp"  :label="item.label" :value="item.value"></el-option>
						</el-select>
					</el-form-item>
					<el-form-item label="充值时间">
						<el-button type="info" @click="times('一个月')">一个月</el-button>
						<el-button type="info" @click="times('三个月')">三个月</el-button>
						<el-button type="info" @click="times('半年')">半年</el-button>
						<el-button type="info" @click="times('一年')">一年</el-button>
					</el-form-item>
					<el-form-item label="价格">
						<el-input v-model="inputMoney" placeholder="请输入你要发布的价格"  style="width: 80%;"></el-input>
						<span>元</span>
					</el-form-item>
				</div>
				<el-form-item label="图片">
					<input type="file" style="position:absolute;opacity:0;width:70px;height:30px;margin-right:10px"  @change="upload" id="fileInput">
					<button type="button" class="el-button el-button--primary el-button--small">
						<span>点击上传</span>
					</button>
				</el-form-item>
				<el-col :span='24'></el-col>
			</el-form>
			<div slot="footer" class="dialog-footer" style="text-align: center;">
				<el-button type="primary" @click.native="addSubmit" :loading="editLoading">确认</el-button>
				<el-button type="primary" @click.native="addFormVisible = false">取消</el-button>
			</div>
		</el-dialog>
		<!--编辑界面-->
		<el-dialog title="修改" v-model="editFormVisible" :close-on-click-modal="false" >
			<el-form :model="initeditForm" label-width="100px">
				<el-form-item label="充值类型">
					<el-select v-model="initeditForm.rechargeTypeName" placeholder="请选择">
					 	<el-option v-for="item in option"  :label="item.label" :value="item.value"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="是否分佣">
					 <el-select v-model="initeditForm.isCommission" placeholder="请选择">
					 	<el-option v-for="item in options"  :label="item.label" :value="item.value"></el-option>
					 </el-select>
				</el-form-item>
				<el-form-item label="分佣比例">
					<el-input v-model="initeditForm.commissionRate" type="text" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="普通会员折扣">
					<el-input v-model="initeditForm.ordinaryDiscount" type="text" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="创客折扣">
					<el-input v-model="initeditForm.customerDiscount" type="text" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="创客商折扣">
					<el-input v-model="initeditForm.merchantDiscount" type="text" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="限额/日">
					<el-input v-model="initeditForm.quota" type="text" auto-complete="off"></el-input>
				</el-form-item>
				<el-col :span='24'></el-col>
			</el-form>
			<div slot="footer" class="dialog-footer" style="text-align: center;">
				<el-button type="primary" @click.native="editSubmit" :loading="editLoading">保存</el-button>
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
                inputMoney:'',
                inputtime:'',
			    numtype:'',
			    numtyId:'',
                inputyk:'',
                jginput:'',
				rechargeList:{
					rechargeTypeId:'',
                    rechargeTypeIdjg:'',
                    rechargeTypeIdll:'',
                    rechargeTypeIdyk:'',
                    rechargeTypeIdsp:'',
					isCommission:'',
					commissionRate:'',
					ordinaryDiscount:'',
					customerDiscount:'',
					merchantDiscount:'',
					quota:''
				},
                sjinput:'',
				//编辑界面数据
				editForm: {},
				initeditForm: {},
				startTime:'',
				endTime:'',
				addFormVisible: false,
				value:'',
				value1:'',
				value2:'',
				selectSubjectStatus: [
				{
					value:'0',
					label:'全部'
				},{
					value:'1',
					label:'微信支付'
				},{
					value:'2',
					label:'余额支付'
				},{
					value:'3',
					label:'支付宝支付'
				},{
					value:'4',
					label:'微信APP支付'
				},{
					value:'5',
					label:'退货'
				},{
					value:'6',
					label:'扫码付'
				}],
				option:[],
				optionjg:[],
				optionll:[],
				optionyk:[{
                    value:'0',
                    label:'中国石油'
                },{
                    value:'1',
                    label:'中国石化'
                }
                ],
                optionsp:[{
                    value:'0',
                    label:'腾讯会员'
                },{
                    value:'1',
                    label:'爱奇艺会员'
                }
                ],
				options: [{
		          value: '0',
		          label: '否'
		        }, {
		          value: '1',
		          label: '是'
		        }],
				filters: {
					name: '',
					status:'',
					type:''
				},
				users: [],
				total: 0,
				page: 1,
				listLoading: false,
				sels: [],//列表选中列

				editFormVisible: false,//编辑界面是否显示
				editLoading: false,
				addFormVisible: false,//新增界面是否显示
				addLoading: false,
				//新增界面数据
				orderDetails: {
				},
				table:[]
			}
		},
		methods: {
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
                    this.uploadBanner();
                } else {
                    this.fileImg = ''
                    console.log('不存在file', file)
                    this.formData = new FormData()
                }
            },
            uploadBanner(){
                    const _this= this;
                    _this.$http.post(baseUrl+'/api/attachment/upload', _this.formData, {
                        progress(event) {
                        }
                    })
                        .then(response => {
                            console.log(response)
                            const info = JSON.parse(response.bodyText);
                            _this.url = info.data[0].baseUri+info.data[0].uri;
                        }, error => _this.$emit('complete', 500, error.message))
            },
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
            commodityReleasejg(){
                this.numtype = 1;
                const _this = this;
                this.optionjg = [];
                $.ajax({
                    type:'POST',
                    dataType:'json',
                    url:baseUrl+"/api/rechargeConfig/recharge/goodsClassList",
                    data:{},
                    contentType:'application/json;charset=utf-8',
                    success:function(data){
                        if(!data.success) {
                            alert(data.msg);
                        }else{
                            var _self = data.data;
                            console.log(_self)
                            for(var i=0;i<_self.length;i++){
                                if(_self[i].type === 1){
                                    _this.numtyId = _self[i].id;
//                                    for (var j = 0; j < _self[i].goodsList.length; j++) {
//                                        const obj = {}
//                                        obj.value = _self[i].goodsList[j].goodsSpecs[0].goodsId;
//                                        obj.label = _self[i].goodsList[j].goodsSpecs[0].costPrice;
//                                        obj.id = _self[i].goodsList[j].goodsSpecs[0].id;
//                                        obj.name = _self[i].goodsList[j].goodsData;
//                                        _this.optionjg.push(obj)
//                                    }
								}
                            }
                        }
                    }
                });
            },
            commodityReleasell(){
                this.numtype = 2;
                const _this = this;
                this.optionll = [];
                $.ajax({
                    type:'POST',
                    dataType:'json',
                    url:baseUrl+"/api/rechargeConfig/recharge/goodsClassList",
                    data:{},
                    contentType:'application/json;charset=utf-8',
                    success:function(data){
                        if(!data.success) {
                            alert(data.msg);
                        }else{
                            console.log(data)
                            var _self = data.data;
                            for(var i=0;i<_self.length;i++){
                                if(_self[i].type === 2){
                                    _this.numtyId = _self[i].id;
//                                    for (var j = 0; j < _self[i].goodsList.length; j++) {
//                                        const obj = {}
//                                        obj.value = _self[i].goodsList[j].goodsSpecs[0].id;
//                                        obj.label = _self[i].goodsList[j].goodsSpecs[0].costPrice;
//                                        obj.id = _self[i].goodsList[j].goodsSpecs[0].goodsId;
//                                        _this.optionll.push(obj)
//                                    }
                                }
                            }
                        }
                    }
                });
            },
            commodityReleaseyk(){
                this.numtype = 3;
                const _this = this;
                this.optionyk = [];
                $.ajax({
                    type:'POST',
                    dataType:'json',
                    url:baseUrl+"/api/rechargeConfig/recharge/goodsClassList",
                    data:{},
                    contentType:'application/json;charset=utf-8',
                    success:function(data){
                        if(!data.success) {
                            alert(data.msg);
                        }else{
                            console.log(data)
                            var _self = data.data;
                            for(var i=0;i<_self.length;i++){
                                if(_self[i].type === 3){
                                    _this.numtyId = _self[i].id;
                                    for (var j = 0; j < _self[i].goodsClasses.length; j++) {
                                        const obj = {}
                                        obj.value = _self[i].goodsClasses[j].id;
                                        obj.label = _self[i].goodsClasses[j].name;
                                        _this.optionyk.push(obj)
                                    }
                                }
                            }
                        }
                    }
                });
            },
            commodityReleasesp(){
                this.numtype = 4;
                const _this = this;
                this.optionsp = [];
                $.ajax({
                    type:'POST',
                    dataType:'json',
                    url:baseUrl+"/api/rechargeConfig/recharge/goodsClassList",
                    data:{},
                    contentType:'application/json;charset=utf-8',
                    success:function(data){
                        if(!data.success) {
                            alert(data.msg);
                        }else{
                            console.log(data)
                            var _self = data.data;
                            for(var i=0;i<_self.length;i++){
                                if(_self[i].type === 4){
                                    _this.numtyId = _self[i].id;
                                    for (var j = 0; j < _self[i].goodsClasses.length; j++) {
                                        const obj = {}
                                        obj.value = _self[i].goodsClasses[j].id;
                                        obj.label = _self[i].goodsClasses[j].name;
                                        _this.optionsp.push(obj)
                                    }
                                }
                            }
                        }
                    }
                });
            },
            commodityRelease(){
                const _this = this;
                this.option = [];
                $.ajax({
                    type:'POST',
                    dataType:'json',
                    url:baseUrl+"/api/rechargeConfig/recharge/goodsClassList",
                    data:{},
                    contentType:'application/json;charset=utf-8',
                    success:function(data){
                        if(!data.success) {
                            alert(data.msg);
                        }else{
							var _self = data.data;
							for(var i=0;i<data.data.length;i++){
                                const obj = {}
                                obj.value = data.data[i].type;
                                obj.label = data.data[i].name;
                                obj.id    = data.data[i].id;
                                _this.option.push(obj);
							}
                            if(_this.rechargeList.rechargeTypeId == 1 ){
                                $('.sort').hide();
                                $('#shouji').show();
                                _this.commodityReleasejg();
                            }else if(_this.rechargeList.rechargeTypeId == 2){
                                $('.sort').hide();
                                $('#liuliang').show();
                                _this.commodityReleasell();
                            }else if(_this.rechargeList.rechargeTypeId == 3){
                                $('.sort').hide();
                                $('#youka').show();
                                _this.commodityReleaseyk();
                            }else if(_this.rechargeList.rechargeTypeId == 4){
                                $('.sort').hide();
                                $('#yingshi').show();
                                _this.commodityReleasesp();
                            }
                        }
                    }
                });



			},
			getlist(){
				const _this = this
				const params = {
				}
				$.ajax({
	                type:'POST',
	                dataType:'json',
	                url:baseUrl+"/api/rechargeConfig/selectList",
	                data:JSON.stringify(params),
	                contentType:'application/json;charset=utf-8',
	                success:function(data){
	                  	console.log(data)
	                 	_this.table = data.data
	                 	console.log(_this.table)
	                }
	            });
                this.commodityRelease();
			},
			addshow() {
				this.getBox()
				this.addFormVisible = true
			},
            times(val){
			    this.inputtime = val;
			},
			// 获取充值类型下拉列表
			getBox() {
				const _this = this
				const params = {}
			},
			//添加商品
			addSubmit() {
				const _this 	= this;
				const _number	= this.numtype;
//				let name		= '';
//				let carouselPicture		= _this.url;

				if(_number === 1){
				    console.log(this.numtyId);
					for(var i=0;i<this.optionjg.length;i++){
                        if(this.optionjg[i].value === this.rechargeList.rechargeTypeIdjg){
                            this.price = this.optionjg[i].label;
                            this.catId = this.optionjg[i].value;
						}
					}
                    const params = {
                        name:this.option[0].label,
                        carouselPicture:_this.url,
                        price:this.inputMoney,
                        catId:this.numtyId,
                    }
                    console.log(params)
                    $.ajax({
                        type: 'POST',
                        dataType: 'json',
                        url: baseUrl + "/api/rechargeType/recharge/post",
                        data: JSON.stringify(params),
                        contentType: 'application/json;charset=utf-8',
                        success: function (data) {
                            if(!data.success){
                                alert(data.msg);
                            }else{
                                console.log(data);
                                alert('修改成功!');
                                _this.addFormVisible = false;
                            }

                        }
                    });
				}
				else if(_number === 2){
                    const params = {
                        name:this.option[1].label,
                        carouselPicture:_this.url,
                        price:this.inputMoney,
                        catId:this.numtyId,
                    }
                    console.log(params);
                    $.ajax({
                        type: 'POST',
                        dataType: 'json',
                        url: baseUrl + "/api/rechargeType/recharge/post",
                        data: JSON.stringify(params),
                        contentType: 'application/json;charset=utf-8',
                        success: function (data) {
                            if(!data.success){
                                alert(data.msg);
                            }else{
                                console.log(data);
                                alert('修改成功!');
                                _this.addFormVisible = false;
                            }

                        }
                    });
				}
                else if(_number === 3){
				    console.log(this.optionyk)
                    let name		= '';
                    for(var i=0;i<this.optionyk.length;i++){
                        if(this.optionyk[i].value === this.rechargeList.rechargeTypeIdyk){
                            name = this.optionyk[i].label;
                            this.catId = this.optionyk[i].value;
                            console.log(this.optionyk[i].label)
                        }
                    }
                    const params = {
                        name:name,
                        carouselPicture:_this.url,
                        price:this.inputMoney,
                        catId:this.numtyId,
                    }
                    $.ajax({
                        type: 'POST',
                        dataType: 'json',
                        url: baseUrl + "/api/rechargeType/recharge/post",
                        data: JSON.stringify(params),
                        contentType: 'application/json;charset=utf-8',
                        success: function (data) {
                            if(!data.success){
                                alert(data.msg);
                            }else{
                                console.log(data);
                                alert('修改成功!');
                                _this.addFormVisible = false;
                            }

                        }
                    });
                }
                else if(_number === 4){
                    let name		= '';
                    for(var i=0;i<this.optionsp.length;i++){
                        if(this.optionsp[i].value === this.rechargeList.rechargeTypeIdsp){
                            name = this.optionsp[i].label;
                            this.catId = this.optionsp[i].value;
                        }
                    }
                    const params = {
                        name:this.inputtime,
                        carouselPicture:_this.url,
                        price:this.inputMoney,
                        catId:this.numtyId,
                    }
                    $.ajax({
                        type: 'POST',
                        dataType: 'json',
                        url: baseUrl + "/api/rechargeType/recharge/post",
                        data: JSON.stringify(params),
                        contentType: 'application/json;charset=utf-8',
                        success: function (data) {
                            if(!data.success){
                                alert(data.msg);
                            }else{
                                console.log(data);
                                alert('修改成功!');
                                _this.addFormVisible = false;
                            }

                        }
                    });
                }
			},
			//删除
			deleteBtn: function (index, row) {
				const _this = this
				const params = {
					id:row.id
				}
				console.log(row)
				this.$confirm('确认删除该记录吗?', '提示', {
					type: 'warning'
				}).then(() => {
					$.ajax({
		                type:'POST',
		                dataType:'json',
		                url:baseUrl+"/api/rechargeConfig/delete/one",
		                data:JSON.stringify(params),
		                contentType:'application/json;charset=utf-8',
		                success:function(data){
		                  	console.log(data)
		                  	if(data.code === 1){
		                  		_this.getlist()
		                  		// alert(data.msg)
		                  	}else{
								alert(data.msg)
		                  	}
		                }
		            });
				}).catch(() => {

				});
			},
			//状态修改
			statusBtn(index, row) {
				const _this = this
				const params = {
					id:row.id
				}
				let url = ''
				if(row.status === 1){
					url = '/api/rechargeConfig/disable'
				}else if(row.status === 0) {
					url = '/api/rechargeConfig/enable'
				}
				$.ajax({
	                type:'POST',
	                dataType:'json',
	                url:baseUrl+url,
	                data:JSON.stringify(params),
	                contentType:'application/json;charset=utf-8',
	                success:function(data){
	                  	console.log(data)
	                  	if(data.code === 1){
	                  		_this.getlist()
	                  		// alert(data.msg)
	                  	}else{
							alert(data.msg)
	                  	}
	                }
	            });
			},
			//显示编辑界面
			editBtn: function (index, row) {
				this.initeditForm = []
				this.editFormVisible = true;
				this.getBox()
				// console.log(row)
				this.initeditForm = row
				this.initeditForm.isCommission = this.initeditForm.isCommission.toString()
				// console.log(row)
			},
			//确认修改
			editSubmit: function () {
				const _this = this
				$.ajax({
	                type:'POST',
	                dataType:'json',
	                url:baseUrl+'/api/rechargeConfig/update',
	                data:JSON.stringify(this.initeditForm),
	                contentType:'application/json;charset=utf-8',
	                success:function(data){
	                  	console.log(data)
	                  	if(data.code === 1){
	                  		_this.getlist()
	                  		// alert(data.msg)
	                  		_this.editFormVisible = false
	                  	}else{
							alert(data.msg)
	                  	}
	                }
	            });
			},
			formatterTime(row,column){
                let curTime = row.createTime;
                curTime = new Date(curTime).toLocaleString()
                return curTime
            },
            formatterstatus(row,column){
            	let status = row.status;
            	if(status === 0){
            		status = '禁用'
            	}else if(status ===1){
            		status = '启用'
            	}
                return status
            },
            formCommission(row,column){
            	let comm = row.isCommission;
            	if(comm === 0){
            		comm = '否'
            	}else if(comm ===1){
            		comm = '是'
            	}
                return comm
            },
			handleCurrentChange(val) {
				this.page = val;
				this.getUsers();
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
	.el-dialog--small {
    	width: 25%;
    	border-radius: 10px
	}
	.el-select-dropdown__item.selected.hover {
		background-color: #e4e8f1;
	}
	.sort .el-input.is-disabled .el-input__inner {
		background-color: inherit;
	}
</style>