<template>
  <section>
    <!--列表-->
    <!-- <el-table :data="orderInformation" border highlight-current-row v-loading="listLoading" style="width: 100%;min-width: 1080px;">
      <el-table-column type="index">
      </el-table-column>
      <el-table-column prop="courierNumber" label="配置">
      </el-table-column>
      <el-table-column label="操作">
        <template scope="scope">
           <el-switch v-model="value1" on-text="" on-color="#13ce66" off-text=""></el-switch>
        </template>
      </el-table-column>
    </el-table -->
    <el-col :span="8" style="margin-top: 40px;">
        <el-col :span="24" style="margin-left: 166px;margin-bottom: 20px;">
            <el-col :span="6" style="margin-top: 6px;">订单自动收货时间：</el-col>
            <el-col :span="8"><el-input v-model="table.receiptDay" auto-complete="off"></el-input></el-col>
            <el-col :span="1" style="margin-top: 6px;margin-left: 5px;">天</el-col>
        </el-col>
        <el-col :span="24" style="margin-left: 166px;margin-bottom: 20px;">
            <el-col :span="6" style="margin-top: 6px;">自动退款日期</el-col>
            <el-col :span="8"><el-input v-model="table.refundDay" auto-complete="off"></el-input></el-col>
            <el-col :span="1" style="margin-top: 6px;margin-left: 5px;">天</el-col>
        </el-col>
        <el-col :span="24" style="margin-left: 166px;margin-bottom: 20px;">
            <el-col :span="6" style="margin-top: 6px;">订单自动取消时间</el-col>
            <el-col :span="8"><el-input v-model="table.cancelHour" auto-complete="off"></el-input></el-col>
            <el-col :span="2" style="margin-top: 6px;margin-left: 5px;">小时</el-col>
        </el-col>
        <el-col :span="24" style="margin-left: 166px;margin-bottom: 20px;">
            <el-col :span="6" style="margin-top: 6px;">订单自动评价时间</el-col>
            <el-col :span="8"><el-input v-model="table.evaluateDay" auto-complete="off"></el-input></el-col>
            <el-col :span="1" style="margin-top: 6px;margin-left: 5px;">天</el-col>
        </el-col>
        <el-col :span="24" style="margin-left: 166px;margin-bottom: 20px;">
            <el-col :span="6" style="margin-top: 6px;">订单收货后维权期</el-col>
            <el-col :span="8"><el-input v-model="table.rightsDay" auto-complete="off"></el-input></el-col>
            <el-col :span="1" style="margin-top: 6px;margin-left: 5px;">天</el-col>
        </el-col>
        <el-col :span="24" style="margin-left: 300px;margin-bottom: 20px;">
            <el-button type="primary" @click="saveBtn">保存</el-button>
        </el-col>
    </el-col>
  </section>
</template>

<script>
  import { state } from '../../vuex/state'
  import util from '../../common/js/util'
  import {baseUrl , editUser, addUser } from '../../api/api';

  export default {
    data() {
      return {
        table:{}
      }
    },
    methods: {
        saveBtn(){
            const _this = this
            let url = baseUrl + "/api/systemConfig/add"
            const params = {
                receiptDay:parseInt(this.table.receiptDay),
                refundDay:parseInt(this.table.refundDay),
                cancelHour:parseInt(this.table.cancelHour),
                evaluateDay:parseInt(this.table.evaluateDay),
                rightsDay:parseInt(this.table.rightsDay)
            }
            if(this.table !== null){
                params.sysId = this.table.sysId
                url = baseUrl + "/api/systemConfig/update"
            }
            console.log(params)

            $.ajax({
                type:'POST',
                dataType:'json',
                url:url,
                contentType:'application/json;charset=utf-8',
                success:function(data){
                    console.log(data)
                    if(data.code !== 1){
                        alert(data.msg)
                    }
                }
            });
        },
        getlist(){
            const _this = this
            $.ajax({
                type:'GET',
                dataType:'json',
                url:baseUrl+"/api/systemConfig/select",
                contentType:'application/json;charset=utf-8',
                success:function(data){
                    console.log(data)
                    _this.table = data.data
                }
            });
        }
    },
    mounted() {
      this.getlist();
    }
  }

</script>