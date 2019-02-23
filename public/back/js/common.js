/*
进度条功能
NProgress.start(); 开始
NProgress.done   结束
*/
/*
ajax 全局事件
.ajaxComplete(fn);  每个ajax完成时,都会调用fn回调函数
.ajaxSuccess(fn);   每个ajax只要成功了, 都会调用fn回调函数
.ajaxError(fn);     每个ajax只要失败了, 都会调用fn回调函数
.ajaxSend(fn);      每个ajax发送前, 都会调用fn回调函数


.ajaxStart(fn);  在第一个ajax开始发送时, 调用fn
.ajaxStop(fn);   在全部的ajax完成时, 调用fn  (不管成功还是失败)


*/

// 在第一个ajax开始发送时, 开启进度条
$(document).ajaxStart(function () {
    // 开启进度条
    
    NProgress.start();
})

// 在全部的ajax完成时, 关闭进度条
$(document).ajaxStop(function () {
    // 模拟网络延迟
    setTimeout(function (params) {
        NProgress.done()
    }, 2000);
})


// 公用的功能

// 1. 左侧二级菜单的切换
// 2. 左侧整体的切换
// 3. 公共的退出的功能

$(function () {
    // 1. 
    $('.nav .category').click(function () {
        // 找下一个兄弟元素,切换显示
        console.log('切换');
        
        $(this).next().stop().slideToggle();
    });
    // 2.
    $('.lt_topbar .icon_menu').click(function () {
        // 让左侧整体菜单切换显示,改左侧菜单left值
        console.log(1111);
        
        $('.lt_aside').toggleClass('hidemenu');
        $('.lt_main .container-fluid').toggleClass('hidemenu');
        $('.lt_topbar').toggleClass('hidemenu');
    })
    // 3. 退出功能
    // 点击菜单按钮,显示一个模态框,询问用户
    $('.lt_topbar .icon_logout').click(function () {
        // 让模态框显示, modal('show')
        $('#logoutModal').modal('show');
    });
    
    // 点击模态框退出按钮,表示确认退出
    // 发送ajax请求, 让服务器端销毁用户的登陆状态
    $('#loginBtn').click(function () {
        $.ajax({
            type: 'get',
            url: '/employee/employeeLogout',
            datatype: 'json',
            success: function (info) {
                // 退出成功, 跳转登录页
                if (info.success) {
                    // 退出成功, 跳转到登陆页
                    location.href = 'login.html';
                }
            }
        })
    })
})

