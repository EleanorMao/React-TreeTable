'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
/**
 * Created by BG236557 on 2016/9/23.
 */
var idCounter = 0;

var uniqueID = exports.uniqueID = function uniqueID() {
    return idCounter++ + new Date().getTime() + Math.random();
};

var empty = exports.empty = function empty() {};

var isObj = exports.isObj = function isObj(input) {
    return Object.prototype.toString.call(input) === '[object Object]';
};

var isArr = exports.isArr = function isArr(input) {
    return Object.prototype.toString.call(input) === '[object Array]';
};

var diff = exports.diff = function diff(a, b) {
    return a.filter(function (x) {
        return b.indexOf(x) === -1;
    });
};

var getScrollBarWidth = exports.getScrollBarWidth = function getScrollBarWidth() {
    var inner = document.createElement('p');
    inner.style.width = '100%';
    inner.style.height = '200px';

    var outer = document.createElement('div');
    outer.style.position = 'absolute';
    outer.style.top = '0px';
    outer.style.left = '0px';
    outer.style.visibility = 'hidden';
    outer.style.width = '200px';
    outer.style.height = '150px';
    outer.style.overflow = 'hidden';
    outer.appendChild(inner);

    document.body.appendChild(outer);
    var w1 = inner.offsetWidth;
    outer.style.overflow = 'scroll';
    var w2 = inner.offsetWidth;
    if (w1 === w2) w2 = outer.clientWidth;

    document.body.removeChild(outer);

    return w1 - w2;
};

var extend = exports.extend = function extend(target) {
    for (var i = 1; i < arguments.length; i++) {
        var source = arguments[i];
        for (var key in source) {
            if (Object.prototype.hasOwnProperty.call(source, key)) {
                target[key] = source[key];
            }
        }
    }
    return target;
};

var sort = exports.sort = function sort(arr) {
    var auto = [];
    var left = [];
    var right = [];
    for (var i = 0, len = arr.length; i < len; i++) {
        var item = arr[i].props || arr[i];
        if (item.dataFixed === 'left') {
            left.push(arr[i]);
        } else if (item.dataFixed === 'right') {
            right.push(arr[i]);
        } else {
            auto.push(arr[i]);
        }
    }
    var sorted = left.concat(auto).concat(right);
    return { sorted: sorted, left: left, right: right };
};