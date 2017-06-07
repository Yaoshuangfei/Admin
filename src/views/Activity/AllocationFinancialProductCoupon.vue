<template>
	<section>
		<el-row :gutter="20">
		  	<el-col :xs="24" :md="12">
		  		<el-col :xs="24" :md="24">
			  		<h4>{{ coupon.title }}</h4>
	  			</el-col>
	  			<el-col :xs="24" :md="24">
			  		<p>此券共分派 {{ coupon.out_count }} 张， 剩余 {{ coupon.left_count }} 张， 每人限制分派 {{ coupon.every_count }} 张</p>
	  			</el-col>
		  		<el-col :xs="24" :md="24">
			  		<label>每人分派数量:</label>
			  		<el-input v-model="assign_count" placeholder=""></el-input>
	  			</el-col>
	  			<el-col :xs="24" :md="24" class="margin_top">
			  		<el-button type="info" size="small" @click='allCheckTrue' v-if="isSelect === false">全选</el-button>
		  			<el-button type="info" size="small" @click='allCheckFalse' v-else>取消</el-button>
		  			<el-button type="info" size="small" @click='saveAssignment'>分派</el-button>
	  			</el-col>
	  			<el-col :xs="24" :md="24">
			  		<label>业务员列表:</label>
			  		<el-input v-model="booksearchtext" :fetch-suggestions="querySearchAsync" @select="handleSelect" placeholder="请输入业务员名字">
			  			<el-button slot="prepend" icon="search"></el-button>
			  		</el-input>
	  			</el-col>
	  			<el-col :xs="24" :md="24">
			  		<ul class="box_height">
			  			<!-- <li v-for="employee in employee_list | conditions">
        					<input type="checkbox" :id="employee.id" :value="employee.id" v-model="check_list">
        					<label :for="employee.id">{{ employee.realname }}</label>
			  			</li> -->
			  			<li v-for="employee in employee_list">
        					<input type="checkbox" :id="employee.id" :value="employee.id" v-model="check_list">
        					<label :for="employee.id">{{ employee.realname }}</label>
			  			</li>
			  		</ul>
	  			</el-col>
	  		</el-col>
		  	<el-col :xs="24" :md="12">
		  		<el-row :gutter="20">
			  		<el-col :xs="12" :md="12">
			  			<span>状态</span>
		  			</el-col>
		  			<el-col :xs="12" :md="12">
		  				<span>信息</span>
		  			</el-col>
		  		</el-row>
		  		<el-row :gutter="20">
			  		<el-col :xs="12" :md="12">
			  			<span>共发人数</span>
		  			</el-col>
		  			<el-col :xs="12" :md="12">
		  				<span>{{ send_count }}</span>
		  			</el-col>
		  		</el-row>
		  		<el-row :gutter="20">
			  		<el-col :xs="12" :md="12">
			  			<span>成功人数</span>
		  			</el-col>
		  			<el-col :xs="12" :md="12">
		  				<span>{{ success_count }}</span>
		  			</el-col>
		  		</el-row>
		  		<el-row :gutter="20">
			  		<el-col :xs="12" :md="12">
			  			<span>错误人数</span>
		  			</el-col>
		  			<el-col :xs="12" :md="12">
		  				<span>{{ fail_count }}</span>
		  			</el-col>
		  		</el-row>
		  		<el-row :gutter="20">
		  			<el-table :data="error_list" style="width: 100%">
		  		      	<el-table-column prop="username" label="错误人员姓名" width="180">
		  		      	</el-table-column>
		  		      	<el-table-column prop="messages" label="原因">
		  		      	</el-table-column>
		  		    </el-table>
		  		</el-row>
	  		</el-col>
		</el-row>

	</section>
</template>

