// const cluster = require("cluster");
// const os = require("os");

// const cpucount = os.cpus().length;

// console.log(`Number of CPUs: ${cpucount}`);
// console.log(`Master ${process.pid} is running`);
// cluster.setupPrimary({
// 	exec: `${__dirname}/app.js`,
// });

// for (let i = 0; i < cpucount; i++) {
// 	cluster.fork();
// }

// cluster.on("exit", (worker, code, signal) => {
// 	console.log(`Worker ${worker.process.pid} died`);
// 	cluster.fork();
// });
