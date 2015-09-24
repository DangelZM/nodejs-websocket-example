var request = require('request');

function getData(io) {
  var currencies = [
    '"AUDUSD"',
    '"EURGBP"',
    '"EURUSD"',
    '"GBPUSD"',
    '"NZDUSD"',
    '"USDCAD"',
    '"USDCHF"',
    '"USDJPY"',
    '"USDRUB"',
    '"USDTRY"'
  ].join(',');

  var apiUrl = 'https://query.yahooapis.com/v1/public/yql?q=select * from yahoo.finance.xchange where pair in (' + currencies + ')&format=json&env=store://datatables.org/alltableswithkeys';

  request({
    url: apiUrl
  }, function(error, response, body) {
    console.log(JSON.parse(body));
    var resultBody = JSON.parse(body);

    if(resultBody.query && resultBody.query.results){
      io.sockets.emit('message', resultBody.query.results.rate);
    } else {
      console.log('No results');
    }

    setTimeout(function () {
      getData(io);
    }, 300);
  });

}

module.exports = function (server) {
  var io = require('socket.io')(server);
  io.on('connection', function(socket){
    console.log('connected');
    socket.on('disconnect', function(){
      console.log('disconnected');
    });
  });

  getData(io);
};