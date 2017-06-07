import Login from './views/Login.vue'
import NotFound from './views/404.vue'
import Home from './views/Home.vue'
import Main from './views/Main.vue'
import { state } from './vuex/state'
/*标的管理Subject*/
import subjectCheckPending from './views/Subject/subjectCheckPending.vue'
import subjectChecked from './views/Subject/subjectChecked.vue'
import subjectList from './views/Subject/subjectList.vue'
import subjectRecord from './views/Subject/subjectRecord.vue'
import subjectPlanList from './views/Subject/subjectPlanList.vue'
import subjectPlanRecord from './views/Subject/subjectPlanRecord.vue'
import transferRecord from './views/Subject/transferRecord.vue'
import pending from './views/Subject/pending.vue'
import examine from './views/Subject/examine.vue'
import see from './views/Subject/see.vue'
import addPlan from './views/Subject/addPlan.vue'

/*财务管理 Finance*/
import withdrawList from './views/Finance/withdrawList.vue'
import withdrawFinishedList from './views/Finance/withdrawFinishedList.vue'
import withdrawPlayinList from './views/Finance/withdrawPlayinList.vue'
import checkList from './views/Finance/checkList.vue'
import usedRecord from './views/Finance/usedRecord.vue'
import investRecord from './views/Finance/investRecord.vue'

/*投资人管理 Investor*/
import investorList from './views/Investor/investorList.vue'
import scoreList from './views/Investor/scoreList.vue'
import invitation from './views/Investor/invitation.vue'

/*资讯管理Article*/
import articleList from './views/Article/articleList.vue'
import addArticle from './views/Article/addArticle.vue'
import newsList from './views/Article/newsList.vue'
import advertisementManagement from './views/Article/advertisementManagement.vue'
import carPCouselManagementApp from './views/Article/carPCouselManagementApp.vue'
import menuManagement from './views/Article/menuManagement.vue'
import bankManagement from './views/Article/bankManagement.vue'
import carouselManagementPC from './views/Article/carouselManagementPC.vue'

/*活动管理 Activity*/
import onlineCoupon from './views/Activity/onlineCoupon.vue'
import packageList from './views/Activity/packageList.vue'
import sendPackage from './views/Activity/sendPackage.vue'
import underlineCoupon from './views/Activity/underlineCoupon.vue'
import underlineCouponAdd from './views/Activity/underlineCouponAdd.vue'
import AllocationFinancialProductCoupon from './views/Activity/AllocationFinancialProductCoupon.vue'
import messageSend from './views/Activity/messageSend.vue'
import messageTemplate from './views/Activity/messageTemplate.vue'
import appMessagePush from './views/Activity/appMessagePush.vue'
import sourceManage from './views/Activity/sourceManage.vue'
import dataStatistics from './views/Activity/dataStatistics.vue'
import mallList from './views/Activity/mallList.vue'
import exchangeRecord from './views/Activity/exchangeRecord.vue'

/*理财产品 Product*/
import productList from './views/Product/productList.vue'
import productAdd from './views/Product/productAdd.vue'
import producRecordtList from './views/Product/producRecordtList.vue'
import unmatchProductList from './views/Product/unmatchProductList.vue'

/*统计管理 Statistics*/
import statistics from './views/Statistics/statistics.vue'

/*系统设置 System*/
import department from './views/System/department.vue'
import menu from './views/System/menu.vue'
import role from './views/System/role.vue'
import account from './views/System/account.vue'
import editPassword from './views/System/editPassword.vue'
import operationLog from './views/System/operationLog.vue'



import user from './views/Subject/user.vue'
    console.log(state.loginID)

