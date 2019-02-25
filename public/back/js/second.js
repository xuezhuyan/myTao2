/*
1. 发送ajax请求, 把从后天请求回来的数据动态的渲染到页面上
2. 在ajax成功回调函数中插入分页插件
3. 给按钮添加点击事件, 显示模态框
4. 显示模态框的同时, 发送ajax请求, 获取所有馆的数据, 动态渲染到下拉菜单中
5. 把下拉菜单的内容, 添加给button按钮


*/



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
                var htmlStr = template('secondTpl', info);
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
                console.log(info);
                
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

        // 点击下拉菜单框 选中的类id， 设置给隐藏域
        var id = $(this).data('id');
        console.log(id);
        
        // 设置给隐藏域  
        // 1. 在下面ajax中 $("#form").serialize(); 把隐藏域中input的 id值传给后台
        // 2. 后台接收到id值,查找对应的categoryName类名, 页面刷新后渲染到表单页面中
        $('[name="categoryId"]').val( id );
        // 只要给隐藏域赋值了, 此时校验状态应该更新程成功
        $('#form').data('bootstrapValidator').updateStatus('categoryId', 'VALID');

    })


    // 4. 完成文件上传初始化
    $("#fileupload").fileupload({
        dataType:"json",
        //e：事件对象
        //data：图片上传后的对象，通过data.result.picAddr可以获取上传后的图片地址
        done:function (e, data) {
          console.log(data);
          // 后台返回的结果  result
          var result = data.result;
          // 获取返回的图片路径
          var picUrl = result.picAddr;
          // 将拿到后台的路径 设置给 img 的 src
          $('#imgBox img').attr('src', picUrl);
          // 把路径赋值给隐藏域 
          $('[name="brandLogo"]').val(picUrl);
          // 只要隐藏域有值了, 就是更新成成功的状态
          $('#form').data('bootstrapValidator').updateStatus('brandLogo', 'VALID');
        }
  });


  // 5. 直接进行校验
  $('#form').bootstrapValidator({
    //1. 指定不校验的类型，默认为[':disabled', ':hidden', ':not(:visible)'],可以不设置
    excluded: [],
  
    //2. 指定校验时的图标显示，默认是bootstrap风格
    feedbackIcons: {
      valid: 'glyphicon glyphicon-ok',
      invalid: 'glyphicon glyphicon-remove',
      validating: 'glyphicon glyphicon-refresh'
    },
  
    //3. 指定校验字段
    fields: {
      //校验用户名，对应name表单的name属性
      categoryId: {
        validators: {
          //不能为空
          notEmpty: {
            message: '请选择一级分类'
          },
        }
      },
      brandName: {
        validators: {
          //不能为空
          notEmpty: {
            message: '请输入二级分类名称'
          },
        }
      },
      brandLogo: {
        validators: {
          //不能为空
          notEmpty: {
            message: '请选择图片'
          },
        }
      }
    }
  });


  // 6. 注册表单校验成功事件, 阻止默认的提交, 通过ajax提交
  $('#form').on('success.form.bv', function (e) {
      e.preventDefault();
      $.ajax({
          type: 'post',
          url: '/category/addSecondCategory',
          data: $("#form").serialize(),
          dataType: 'json',
          success: function ( info ) {
              console.log(info);
              console.log(1);
              if (info.success) {
                  // 添加成功  关闭模态框
                  $("#addModal").modal('hide');
                  // 页面重新渲染到第一页
                  currentPage = 1;
                  render();
                  console.log('你好');
                  
                  // 将表单元素重置
                  $("#form").data('bootstrapValidator').resetForm(true);
                  // button 和 img 不是表单元素, 需手动重置
                  $('#dropdownText').text('请选择一级分类');
                  $("#imgBox img").attr('src', '');
              }
          }
      })
  })

  $('#noAdd').on('click', function () {
    $("#form").data('bootstrapValidator').resetForm(true);
    // button 和 img 不是表单元素, 需手动重置
    $('#dropdownText').text('请选择一级分类');
    $("#imgBox img").attr('src', '');
  })
})