function arrayifyPrimitive(item?: number | string | boolean | (number | string | boolean)[]) {
    if (Array.isArray(item)) {
        return item;
    } else {
        return [item];
    }
}

export {
    arrayifyPrimitive
};