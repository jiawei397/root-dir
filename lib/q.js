var Q = {};
//增加一个停止链式的方法
var STOP_VALUE = {};//只要外界无法“===”这个对象就可以了
var STOPPER_PROMISE = Promise.resolve(STOP_VALUE);

/**
 * 判断是否函数
 */
var isFunction = function (fn) {
    return Object.prototype.toString.call(fn) === "[object Function]";
};

Promise.prototype.__then__ = Promise.prototype.then;

Q.stop = Promise.stop = function () {
    return STOPPER_PROMISE;//不是每次返回一个新的Promise，可以节省内存
};

Promise.prototype.then = function (onResolved, onRejected) {
    return this.__then__(function (value) {
        return value === STOP_VALUE || (isFunction(onResolved) ? onResolved(value) : onResolved);
    }, onRejected);
};

Q.defer = function () {
    var resolve, reject;
    var promise = new Promise(function () {
        resolve = arguments[0];
        reject = arguments[1];
    });
    return {
        resolve: resolve,
        reject: reject,
        promise: promise
    };
};
Q.reject = Promise.reject;
Q.resolve = Promise.resolve;
Q.isPromise = function (promise) {
    return promise instanceof Promise;
};
Q.denodeify = function (func) {
    if (!isFunction(func)) {
        throw  new Error("this is not a function");
    }
    return function () {
        let args = [].slice.call(arguments);
        var lastArg = args[args.length - 1];
        let defered = Q.defer();
        if (isFunction(lastArg)) {
            args.pop();
            args.push(function (err, result) {
                if (err) {
                    defered.reject(err);
                    return;
                }
                try {
                    lastArg.apply(null, arguments);
                    defered.resolve(result);
                } catch (e) {
                    defered.reject(e);
                }
            })
        } else {
            args.push(function (err, result) {
                if (err) {
                    defered.reject(err);
                    return;
                }
                defered.resolve(result);
            })
        }
        try {
            func.apply(null, args);
        } catch (e) {
            defered.reject(e);
        }
        return defered.promise;
    };
};

module.exports = Q;