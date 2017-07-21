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
		<!--统计图-->
		<el-row class="statistics">
			<el-col :span="24" class="statistics_title">
				<div class="grid-content bg-purple">
					<div style="float:left" class="statistics_title_left">
						<span>财务报表</span>
						<span>周报表</span>
					</div>
					<div style="float:right;margin-right: 2%;" class="statistics_title_right">
						<span class="wrapper">
							  <el-radio-group v-model="radio3" class="wrapper_btn" style="position: relative;top:-5px;">
								<el-radio-button label="周报表" class="wrapper_btn_01"></el-radio-button>
								<el-radio-button label="月报表"></el-radio-button>
								<el-radio-button label="季度报表"></el-radio-button>
								<el-radio-button label="年报表"></el-radio-button>
							  </el-radio-group>
  						</span>
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
							<li>1、中国地图，省份用户监测</li>
							<li>1、中国地图，省份用户监测</li>
							<li>1、中国地图，省份用户监测</li>
							<li>1、中国地图，省份用户监测</li>
							<li></li>
							<li></li>
							<li></li>
							<li></li>
							<li></li>
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

<!--<script>-->
    <!--import echarts from 'echarts'-->
	<!--export default {-->
        <!--data () {-->
            <!--return {-->
                <!--radio3: '报表',-->
                <!--chartColumn: null,-->
                <!--chartBar: null,-->
                <!--chartLine: null,-->
                <!--chartPie: null-->
            <!--};-->
        <!--}-->
	<!--}-->

