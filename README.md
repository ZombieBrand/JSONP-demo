# JSONP跨域请求
## 运行方式
1. 使用node.js执行index.js监听80端口
2. 更改本地hosts文件,映射本地访问为
```
127.0.0.1 cheche.com
127.0.0.1 duowan.com
```
3. 访问[http://cheche.com](http://cheche.com), script会请求`http://duowan.com/duowan.js`

## 具体实现代码
1. 声明封装一个jsonp的函数,并且传入两个参数url和一个随机的Messagexxx,因为防止多次跨域请求得到的资源不会被覆盖.让每一次请求的资源都能够独立的显示.
```javascripy
 function jsonp(url,fn){
  var Message = 'Message'+parseInt(Math.randow()*1000,10)  //生成随机Message
  window[Message] = fn                                     //让这个随机Message是window中的key,这里不使用window.Message主要是因为这个Message是随机每一都不一样.
  var script = document.createElement('script')            //创建一个script标签
  script.src = url+'?callback='+ Message                   //callback是约定俗成的,可以改变为任意参数
  document.head.appendChild(script)                        //利用script的特性,只有在html文档中才会触发请求
 }
```
2. 在duowan.js中放入要被跨域请求的数据
`{{callback}}({"name":"cheche","gender":"male"})`         //{{callback}}是一个占位等待被回调的参数

3. 在后端中需要添加如下代码
```JavaScript
  if(path === "/duowan.js"){
    var string = fs.readFileSync('./duowan.js','utf-8')
    var callback = query.callback                         //利用?查询字符串调取callback的值,这个值就是Message看上边步骤1
    response.setHeader('Content-Type','charset=utf-8')    
    response.end(string.replace('{{callback}}',callback)) //替换string字符串中的{{callback}}为callback,它的值又是Message,Message在window中它的值是function(data){}
  }
```
4. 在前端执行jsonp函数
```JavaScript
  jsonp('http://duowan.com',function(data){
    console.log(第一次数据)
    console.log(data)
  })
  jsonp('http://duowan.com',function(data){
    console.log(第二次数据)
    console.log(data)
  })
```
5. 得到响应的数据为Message加随机数的执行函数:Message0323({"name":"cheche","gender":"male"})
```
  第一次的数据
  {"name":"cheche","gender":"male"}
  第二次的数据
  {"name":"cheche","gender":"male"}
  
```

## jQuery也有同样的函数实现JSONP
```JavaScript
  $.ajax({
    url:"http://duowan.com/duowan.js"
    dataType:'jsonp'
    success:function(data){
      console.log('第一次执行')
      console.log(data)
    }
    
  })
```
