/**
 * Validate JSON data
 */
exports.validateJSON = (data, fields) => {
    if (typeof data !== "object") throw "Data must be of type 'object'";
    else if (typeof fields !== "object") throw "Fields must be of type 'object'";

    for (field in fields) {
        if (!data.hasOwnProperty(field)) return false;
        else if (!checkType(data[field], fields[field].type)) {return false;}
        else if (fields[field].type === "array") if (!checkArray(data[field], fields[field].contains)) return false;
        else if (fields[field].type === "object") if (!checkObject(data[field], fields[field].properties)) return false;
    }

    return true;
}

function checkType(value, expected) {
    if (typeof value === "object") {
        if (value.constructor === Array) return "array" === expected;
        else return "object" === expected;
    }
    return typeof value === expected;
}

function checkArray(array, expected) {
    for (e of array) {
        if (!checkType(e, expected.type)) return false;
        else if (expected.type === "array") if (!checkArray(e, expected.contains)) return false;
        else if (expected.type === "object") if (!checkObject(e, expected.properties)) return false;
    }
    return true;
}

function checkObject(object, expected) {
    for (prop in expected) {
        if (!object.hasOwnProperty(prop)) return false;
        else if (!checkType(object[prop], expected[prop].type)) return false;
        else if (expected[prop].type === "array") if (!checkArray(object[prop], expected[prop].contains)) return false;
        else if (expected[prop].type === "object") if (!checkObject(object[prop], expected[prop].properties)) return false;
    }
    return true;
}