<!--</script>-->
<script>
    import echarts from 'echarts'
	import { state } from '../../vuex/state'
	import util from '../../common/js/util'
	import {baseUrl , editUser, addUser } from '../../api/api';
    export default {
        data() {
            return {
                radio3: '报表',
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
                HistoryPrice:''
            }
        },
        methods: {
        	getlist(){
        		const _this = this
        		$.ajax({
                    type:'GET',
                    dataType:'json',
                    url:baseUrl+"/api/orderMall/selectGroupOfSys",
                    data:{},
                    contentType:'application/json;charset=utf-8',
                    success:function(data){
                        console.log(data)
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
                        			_this.userNumPrice = info[i].avgPrice*100
                        		}
                        		// _this.userNum = info[i].countAll
                        		// _this.userNumPrice = info[i].avgPrice*100
                        	}else if(info[i].type === 2){
                        		if(info[i].countAll === null){
                        			_this.TotalTurnover = 0
                        		}else{
                        			_this.TotalTurnover = info[i].countAll
                        		}
                        		if(info[i].avgPrice === null){
                        			_this.TotalTurnoverPrice = 0
                        		}else{
                        			_this.TotalTurnoverPrice = info[i].avgPrice*100
                        		}
                        		// _this.TotalTurnover = info[i].countAll
                        		// _this.TotalTurnoverPrice = info[i].avgPrice*100
                        	}else if(info[i].type === 3){
                        		if(info[i].countAll === null){
                        			_this.Merchant = 0
                        		}else{
                        			_this.Merchant = info[i].countAll
                        		}
                        		if(info[i].avgPrice === null){
                        			_this.MerchantPrice = 0
                        		}else{
                        			_this.MerchantPrice = info[i].avgPrice*100
                        		}
                        		// _this.Merchant = info[i].countAll
                        		// _this.MerchantPrice = info[i].avgPrice*100
                        	}else if(info[i].type === 4){
                        		if(info[i].countAll === null){
                        			_this.Recharge = 0
                        		}else{
                        			_this.Recharge = info[i].countAll
                        		}
                        		if(info[i].avgPrice === null){
                        			_this.RechargePrice = 0
                        		}else{
                        			_this.RechargePrice = info[i].avgPrice*100
                        		}
                        		// _this.Recharge = info[i].countAll
                        		// _this.RechargePrice = info[i].avgPrice*100
                        	}else if(info[i].type === 5){
                        		if(info[i].countAll === null){
                        			_this.publicWelfare = 0
                        		}else{
                        			_this.publicWelfare = info[i].countAll
                        		}
                        		if(info[i].avgPrice === null){
                        			_this.publicWelfarePrice = 0
                        		}else{
                        			_this.publicWelfarePrice = info[i].avgPrice*100
                        		}
                        		// _this.publicWelfarePrice = info[i].avgPrice*100
                        	}else if(info[i].type === 6){
                        		if(info[i].countAll === null){
                        			_this.History = 0
                        		}else{
                        			_this.History = info[i].countAll
                        		}
                        		if(info[i].avgPrice === null){
                        			_this.HistoryPrice = 0
                        		}else{
                        			_this.HistoryPrice = info[i].avgPrice*100
                        		}
                        		// _this.HistoryPrice = info[i].avgPrice*100
                        	}
                        }

                    }
                });
        	},
            drawColumnChart() {
                this.chartColumn = echarts.init(document.getElementById('chartColumn'));
                this.chartColumn.setOption({
                    title: { text: '周营业额' },
                    tooltip: {},
                    xAxis: {
                        type : 'category',
                        boundaryGap : false,
                        data: ["5.21", "5.22", "5.23", "5.24", "5.25", "5.26"]
                    },
                    yAxis: {
                        type : 'value'
					},
                    series: [{
                        name: '销量',
                        type: 'line',
                        smooth:true,
                        itemStyle: {normal: {areaStyle: {type: 'default'}}},
                        data: [0, 100, 36, 10, 10, 20]
                    }]
                });
            },
            drawPieChart() {
                this.chartPie = echarts.init(document.getElementById('chartPie'));
                this.chartPie.setOption({
                    title: {
                        text: '收入分析图',
                        subtext: '纯属虚构',
                        x: 'center'
                    },
                    tooltip: {
                        trigger: 'item',
                        formatter: "{a} <br/>{b} : {c} ({d}%)"
                    },
                    legend: {
                        orient: 'vertical',
                        left: 'left',
                        data: ['商城', '邮件营销', '联盟广告', '视频广告', '搜索引擎']
                    },
                    series: [
                        {
                            name: '访问来源',
                            type: 'pie',
                            radius: '55%',
                            center: ['50%', '60%'],
                            data: [
                                { value: 335, name: '商城' },
                                { value: 310, name: '邮件营销' },
                                { value: 234, name: '联盟广告' },
                                { value: 135, name: '视频广告' },
                                { value: 1548, name: '搜索引擎' }
                            ],
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
//            drawMapChart() {
//                this.chartPie = echarts.init(document.getElementById('chartmap'));
//                this.chartPie.setOption({
//                    title : {
//                        text: '各微商销量',
//                        subtext: '纯属虚构',
//                        x:'center'
//                    },
//                    tooltip : {
//                        trigger: 'item'
//                    },
//                    legend: {
//                        orient: 'vertical',
//                        x:'left',
//                        data:['蜂蜜','巧克力','水果']
//                    },
//                    dataRange: {
//                        min: 0,
//                        max: 2500,
//                        x: 'left',
//                        y: 'bottom',
//                        text:['高','低'],           // 文本，默认为数值文本
//                        calculable : true
//                    },
//                    toolbox: {
//                        show: true,
//                        orient : 'vertical',
//                        x: 'right',
//                        y: 'center',
//                        feature : {
//                            mark : {show: true},
//                            dataView : {show: true, readOnly: false},
//                            restore : {show: true},
//                            saveAsImage : {show: true}
//                        }
//                    },
//                    series : [
//                        {
//                            name: '蜂蜜',
//                            type: 'map',
//                            mapType: 'china',
//                            roam: false,
//                            itemStyle:{
//                                normal:{label:{show:true}},
//                                emphasis:{label:{show:true}}
//                            },
//                            data:[
//                                {name: '北京',value: Math.round(Math.random()*1000)},
//                                {name: '天津',value: Math.round(Math.random()*1000)},
//                                {name: '上海',value: Math.round(Math.random()*1000)},
//                                {name: '重庆',value: Math.round(Math.random()*1000)},
//                                {name: '河北',value: Math.round(Math.random()*1000)},
//                                {name: '河南',value: Math.round(Math.random()*1000)},
//                                {name: '云南',value: Math.round(Math.random()*1000)},
//                                {name: '辽宁',value: Math.round(Math.random()*1000)},
//                                {name: '黑龙江',value: Math.round(Math.random()*1000)},
//                                {name: '湖南',value: Math.round(Math.random()*1000)},
//                                {name: '安徽',value: Math.round(Math.random()*1000)},
//                                {name: '山东',value: Math.round(Math.random()*1000)},
//                                {name: '新疆',value: Math.round(Math.random()*1000)},
//                                {name: '江苏',value: Math.round(Math.random()*1000)},
//                                {name: '浙江',value: Math.round(Math.random()*1000)},
//                                {name: '江西',value: Math.round(Math.random()*1000)},
//                                {name: '湖北',value: Math.round(Math.random()*1000)},
//                                {name: '广西',value: Math.round(Math.random()*1000)},
//                                {name: '甘肃',value: Math.round(Math.random()*1000)},
//                                {name: '山西',value: Math.round(Math.random()*1000)},
//                                {name: '内蒙古',value: Math.round(Math.random()*1000)},
//                                {name: '陕西',value: Math.round(Math.random()*1000)},
//                                {name: '吉林',value: Math.round(Math.random()*1000)},
//                                {name: '福建',value: Math.round(Math.random()*1000)},
//                                {name: '贵州',value: Math.round(Math.random()*1000)},
//                                {name: '广东',value: Math.round(Math.random()*1000)},
//                                {name: '青海',value: Math.round(Math.random()*1000)},
//                                {name: '西藏',value: Math.round(Math.random()*1000)},
//                                {name: '四川',value: Math.round(Math.random()*1000)},
//                                {name: '宁夏',value: Math.round(Math.random()*1000)},
//                                {name: '海南',value: Math.round(Math.random()*1000)},
//                                {name: '台湾',value: Math.round(Math.random()*1000)},
//                                {name: '香港',value: Math.round(Math.random()*1000)},
//                                {name: '澳门',value: Math.round(Math.random()*1000)}
//                            ]
//                        },
//                        {
//                            name: '巧克力',
//                            type: 'map',
//                            mapType: 'china',
//                            itemStyle:{
//                                normal:{label:{show:true}},
//                                emphasis:{label:{show:true}}
//                            },
//                            data:[
//                                {name: '北京',value: Math.round(Math.random()*1000)},
//                                {name: '天津',value: Math.round(Math.random()*1000)},
//                                {name: '上海',value: Math.round(Math.random()*1000)},
//                                {name: '重庆',value: Math.round(Math.random()*1000)},
//                                {name: '河北',value: Math.round(Math.random()*1000)},
//                                {name: '安徽',value: Math.round(Math.random()*1000)},
//                                {name: '新疆',value: Math.round(Math.random()*1000)},
//                                {name: '浙江',value: Math.round(Math.random()*1000)},
//                                {name: '江西',value: Math.round(Math.random()*1000)},
//                                {name: '山西',value: Math.round(Math.random()*1000)},
//                                {name: '内蒙古',value: Math.round(Math.random()*1000)},
//                                {name: '吉林',value: Math.round(Math.random()*1000)},
//                                {name: '福建',value: Math.round(Math.random()*1000)},
//                                {name: '广东',value: Math.round(Math.random()*1000)},
//                                {name: '西藏',value: Math.round(Math.random()*1000)},
//                                {name: '四川',value: Math.round(Math.random()*1000)},
//                                {name: '宁夏',value: Math.round(Math.random()*1000)},
//                                {name: '香港',value: Math.round(Math.random()*1000)},
//                                {name: '澳门',value: Math.round(Math.random()*1000)}
//                            ]
//                        },
//                        {
//                            name: '水果',
//                            type: 'map',
//                            mapType: 'china',
//                            itemStyle:{
//                                normal:{label:{show:true}},
//                                emphasis:{label:{show:true}}
//                            },
//                            data:[
//                                {name: '北京',value: Math.round(Math.random()*1000)},
//                                {name: '天津',value: Math.round(Math.random()*1000)},
//                                {name: '上海',value: Math.round(Math.random()*1000)},
//                                {name: '广东',value: Math.round(Math.random()*1000)},
//                                {name: '台湾',value: Math.round(Math.random()*1000)},
//                                {name: '香港',value: Math.round(Math.random()*1000)},
//                                {name: '澳门',value: Math.round(Math.random()*1000)}
//                            ]
//                        }
//                    ]
//                });
//            },
            drawCharts() {
                this.drawColumnChart()
                this.drawPieChart()
                // this.drawMapChart()
            },
        },
        mounted: function () {
            this.drawCharts()
           	this.getlist()
        },
        updated: function () {
            this.drawCharts()
        }
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
	.el-radio-button:first-child .el-radio-button__inner {border: none;}
	.el-radio-button:first-child .el-radio-button__inner {border-radius: 10px;}
	.el-radio-button:last-child .el-radio-button__inner {border-radius: 10px;}
	.el-radio-button__orig-radio:checked+.el-radio-button__inner {background-color:#22ac38;}
	.el-radio-button__inner {background: #f7f7f7;font-size: 18px;color: #6a7c8f;}
	.el-radio-button__inner:hover {color: #22ac38;}
	.wrapper_btn span {
		border: transparent;
		border-radius: 10px;
		margin: 0 10px;
	}
</style>