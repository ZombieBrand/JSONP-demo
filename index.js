var http = require('http')
var fs = require('fs')
var url = require('url')

//console.log(Object.keys(http))
var port = process.env.PORT || 80;

var server = http.createServer(function(request, response){

  var temp = url.parse(request.url, true)
  var path = temp.pathname
  var query = temp.query
  var method = request.method

  //从这里开始看，上面不要看
  if(path === '/duowan'){   
    var string = fs.readFileSync('./duowan.html', 'utf8')
    response.setHeader('Content-Type', 'text/html;charset=utf-8')
    response.end(string)
  }else if(path === '/cheche'){  
    var string = fs.readFileSync('./cheche.html', 'utf8')
    response.setHeader('Content-Type', 'text/html;charset=utf-8')
    response.end(string)
  }else if(path === '/duowan.js'){  
    var string = fs.readFileSync('./duowan.js', 'utf8')
    var callback = query.callback
    response.setHeader('Content-Type', 'text/javascript;charset=utf-8')
    response.end(string.replace('{{callback}}',callback))
  }else{  
    response.statusCode = 404
    response.setHeader('Content-Type', 'text/html;charset=utf-8') 
    response.end('找不到对应的路径，你需要自行修改 index.js')
  }

  // 代码结束，下面不要看
  console.log(method + ' ' + request.url)
})

server.listen(port)
console.log('监听 ' + port + ' 成功，打开 http://localhost:' + port)
