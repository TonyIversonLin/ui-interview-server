/**
 * Module that generates fake data
 * 
 * 
 * This module will publish "mockData" events that can be subscribed to using socketcluster-client in the angular App!
 */
module.exports.attach = function (scServer, socket) {
    
    console.log('Initializing Mock Data feed...');

    var mockData = [{
            fundName: "Fund 1",
            pnl: 12345.0,
            cumulativePnl: 100000.00,
            return: 0.05
        },{
            fundName: "Fund 2",
            pnl: -12345.0, 
            cumulativePnl: -10000.00,
            return: -0.01
        }, {
            fundName: "Fund 3", 
            pnl: 2345.0, 
            cumulativePnl: 45670.0,
            return: 0.12
        }];

    var interval = setInterval(function () {
        var dataToPublish = generateMockData(mockData);
        socket.exchange.publish('mockData', dataToPublish , function(err) {
            if (err) { 
                console.log('Failed to publish mock data ' + JSON.stringify(err));
            } else { 
                console.log('Mock data Published: ' + JSON.stringify(dataToPublish));
            }
        });
      }, 1000);

    generateMockData = function(data) { 
        return randomizeData(data);
    };
    
    randomizeData = function(data) { 
        return data.map((datum) => {
            return Object.assign({}, datum, { 
                pnl: parseFloat(datum.pnl + Math.random()*1000).toFixed(2),
                cumulativePnl: parseFloat(datum.cumulativePnl + Math.random()*10000).toFixed(2),
                return: parseFloat(Math.random()).toFixed(2)
            });
        });
    };

    return interval;

};

module.exports.unsubscribe = function(interval) { 
    clearInterval(interval);
};