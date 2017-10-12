<template>
	<section>
		<!--权限管理头部-->
		<el-row>
			<el-col :span="24">
				<div class="grid-content bg-purple-dark" style="height:70px;line-height: 70px;text-align: right;">
					<el-button type="primary">保存</el-button>
					<el-button type="primary">取消</el-button>
				</div>
			</el-col>
			<el-col :span="24" class="permissions">修改权限</el-col>
		</el-row>
		<!--权限管理主体-->
		<el-row style="margin-top: 20px;">
			<el-col :span="21">
				<el-tree
						:data="data2"
						show-checkbox
						node-key="id"
						>
				</el-tree>
			</el-col>
			<el-col :span="3">
				<div class="jurisdiction_right">
					<ul>
						<li>商品管理</li>
						<li>评价管理</li>
						<li>交易管理</li>
						<li>物流管理</li>
						<li>店铺管理</li>
						<li>营销中心</li>
						<li>客户服务</li>
						<li>财务</li>
						<li>网络电话管理</li>
						<li>爱心公益管理</li>
						<li>扫码付管理</li>
						<li>特色服务</li>
						<li>发票管理</li>
					</ul>
				</div>
			</el-col>
		</el-row>
	</section>
</template>

<script>
	import { state } from '../../vuex/state'
	import util from '../../common/js/util'
	import {baseUrl , editUser, addUser } from '../../api/api';

	export default {
		data() {
			return {
				radio: '0',
				checked: true,
				value:'',
				value1:'',
				value2:'',
				data2:[{
				    id:1,
					label:'banner'
				},
                    {
                        id: 2,
                        label: '商品管理',
                        children: [{
                            id: 3,
                            label: '商品操作权限',
							children:[
								{
								    id:4,
									label:'编辑商品',
								},
                                {
                                    id:5,
                                    label:'上下架',
                                },
                                {
                                    id:6,
                                    label:'删除商品',
                                },
                                {
                                    id:7,
                                    label:'删除/修改邮费',
                                }
							]
                        }, {
                            id: 8,
                            label: '发布商品'
                        },
							{
                                id: 9,
                                label: '橱窗推荐'
                            },
							{
                                id: 10,
                                label: '仓库中的商品'
                            },
                            {
                                id: 11,
                                label: '商品属性管理'
                            },
                            {
                                id: 12,
                                label: '货品管理'
                            }
                        ]
                    }
                    ,
                    {
                        id: 31,
                        label: '评价管理',
                        children: [{
                            id: 32,
                            label: '商品评价管理',
                            children:[
                                {
                                    id:33,
                                    label:'回复评价',
                                },
                                {
                                    id:34,
                                    label:'举报评价',
                                },
                                {
                                    id:35,
                                    label:'删除评价',
                                }

                            ]
                        }, {
                            id: 36,
                            label: '店铺信用'
                        }
                        ]
                    },
                    {
                        id: 41,
                        label: '交易管理',
                        children: [{
                            id: 42,
                            label: '交易操作权限',
                            children:[
                                {
                                    id:43,
                                    label:'关闭交易',
                                },
                                {
                                    id:44,
                                    label:'修改价格',
                                },
                                {
                                    id:45,
                                    label:'延长发货',
                                },
                                {
                                    id:46,
                                    label:'订单导出',
                                }

                            ]
                        }, {
                            id: 47,
                            label: '商品退货／退款',
                            children:[
                                {
                                    id:471,
                                    label:'同意退款',
                                },
                                {
                                    id:472,
                                    label:'同意退货',
                                },
                                {
                                    id:473,
                                    label:'拒绝申请',
                                }]
                        },
                            {
                                id: 48,
                                label: '已卖出的商品',
                                children:[
                                    {
                                        id:481,
                                        label:'查看订单详情',
                                    }]
                            },
                            {
                                id: 49,
                                label: '电子优惠券',
                            }
                        ]
                    },
                    {
                        id: 51,
                        label: '物流管理',
                        children: [{
                            id: 52,
                            label: '查看发货列表',
                            children:[
                                {
                                    id:53,
                                    label:'发货',
                                }
                            ]
                        }, {
                            id: 54,
                            label: '修改收货地址'
                        }
                        ]
                    }
				]
			}
		},
		methods: {
			getlist(){
				const _this = this
				_this.table = []
				const params = {
					rolesId:1
				}
				console.log(params)
				$.ajax({
                    type: 'POST',
                    dataType: 'json',
                    url: baseUrl + "/api/permissions/findPermissionsTypeOne",
                    data: JSON.stringify(params),
                    contentType: 'application/json;charset=utf-8',
                    success: function (data) {
                        console.log(data)
                    }
                })
			},
			handleCurrentChange(val) {
				this.page = val;
				this.getlist();
			},
			selsChange: function (sels) {
				this.sels = sels;
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
	.permissions {
		background: #eee;
		height:60px;
		line-height: 60px;
		padding-left: 20px;
		font-size: 24px;
		color: #2a3f54;
	}
	.el-tree {
		background: transparent;
		border: none;
	}
	/*.el-tree-node__content:hover {*/
		/*background: transparent;*/
	/*}*/
	.jurisdiction_right ul {
		margin: 0;
		padding: 0;
		width:100%;
		border: 1px solid #cfcfcf;
	}
	.jurisdiction_right ul li{
		list-style-type: none;
		margin: 0;
		padding: 0;
		text-align: center;
		width:100%;
		height:40px;
		background:#eee;
		line-height: 40px;
		border-bottom: 1px solid #cfcfcf;
		cursor: pointer;
	}
	.jurisdiction_right ul li:hover {
		background: #48576a;
		color: #fff;
	}
	.jurisdiction_right ul li:last-child {
		border-bottom: none;
	}
</style>