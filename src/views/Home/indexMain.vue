<template>
	<section style="background: #f7f7f7;">
		
		<!--顶部数据-->
		<el-row :gutter="20" class="main_top">
			<el-col :span="4">
				<div class="grid-content bg-purple Finance">
					<p>用户总数</p>
					<p>{{userNum}}</p>
					<p>
						<span>{{userNumPrice}}%</span>
						<span>来自上周</span>
					</p>
				</div>
			</el-col>
			<el-col :span="4">
				<div class="grid-content bg-purple Finance">
					<p>总营业额</p>
					<p>{{TotalTurnover}}</p>
					<p>
						<span>{{TotalTurnoverPrice}}%</span>
						<span>来自上周</span>
					</p>
				</div>
			</el-col>
			<el-col :span="4">
				<div class="grid-content bg-purple Finance">
					<p>商户入驻</p>
					<p>{{Merchant}}</p>
					<p>
						<span>{{MerchantPrice}}%</span>
						<span>来自上周</span>
					</p>
				</div>
			</el-col>
			<el-col :span="4">
				<div class="grid-content bg-purple Finance">
					<p>充值金额</p>
					<p>{{Recharge}}</p>
					<p>
						<span>{{RechargePrice}}%</span>
						<span>来自上周</span>
					</p>
				</div>
			</el-col>
			<el-col :span="4">
				<div class="grid-content bg-purple Finance">
					<p>公益收益</p>
					<p>{{publicWelfare}}</p>
					<p>
						<span>{{publicWelfarePrice}}%</span>
						<span>来自上周</span>
					</p>
				</div>
			</el-col>
			<el-col :span="4">
				<div class="grid-content bg-purple Finance">
					<p>历史提现</p>
					<p>{{History}}</p>
					<p>
						<span>{{HistoryPrice}}%</span>
						<span>来自上周</span>
					</p>
				</div>
			</el-col>
		</el-row>
		<!-- <el-row :span="24">
			<el-radio-group v-model="radio3" @change='clickRadio'>
				<el-radio-button  v-for="item in ruleAll" :label="item.id">{{item.name}}</el-radio-button>
		  	</el-radio-group>
		</el-row> -->
		<!--统计图-->
		<el-row class="statistics">
			<el-col :span="24" class="statistics_title">
				<div class="grid-content bg-purple">
					<div style="float:left" class="statistics_title_left">
						<span>财务报表</span>
						<span>{{baobiaoName}}</span>
					</div>
					<div style="float:right;margin-right: 2%;" class="statistics_title_right">
						<el-radio-group v-model="radio3" @change='click'>
				<el-radio-button  v-for="item in ruleAll" :label="item.id">{{item.name}}</el-radio-button>
		  	</el-radio-group>
					</div>
				</div>
			</el-col>
			<el-col :span="24" class="statistics_img">
				<div class="grid-content bg-purple-light">
					<el-row>
						<el-col :span="16">
							<div id="chartColumn" style="width:100%; height:650px;"></div>
						</el-col>
						<el-col :span="8">
							<div id="chartPie" style="width:100%; height:650px;"></div>
						</el-col>
					</el-row>
				</div>
			</el-col>
		</el-row>
		<el-row class="statistics_bottom">
			<el-col :span="7" style="margin-top: 0;">
				<div class="grid-content bg-purple" style="margin: auto;overflow-y: auto;">
					<div class="statistics_bottom_left_top">待办事项</div>
					<div class="statistics_bottom_main">
						<ul>
							<li v-for="item in daibanList">{{item.notifyContent}}</li>
						</ul>
					</div>
				</div>
			</el-col>
			<el-col :span="16" style="float:right;margin-top: 0;">
				<div class="grid-content bg-purple">
					<div class="statistics_bottom_left_top">用户位置</div>
					<div id="chartmap" style="width:100%; height:650px;"></div>
				</div>
			</el-col>
		</el-row>
	</section>
</template>

