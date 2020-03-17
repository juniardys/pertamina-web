'use strict'

const data = use('App/Helpers/access_list.json')

const get = () => {
    return data
}

const startsWith = (haystack, needle) => {
    let length = needle.length
    return (haystack.substring(0, length) === needle)
}

const hasChild = (parent) => {
    let result
    Object.keys(data).forEach(function (key) {
        if (startsWith(key, parent + ".")) {
            result = true;
        }
    });

    return (result) ? result : false
}

const getChild = (parent) => {
    let result = []
    Object.keys(data).forEach(function (key) {
        if (parent != key && startsWith(key, parent + ".")) {
            result.push(key)
        }
    });

    return result
}

let hasReaded = [];

const makeTree = (key) => {
    let childern = []
    if (hasChild(key)) {
        let dataChildern = getChild(key)
        dataChildern.forEach(function (child) {
            if (!hasReaded.includes(child)) {
                hasReaded.push(child)
                if (hasChild(child)) {
                    childern.push(makeTree(child))
                } else {
                    childern.push({
                        value: child,
                        label: data[child]
                    })
                }
            }
        });
        return {
            value: key,
            label: data[key],
            children: childern
        }
    } else {
        hasReaded.push(key)
        return {
            value: key,
            label: data[key]
        }
    }
}

const jsTree = () => {
    let result = []
    hasReaded = []
    Object.keys(data).forEach(function (key) {
        if (!hasReaded.includes(key)) {
            result.push(makeTree(key))
        }
    });

    return result
}


module.exports = {
    get,
    startsWith,
    hasChild,
    getChild,
    jsTree
}