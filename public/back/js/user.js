$(function () {
    // 已进入页面就发送ajax请求
    // template(模板id, 数据对象)  返回一个 htmlStr
    var currentPage = 1; //当前页
    var pageSize = 5; // 每页条数
    var currentId;  // 标记当前正在编辑的用户的id
    var isDelete;   // 标记修改用户的状态
    render();
    function render() {
        $.ajax({
            type: 'get',
            url: '/user/queryUser',
            data: {
                page: currentPage,
                pageSize: pageSize,
            },
            dataType:'json',
            success: function (info) {
                var htmlStr = template('tpl', info);
                $('tbody').html(htmlStr);


                // 分页
                // 根据请求回来的数据, 完成分页的初始化
                $("#paginator").bootstrapPaginator({
                    bootstrapMajorVersion: 3,//默认是2，如果是bootstrap3版本，这个参数必填
                    currentPage: info.page,//当前页
                    totalPages: Math.ceil(info.total / info.size),//总页数
                    onPageClicked:function(a, b, c,page){
                        
                      //为按钮绑定点击事件 page:当前点击的按钮值
                      currentPage = page;
                      render()
                    }
                  });
            }
        })
    }
    // 2. 点击表格中的按钮  显示模态框
    // 事件委托
    //        1. 给动态的元素绑定事件
    //        2. 批量绑定点击事件
    // 思路: 使用事件委托绑定按钮点击事件
    $('tbody').on('click', '.btn', function () {
        // 显示模态框
        $('#userModal').modal('show');
        // 获取id
        currentId = $(this).parent().data('id');
        // 获取按钮的状态
        // 有btn-danger类 => 禁用按钮
        isDelete = $(this).hasClass('btn-danger') ? 0 : 1;
    });
    
    // 给模态框的确定按钮添加点击事件
    $('#confirmBtn').click(function () {
        // 发送ajax请求, 完成用户状态的编辑
        // 传参需要两个id  isDelete
        $.ajax({
            type: 'post',
            url: '/user/updateUser',
            data: {
                id: currentId,
                isDelete: isDelete
            },
            dataType: 'json',
            success: function (info) {
                console.log(info);
                if(info.success) {
                    // 关闭模态框
                    $('#userModal').modal('hide');
                    // 重新调用  render()  重新渲染
                    render();
                }
            }
        })
    })
})