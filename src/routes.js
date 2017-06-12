import Login from './views/Login.vue'
import NotFound from './views/404.vue'
import Home from './views/Home.vue'
import Main from './views/Home/indexMain.vue'
import { state } from './vuex/state'
/*系统管理 systemSettings*/
import Jurisdiction from './views/systemSettings/Jurisdiction.vue'
import SystemPush from './views/systemSettings/SystemPush.vue'
import ChangePasswords from './views/systemSettings/ChangePasswords.vue'

/*配置管理 configuration*/
import banner from './views/configuration/banner.vue'
import system from './views/configuration/system.vue'
import BankCard from './views/configuration/BankCard.vue'
import rule from './views/configuration/rule.vue'

/*商品管理 commodity */
import investorList from './views/commodity/investorList.vue'
import scoreList from './views/commodity/scoreList.vue'
import invitation from './views/commodity/invitation.vue'

/*订单管理 order*/
import OrderInformation from './views/order/OrderInformation.vue'
import OrderEvaluation from './views/order/OrderEvaluation.vue'
import ReturnGoods from './views/order/ReturnGoods.vue'

/*店铺管理 shop */
import packageList from './views/shop/packageList.vue'
import sendPackage from './views/shop/sendPackage.vue'
import exchangeRecord from './views/shop/exchangeRecord.vue'

/*财务管理 Finance*/
import WebPipelining from './views/Finance/WebPipelining.vue'
import CellularPhoneReplenishing  from './views/Finance/CellularPhoneReplenishing.vue'
import PersonalFlow from './views/Finance/PersonalFlow.vue'
import ShopFlow from './views/Finance/ShopFlow.vue'
import Donation from './views/Finance/Donation.vue'
import Imazamox from './views/Finance/Imazamox.vue'
import SweepCodeToPayWater from './views/Finance/SweepCodeToPayWater.vue'
import PublicWelfareFundRaising from './views/Finance/PublicWelfareFundRaising.vue'
import MerchantCommission from './views/Finance/MerchantCommission.vue'


// 用户管理 user 
// 扫码付管理 scanCodePayment 
// 慈善公益管理 Charity
// 充值管理 Recharge 

// 网络电话管理 VoIP
import department from './views/VoIP/department.vue'
import menu from './views/VoIP/menu.vue'
import role from './views/VoIP/role.vue'
import account from './views/VoIP/account.vue'
import editPassword from './views/VoIP/editPassword.vue'
import operationLog from './views/VoIP/operationLog.vue'

/*统计管理 Statistics*/
// import statistics from './views/Statistics/statistics.vue'





    console.log(state.loginID)

