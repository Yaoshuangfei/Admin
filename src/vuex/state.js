// 应用初始状态
export const state = {
    count: 10,
    main: 100,
    loginID: false,
    accountId: '',
    accessToken: '',
    HTTPCODE: {
	    LOGINFAIL: 1000001, //返回值 登录错误
	    SUCCEED: 1000000, //返回值 成功(1)
	    FAIL: 1000100 //返回值 失败(0)
	}
}

