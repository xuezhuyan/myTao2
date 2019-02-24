$(function () {
    // 一进入页面就发送ajax请求
    var currentPage = 1; //当前页面
    var pageSize = 5; // 每页条数
    render();
    function render() {
        $.ajax({
            type: 'get',
            url: '/category/querySecondCategoryPaging',
            data: {
                page: currentPage,
                pageSize: pageSize
            },
            dataType: 'json',
            success: function (info) {
                console.log(info);
                var htmlStr = template('secon4dTpl', info);
                $('tbody').html(htmlStr);

                // 实现分页插件的初始化
                $('#paginator').bootstrapPaginator({
                    // 版本号
                    bootstrapMajorVersion: 3,
                    // 当前页
                    currentPage: info.page,
                    // 总页数
                    totalPages: Math.ceil(info.total / info.size),
                    // 给页码添加点击事件
                    onPageClicked: function (a, b, c, page) {
                        // 更新当前页
                        currentPage = page;
                        // 并且重新渲染
                        render();
                    }
                })
            }
        })
    }
    //2. 点击添加分类按钮, 显示模态框
    $('#addBtn').click(function () {
        // 显示模态框
        $('#addModal').modal('show');
        // 发送请求,获取一级分类的全部数据,将来用于渲染
        // 根据已有的接口, 模拟获取全部的数据的接口, page:1  pageSize: 100
        $.ajax({
            type: 'get',
            url: '/category/queryTopCategoryPaging',
            data: {
                page: 1,
                pageSize: 100
            },
            dataType: 'json',
            success: function (info) {
                var htmlStr = template('dropdownTpl', info);
                $('.dropdown-menu').html(htmlStr);
            }
        })
    });
    // 3. 给下拉菜单添加可选功能
    $('.dropdown-menu').on('click', 'a',function () {
        // 获取 a 的文本
        var txt = $(this).text();
        // 设置给  button 按钮
        $('#dropdownText').text(txt);
    })
})