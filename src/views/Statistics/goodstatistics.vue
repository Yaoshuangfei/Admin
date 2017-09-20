<template>
    <section>
    <!--工具条-->
        <el-col :span="24" class="toolbar" style="padding-bottom: 0px;background: #fff">
            <el-form :inline="true">
               <!--  <el-form-item>
                    <el-select v-model="name" clearable>
                      <el-option v-for="item in options" :label="item.label" :value="item.value">
                      </el-option>
                    </el-select>
                </el-form-item> -->
                <el-form-item>
                    <el-button type="primary">导出数据</el-button>
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
                <el-col :span="24" style="height: 60px;line-height: 60px;border-bottom: 1px solid #ccc">
                    <el-col :span="4">个人美妆</el-col>
                    <el-col :span="4">11111</el-col>
                    <el-col :span="4">11111</el-col>
                    <el-col :span="4">11111</el-col>
                    <el-col :span="4">11111</el-col>
                </el-col>
                <el-col :span="24" style="height: 60px;line-height: 60px;">
                    <el-col :span="4">个人美妆</el-col>
                    <el-col :span="4">11111</el-col>
                    <el-col :span="4">11111</el-col>
                    <el-col :span="4">11111</el-col>
                    <el-col :span="4">11111</el-col>
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
                chartPie:null,
                chartPieRight:null
            }
        },
        methods: {
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
                         data:['直接访问','邮件营销','联盟广告','视频广告','搜索引擎']
                    },
                    series: [
                        {
                            name: '访问来源',
                            type: 'pie',
                            radius: '55%',
                            center: ['50%', '60%'],
                            data:[
                {value:335, name:'直接访问'},
                {value:310, name:'邮件营销'},
                {value:234, name:'联盟广告'},
                {value:135, name:'视频广告'},
                {value:1548, name:'搜索引擎'}
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
                         data:['直接访问','邮件营销','联盟广告','视频广告','搜索引擎']
                    },
                    series: [
                        {
                            name: '访问来源',
                            type: 'pie',
                            radius: '55%',
                            center: ['50%', '60%'],
                            data:[
                {value:335, name:'直接访问'},
                {value:310, name:'邮件营销'},
                {value:234, name:'联盟广告'},
                {value:135, name:'视频广告'},
                {value:1548, name:'搜索引擎'}
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
            // this.drawColumnChart()
            this.drawPieChart()
            this.drawPieChartR()
        }
    }
</script>