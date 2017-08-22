<template>
	<el-row class="container">
		<el-col :span="24" class="main">
			<aside :class="collapsed?'menu-collapsed':'menu-expanded'">
				<div style="height: 283px;text-align: center;position: relative;border-bottom: 3px solid #4d6985;">
					<router-link :to="{ name: '主页'}">
						<img src="../assets/logos.png" alt="" style="margin-top: 50px;">
					</router-link>
					<div class="main_login">
						<ul>
							<li>
								<img style="width:50px" src="http://resources.51att.cn/ATTACHMENT/ATTACHMENT/1bccc3cf-8d44-4482-84e1-82d84d56e25c.png">
							</li>
							<li>
								<p>
									<span class="main_login_name">昵称</span>
									<!-- <span class="main_login_write">注销</span> -->
								</p>
								<p style="font-size: 18px;">123456789</p>
							</li>
						</ul>
					</div>
				</div>
				<!--导航菜单-->
				<div style="width: 230px;height: 72%;overflow-y: auto;">
				<el-menu :default-active="$route.path" class="el-menu-vertical-demo el-menu--dark" @open="handleopen" @close="handleclose" @select="handleselect"
					 unique-opened router v-show="!collapsed" style="background: #2a3f54;">
					<template  v-for="(item,index) in $router.options.routes"  v-if="!item.hidden">
						<el-submenu :index="index+''" v-if="!item.leaf">
							<template slot="title"><i :class="item.iconCls"></i>{{item.name}}</template>
							<el-menu-item v-for="child in item.children" :index="child.path" v-if="!child.hidden">{{child.name}}</el-menu-item>
						</el-submenu>
						<el-menu-item v-if="item.leaf&&item.children.length>0" :index="item.children[0].path"><i :class="item.iconCls"></i>{{item.children[0].name}}</el-menu-item>
					</template>
				</el-menu>
				<!--导航菜单-折叠后-->
				<ul class="el-menu el-menu-vertical-demo  collapsed" v-show="collapsed" ref="menuCollapsed" style="background: #2a3f54;">
					<li v-for="(item,index) in $router.options.routes" v-if="!item.hidden" class="el-submenu item">
						<template v-if="!item.leaf">
							<div class="el-submenu__title" style="padding-left: 20px;" @mouseover="showMenu(index,true)" @mouseout="showMenu(index,false)"><i :class="item.iconCls"></i></div>
							<ul class="el-menu submenu" :class="'submenu-hook-'+index" @mouseover="showMenu(index,true)" @mouseout="showMenu(index,false)">
								<li v-for="child in item.children" v-if="!child.hidden" class="el-menu-item" style="padding-left: 40px;" :class="$route.path==child.path?'is-active':''" @click="$router.push(child.path)">{{child.name}}</li>
							</ul>
						</template>
						<template v-else>
							<li class="el-submenu">
								<div class="el-submenu__title el-menu-item" style="padding-left: 20px;height: 56px;line-height: 56px;padding: 0 20px;" :class="$route.path==item.children[0].path?'is-active':''" @click="$router.push(item.children[0].path)"><i :class="item.iconCls"></i></div>
							</li>
						</template>
					</li>
				</ul></div>
			</aside>
			<section class="content-container">
				<el-col :span="24" style="position: fixed;z-index: 9999;top:-10px;border-bottom: 1px solid #ddd;">
						<el-col :span="24" class="header">
							<el-row>
								<el-col :xs="8" :sm="6" :md="4" :lg="4" style="margin-top: 0;">
									<div class="grid-content bg-purple">
										<div class="tools" @click.prevent="collapse">
											<img src="../assets/icon_001.png" alt="" style="vertical-align: middle;">
										</div>
									</div>
								</el-col>
								<el-col :xs="4" :sm="6" :md="14" :lg="15" style="margin-top: 0;text-align: right;">
									<div class="grid-content bg-purple-light">
										<el-dropdown trigger="hover">
										<span class="el-dropdown-link userinfo-inner">
										<!-- <img :src="this.sysUserAvatar" />  -->
										你好:
										{{sysUserName}}</span>
											<el-dropdown-menu slot="dropdown">
												<el-dropdown-item>修改密码</el-dropdown-item>
												<el-dropdown-item>忘记密码</el-dropdown-item>
												<el-dropdown-item divided @click.native="logout">退出登录</el-dropdown-item>
											</el-dropdown-menu>
										</el-dropdown>
									</div>
								</el-col>
							</el-row>
			<!--<el-col :span="10" class="logo" :class="collapsed?'logo-collapse-width':'logo-width'">-->
				<!--吸引力-->
			<!--</el-col>-->
			<!--<el-col :span="24">-->
				<!--<div class="tools" @click.prevent="collapse">-->
					<!--<i class="fa fa-align-justify"></i>-->
				<!--</div>-->
				<!--<div style="float:right;">asd</div>-->
			<!--</el-col>-->
			<!--<el-col :span="14" class="userinfo">-->
				<!--<el-dropdown trigger="hover">-->
					<!--<span class="el-dropdown-link userinfo-inner">-->
					<!--&lt;!&ndash; <img :src="this.sysUserAvatar" />  &ndash;&gt;-->
					<!--你好:-->
					<!--{{sysUserName}}</span>-->
					<!--<el-dropdown-menu slot="dropdown">-->
						<!--<el-dropdown-item>我的消息</el-dropdown-item>-->
						<!--<el-dropdown-item>设置</el-dropdown-item>-->
						<!--<el-dropdown-item divided @click.native="logout">退出登录</el-dropdown-item>-->
					<!--</el-dropdown-menu>-->
				<!--</el-dropdown>-->
			<!--</el-col>-->
		</el-col>
				</el-col>
				<div class="grid-content bg-purple-light" style="padding-left: 20px;margin-top: 50px">
					<el-col :span="24" class="breadcrumb-container">
						<strong class="title">{{$route.name}}</strong>
						<el-breadcrumb separator="/" class="breadcrumb-inner">
							<el-breadcrumb-item v-for="item in $route.matched">
								{{ item.name }}
							</el-breadcrumb-item>
						</el-breadcrumb>
					</el-col>
					<el-col :span="24" class="content-wrapper" style="background: #f7f7f7;">
						<transition name="fade" mode="out-in">
							<router-view></router-view>
						</transition>
					</el-col>
				</div>
			</section>
		</el-col>
		<!-- <el-col :span="24" class="footer">
			<el-row>
				<el-col :span="24">11111</el-col>
			</el-row>
		</el-col> -->
	</el-row>
