<template>
  <section>
    <!--工具条-->
    <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
      <el-form :inline="true" :model="filters">
        <span class="demonstration">开始时间：</span>
        <el-date-picker v-model="value1" type="datetime" placeholder="选择日期时间">
        </el-date-picker>
        <span class="demonstration">结束时间：</span>
        <el-date-picker v-model="value2" type="datetime" placeholder="选择日期时间">
        </el-date-picker>
        <el-select v-model="value" placeholder="操作内容">
            <el-option v-for="item in list" :label="item.label" :value="item.value">
            </el-option>
        </el-select>
        <el-form-item>
          <el-input v-model="filters.name" placeholder="操作人"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" v-on:click="getUsers">查询</el-button>
        </el-form-item>
        <!-- <el-form-item>
          <el-button type="primary" @click="handleAdd">新增</el-button>
        </el-form-item> -->
      </el-form>
    </el-col>

    <!--列表-->
    <el-table :data="table" border highlight-current-row v-loading="listLoading" style="width: 100%;min-width: min-width:1080px;">
      <el-table-column type="index" label="序号">
      </el-table-column>
      <el-table-column prop="number" label="操作类型">
      </el-table-column>
      <el-table-column prop="name" label="操作内容">
      </el-table-column>
      <el-table-column prop="user_name" label="操作人手机号">
      </el-table-column>
      <el-table-column prop="loan" label="操作人">
      </el-table-column>
      <el-table-column prop="loan_number" label="操作时间">
      </el-table-column>
    </el-table>

    <!--工具条-->
    <el-col :span="24" class="toolbar">
      <!-- <el-button type="danger" @click="batchRemove" :disabled="this.sels.length===0">批量删除</el-button> -->
      <el-pagination layout="prev, pager, next" @current-change="handleCurrentChange" :page-size="20" :total="total" style="float:right;">
      </el-pagination>
    </el-col>

    <!--编辑界面-->
    <el-dialog title="编辑" v-model="editFormVisible" :close-on-click-modal="false">
      <el-form :model="editForm" label-width="80px" :rules="editFormRules" ref="editForm">
        <el-form-item label="姓名" prop="name">
          <el-input v-model="editForm.name" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="性别">
          <el-radio-group v-model="editForm.sex">
            <el-radio class="radio" :label="1">男</el-radio>
            <el-radio class="radio" :label="0">女</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="年龄">
          <el-input-number v-model="editForm.age" :min="0" :max="200"></el-input-number>
        </el-form-item>
        <el-form-item label="生日">
          <el-date-picker type="date" placeholder="选择日期" v-model="editForm.birth"></el-date-picker>
        </el-form-item>
        <el-form-item label="地址">
          <el-input type="textarea" v-model="editForm.addr"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click.native="editFormVisible = false">取消</el-button>
        <el-button type="primary" @click.native="editSubmit" :loading="editLoading">提交</el-button>
      </div>
    </el-dialog>

    <!--新增界面-->
    <el-dialog title="新增" v-model="addFormVisible" :close-on-click-modal="false">
      <el-form :model="addForm" label-width="80px" :rules="addFormRules" ref="addForm">
        <el-form-item label="姓名" prop="name">
          <el-input v-model="addForm.name" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="性别">
          <el-radio-group v-model="addForm.sex">
            <el-radio class="radio" :label="1">男</el-radio>
            <el-radio class="radio" :label="0">女</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="年龄">
          <el-input-number v-model="addForm.age" :min="0" :max="200"></el-input-number>
        </el-form-item>
        <el-form-item label="生日">
          <el-date-picker type="date" placeholder="选择日期" v-model="addForm.birth"></el-date-picker>
        </el-form-item>
        <el-form-item label="地址">
          <el-input type="textarea" v-model="addForm.addr"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click.native="addFormVisible = false">取消</el-button>
        <el-button type="primary" @click.native="addSubmit" :loading="addLoading">提交</el-button>
      </div>
    </el-dialog>
  </section>
</template>

