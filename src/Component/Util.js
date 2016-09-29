/**
 * Created by BG236557 on 2016/9/23.
 */
let idCounter = 0;

export let uniqueID = function () {
    return idCounter++ + new Date().getTime() + Math.random();
};

export let empty = function () {
};

export let isObj = function (input) {
    return Object.prototype.toString.call(input) === '[object Object]';
};

export let isArr = function (input) {
    return Object.prototype.toString.call(input) === '[object Array]';
};

export let diff = function (a, b) {
    return a.filter(x => {
        return b.indexOf(x) === -1
    });
};

export let getScrollBarWidth = function () {
    const inner = document.createElement('p');
    inner.style.width = '100%';
    inner.style.height = '200px';

    const outer = document.createElement('div');
    outer.style.position = 'absolute';
    outer.style.top = '0px';
    outer.style.left = '0px';
    outer.style.visibility = 'hidden';
    outer.style.width = '200px';
    outer.style.height = '150px';
    outer.style.overflow = 'hidden';
    outer.appendChild(inner);

    document.body.appendChild(outer);
    const w1 = inner.offsetWidth;
    outer.style.overflow = 'scroll';
    let w2 = inner.offsetWidth;
    if (w1 === w2) w2 = outer.clientWidth;

    document.body.removeChild(outer);

    return w1 - w2;
};

export let extend = function (target) {
    for (let i = 1; i < arguments.length; i++) {
        let source = arguments[i];
        for (let key in source) {
            if (Object.prototype.hasOwnProperty.call(source, key)) {
                target[key] = source[key];
            }
        }
    }
    return target;
};

export let sort = function (arr) {
    let auto = [];
    let left = [];
    let right = [];
    for (let i = 0, len = arr.length; i < len; i++) {
        let item = arr[i].props || arr[i];
        if (item.dataFixed === 'left') {
            left.push(arr[i]);
        } else if (item.dataFixed === 'right') {
            right.push(arr[i]);
        } else {
            auto.push(arr[i]);
        }
    }
    let sorted = left.concat(auto).concat(right);
    return {sorted, left, right}
};