/*ajax请求封装
options = {
  url: "",
  method: "",
  data: "",
  success: function(result) {},
  error: function(error) {}
}
*/ 

window.ajax = function (options) {
  options = options || {};
  options.method = options.method || "GET";
  options.data = options.data || {};
  //1.创建XHR对象
  var xhr = new XMLHttpRequest();
  //2.设置监听函数
  xhr.onreadystatechange = function () {
    if (xhr.readyState === 4) {
      if (xhr.status >= 200 && xhr.status < 300) {
        options.success(JSON.parse(xhr.responseText));
      }
      else {
        options.error(JSON.parse(xhr.responseText));      
      }
    }
  }
  //3.调用open()建立连接
  xhr.open(options.method,options.url,true);
  //4.发送数据
  if (options.method === "POST" || options.method === "PUT") {
    xhr.setRequestHeader("Content-type","application/json");
    xhr.send(JSON.stringify(options.data));
  }
  xhr.send(options.data);
}