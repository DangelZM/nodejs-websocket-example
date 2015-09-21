var request = require('request');
var token = "081D75D074AA4092BD6F7720637B0969";

/*var jsonForTest = [
  {
    "Outcome": "Success",
    "Message": null,
    "Identity": "Request",
    "Delay": 0.0067632,
    "BaseCurrency": "EUR",
    "QuoteCurrency": "USD",
    "Symbol": "EURUSD",
    "Date": "09/18/2015",
    "Time": "8:59:59 PM",
    "QuoteType": "Spot",
    "Bid": 1.1298,
    "Mid": 1.1303,
    "Ask": 1.1308,
    "Spread": 0.001,
    "Text": "1 European Union euro = 1.1303 United States dollars",
    "Source": "SIX Financial Information, Buyer = \"ICAP PLC London, Premium Spot Forex\", Seller = \"ICAP PLC London, Premium Spot Forex\""
  },
  {
    "Outcome": "Success",
    "Message": null,
    "Identity": null,
    "Delay": 0,
    "BaseCurrency": "AUD",
    "QuoteCurrency": "USD",
    "Symbol": "AUDUSD",
    "Date": "09/18/2015",
    "Time": "8:59:59 PM",
    "QuoteType": "Spot",
    "Bid": 0.71673,
    "Mid": 0.71888,
    "Ask": 0.72103,
    "Spread": 0.0043,
    "Text": "1 Australian dollar = 0.71888 United States dollar",
    "Source": "SIX Financial Information, Buyer = \"ICAP PLC London, Premium Spot Forex\", Seller = \"ICAP PLC London, Premium Spot Forex\""
  }
];*/

function getData(socket) {
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



  var apiUrl = 'https://query.yahooapis.com/v1/public/yql?q=select * from yahoo.finance.xchange where pair in (' + currencies + ')&format=json&diagnostics=true&env=store://datatables.org/alltableswithkeys';

  request({
    url: apiUrl
  }, function(error, response, body) {
    //console.log(JSON.parse(body).query.results.rate);
    socket.emit('message', JSON.parse(body).query.results.rate);
    setTimeout(function () {
      getData(socket);
    }, 300);
  });

  /*socket.emit('message', jsonForTest);
  setTimeout(function () {
    getData(socket);
  }, 3000);*/
}

module.exports = function (server) {
  var io = require('socket.io')(server);
  io.on('connection', function(socket){
    console.log('connected');

    getData(socket);

  });
};