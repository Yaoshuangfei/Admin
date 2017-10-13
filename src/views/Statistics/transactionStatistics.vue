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
                </el-form-item>
                <el-form-item>
                    <el-date-picker v-model="startTime" type="date" placeholder="选择开始日期"></el-date-picker>
                    <el-date-picker v-model="endTime" type="date" placeholder="选择结束日期"></el-date-picker>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="getlist">查询</el-button>
                    <!-- <el-button type="primary">导出数据</el-button> -->
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
                <el-col :span="20">
                    <el-form :inline="true">
                        <el-form-item>
                            <el-select v-model="namebottom" clearable>
                              <el-option v-for="item in options" :label="item.label" :value="item.value">
                              </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item>
                            <el-button type="primary" @click="onMouth">本月</el-button>
                            <el-button type="primary" @click="inMouth">上月</el-button>
                        </el-form-item>
                        <el-form-item>
                            <el-date-picker v-model="bstartTime" type="date" placeholder="选择开始日期"></el-date-picker>
                            <el-date-picker v-model="bendTime" type="date" placeholder="选择结束日期"></el-date-picker>
                        </el-form-item>
                        <el-form-item>
                           <el-button type="primary" @click="getlistBootm">查询</el-button>
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
                                
                name:2,
                namebottom:2,
                options:[],
                chartColumn: null,
                chartPie:null,
                chartPieRight:null,
                plist:[],
                wxlist:[],
                cNum:'',
                startTime:'',
                endTime:'',
                monthTime:'',
                bstartTime:'',
                bendTime:'',
                dataAll:[],
                sjList: [],
                min:'',
                max:''
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
                this.startTime = ''
                this.endTime = ''
                this.getlist()
            },
            zjBtn(){
                this.cNum = 7
                this.startTime = ''
                this.endTime = ''
                this.getlist()
            },
            yBtn(){
                this.cNum = 30
                this.startTime = ''
                this.endTime = ''
                this.getlist()
            },
            getlist(){
                const _this = this
                _this.dataAll = []
                this.sjList = []
                const params = {
                    storeId:this.name,
                    cNum:this.cNum,
                    startTime:'',
                    endTime:''
                }
                if(this.startTime !== ''){
                    const y = this.startTime.getFullYear()
                    const m = this.startTime.getMonth() + 1
                    const d = this.startTime.getDate()
                    params.startTime = y+'-'+ m +'-'+ d
                }
                if(this.endTime !== ''){
                    const _y = this.endTime.getFullYear()
                    const _m = this.endTime.getMonth() + 1
                    const _d = this.endTime.getDate()
                    params.endTime = _y+'-'+ _m +'-'+ _d
                }
                console.log(params)
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

                        const payAmountList = [] //金额
                        const payMemberNumList = [] //人数
                        for (var i = 0; i < info.mallStatisticsDetailsPmnAPa.length; i++) {
                            payAmountList.push(info.mallStatisticsDetailsPmnAPa[i].payAmount) //金额
                            payMemberNumList.push(info.mallStatisticsDetailsPmnAPa[i].payMemberNum)//人数
                            _this.sjList.push(info.mallStatisticsDetailsPmnAPa[i].dateDay.substring(5))
                        }
                        const rateList = [] //成交率
                        for (var i = 0; i < info.mallStatisticsDetailsPmnAPaFinishRate.length; i++) {
                            rateList.push(info.mallStatisticsDetailsPmnAPaFinishRate[i].rate) //成交率
                        }

                        const rateListone = [] //下单转化率
                        for (var i = 0; i < info.mallStatisticsDetailsPmnAPaRate.length; i++) {
                            rateListone.push(info.mallStatisticsDetailsPmnAPaRate[i].rate) //下单转化率
                        }

                        const payOrderNcList = [] //付款件数
                        for (var i = 0; i < info.mallStatisticsDetailsPoNc.length; i++) {
                            payOrderNcList.push(info.mallStatisticsDetailsPoNc[i].payOrderNc) //付款件数
                        }

                        const rAmountList = [] //退款金额
                        for (var i = 0; i < info.mallStatisticsDetailsRa.length; i++) {
                            rAmountList.push(info.mallStatisticsDetailsRa[i].rAmount) //退款金额
                        }
                        _this.dataAll = [
                            {
                                name:'付款金额',
                                type:'line',
                                data:payAmountList
                            },
                            {
                                name:'付款人数',
                                type:'line',
                                data:payMemberNumList
                            },
                            {
                                name:'成交率',
                                type:'line',
                                yAxisIndex: 1,
                                data:rateList
                            },
                            {
                                name:'下单转化率',
                                type:'line',
                                yAxisIndex: 1,
                                data:rateListone
                            },
                            {
                                name:'付款件数',
                                type:'line',
                                data:payOrderNcList
                            },
                            {
                                name:'退款金额',
                                type:'line',
                                data:rAmountList
                            }
                        ]
                        _this.max = 0
                        for (var i = 0; i < payAmountList.length; i++) {
                            if(payAmountList[i] > _this.max){
                                _this.max = payAmountList[i]
                            }
                        }
                        _this.min = payAmountList[0]
                        for (var i = 0; i < payAmountList.length; i++) {
                            if(payAmountList[i] < _this.min ){
                                _this.min = payAmountList[i]
                            }
                        }
                        _this.drawColumnChart()
                    }
                })
                this.cNum = ''
            },
            onMouth(){
                this.bstartTime = ''
                this.bendTime = ''
                const date = new Date()
                const by = date.getFullYear()
                const bm = date.getMonth() + 1
                this.monthTime = by + '-' + bm
                this.getlistBootm()
            },
            inMouth(){
                this.bstartTime = ''
                this.bendTime = ''
                const date = new Date()
                const sy = date.getFullYear()
                const sm = date.getMonth()
                this.monthTime = sy + '-' + sm
                this.getlistBootm()
            },
            getlistBootm(){
                const _this = this
                const params = {
                    storeId:this.namebottom,
                    monthTime:this.monthTime,
                    startTime:'',
                    endTime:''
                }
                if(this.bstartTime !== ''){
                    const y = this.bstartTime.getFullYear()
                    const m = this.bstartTime.getMonth() + 1
                    const d = this.bstartTime.getDate()
                    params.startTime = y+'-'+ m +'-'+ d
                }
                if(this.bendTime !== ''){
                    const _y = this.bendTime.getFullYear()
                    const _m = this.bendTime.getMonth() + 1
                    const _d = this.bendTime.getDate()
                    params.endTime = _y+'-'+ _m +'-'+ _d
                }
                console.log(params)
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
                this.monthTime = ''
            },
            // 折线图
            drawColumnChart() {
                this.chartColumn = echarts.init(document.getElementById('chartColumn'));
                this.chartColumn.setOption({
                    tooltip: {
                        trigger: 'axis',
                        axisPointer: {
                            type: 'cross',
                            crossStyle: {
                                color: '#999'
                            }
                        }
                    },
                    toolbox: {
                        // feature: {
                        //     dataView: {show: true, readOnly: false},
                        //     magicType: {show: true, type: ['line', 'bar']},
                        //     restore: {show: true},
                        //     saveAsImage: {show: true}
                        // }
                    },
                    legend: {
                        data:['付款金额','付款人数','成交率','下单转化率','付款件数','退款金额']
                    },
                    xAxis: [
                        {
                            type: 'category',
                            data: this.sjList,
                            axisPointer: {
                                type: 'shadow'
                            }
                        }
                    ],
                    yAxis: [
                        {
                            type: 'value',
                            name: '金额',
                            min:  this.min,
                            max:  this.max,
                            interval: this.max/10,
                            axisLabel: {
                                formatter: '{value} 元'
                            }
                        },
                        {
                            type: 'value',
                            name: '转化率',
                            min: 0,
                            max: 1,
                            interval: 0.1,
                            axisLabel: {
                                formatter: '{value} %'
                            }
                        }
                    ],
                    series: this.dataAll
                    // [
                    //     {
                    //         name:'下单转化率',
                    //         type:'line',
                    //         data:[2.0, 4.9, 7.0, 23.2, 25.6, 76.7, 135.6, 162.2, 32.6, 20.0, 6.4, 3.3]
                    //     },
                    //     {
                    //         name:'成交率',
                    //         type:'line',
                    //         data:[2.6, 5.9, 9.0, 26.4, 28.7, 70.7, 175.6, 182.2, 48.7, 18.8, 6.0, 2.3]
                    //     },
                    //     {
                    //         name:'付款转化率',
                    //         type:'line',
                    //         yAxisIndex: 1,
                    //         data:[2.0, 2.2, 3.3, 4.5, 6.3, 10.2, 20.3, 23.4, 23.0, 16.5, 12.0, 6.2]
                    //     }
                    // ]
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
                         data:['平台商品数量','微信商品数量']
                    },
                    series: [
                        {
                            name: '访问来源',
                            type: 'pie',
                            radius: '55%',
                            center: ['50%', '60%'],
                            data:[
                                
                                {value:this.goodsNumPla, name:'平台商品数量'},
                                {value:this.goodsNumWx, name:'微信商品数量'}
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
                         data:['微信身份数量','平台身份数量']
                    },
                    series: [
                        {
                            name: '访问来源',
                            type: 'pie',
                            radius: '55%',
                            center: ['50%', '60%'],
                            data:[
                                {value:this.idenNumWx, name:'微信身份数量'},
                                {value:this.idenNumPla, name:'平台身份数量'}
                                
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
            // this.drawColumnChart()
        }
    }
</script>