</template>

<script>
	export default {
		data() {
			return {
				collapsed:false,
				sysUserName: '',
				sysUserAvatar: '',
				form: {
					name: '',
					region: '',
					date1: '',
					date2: '',
					delivery: false,
					type: [],
					resource: '',
					desc: ''
				},
				meunList: [],
				list:[{
					name:'xiangmu1'
				},{
					name:'xiangmu1'
				},{
					name:'xiangmu1'
				},{
					name:'xiangmu1'
				}]
			}
		},
		methods: {
			// 菜单获取
			getMenuList() {
				const _this = this
				const params = {
		              accountId: '1',
		              accessToken: '1'
		        }
		         console.log(params);
			   	$.post("http://192.168.10.18:8080/shangfu-admin-web//backstage/menu/getMenu",
			    { param: JSON.stringify(params) },
			        function(data){
			            const info = eval('(' + data + ')');
			            const resepene = JSON.parse(info)
			            const list = resepene.obj
			            console.log(list)
			            for(var i = 0;i<list.length;i++){
			            	var father = {}
			            	father.name = list[i].name
			            	if(list[i].nodes.length !==0){
		                		var chlid = []
		                		father.children = chlid
		                		_this.menunodes(list[i].nodes,chlid);
		                		_this.meunList.push(father)
		                	}else{
		                		_this.meunList.push(father)
		                	}
			            }
			            console.log(_this.meunList)
			        }
			    );
			},
			menunodes(list,chlid){
				for(var x = 0;x<list.length;x++){
					var childrens = {}
					childrens.name = list[x].name
					if(list[x].nodes.length !== 0){
						var chlids = []
						childrens.children = chlids
						this.menunodes(list[x].nodes,chlids);
					}
					chlid.push(childrens)
				}
			},
			onSubmit() {
				console.log('submit!');
			},
			handleopen() {
				//console.log('handleopen');
			},
			handleclose() {
				//console.log('handleclose');
			},
			handleselect: function (a, b) {
			},
			//退出登录
			logout: function () {
				var _this = this;
				this.$confirm('确认退出吗?', '提示', {
					//type: 'warning'
				}).then(() => {
					sessionStorage.removeItem('user');
					_this.$router.push('/login');
				}).catch(() => {

				});


			},
			//折叠导航栏
			collapse:function(){
				this.collapsed=!this.collapsed;
			},
			showMenu(i,status){
				this.$refs.menuCollapsed.getElementsByClassName('submenu-hook-'+i)[0].style.display=status?'block':'none';
			}
		},
		mounted() {
			var user = sessionStorage.getItem('user');
			if (user) {
				user = JSON.parse(user);
				this.sysUserName = user.name || '';
				this.sysUserAvatar = user.avatar || '';
			}
			// this.getMenuList()
			console.log(this.$router.options.routes)
		}
	}