let routes = [
    {
        path: '/login',
        component: Login,
        name: '',
        hidden: true
    },
     {
        path: '/mian',
        component: Main,
        name: '',
        hidden: true
    },
    // { path: '/main', component: Main },
    {
        path: '/Subject',
        component: Home,
        name: ' 系统设置',
        iconCls: 'el-icon-message',//图标样式class
        children: [
            { path: '/main', component: Main, name: '主页', hidden: true },
            { path: '/Jurisdiction', component: Jurisdiction, name: '权限管理' },
            { path: '/ChangePasswords', component: ChangePasswords, name: '更改密码' },
            { path: '/SystemPush', component: SystemPush, name: '系统推送' }
        ]
    },
    {
        path: '/',
        component: Home,
        name: '配置管理',
        iconCls: 'fa fa-bar-chart',
        children: [
            { path: '/banner', component: banner, name: 'banner管理了' },
            { path: '/system', component: system, name: '系统配置' },
            { path: '/BankCard', component: BankCard, name: '银行卡管理' },
            { path: '/rule', component: rule, name: '规则管理' }
        ]
    },
    {
        path: '/',
        component: Home,
        name: '商品管理',
        iconCls: 'fa fa-id-card-o',
        children: [
            { path: '/investorList', component: investorList, name: '投资人管理列表' },
            { path: '/scoreList', component: scoreList, name: '积分管理' },
            { path: '/invitation', component: invitation, name: '投资人邀请记录' }
        ]
    },
    {
        path: '/',
        component: Home,
        name: '订单管理',
        iconCls: 'fa el-icon-picture',
        children: [
            { path: '/OrderInformation', component: OrderInformation, name: '订单信息管理' },
            { path: '/OrderEvaluation', component: OrderEvaluation, name: '订单评价管理' },
            { path: '/ReturnGoods', component: ReturnGoods, name: '退货管理' }
        ]
    },
    {
        path: '/',
        component: Home,
        name: '店铺管理',
        iconCls: 'fa el-icon-menu',
        children: [
            { path: '/packageList', component: packageList, name: '店铺信息管理' },
            { path: '/sendPackage', component: sendPackage, name: '视频管理' },
            { path: '/exchangeRecord', component: exchangeRecord, name: '违规处理' },
        ]
    },
    {
        path: '/',
        component: Home,
        name: '财务管理',
        iconCls: 'fa el-icon-date',
        children: [
            { path: '/WebPipelining', component: WebPipelining, name: '网站流水报表' },
            { path: '/CellularPhoneReplenishing ', component: CellularPhoneReplenishing , name: '手机充值记录' },
            { path: '/PersonalFlow', component: PersonalFlow, name: '个人流水记录' },
            { path: '/ShopFlow', component: ShopFlow, name: '店铺流水记录' },
            { path: '/Donation', component: Donation, name: '转赠记录' },
            { path: '/Imazamox', component: Imazamox, name: '金豆记录' },
            { path: '/SweepCodeToPayWater', component: SweepCodeToPayWater, name: '扫码付流水记录' },
            { path: '/PublicWelfareFundRaising', component: PublicWelfareFundRaising, name: '公益筹款记录' },
            { path: '/MerchantCommission', component: MerchantCommission, name: '商户手续费记录' }
        ]
    },
    // {
    //     path: '/',
    //     component: Home,
    //     name: '',
    //     iconCls: 'fa fa-address-card',
    //     leaf: true,//只有一个节点
    //     children: [
    //         { path: '/statistics', component: statistics, name: '统计管理' }
    //     ]
    // },
    {
        path: '/',
        component: Home,
        name: '用户管理',
        iconCls: 'el-icon-message',
        children: [
            // { path: '/department', component: department, name: '员工管理' },
            // { path: '/menu', component: menu, name: '菜单管理' },
            // { path: '/role', component: role, name: '组织管理' },
            // { path: '/account', component: account, name: '账号管理' },
            // { path: '/editPassword', component: editPassword, name: '修改密码' },
            // { path: '/operationLog', component: operationLog, name: '操作日志' }
        ]
    },
    {
        path: '/',
        component: Home,
        name: '扫码付管理',
        iconCls: 'el-icon-message',
        children: [
            // { path: '/department', component: department, name: '员工管理' },
            // { path: '/menu', component: menu, name: '菜单管理' },
            // { path: '/role', component: role, name: '组织管理' },
            // { path: '/account', component: account, name: '账号管理' },
            // { path: '/editPassword', component: editPassword, name: '修改密码' },
            // { path: '/operationLog', component: operationLog, name: '操作日志' }
        ]
    },
    {
        path: '/',
        component: Home,
        name: '慈善公益管理',
        iconCls: 'el-icon-message',
        children: [
            // { path: '/department', component: department, name: '员工管理' },
            // { path: '/menu', component: menu, name: '菜单管理' },
            // { path: '/role', component: role, name: '组织管理' },
            // { path: '/account', component: account, name: '账号管理' },
            // { path: '/editPassword', component: editPassword, name: '修改密码' },
            // { path: '/operationLog', component: operationLog, name: '操作日志' }
        ]
    },
    {
        path: '/',
        component: Home,
        name: '充值管理',
        iconCls: 'el-icon-message',
        children: [
            // { path: '/department', component: department, name: '员工管理' },
            // { path: '/menu', component: menu, name: '菜单管理' },
            // { path: '/role', component: role, name: '组织管理' },
            // { path: '/account', component: account, name: '账号管理' },
            // { path: '/editPassword', component: editPassword, name: '修改密码' },
            // { path: '/operationLog', component: operationLog, name: '操作日志' }
        ]
    },
    {
        path: '/',
        component: Home,
        name: '网络电话管理',
        iconCls: 'el-icon-message',
        children: [
            // { path: '/department', component: department, name: '员工管理' },
            // { path: '/menu', component: menu, name: '菜单管理' },
            // { path: '/role', component: role, name: '组织管理' },
            // // { path: '/account', component: account, name: '账号管理' },
            // { path: '/editPassword', component: editPassword, name: '修改密码' },
            // { path: '/operationLog', component: operationLog, name: '操作日志' }
        ]
    },
    {
        path: '/',
        component: Home,
        name: '',
        iconCls: 'fa fa-bar-chart',
        hidden: true,
        children: [
            // { path: '/examine', component: examine},
            // { path: '/see', component: see},
            // { path: '/addPlan/:id/:index', name:'计划发布', component: addPlan}
        ]
    },
    {
        path: '*',
        hidden: true,
        redirect: { path: '/404' }
    }
];

export default routes;