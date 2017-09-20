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
                    <el-button type="primary">导出数据</el-button>
                </el-form-item>
            </el-form>
        </el-col>
        <el-col :span="24" style="">
            <el-col :span="24">
                <div id="chartColumnTop" style="width:100%; height:650px;"></div>
            </el-col>
            <el-col :span="24">
                <el-col :span="4">营业额增长情况</el-col>
            </el-col>
             <el-col :span="24">
                <div id="chartColumn" style="width:100%; height:650px;"></div>
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
                name:'',
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
                chartColumn: null,
                chartColumnTop:null
            }
        },
        methods: {
            // 折线图 
            drawColumnChartTop() {
                this.chartColumnTop = echarts.init(document.getElementById('chartColumnTop'));
                this.chartColumnTop.setOption({
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
            }
        },
        mounted: function () {
            this.drawColumnChartTop()
            this.drawColumnChart()
        }
    }
</script>