<template>
    <section>
    <!--工具条-->
        <el-col :span="24" class="toolbar" style="padding-bottom: 0px;background: #fff">
            <el-form :inline="true">
                <el-form-item>
                    <el-select v-model="name" clearable>
                      <el-option v-for="item in options" :label="item.label" :value="item.value">
                      </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="ztBtn">昨天</el-button>
                    <el-button type="primary" @click="zjBtn">最近7天</el-button>
                    <el-button type="primary" @click="yBtn">最近30天</el-button>
                    <el-button type="primary" @click="getlist">查询</el-button>
                    <el-button type="primary">导出数据</el-button>
                </el-form-item>
            </el-form>
        </el-col>
        <el-col :span="24" style="">
            <el-col :span="16"  style="border:1px solid #ddd;text-align: center;">
                <el-col :span="24" style="height: 40px;line-height: 40px;background:#ccc;">
                    <el-col :span="4">浏览人数</el-col>
                    <el-col :span="4">下单人数</el-col>
                    <el-col :span="4">订单数</el-col>
                    <el-col :span="4">下单件数</el-col>
                    <el-col :span="4">有效订单</el-col>
                    <el-col :span="4">下单金额</el-col>
                </el-col>
                <el-col :span="24" style="height: 60px;line-height: 60px;">
                    <el-col :span="4">{{browseNum}}</el-col>
                    <el-col :span="4">{{pOrderNum}}</el-col>
                    <el-col :span="4">{{orderNum}}</el-col>
                    <el-col :span="4">{{pOrderNc}}</el-col>
                    <el-col :span="4">{{vaOrderNum}}</el-col>
                    <el-col :span="4">{{pAmount}}</el-col>
                </el-col>
                <el-col :span="24" style="height: 40px;line-height: 40px;background:#ccc;">
                    <el-col :span="4">退款金额</el-col>
                    <el-col :span="4">付款人数</el-col>
                    <el-col :span="4">付款订单数</el-col>
                    <el-col :span="4">付款件数</el-col>
                    <el-col :span="4">付款金额</el-col>
                </el-col>
                <el-col :span="24" style="height: 60px;line-height: 60px;">
                    <el-col :span="4">{{rAmount}}</el-col>
                    <el-col :span="4">{{payMemberNum}}</el-col>
                    <el-col :span="4">{{payOrderNum}}</el-col>
                    <el-col :span="4">{{payOrderNc}}</el-col>
                    <el-col :span="4">{{payAmount}}</el-col>
                </el-col>
            </el-col>
            <el-col :span="8"  style="border:1px solid #ddd;height: 200px;"></el-col>
            <el-col :span="24">
                <div id="chartColumn" style="width:100%; height:650px;"></div>
            </el-col>
            <el-col :span="24">
                <el-col :span="4">订单构成来源</el-col>
                <el-col :span="10">
                    <el-form :inline="true">
                        <el-form-item>
                            <el-select v-model="name" clearable>
                              <el-option v-for="item in options" :label="item.label" :value="item.value">
                              </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item>
                            <el-button type="primary">导出数据</el-button>
                        </el-form-item>
                    </el-form>
                </el-col>
            </el-col>
            <el-col :span="24">
                <el-col :span="12"><div id="chartPie" style="width:100%; height:650px;"></div></el-col>
                <el-col :span="12"><div id="chartPieRight" style="width:100%; height:650px;"></div></el-col>
            </el-col>
        </el-col>



        <el-col :span="24"  style="border:1px solid #ddd;text-align: center;">
                <el-col :span="24" style="height: 40px;line-height: 40px;background:#ccc;">
                    <el-col :span="4">来源</el-col>
                    <el-col :span="4">身份数量</el-col>
                    <el-col :span="4">付款金额</el-col>
                    <el-col :span="4">商品数量</el-col>
                    <el-col :span="4">付款金额</el-col>
                </el-col>
                <el-col :span="24" style="height: 60px;line-height: 60px;border-bottom: 1px solid #ccc">
                    <el-col :span="4">平台</el-col>
                    <el-col :span="4">{{idenNumPla}}</el-col>
                    <el-col :span="4">{{idenPayMoneyPla}}</el-col>
                    <el-col :span="4">{{goodsNumPla}}</el-col>
                    <el-col :span="4">{{goodsPayMoneyPla}}</el-col>
                </el-col>
                <el-col :span="24" style="height: 60px;line-height: 60px;">
                    <el-col :span="4">微信</el-col>
                    <el-col :span="4">{{idenNumWx}}</el-col>
                    <el-col :span="4">{{idenPayMoneyWx}}</el-col>
                    <el-col :span="4">{{goodsNumWx}}</el-col>
                    <el-col :span="4">{{goodsPayMoneyWx}}</el-col>
                </el-col>
            </el-col>
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
                payOrderNc:'',    //付款件数
                payOrderNum:'',    //付款订单数
                rAmount:'',    //退款金额
                payAmount:'',    //付款金额
                browseNum:'',    //浏览人数
                vaOrderNum:'',    //有效订单
                pAmount:'',    //下单金额
                pOrderNum:'',    //下单人数
                orderNum:'',    //订单数
                pOrderNc:'',    //下单件数
                payMemberNum:'',    //付款人数

                idenNumPla:'',    //-身份数量（来源平台）
                idenPayMoneyPla:'',    //付款金额（身份）（来源平台）
                goodsNumPla:'',    //商品数量（来源平台）
                goodsPayMoneyPla:'',    //付款金额（商品）（来源平台）
                idenNumWx:'',    //-身份数量（来源微信）
                idenPayMoneyWx:'',    //付款金额（身份）（来源微信）
                goodsNumWx:'',    //商品数量（来源微信）
                goodsPayMoneyWx:'',    //付款金额（商品）（来源微信）
                                
                name:4,
                options:[],
                chartColumn: null,
                chartPie:null,
                chartPieRight:null,
                plist:[],
                wxlist:[],
                cNum:''
        	}
        },
        methods: {
            getTransaction(){
                const _this = this
                this.options = []
                const params = {
                    pageNum:1,
                    size:1000,
                    name:'',
                    nickName:'',
                    mobile:'',
                    status:'',
                    id:''
                }
                $.ajax({
                    type: 'POST',
                    dataType: 'json',
                    url: baseUrl + "/api/store/find/page",
                    data: JSON.stringify(params),
                    contentType: 'application/json;charset=utf-8',
                    success: function (data) {
                        console.log(data)
                        const info = data.data
                        for (var i = 0; i < info.list.length; i++) {
                            const obj = {}
                            obj.value = info.list[i].id
                            obj.label = info.list[i].name
                            _this.options.push(obj)
                        }
                    }
                })
            },
            ztBtn(){
                this.cNum = 1
                this.getlist()
            },
            zjBtn(){
                this.cNum = 7
                this.getlist()
            },
            yBtn(){
                this.cNum = 30
                this.getlist()
            },
            getlist(){
                const _this = this
                const params = {
                    storeId:this.name,
                    cNum:this.cNum,
                    startTime:'',
                    endTime:''
                }
                $.ajax({
                    type: 'POST',
                    dataType: 'json',
                    url: baseUrl + "/api/admin/mallStatistics/findMallStatistics",
                    data: JSON.stringify(params),
                    contentType: 'application/json;charset=utf-8',
                    success: function (data) {
                        console.log(data)
                        const info = data.data
                        _this.browseNum = info.browseNum
                        _this.orderNum = info.orderNum
                        _this.pAmount = info.pAmount
                        _this.pOrderNc = info.pOrderNc
                        _this.pOrderNum = info.pOrderNum
                        _this.payAmount = info.payAmount
                        _this.payMemberNum = info.payMemberNum
                        _this.payOrderNc = info.payOrderNc
                        _this.payOrderNum = info.payOrderNum
                        _this.rAmount = info.rAmount
                        _this.vaOrderNum = info.vaOrderNum
                    }
                })
                this.cNum = ''
            },
            getlistBootm(){
                const _this = this
                const params = {
                    storeId:this.name,
                    monthTime:'',
                    startTime:'',
                    endTime:''
                }
                $.ajax({
                    type: 'POST',
                    dataType: 'json',
                    url: baseUrl + "/api/admin/mallStatistics/findMallMakeUpStatistics",
                    data: JSON.stringify(params),
                    contentType: 'application/json;charset=utf-8',
                    success: function (data) {
                        console.log(data)
                        const info = data.data
                        _this.goodsNumPla = info.goodsNumPla
                        _this.goodsNumWx = info.goodsNumWx
                        _this.goodsPayMoneyPla = info.goodsPayMoneyPla
                        _this.goodsPayMoneyWx = info.goodsPayMoneyWx
                        _this.idenNumPla = info.idenNumPla
                        _this.idenNumWx = info.idenNumWx
                        _this.idenPayMoneyPla = info.idenPayMoneyPla
                        _this.idenPayMoneyWx = info.idenPayMoneyWx
                        _this.drawPieChart()
                        _this.drawPieChartR()
                    }
                })
            },
            // 折线图
            drawColumnChart() {
                this.chartColumn = echarts.init(document.getElementById('chartColumn'));
                this.chartColumn.setOption({
                    title: { text: '' },
                    tooltip: {},
                    legend: {
                        data:['提现总金额','成交额总数','成交商品总数','成交额平均值']
                    },
                    xAxis: {
                        type : 'category',
                        boundaryGap : false,
                        data: ['一', '二', '三', '四', '五', '六', '七', '八', '九']
                    },
                    yAxis: {
                        type : 'value'
                    },
                    series:[
                            {
                                name: '3的指数',
                                type: 'line',
                                data: [1, 3, 9, 27, 81, 247, 741, 2223, 6669]
                            },
                            {
                                name: '2的指数',
                                type: 'line',
                                data: [1, 2, 4, 8, 16, 32, 64, 128, 256]
                            },
                            {
                                name: '1/2的指数',
                                type: 'line',
                                data: [1/2, 1/4, 1/8, 1/16, 1/32, 1/64, 1/128, 1/256, 1/512]
                            }
                        ]
                });
            },
            // 饼图
            drawPieChart() {
                this.chartPie = echarts.init(document.getElementById('chartPie'));
                this.chartPie.setOption({
                    title: {
                        text: '平台',
                        x: 'center'
                    },
                    tooltip: {
                        trigger: 'item',
                        formatter: "{a} <br/>{b} : {c} ({d}%)"
                    },
                    legend: {
                        orient: 'vertical',
                        left: 'left',
                         data:['身份数量','身份付款金额','商品数量','商品付款金额']
                    },
                    series: [
                        {
                            name: '访问来源',
                            type: 'pie',
                            radius: '55%',
                            center: ['50%', '60%'],
                            data:[
                                {value:this.idenNumPla, name:'身份数量'},
                                {value:this.goodsPayMoneyPla, name:'身份付款金额'},
                                {value:this.goodsNumPla, name:'商品数量'},
                                {value:this.idenPayMoneyPla, name:'商品付款金额'}
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
            drawPieChartR() {
                this.chartPieRight = echarts.init(document.getElementById('chartPieRight'));
                this.chartPieRight.setOption({
                    title: {
                        text: '微信',
                        x: 'center'
                    },
                    tooltip: {
                        trigger: 'item',
                        formatter: "{a} <br/>{b} : {c} ({d}%)"
                    },
                    legend: {
                        orient: 'vertical',
                        left: 'left',
                         data:['身份数量','身份付款金额','商品数量','商品付款金额']
                    },
                    series: [
                        {
                            name: '访问来源',
                            type: 'pie',
                            radius: '55%',
                            center: ['50%', '60%'],
                            data:[
                                {value:this.idenNumWx, name:'身份数量'},
                                {value:this.idenPayMoneyWx, name:'身份付款金额'},
                                {value:this.goodsNumWx, name:'商品数量'},
                                {value:this.goodsPayMoneyWx, name:'商品付款金额'}
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
            }
        },
        mounted: function () {
            this.getTransaction()
            this.getlist()
            this.getlistBootm()
            this.drawColumnChart()
        }
    }
</script>