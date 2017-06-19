
import { clipFragments, historyArr, deleteFragments } from './videoclip-init'

/**
 * @param { Number | String } sT
 * @returns {String}
 */
function toPreTime(sT) {
    const sedTime = typeof sT == 'number' ? sT : parseFloat(sT);

    if (!Number.isInteger(sedTime)) {
        throw new Error(`toPreTime error: sedTime is ${ sT }`);
    }

    function supple(val) {
        val = '' + val;

        if (val.length === 1) {
            val = '0' + val;
        }

        return val;
    }

    const hour = Math.trunc(sedTime / 3600);
    const minute = Math.trunc((sedTime - (hour * 3600)) / 60);
    const second = sedTime % 60;

    if (hour == '00') {
        return `${ supple(minute) }:${ supple(second) }`;
    }

    return `${ supple(hour) }:${ supple(minute) }:${ supple(second) }`;
}

/**
 * @param { String } pT
 * @returns {Number}
 */
function toSedTime(pT) {
    try {
        const timePages = pT.split(':');
        const timePagesLen = timePages.length;
        let rel = 0;

        if (timePagesLen <= 1 || timePagesLen > 3) throw new Error(`toSedTime error: preTime is ${ pT }`);

        for (let p of timePages.keys()) {
            timePages[p] = toInt(timePages[p]);
        }

        if (timePagesLen === 3) {
            rel += toInt(timePages[0] * 3600) + toInt(timePages[1] * 60) + toInt(timePages[2]);
        } else if (timePagesLen === 2) {
            rel += toInt(timePages[0] * 60) + toInt(timePages[1]);
        }

        return rel;

    } catch (err) {
        console.log(err);
        throw new Error(`toSedTime error: ${ err }`);
    }
}

/**
 * @param { Number | String } argumentForCoercion
 * @returns {Number}
 */
function toInt(argumentForCoercion) {
    let coercedNumber = +argumentForCoercion;
    let value = 0;

    if (coercedNumber !== 0 && isFinite(coercedNumber)) {
        value = Math.trunc(coercedNumber);
    }

    return value;
}

/**
 * @param target
 * @param element
 */
function appendElement(target, element) {
    let ele = element;

    if (typeof ele == 'string') {
        const chileNodes = getChildElements(element);
        ele = document.createDocumentFragment();

        for (let childItem of chileNodes) {
            ele.appendChild(childItem);
        }
    }

    target.appendChild(ele);
}

/**
 * @param target
 * @param element
 */
function beforeElement(target, element) {
    if (typeof element == 'string') {
        const fg = document.createDocumentFragment();
        const childNodes = getChildElements(element);

        for (let childItem of childNodes) {
            fg.appendChild(childItem);
        }

        target.parentNode.insertBefore(fg, target);
    } else {
        target.parentNode.insertBefore(element, target);
    }
}

/**
 * @param { Element } ele
 * @returns { Array }
 */
function getChildElements(ele) {
    const div = document.createElement('div');
    div.innerHTML = ele;

    return Array.from(div.childNodes);
}

/**
 * @param { Element } obj
 * @returns { Number | number }
 */
function getAbsLeft(obj) {
    let l = obj.offsetLeft;

    while (obj.offsetParent != null) {
        obj = obj.offsetParent;
        l += obj.offsetLeft;
    }

    return l;
}

/**
 * @param { Number } ct
 * @returns { Number }
 */
function toRealTime(ct) {
    var _index = 0;

    for (let i = 0; i < clipFragments.length; i++) {
        if (ct > clipFragments[i].st && ct <= clipFragments[i].et) {
            _index = i;
            break;
        }
    }

    return ct + clipFragments[_index].over;
}

/**
 * @type {{addPart, removePart, getPart, getLength}}
 */
let vjsHistoryPart = function () {
    return {
        addPart () {
            historyArr.push(Object.assign({}, {
                cg: JSON.parse(JSON.stringify(clipFragments)),
                dg: JSON.parse(JSON.stringify(deleteFragments)),
            }));
        },
        removePart () {
            if (historyArr.length > 1) {
                historyArr.pop();
            }
        },
        getPart () {
            return historyArr.length == 1 ? historyArr[0] : historyArr[historyArr.length - 2];
        },
        getFirstPart () {
            return historyArr[0];
        },
        getLength () {
            return historyArr.length;
        }
    }
}();

/**
 * return { Undefiend }
 */
function saveHistory() {
    //var str = JSON.stringify(historyArr);

    //localStorage.removeItem('history');

    /*localStorage.setItem('history', JSON.stringify({
        history: historyArr,
    }));*/
}

export { toPreTime, toSedTime, toInt, appendElement, beforeElement, getAbsLeft, toRealTime, vjsHistoryPart, saveHistory }

