function transformIfDefined<ItemType, CallbackReturnType>(item: ItemType | void, cb: (item: ItemType) => CallbackReturnType) {
    if (item) {
        return cb(item);
    } else {
        return item;
    }
}

export {
    transformIfDefined
};