export function param(a) {
    var s = [];
    var add = function (k, v) {
        v = typeof v === 'function' ? v() : v;
        v = v === null ? '' : v === undefined ? '' : v;
        s[s.length] = encodeURIComponent(k) + '=' + encodeURIComponent(v);
    };
    var buildParams = function (prefix, obj) {
        var i, len, key;

        if (prefix) {
            if (Array.isArray(obj)) {
                for (i = 0, len = obj.length; i < len; i++) {
                    buildParams(
                        prefix + '[' + (typeof obj[i] === 'object' && obj[i] ? i : '') + ']',
                        obj[i]
                    );
                }
            } else if (Object.prototype.toString.call(obj) === '[object Object]') {
                for (key in obj) {
                    buildParams(prefix + '[' + key + ']', obj[key]);
                }
            } else {
                add(prefix, obj);
            }
        } else if (Array.isArray(obj)) {
            for (i = 0, len = obj.length; i < len; i++) {
                add(obj[i].name, obj[i].value);
            }
        } else {
            for (key in obj) {
                buildParams(key, obj[key]);
            }
        }
        return s;
    };

    return buildParams('', a).join('&');
}

export function getPath(url) {
    let pathRegex = /.+?:\/\/.+?(\/.+?)(?:#|\?|$)/
    let result = url.match(pathRegex)
    return result && result.length > 1 ? result[1] : ''
}

export function getQueryString(url) {
    let arrSplit = url.split('?')
    return arrSplit.length > 1 ? url.substring(url.indexOf('?')+1) : ''
}

export function wait(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

export async function delayWrap(fn, minDelay = 0) {
    let ms = +new Date
    let result = await fn()
    if (+new Date - ms < minDelay) {
        await wait(minDelay - (+new Date - ms))
    }
    return result
}
