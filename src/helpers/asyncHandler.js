// middleware handle error
const asynHandler = (func) => {
    return (req, res, next) => {
        func(req, res, next).catch(next);
    }
}


module.exports = asynHandler;