<script>
  import util from '../../common/js/util'
  //import NProgress from 'nprogress'
  import { getUserListPage, removeUser, batchRemoveUser, editUser, addUser } from '../../api/api';

  export default {
    data() {
      return {
        value:'',
        value1:'',
        value2:'',
        value3:'',
        value4:'',
        list:[{
          value:'选项1',
          label:'审核商品'
        },{
          value:'选项2',
          label:'轮播管理'
        },{
          value:'选项3',
          label:'60s管理'
        },{
          value:'选项4',
          label:'人气爆款'
        },{
          value:'选项5',
          label:'热门活动'
        },{
          value:'选项6',
          label:'楼层管理'
        },{
          value:'选项7',
          label:'活动管理'
        },{
          value:'选项8',
          label:'活动代码'
        },{
          value:'选项9',
          label:'活动楼层'
        },{
          value:'选项10',
          label:'活动商品'
        },{
          value:'选项11',
          label:'抽奖管理'
        },{
          value:'选项12',
          label:'奖品管路'
        },{
          value:'选项13',
          label:'品牌管理'
        }
        ,{
          value:'选项14',
          label:'一级类目'
        },{
          value:'选项15',
          label:'二级类目'
        },{
          value:'选项16',
          label:'功效管理'
        },{
          value:'选项17',
          label:'商家管理'
        },{
          value:'选项18',
          label:'cms管理'
        },{
          value:'选项19',
          label:'app精选单品'
        },{
          value:'选项20',
          label:'每周新款'
        },{
          value:'选项21',
          label:'用户管理'
        },{
          value:'选项22',
          label:'账户管理'
        },{
          value:'选项23',
          label:'日志查询'
        }],
        filters: {
          name: ''
        },
        users: [],
        total: 0,
        page: 1,
        listLoading: false,
        sels: [],//列表选中列

        editFormVisible: false,//编辑界面是否显示
        editLoading: false,
        editFormRules: {
          name: [
            { required: true, message: '请输入姓名', trigger: 'blur' }
          ]
        },
        //编辑界面数据
        editForm: {
          id: 0,
          name: '',
          sex: -1,
          age: 0,
          birth: '',
          addr: ''
        },

        addFormVisible: false,//新增界面是否显示
        addLoading: false,
        addFormRules: {
          name: [
            { required: true, message: '请输入姓名', trigger: 'blur' }
          ]
        },
        //新增界面数据
        addForm: {
          name: '',
          sex: -1,
          age: 0,
          birth: '',
          addr: ''
        },
        table:[{
          id:"001",
          number:"18709829122",
          name:"胡红",
          user_name:"4分",
          loan:" 抵押标 【东阳】大众抵押标，感谢支持！（续）",
          loan_number:"450000元",
          min_company:"-",
          interest_rate:"10%",
          data_qx:"1个月",
          time:"2017-04-01 12:12:00",
          toubiao:"0元",
          fs_time:"",
          yhkje:"0元",
          syhkje:"545111元",
          state:"等待初审"
        },{
          id:"001",
          number:"18709829122",
          name:"胡红",
          user_name:"4分",
          loan:" 抵押标 【东阳】大众抵押标，感谢支持！（续）",
          loan_number:"450000元",
          min_company:"-",
          interest_rate:"10%",
          data_qx:"1个月",
          time:"2017-04-01 12:12:00",
          toubiao:"0元",
          fs_time:"",
          yhkje:"0元",
          syhkje:"545111元",
          state:"等待初审"
        }]
      }
    },
    methods: {
      //性别显示转换
      formatSex: function (row, column) {
        return row.sex == 1 ? '男' : row.sex == 0 ? '女' : '未知';
      },
      handleCurrentChange(val) {
        this.page = val;
        this.getUsers();
      },
      //获取用户列表
      getUsers() {
        let para = {
          page: this.page,
          name: this.filters.name
        };
        this.listLoading = true;
        //NProgress.start();
        getUserListPage(para).then((res) => {
          this.total = res.data.total;
          this.users = res.data.users;
          this.listLoading = false;
          //NProgress.done();
        });
      },
      //删除
      handleDel: function (index, row) {
        this.$confirm('确认删除该记录吗?', '提示', {
          type: 'warning'
        }).then(() => {
          this.listLoading = true;
          //NProgress.start();
          let para = { id: row.id };
          removeUser(para).then((res) => {
            this.listLoading = false;
            //NProgress.done();
            this.$message({
              message: '删除成功',
              type: 'success'
            });
            this.getUsers();
          });
        }).catch(() => {

        });
      },
      //显示编辑界面
      handleEdit: function (index, row) {
        this.editFormVisible = true;
        this.editForm = Object.assign({}, row);
      },
      //显示新增界面
      handleAdd: function () {
        this.addFormVisible = true;
        this.addForm = {
          name: '',
          sex: -1,
          age: 0,
          birth: '',
          addr: ''
        };
      },
      //编辑
      editSubmit: function () {
        this.$refs.editForm.validate((valid) => {
          if (valid) {
            this.$confirm('确认提交吗？', '提示', {}).then(() => {
              this.editLoading = true;
              //NProgress.start();
              let para = Object.assign({}, this.editForm);
              para.birth = (!para.birth || para.birth == '') ? '' : util.formatDate.format(new Date(para.birth), 'yyyy-MM-dd');
              editUser(para).then((res) => {
                this.editLoading = false;
                //NProgress.done();
                this.$message({
                  message: '提交成功',
                  type: 'success'
                });
                this.$refs['editForm'].resetFields();
                this.editFormVisible = false;
                this.getUsers();
              });
            });
          }
        });
      },
      //新增
      addSubmit: function () {
        this.$refs.addForm.validate((valid) => {
          if (valid) {
            this.$confirm('确认提交吗？', '提示', {}).then(() => {
              this.addLoading = true;
              //NProgress.start();
              let para = Object.assign({}, this.addForm);
              para.birth = (!para.birth || para.birth == '') ? '' : util.formatDate.format(new Date(para.birth), 'yyyy-MM-dd');
              addUser(para).then((res) => {
                this.addLoading = false;
                //NProgress.done();
                this.$message({
                  message: '提交成功',
                  type: 'success'
                });
                this.$refs['addForm'].resetFields();
                this.addFormVisible = false;
                this.getUsers();
              });
            });
          }
        });
      },
      selsChange: function (sels) {
        this.sels = sels;
      },
      //批量删除
      batchRemove: function () {
        var ids = this.sels.map(item => item.id).toString();
        this.$confirm('确认删除选中记录吗？', '提示', {
          type: 'warning'
        }).then(() => {
          this.listLoading = true;
          //NProgress.start();
          let para = { ids: ids };
          batchRemoveUser(para).then((res) => {
            this.listLoading = false;
            //NProgress.done();
            this.$message({
              message: '删除成功',
              type: 'success'
            });
            this.getUsers();
          });
        }).catch(() => {

        });
      }
    },
    mounted() {
      this.getUsers();
    }
  }

</script>

<style scoped>

</style>