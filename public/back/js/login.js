$(function () {
    /*
   * 1. 进行表单校验配置
   *    校验要求:
   *        (1) 用户名不能为空, 长度为2-6位
   *        (2) 密码不能为空, 长度为6-12位
   * */
    $("#form").bootstrapValidator({
        feedbackIcons: {
            valid: 'glyphicon glyphicon-ok',
            invalid: 'glyphicon glyphicon-remove',
            validating: 'glyphicon glyphicon-refresh'
        },
        fields: {
            username: {
                validators: {
                    notEmpty: {
                        message: '用户名不能为空'
                    },
                    stringLength: {
                        min: 2,
                        max: 6,
                        message: '用户名长度必须在2到6之间'
                    },
                    callback: {
                        message: '用户名不存在'
                    }
                }
            },
            password: {
                validators: {
                    notEmpty: {
                        message: '密码不能为空'
                    },
                    stringLength: {
                        min: 6,
                        max: 12,
                        message: '密码长度必须在6到12之间'
                    },
                    callback: {
                        message: '密码错误'
                    }
                }
            }
        }
    })
    /* 
    2. 使用 submit 按钮, 会进行表单提交, 此时表单校验插件会立刻进行校验
       (1) 校验成功, 此时会默认提交, 发生页面跳转,  注册表单校验成功事件, 在事件中阻止默认的跳转提交, 通过ajax提交
       (2) 校验失败, 自动拦截提交

      注册表单校验成功事件, 在事件委托中阻止默认的提交, 通过ajax提交
  */
 $("#form").on('success.form.bv', function (e) {
    e.preventDefault();
    //使用ajax提交逻辑
    $.ajax({
        type: "post",
        url: "/employee/employeeLogin",
        data: $('#form').serialize(),  // $('#form').serialize(),  获取表单里所有的内容
        dataType: 'json',
        success: function (info) {
            if (info.error === 1000) {
                // alert('用户名不存在!');
                // $(form).data('bootstrapValidator')
                // .updateStatus(field, 'NOT_VALIDATED')
                // .validateField(field);

                $('#form').data('bootstrapValidator').updateStatus('username', 'INVALID','callback')
            }
            if (info.error === 1001 ) {
                // alert('密码错误');
                $('#form').data('bootstrapValidator').updateStatus('password', 'INVALID','callback')
            }
            if (info.success) {
                location.href = 'index.html';
            }
        }
    })
});

// $(form).data('bootstrapValidator').resetForm();
// 表单重置
// resetForm(false) 只重置状态
// resetForm(true)  重置内容和状态
    $('[type="reset"]').click(function () {  //利用属性选择器[]
        console.log(111);
        
        $("#form").data('bootstrapValidator').resetForm();
})
})