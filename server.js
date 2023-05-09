const app = require("./src/app");
const mongoose = require('mongoose')
const PORT = process.env.PORT || 3000;

const server = app.listen(PORT, () => {
  console.log(`WSV eCommerce started on port ${PORT}`);
});


process.on('SIGINT', () => {
    server.close(() => {
        mongoose.disconnect();
        console.log('WSV eCommerce terminated');
    }); 
});
