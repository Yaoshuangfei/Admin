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
                    <el-date-picker v-model="value" type="month" placeholder="选择月">
                    </el-date-picker>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="getlist">查询</el-button>
                    <el-button type="primary">导出数据</el-button>
                </el-form-item>
            </el-form>
        </el-col>
        <el-col :span="24" style="">
            <el-col :span="24">
                <div id="chartColumnTop" style="width:100%; height:650px;"></div>
            </el-col>
            <el-col :span="24" v-if="yyeShow">
                <el-col :span="4">营业额增长情况</el-col>
            </el-col>
             <el-col :span="24" v-if="yyeShow">
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
                name:0,
                value:'',
                options:[],
                chartColumn: null,
                chartColumnTop:null,
                topList:[],
                list:[],
                topTitle:[],
                bottomTitle:[],
                yyeShow:true
            }
        },
        methods: {
            getlist(){
                const _this = this
                _this.bottomTitle = []
                _this.topTitle = []
                if(this.name === 0){
                    this.yyeShow = false
                }else{
                    this.yyeShow = true
                }
                const params = {
                    storeId:this.name,
                    dateDay:''
                }
                console.log(this.value)
                if(this.value !== '' && this.value !== undefined){
                    const y = this.value.getFullYear()
                    const m = this.value.getMonth() + 1
                    params.dateDay =  y +'-' + m
                }
                console.log(params)
                $.ajax({
                    type: 'POST',
                    dataType: 'json',
                    url: baseUrl + "/api/admin/mallStatistics/storeMemberStatistics",
                    data: JSON.stringify(params),
                    contentType: 'application/json;charset=utf-8',
                    success: function (data) {
                        console.log(data)
                        if(data.code === 1){
                            const info = data.data.list
                            const infos = data.data.yyeList
                            const arry = []
                            for (var i = 0; i < info.length; i++) {
                               arry.push(info[i].memberNum)
                               _this.topTitle.push(info[i].dateDay.substring(5))
                            }
                            _this.topList = [{
                                name: '天新增会员',
                                type: 'line',
                                data: arry
                            }]
                            if(infos.length > 0){
                                _this.yyeShow = true
                                const arrys = []
                                for (var i = 0; i < infos.length; i++) {
                                   arrys.push(infos[i].turnover)
                                   _this.bottomTitle.push(infos[i].dateDay.substring(5))
                                }
                                _this.list = [{
                                    name: '天营业额',
                                    type: 'line',
                                    data: arrys
                                }]
                                _this.drawColumnChart()
                            }else{
                                _this.yyeShow = false
                                // _this.list = [{
                                //     name: '天营业额',
                                //     type: 'line',
                                //     data: []
                                // }]
                                // _this.drawColumnChart()
                            }
                            console.log(_this.topList)
                            console.log(_this.list)
                            _this.drawColumnChartTop()
                        }
                    }
                })
            },
            // 折线图 
            drawColumnChartTop() {
                this.chartColumnTop = echarts.init(document.getElementById('chartColumnTop'));
                this.chartColumnTop.setOption({
                    title: { text: '' },
                    tooltip: {},
                    legend: {
                        data:['天新增会员']
                    },
                    xAxis: {
                        type : 'category',
                        boundaryGap : false,
                        data: this.topTitle
                    },
                    yAxis: {
                        type : 'value'
                    },
                    series:this.topList
                });
            },
            drawColumnChart() {
                this.chartColumn = echarts.init(document.getElementById('chartColumn'));
                this.chartColumn.setOption({
                    title: { text: '' },
                    tooltip: {},
                    legend: {
                        data:['天营业额']
                    },
                    xAxis: {
                        type : 'category',
                        boundaryGap : false,
                        data: this.bottomTitle
                    },
                    yAxis: {
                        type : 'value'
                    },
                    series:this.list
                });
            },
            getTransaction(){
                const _this = this
                this.options = [{value:0,label:'平台'}]
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
            }
        },
        mounted: function () {
            this.getTransaction()
            this.getlist()
        }
    }
</script>