<script>
    import echarts from 'echarts'
	import { state } from '../../vuex/state'
	import util from '../../common/js/util'
    import china from '../../common/js/china'
	import {baseUrl , editUser, addUser } from '../../api/api';
    export default {
        data() {
            return {
                baobiaoName:'日营业额',
            	 ruleAll:[{
                	name:'日报表',
                	id:0
                },{
                	name:'周报表',
                	id:1
                },{
                	name:'月报表',
                	id:2
                },{
                	name:'季报表',
                	id:3
                },{
                	name:'年报表',
                	id:4
                }],
                radio3: 0,
                chartColumn: null,
                chartBar: null,
                chartLine: null,
                chartPie: null,
                chartmap: null,
                userNum:'',
                TotalTurnover:'',
                Merchant:'',
                Recharge:'',
                publicWelfare:'0',
                History:'',

                userNumPrice:'',
                TotalTurnoverPrice:'',
                MerchantPrice:'',
                RechargePrice:'',
                publicWelfarePrice:'0',
                HistoryPrice:'',

                daibanList:[],

                type:0,

                listAll:[],//线图
                sj:[],
                cj:[],
                sp:[],
                pj:[],
                tx: [],
                parobj:[],//饼图
                parName:[],
                maplist:[]
            }
        },
        methods: {
        	// 获取头部信息
        	getlist(){
        		const _this = this
        		$.ajax({
                    type:'GET',
                    dataType:'json',
                    url:baseUrl+"/api/orderMall/selectGroupOfSys",
                    data:{},
                    contentType:'application/json;charset=utf-8',
                    success:function(data){
                        const info = data.data
                        for(var i = 0;i<info.length;i++){
                        	if(info[i].type === 1){
                        		if(info[i].countAll === null){
                        			_this.userNum = 0
                        		}else{
                        			_this.userNum = info[i].countAll
                        		}
                        		if(info[i].avgPrice === null){
                        			_this.userNumPrice = 0
                        		}else{
                        			_this.userNumPrice = (info[i].avgPrice*100).toFixed(2)
                        		}
                        	}else if(info[i].type === 2){
                        		if(info[i].countAll === null){
                        			_this.TotalTurnover = 0
                        		}else{
                        			_this.TotalTurnover = info[i].countAll
                        		}
                        		if(info[i].avgPrice === null){
                        			_this.TotalTurnoverPrice = 0
                        		}else{
                        			_this.TotalTurnoverPrice = (info[i].avgPrice*100).toFixed(2)
                        		}
                        	}else if(info[i].type === 3){
                        		if(info[i].countAll === null){
                        			_this.Merchant = 0
                        		}else{
                        			_this.Merchant = info[i].countAll
                        		}
                        		if(info[i].avgPrice === null){
                        			_this.MerchantPrice = 0
                        		}else{
                        			_this.MerchantPrice = (info[i].avgPrice*100).toFixed(2)
                        		}
                        	}else if(info[i].type === 4){
                        		if(info[i].countAll === null){
                        			_this.Recharge = 0
                        		}else{
                        			_this.Recharge = info[i].countAll
                        		}
                        		if(info[i].avgPrice === null){
                        			_this.RechargePrice = 0
                        		}else{
                        			_this.RechargePrice = (info[i].avgPrice*100).toFixed(2)
                        		}
                        	}else if(info[i].type === 5){
                        		if(info[i].countAll === null){
                        			_this.publicWelfare = 0
                        		}else{
                        			_this.publicWelfare = info[i].countAll
                        		}
                        		if(info[i].avgPrice === null){
                        			_this.publicWelfarePrice = 0
                        		}else{
                        			_this.publicWelfarePrice = (info[i].avgPrice*100).toFixed(2)
                        		}
                        	}else if(info[i].type === 6){
                        		if(info[i].countAll === null){
                        			_this.History = 0
                        		}else{
                        			_this.History = info[i].countAll
                        		}
                        		if(info[i].avgPrice === null){
                        			_this.HistoryPrice = 0
                        		}else{
                        			_this.HistoryPrice = (info[i].avgPrice*100).toFixed(2)
                        		}
                        	}
                        }

                    }
                });
        	},
        	// 待办事项
        	getUser(){
        		const _this = this
        		$.ajax({
                    type:'POST',
                    dataType:'json',
                    url:baseUrl+"/api/notify/selectListGroupOfSystem",
                    data:JSON.stringify([5,6,13]),
                    contentType:'application/json;charset=utf-8',
                    success:function(data){
                    	const info = data.data
                    	_this.daibanList = info
                    }
                });
        	},
        	click(val) {
        		this.type = val
                if(val === 0){
                    this.baobiaoName = '日营业额'
                }else if(val === 1){
                    this.baobiaoName = '周营业额'
                }else if(val === 2){
                    this.baobiaoName = '月营业额'
                }else if(val === 3){
                    this.baobiaoName = '季营业额'
                }else if(val === 4){
                    this.baobiaoName = '年营业额'
                }
        		this.getPosition()
			},
        	// 图
        	getPosition(){
        		const _this = this
        		_this.sj = []
        		_this.cj = []
        		_this.sp = []
        		_this.pj = []
                _this.tx = []
        		_this.parobj = []//初始化饼图数据
        		_this.parName = []
        		_this.listAll = []//初始化线形图数据
        		const params = {
        			type:this.type,
        			storeId:state.storeId
        		}
        		// console.log(params)
        		
        		$.ajax({
	              type:'POST',
	              dataType:'json',
	              url:baseUrl+"/api/orderMall/selectByPayTimeGroup",
	              data:JSON.stringify(params),
	              contentType:'application/json;charset=utf-8',
	              success:function(data){
	                const info = data.data
	                // 线形图
                    if(info === null){
                        return
                    }
                    console.log(info)
	                const linelist = info.analysisVOList
	                for(var i = 0;i<linelist.length;i++){
	                	// 时间
	                	var date=new Date(linelist[i].payTime);
	                	if(_this.type === 0){
	                		 _this.sj.push(date.getHours()+'时')
	                	}else if(_this.type === 1 || _this.type === 3){
	                		 _this.sj.push((date.getMonth()+1)+"月"+date.getDate()+'日')
	                	}else if(_this.type === 2 ){

                            _this.sj.push(date.getDate()+'日')
                        }else{
	                		_this.sj.push(date.getFullYear()+"-"+(date.getMonth()+1))
	                	}
	                	_this.cj.push(linelist[i].moneyAll)
	                	_this.sp.push(linelist[i].countAll)
	                	_this.pj.push(linelist[i].avgPrice)
                        _this.tx.push(linelist[i].amount)
	                }
	                console.log(_this.sj)

                    

	                const obj = {}
                	obj.name = '成交额总数'
                	obj.type = 'line'
                	obj.smooth = true
                	obj.data = _this.cj
                	obj.itemStyle = {
                		normal : {
                			label:{show:true}
                		}
                	}
            		_this.listAll.push(obj)

            		const obj1 = {}
                	obj1.name = '成交商品总数'
                	obj1.type = 'line'
                	obj1.smooth = true
                	obj1.data = _this.sp
                	obj1.itemStyle = {
                		normal : {
                			label:{show:true}
                		}
                	}
            		_this.listAll.push(obj1)

            		const obj2 = {}
                	obj2.name = '成交额平均值'
                	obj2.type = 'line'
                	obj2.smooth = true
                	obj2.data = _this.pj
                	obj2.itemStyle = {
                		normal : {
                			label:{show:true}
                		}
                	}
            		_this.listAll.push(obj2)
            		
                    const obj3 = {}
                    obj3.name = '提现总金额'
                    obj3.type = 'line'
                    obj3.smooth = true
                    obj3.data = _this.tx
                    obj3.itemStyle = {
                        normal : {
                            label:{show:true}
                        }
                    }
                    _this.listAll.push(obj3)

            		console.log(_this.listAll)



					//饼图数据
	                const ordlist= info.orderMalls
	                console.log(ordlist)
	                for(var i = 0;i<ordlist.length;i++){
	                	const obj = {}
	                	if(ordlist[i].orderType === 3){
	                		obj.name = '业务充值'
	                	}else if(ordlist[i].orderType === 4){
	                		obj.name = '余额充值'
	                	}else if(ordlist[i].orderType === 5){
	                		obj.name = '商品购买'
	                	}else if(ordlist[i].orderType === 6){
	                		obj.name = ordlist[i].storeName+ '身份购买'
	                	}else if(ordlist[i].orderType === 7){
	                		obj.name = '平台身份购买 '
	                	}else if(ordlist[i].orderType === 8){
	                		obj.name = '补货'
	                	}else if(ordlist[i].orderType === 9){
	                		obj.name = '金豆充值'
	                	}else if(ordlist[i].orderType === 13){
	                		obj.name = '便付劵充值'
	                	}else{
	                		obj.name = '业务充值'
	                	}
	                	obj.value = ordlist[i].totalMoney
	                	_this.parName.push(obj.name)
	                	_this.parobj.push(obj)
	                }
	                console.log(_this.parobj)

	                console.log(_this.parName)
	                _this.drawColumnChart()
	                _this.drawPieChart()
	              }
	          });
        	},
        	// 折线图
            drawColumnChart() {
                this.chartColumn = echarts.init(document.getElementById('chartColumn'));
                this.chartColumn.setOption({
                    title: { text: this.baobiaoName },
                    tooltip: {},
                    legend: {
        				data:['提现总金额','成交额总数','成交商品总数','成交额平均值']
    				},
                    xAxis: {
                        type : 'category',
                        boundaryGap : false,
                        data: this.sj
                    },
                    yAxis: {
                        type : 'value'
					},
                    series:this.listAll
                });
            },
            // 饼图
            drawPieChart() {
                this.chartPie = echarts.init(document.getElementById('chartPie'));
                this.chartPie.setOption({
                    title: {
                        text: '店铺收入支出分析图',
                        x: 'center'
                    },
                    tooltip: {
                        trigger: 'item',
                        formatter: "{a} <br/>{b} : {c} ({d}%)"
                    },
                    legend: {
                        orient: 'vertical',
                        left: 'left',
                         data:this.parName
                    },
                    series: [
                        {
                            name: '访问来源',
                            type: 'pie',
                            radius: '55%',
                            center: ['50%', '60%'],
                            data:this.parobj,
                            itemStyle: {
                                emphasis: {
                                    shadowBlur: 10,
                                    shadowOffsetX: 0,
                                    shadowColor: 'rgba(0, 0, 0, 0.5)'
                                }
                            }
                        }
                    ]
                });
            },
            // 地图
            getmapList(){
                const _this = this
                this.maplist = []
                $.ajax({
                    type:'GET',
                    dataType:'json',
                    url:baseUrl+"/api/orderMall/selectCountGroupByCounty",
                    contentType:'application/json;charset=utf-8',
                    success:function(data){
                        console.log(data)
                        const info = data.data
                        for (var i = 0; i < info.length; i++) {
                            
                            const obj = {}
                            obj.name = info[i].provinceName
                            obj.calue = info[i].countGroup
                            _this.maplist.push(obj)
                        }
                        // _this.maplist = [
                        //         {name: '北京',value: Math.round(Math.random()*1000)},
                        //         {name: '天津',value: Math.round(Math.random()*1000)},
                        //         {name: '上海',value: Math.round(Math.random()*1000)},
                        //         {name: '重庆',value: Math.round(Math.random()*1000)},
                        //         {name: '山东',value: Math.round(Math.random()*1000)},
                        //         {name: '新疆',value: Math.round(Math.random()*1000)},
                        //         {name: '江苏',value: Math.round(Math.random()*1000)},
                        //         {name: '浙江',value: Math.round(Math.random()*1000)},
                        //         {name: '江西',value: Math.round(Math.random()*1000)}
                        //     ]
                        console.log(_this.maplist)
                        _this.chartmapFu()
                    }
                });
            },
            chartmapFu() {
                const chartmap = echarts.init(document.getElementById('chartmap'));
                chartmap.setOption({
                        title : {
                            text: '地区销量',
                            // subtext: '纯属虚构',
                            x:'center'
                        },
                        tooltip : {
                            trigger: 'item'
                        },
                        legend: {
                            orient: 'vertical',
                            x:'left',
                            data:['销量']
                        },
                        dataRange: {
                            min: 0,
                            max: 2500,
                            x: 'left',
                            y: 'bottom',
                            text:['高','低'],           // 文本，默认为数值文本
                            calculable : true
                        },
                        toolbox: {
                            show: true,
                            orient : 'vertical',
                            x: 'right',
                            y: 'center',
                            feature : {
                                mark : {show: true},
                                dataView : {show: true, readOnly: false},
                                restore : {show: true},
                                saveAsImage : {show: true}
                            }
                        },
                        roamController: {
                            show: true,
                            x: 'right',
                            mapTypeControl: {
                                'china': true
                            }
                        },
                    series : [
                        {
                            name: '销量',
                            type: 'map',
                            mapType: 'china',
                            roam: false,//放大放小
                            itemStyle:{
                                normal:{label:{show:true}},
                                emphasis:{label:{show:true}}
                            },
                            data:this.maplist
                            // [
                            //     {name: '北京',value: Math.round(Math.random()*1000)},
                            //     {name: '天津',value: Math.round(Math.random()*1000)},
                            //     {name: '上海',value: Math.round(Math.random()*1000)},
                            //     {name: '重庆',value: Math.round(Math.random()*1000)},
                            //     {name: '山东',value: Math.round(Math.random()*1000)},
                            //     {name: '新疆',value: Math.round(Math.random()*1000)},
                            //     {name: '江苏',value: Math.round(Math.random()*1000)},
                            //     {name: '浙江',value: Math.round(Math.random()*1000)},
                            //     {name: '江西',value: Math.round(Math.random()*1000)}
                            // ]
                        }
                    ]
                })
            },
            formatterTime(row){
                return  new Date(row).toLocaleString()
            }
        },
        mounted: function () {
        	this.getPosition()
           	this.getlist()
           	this.getUser()

            this.getmapList()
            // this.chartmapFu()
        },
       	// 更新
        // updated: function () {
        //     this.drawCharts()
        // }
    }