<script>
	import util from '../../common/js/util'
	//import NProgress from 'nprogress'
	import { getUserListPage, removeUser, batchRemoveUser, editUser, addUser } from '../../api/api';
	const cityOptions = ['嘉兴分公司', '嘉兴分公司', '嘉兴分公司', '嘉兴分公司', '嘉兴分公司', '嘉兴分公司', '嘉兴分公司', '嘉兴分公司'];
	export default {
		data() {
			return {
				get_id: this.$route.params.id,
				coupon: {
                    title: '范丽芳加息券',
                    out_count: 0,
                    left_count: 0,
                    every_count: 0
                },
                assign_count: '',
                employee_list: [{
                    id: "58e5e79a18d68010520c620",
                    realname: "临时帐号29421"
                },{
                    id: "58e5e79a18d68010520c62",
                    realname: "临时帐号294210"
                },{
                    id: "58e5e79a18d68010520c6",
                    realname: "临时帐号294219"
                },{
                    id: "58e5e79a18d68010520c620a",
                    realname: "临时帐号2942100"
                }],
                check_list: [],
                isSelect: false,
                error_list:  [{
                    username: "58e5e79a18d68010520c620",
                    messages: "临时帐号29421"
                },{
                    username: "58e5e79a18d68010520c62",
                    messages: "临时帐号294210"
                },{
                    username: "58e5e79a18d68010520c6",
                    messages: "临时帐号294219"
                },{
                    username: "58e5e79a18d68010520c620a",
                    messages: "临时帐号2942100"
                }],
                fail_count: '',
                success_count: '',
                send_count: '',
                booksearchtext: ''
		    }
		},
		filters: {
			conditions: function (items) {
                const searchRegex = new RegExp(this.booksearchtext, 'i')
                const arr = []
                for (let i = 0, j = items.length; i < j; i++) {
                    if (searchRegex.test(items[i].realname)) {
                        arr.firstLetter = items[i].firstLetter
                        arr.push(items[i])
                    }
                }
                return arr
            }
        },
		methods: {
			querySearchAsync(queryString, cb) {
		        var restaurants = this.restaurants;
		        var results = queryString ? restaurants.filter(this.createStateFilter(queryString)) : restaurants;

		        clearTimeout(this.timeout);
		        this.timeout = setTimeout(() => {
		          cb(results);
		        }, 3000 * Math.random());
	      	},
	      	createStateFilter(queryString) {
		        return (state) => {
		          	return (state.value.indexOf(queryString.toLowerCase()) === 0);
		        };
	      	},
	      	handleSelect(item) {
		        console.log(item);
	      	},
			saveAssignment() {
                if (this.assign_count === '') {
                    this.assign_count = 0
                }
                console.log(this.assign_count)
                this.post_success = 1
                const param = {
                    method: 'allocation_financial_product_coupon',
                    access_token: this.getCookie('access_token'),
                    coupon_id: this.get_id,
                    count: this.assign_count,
                    employee_list: this.check_list
                }
                console.log(this.check_list)
                this.$http.jsonp(`http://${this.url}/webapi/financial_product_coupon`, { params: JSON.stringify(param) }, { jsonp: 'jsoncallback' })
                .then(response => {
                    if (response.status === 200) {
                        if (response.data.code === 200) {
                            console.log(response.data)
                            this.error_list = response.data.value.error_list
                            this.send_count = response.data.value.send_count
                            this.fail_count = response.data.value.fail_count
                            this.success_count = response.data.value.success_count
                            console.log(this.error_list)
                            console.log(this.send_count)
                            console.log(this.fail_count)
                            console.log(this.success_count)
                            this.post_success = 0
                            this.jsonpIdPost()
                        }
                        if (response.data.code === 400) {
                            this.alert(response.data.message)
                            this.post_success = 0
                        }
                        this.juggCode(response.data.code, this.post_success)
                        this.post_success = 0
                    } else if (response.status === 400) {
                        this.alert(response.data.message)
                        this.post_success = 0
                    }
                }, response => {
                    this.alert(response.data.message)
                    this.post_success = 0
                })
            },
            allCheckTrue() {
                this.check_list = []
                this.employee_list.forEach((item) => {
                    this.check_list.push(item.id)
                })
                this.isSelect = true
            },
            allCheckFalse() {
                this.check_list = []
                this.isSelect = false
            }
		},
		mounted() {
			if (this.$route.params.id) {
                console.log(this.$route.params.id)
                this.isEdit = true
            }
		}
	}

</script>

<style lang="scss" scoped>
	.margin_top{
		margin-top: 10px;
	}
	.box_height{
		width: 100%;
        height: 400px;
        overflow: auto;
		float: left;
		padding-left: 0;
		clear: both;
		list-style: none;
		li{
			width: 150px;
			float: left;
		}
	}
</style>