</script>

<style scoped lang="scss">
	@import '~scss_vars';
	.container {
		position: absolute;
		top: 0px;
		bottom: 0px;
		width: 100%;
		.header {
			height: 60px;
			line-height: 60px;
			background: $color-primarys;
			color:#fff;
			.userinfo {
				text-align: right;
				padding-right: 35px;
				float: right;
				.userinfo-inner {
					cursor: pointer;
					color:#fff;
					img {
						width: 40px;
						height: 40px;
						border-radius: 20px;
						margin: 10px 0px 10px 10px;
						float: right;
					}
				}
			}
			.logo {
				//width:230px;
				height:60px;
				font-size: 22px;
				padding-left:20px;
				padding-right:20px;
				border-color: rgba(238,241,146,0.3);
				border-right-width: 1px;
				border-right-style: solid;
				img {
					width: 40px;
					float: left;
					margin: 10px 10px 10px 18px;
				}
				.txt {
					color:#fff;
				}
			}
			.logo-width{
				width:230px;
			}
			.logo-collapse-width{
				width:60px
			}
			.tools{
				padding: 0px 23px;
				width:14px;
				height: 60px;
				line-height: 60px;
				cursor: pointer;
			}
		}
		.footer {

		}
		.main {
			display: flex;
			/*// background: #324057;*/
			position: absolute;
			top: -10px;
			bottom: 0px;
			overflow: hidden;
			aside {
				flex:0 0 230px;
				width: 230px;
				/*// position: absolute;*/
				/*// top: 0px;*/
				/*// bottom: 0px;*/
				background: $color-header;
				.main_login {
					margin-top: 50px;
					ul , li  {
						list-style-type: none;
						margin: 0;
						padding: 0;
					}
					li {
						display: inline-block;
						vertical-align: middle;
						p {
							margin: 0;
							padding: 0;
						}
					}
					li:first-child span {
						display: block;
						width:41px;
						height:41px;
						border-radius: 50%;
						border: 2px solid  rgba(247,247,247,.5);
					}
					li:last-child {
						width:140px;
						text-align: left;
						padding-left: 10px;
						color: $color-font;
						span {
							vertical-align: bottom;
							display: inline-block;
						}
						.main_login_name {
							font-size: 20px;
							width:100px;
						}
						.main_login_write {
							font-size: 14px;
						}
					}
				}
				.el-menu{
					height: 100%;
				}
				.collapsed{
					width:60px;
					.item{
						position: relative;
					}
					.submenu{
						position:absolute;
						top:0px;
						left:60px;
						z-index:99999;
						height:auto;
						display:none;
					}

				}
			}
			.menu-collapsed{
				flex:0 0 60px;
				width: 60px;
				overflow-y: auto;
			}
			::-webkit-scrollbar {
				-webkit-appearance: none;       /*可去除系统默认的样式*/
				width: 7px;                           /*滚动条宽度*/
			}
			.menu-expanded{
				flex:0 0 230px;
				width: 230px;

				.el-menu {
				}
				/*overflow-y: auto;*/
			}
			.content-container {
				/*// background: #f1f2f7;*/
				flex:1;
			/*	// position: absolute;
				// right: 0px;
				// top: 0px;
				// bottom: 0px;
				// left: 230px;*/
				overflow-y: scroll;
				padding: 20px 20px 20px 0;
				background: #f7f7f7;
				.breadcrumb-container {
					//margin-bottom: 15px;
					.title {
						width: 200px;
						float: left;
						color: #475669;
					}
					.breadcrumb-inner {
						float: right;
					}
				}
				.content-wrapper {
					background-color: #fff;
					box-sizing: border-box;
				}
			}
		}
	}
</style>