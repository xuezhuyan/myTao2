$(function () {
    // 发送ajax请求, 获取数据, 完成渲染
    var currentPage = 1; //当前页
    var pageSize = 5; // 每页多少条
    render();
    function render() {
        $.ajax({
            type: 'get',
            url: '/category/queryTopCategoryPaging',
            data: {
                page: currentPage,
                pageSize: pageSize
            },
            dataType: 'json',
            success: function (info) {
                var htmlStr = template('firstTpl', info);
                $('tbody').html(htmlStr);

                $("#paginator").bootstrapPaginator({
                    bootstrapMajorVersion: 3,//默认是2，如果是bootstrap3版本，这个参数必填
                    currentPage: info.page,//当前页
                    totalPages: Math.ceil(info.total / info.size),//总页数
                    onPageClicked: function (event, originalEvent, type, page) {
                        //为按钮绑定点击事件 page:当前点击的按钮值
                        currentPage = page;
                        render()
                    }
                });
            }
        })
    }
    // 2. 点击添加分类按钮,显示添加模态框
    $('#addBtn').click(function () {
        // 显示,模态框
        $('#addModal').modal('show');
    });

    // 3. 完成添加校验
    $('#form').bootstrapValidator({
      
        //配置图标
        feedbackIcons: {
          valid: 'glyphicon glyphicon-ok',
          invalid: 'glyphicon glyphicon-remove',
          validating: 'glyphicon glyphicon-refresh'
        },
      
        //3. 指定校验字段
        fields: {
          //校验用户名，对应name表单的name属性
          categoryName: {
            validators: {
              //不能为空
              notEmpty: {
                message: '请输入一级分类名称'
              },
            }
          },
        }
    });


    // 4. 注册表单校验成功事件, 在事件中阻止默认的提交, 通过ajax提交即可
    $('#form').on('success.form.bv', function (e) {
        e.preventDefault(); //阻止默认的提交
        // 通过ajax提交
        $.ajax({
            type: 'post',
            url: '/category/addTopCategory',
            data: $('#form').serialize(),
            dataType: 'json',
            success: function (info) {
                console.log(info);
                if(info.success) {
                    // 说明添加成功
                    // 关闭模态框
                    $('#addModal').modal('hide');
                    // 重新渲染到第一页
                    currentPage = 1;
                    render();


                    // 将表单内容和状态都重置
                    $('#form').data('bootstrapValidator').resetForm(true);
                }
            }
        })
    })


})