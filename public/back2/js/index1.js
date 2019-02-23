$(function () {
    $('#form').bootstrapValidator({
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
                        message: '请输入2至6位'
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
                        message: '请输入6至12位'
                    }
                }
            }
        }
    })
});


$("#form").on('success.form.bv', function (e) {
    e.preventDefault();
    //使用ajax提交逻辑
    $.ajax({
        type: 'post',
        url: '/employee/employeeLogin',
        data: $("#form").serialize(),
        dataType: 'json',
        success:function (info) {
            if (info.error === 1000) {
                alert('用户名错误')
            }
            if (info.error === 1001) {
                alert('密码错误')
            }
            if (info.success) {
                location.href = 'login.html'
            }
        }
    })
});