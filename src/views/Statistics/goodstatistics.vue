<template>
    <section>
    <!--工具条-->
        <el-col :span="24" class="toolbar" style="padding-bottom: 0px;background: #fff">
            <el-form :inline="true">
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
        <el-col :span="24">
            <el-col :span="24" style="text-align: center;font-size: 24px;"><h1>一级分类商品</h1></el-col>
            <el-col :span="24">
                <el-col :span="12"><div id="chartPie" style="width:100%; height:650px;"></div></el-col>
                <el-col :span="12"><div id="chartPieRight" style="width:100%; height:650px;"></div></el-col>
            </el-col>
        </el-col>
        <el-col :span="24"  style="border:1px solid #ddd;text-align: center;">
                <el-col :span="24" style="height: 40px;line-height: 40px;background:#ccc;">
                    <el-col :span="4">分类名称</el-col>
                    <el-col :span="4">销售数量</el-col>
                    <el-col :span="4">数量比例</el-col>
                    <el-col :span="4">销售金额</el-col>
                    <el-col :span="4">金额比例</el-col>
                </el-col>
                <el-col :span="24" style="height: 60px;line-height: 60px;border-bottom: 1px solid #ccc" v-for="item in goodslist">
                    <el-col :span="4">{{item.name}}</el-col>
                    <el-col :span="4">{{item.sellNum}}</el-col>
                    <el-col :span="4">{{(item.sellNum/quantityTotal).toFixed(4)}}</el-col>
                    <el-col :span="4">{{item.sellQuota}}</el-col>
                    <el-col :span="4">{{(item.sellQuota/totalMoneyTotal).toFixed(4)}}</el-col>
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
                startTime:'',
                endTime:'',
                cNum:'',
                name:'',
                totalMoneyTotal:'',
                quantityTotal:'',
                goodslist:[],
                options:[
                    {
                        value:'1',
                        label:'1店'
                    },{
                        value:'2',
                        label:'2店'
                    },{
                        value:'3',
                        label:'3店'
                    },{
                        value:'4',
                        label:'4店'
                    }
                ],
                chartPie:null,
                chartPieRight:null,
                listL:[],
                namesL:[],
                listR:[],
                namesR:[]
            }
        },
        methods: {
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
                _this.listL = []
                _this.namesL = []
                _this.listR = []
                _this.namesR = []
                const params = {
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
                    url: baseUrl + "/api/admin/mallStatistics/commodityStatistics",
                    data: JSON.stringify(params),
                    contentType: 'application/json;charset=utf-8',
                    success: function (data) {
                        console.log(data)
                        const info = data.data
                        _this.totalMoneyTotal = info.totalMoneyTotal
                        _this.quantityTotal = info.quantityTotal
                        _this.goodslist = info.list
                        for (var i = 0; i < info.list.length; i++) {
                            const obj = {}
                            obj.value = info.list[i].sellNum
                            obj.name = info.list[i].name
                            _this.listL.push(obj)
                            _this.namesL.push(info.list[i].name)
                        }
                        for (var i = 0; i < info.list.length; i++) {
                            const objR = {}
                            objR.value = info.list[i].sellQuota
                            objR.name = info.list[i].name
                            _this.listR.push(objR)
                            _this.namesR.push(info.list[i].name)
                        }
                        _this.drawPieChart()
                        _this.drawPieChartR()
                    }
                })
                 this.cNum = ''
            },
            // 饼图
            drawPieChart() {
                this.chartPie = echarts.init(document.getElementById('chartPie'));
                this.chartPie.setOption({
                    title: {
                        text: '销量',
                        x: 'center'
                    },
                    tooltip: {
                        trigger: 'item',
                        formatter: "{a} <br/>{b} : {c} ({d}%)"
                    },
                    legend: {
                        orient: 'vertical',
                        left: 'left',
                         data:this.listL
                    },
                    series: [
                        {
                            name: '访问来源',
                            type: 'pie',
                            radius: '55%',
                            center: ['50%', '60%'],
                            data:this.listL,
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
                        text: '销售额',
                        x: 'center'
                    },
                    tooltip: {
                        trigger: 'item',
                        formatter: "{a} <br/>{b} : {c} ({d}%)"
                    },
                    legend: {
                        orient: 'vertical',
                        left: 'left',
                         data:this.listR
                    },
                    series: [
                        {
                            name: '访问来源',
                            type: 'pie',
                            radius: '55%',
                            center: ['50%', '60%'],
                            data:this.listR,
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
            this.getlist()
            this.drawPieChart()
            this.drawPieChartR()
        }
    }
</script>