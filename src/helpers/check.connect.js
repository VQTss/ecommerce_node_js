const { log } = require('console');
const moongoose = require('mongoose');
const os = require('os')
const _SECONDS = 5000;



// count connetions
const countConnections = () => {
    const connections = moongoose.connections;
    const count = connections.length;
    console.log(`Number of connections: ${count}`);
}

// check overload connections
const checkOverLoad = () => {
    setInterval (() => {
        const numConnections = moongoose.connect.length;
        const numCores = os.cpus().length;
        const memoryUsage = process.memoryUsage.rss;

        const maxConnections = numCores * 5;

        console.log(`Active connections: ${numConnections}`);
        console.log(`Memory usage: ${(memoryUsage / 1024 / 1024)} MB`);

        if (numConnections > maxConnections) {
            console.log(`Connections overload detected!`);
        }


    }, _SECONDS);
}


module.exports = {
    countConnections,
    checkOverLoad
}