</script>

<style scoped lang="scss">
	.main_top {
		text-align: center;
		padding: 40px 0 35px 0;
		font-family: "Microsoft YaHei";
		.Finance {
			p {
				margin: 0;
				padding: 0;
				color: #6a7c8f;
			}
			p:nth-child(1) {  font-size: 14px;  }
			p:nth-child(2) {  font-size: 36px;font-weight: 900  }
			p:nth-child(3) {
				font-size: 14px;
				span:nth-child(1){
					color: #1abb9c;
				}
			}
		}
		.el-row {
			margin-bottom: 20px;
			&:last-child {
				margin-bottom: 0;
			}
		}
		.el-col {
			border-radius: 4px;
		}
		.bg-purple-dark {
			/*background: #99a9bf;*/
		}
		.bg-purple {
			/*background: #d3dce6;*/
		}
		.bg-purple-light {
			/*background: #e5e9f2;*/
		}
		.grid-content {
			border-radius: 4px;
			min-height: 36px;
		}
		.row-bg {
			padding: 10px 0;
			background-color: #f9fafc;
		}
	}
	.statistics {
		font-family: "Microsoft YaHei";
		border: 1px solid #cdcdcd;
		box-shadow: 0 2px 10px rgba(0,0,0,.1);
		.statistics_img , .statistics_title {
			margin-top: 0;
		}
		.statistics_title {
			height:70px;
			border-bottom: 1px solid #cdcdcd;
			line-height: 70px;
			.statistics_title_left {
				height:70px;
				span:nth-child(1) {
					font-size: 30px;
					font-weight: 900;
					color: #6a7c8f;
					margin: 0 20px;
				}
				span:nth-child(2) {
					font-size: 18px;
					color: #6a7c8f;
				}
			}
			.statistics_title_right {
				height:70px;
			}
		}
	}
	.statistics_bottom {
		font-family: "Microsoft YaHei";
		margin-top: 30px;
		height:720px;
		margin-bottom: 100px;
		.grid-content {
			border: 1px solid #cdcdcd;
			box-shadow: 0 2px 10px rgba(0,0,0,.1);
			height:720px;
			.statistics_bottom_left_top {
				height:70px;
				font-size: 30px;
				font-weight: 900;
				color: #6a7c8f;
				padding: 0 5%;
				border-bottom: 1px solid #cdcdcd;
				line-height: 70px;
			}
			.statistics_bottom_main {
				ul ,li {
					list-style-type: none;
					margin: 0;
					padding: 0;
				}
				ul {
					width:90%;
					margin: auto;
				}
				li {
					height:64px;
					line-height: 64px;
					font-size: 18px;
					color: #333;
					white-space:nowrap;
					text-overflow:ellipsis;
					-o-text-overflow:ellipsis;
					overflow: hidden;
					width:100%;
					border-bottom: 1px solid #cdcdcd;
				}
			}
		}
	}
</style>
<style>
	/*.el-radio-button:first-child .el-radio-button__inner {border: none;}*/
	/*.el-radio-button:first-child .el-radio-button__inner {border-radius: 10px;}*/
	/*.el-radio-button:last-child .el-radio-button__inner {border-radius: 10px;}*/
	/*.el-radio-button__orig-radio:checked+.el-radio-button__inner {background-color:#22ac38;}*/
	.el-radio-button__inner {background: #f7f7f7;font-size: 18px;color: #6a7c8f;}
	.el-radio-button__inner:hover {color: #22ac38;}
	.wrapper_btn span {
		border: transparent;
		border-radius: 10px;
		margin: 0 10px;
	}
</style>