let routes = [
    {
        path: '/login',
        component: Login,
        name: '',
        hidden: true
    },
        //{ path: '/main', component: Main },
    {
        path: '/Subject',
        component: Home,
        name: ' 标的管理',
        iconCls: 'el-icon-message',//图标样式class
        children: [
            { path: '/main', component: Main, name: '主页', hidden: true },
            { path: '/subjectCheckPending', component: subjectCheckPending, name: '待审核标的列表' },
            { path: '/subjectChecked', component: subjectChecked, name: '已审核标的列表' },
            { path: '/pending/:borrowId/', component: pending, name: '审核标的', hidden: true},
            { path: '/pending/:borrowId/:subjectId/', component: pending, name: '查看或发布标的', hidden: true},
            // { path: '/pending/:borrowId/:subjectId/', component: pending, name: '发布标的', hidden: true},
            { path: '/pending/:borrowId/:subjectId/:checked/', component: pending, name: '查看已审核标的', hidden: true},
            { path: '/subjectList', component: subjectList, name: '标的管理列表' },
            { path: '/subjectRecord', component: subjectRecord, name: '标的购买记录' },
            { path: '/subjectPlanList', component: subjectPlanList, name: '蜜蜂计划管理列表' },
            { path: '/subjectPlanRecord', component: subjectPlanRecord, name: '蜜蜂计划购买记录' },
            { path: '/transferRecord', component: transferRecord, name: '转让标的列表' }
        ]
    },
    {
        path: '/',
        component: Home,
        name: '财务管理',
        iconCls: 'fa fa-bar-chart',
        children: [
            { path: '/withdrawList', component: withdrawList, name: '提现待审核' },
            { path: '/withdrawFinishedList', component: withdrawFinishedList, name: '提现管理' },
            { path: '/withdrawPlayinList', component: withdrawPlayinList, name: '提现打款' },
            { path: '/checkList', component: checkList, name: '付款管理' },
            { path: '/usedRecord', component: usedRecord, name: '资金使用记录' },
            { path: '/investRecord', component: investRecord, name: '投标记录列表' }
        ]
    },
    {
        path: '/',
        component: Home,
        name: '投资人管理',
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
        name: '资讯管理',
        iconCls: 'fa el-icon-picture',
        children: [
            { path: '/articleList', component: articleList, name: '文章列表' },
            { path: '/addArticle/:id', component: addArticle, name: '添加文章' },
            { path: '/newsList/:id', component: newsList, name: '新闻资讯' },
            { path: '/advertisementManagement', component: advertisementManagement, name: 'App开屏广告管理' },
            { path: '/carPCouselManagementApp', component: carPCouselManagementApp, name: 'App轮播图管理' },
            { path: '/menuManagement', component: menuManagement, name: 'App菜单管理' },
            { path: '/carouselManagementPC', component: carouselManagementPC, name: 'PC轮播图管理' },
            { path: '/bankManagement', component: bankManagement, name: '支付银行说明管理' }
        ]
    },
    {
        path: '/',
        component: Home,
        name: '活动管理',
        iconCls: 'fa el-icon-menu',
        children: [
            { path: '/onlineCoupon', component: onlineCoupon, name: '线上理财礼券', hidden: true },
            { path: '/packageList', component: packageList, name: '礼包管理' },
            { path: '/sendPackage', component: sendPackage, name: '发送红包管理' },
            { path: '/underlineCoupon', component: underlineCoupon, name: '线下理财券', hidden: true },
            { path: '/underlineCouponAdd', component: underlineCouponAdd, name: '添加线下理财券', hidden: true },
            { path: '/underlineCouponAdd/:id', component: underlineCouponAdd, name: '修改线下理财券', hidden: true },
            { path: '/AllocationFinancialProductCoupon/:id', component: AllocationFinancialProductCoupon, name: '分派线下理财券', hidden: true },
            { path: '/messageSend', component: messageSend, name: '短信发送管理' },
            { path: '/messageTemplate', component: messageTemplate, name: '短信模板管理' },
            { path: '/appMessagePush', component: appMessagePush, name: 'App消息推送', hidden: true },
            { path: '/sourceManage', component: sourceManage, name: '渠道管理' },
            { path: '/dataStatistics', component: dataStatistics, name: '渠道数据统计' },
            { path: '/mallList', component: mallList, name: '积分商城商品管理' },
            { path: '/exchangeRecord', component: exchangeRecord, name: '积分商城兑换记录' },
        ]
    },
    {
        path: '/',
        component: Home,
        name: '理财管理',
        iconCls: 'fa el-icon-date',
        children: [
            { path: '/productList', component: productList, name: '理财产品管理列表' },
            { path: '/productAdd', component: productAdd, name: '理财产品添加', hidden: true },
            { path: '/productAdd/:id', component: productAdd, name: '理财产品修改', hidden: true },
            { path: '/producRecordtList', component: producRecordtList, name: '理财产品购买记录' },
            { path: '/unmatchProductList', component: unmatchProductList, name: '理财产品未匹配标的列表' }
        ]
    },
    {
        path: '/',
        component: Home,
        name: '',
        iconCls: 'fa fa-address-card',
        leaf: true,//只有一个节点
        children: [
            { path: '/statistics', component: statistics, name: '统计管理' }
        ]
    },
    {
        path: '/',
        component: Home,
        name: '系统设置',
        iconCls: 'el-icon-message',
        children: [
            { path: '/department', component: department, name: '员工管理' },
            { path: '/menu', component: menu, name: '菜单管理' },
            { path: '/role', component: role, name: '组织管理' },
            // { path: '/account', component: account, name: '账号管理' },
            { path: '/editPassword', component: editPassword, name: '修改密码' },
            { path: '/operationLog', component: operationLog, name: '操作日志' }
        ]
    },
    {
        path: '/',
        component: Home,
        name: '',
        iconCls: 'fa fa-bar-chart',
        hidden: true,
        children: [
            { path: '/examine', component: examine},
            { path: '/see', component: see},
            { path: '/addPlan/:id/:index', name:'计划发布', component: addPlan}
        ]
    },
    {
        path: '*',
        hidden: true,
        redirect: { path: '/404' }
    }
];

export default routes;