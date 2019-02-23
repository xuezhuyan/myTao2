// 前端不知道当前用户的登陆状态,但是后天知道
// 前端一般可以发送ajax请求, 去检测用户的登陆状态, 如果未登录,进行拦截,拦截到登录页

$.ajax({
    type: 'get',
    url: '/employee/checkRootLogin',
    dataType: 'json',
    success: function (info) {
        if (info.error === 400) {
            location.href = 'login.html';
        }
    }
})