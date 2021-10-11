const http = require('http');
const url = require('url');
const fs = require('fs');

let subscribers = Object.create(null);

// общий обработчик все запросов
function requestListener(req, res) {
  console.log(req.url);
  const urlParsed = url.parse(req.url, true);

  if (urlParsed.pathname === '/') {
    // Тут мы говорим что это антипатерн в nodejs и все нужно писать неблокируещим
    const data = fs.readFileSync('index.html');
    console.log(data);
    res.writeHeader(200, {'Content-Type': 'text/html','Content-Length': data.length});
    res.write(data);
    return res.end("200");
  }

  if (urlParsed.pathname === '/index.js') {
    const data = fs.readFileSync('index.js');
    console.log(data);
    res.writeHeader(200, {'Content-Type': 'text/html','Content-Length': data.length});
    res.write(data);
    return res.end("200");
  }

  if (urlParsed.pathname == '/subscribe') {
    console.log('subscribe')
    const id = Math.random();

    subscribers[id] = res;

    req.on('close', function() {
      delete subscribers[id];
    });
    return;
  }
}

// создаем сервер и передаем функцию слушатель всех запросов
http.createServer(requestListener).listen(8080);

// слушаем изменение в файлах
fs.watch('./index.html', (event, fileName) => {
  hadleFileChange(fileName);
});
fs.watch('./index.js', (event, fileName) => {
  hadleFileChange(fileName);
});

function hadleFileChange(fileName) {
  console.log('handle file change');
  for (let id in subscribers) {
    let res = subscribers[id];
    res.end(fileName);
  }
  subscribers = Object.create(null);
}