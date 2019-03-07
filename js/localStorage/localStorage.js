//========== localstorage management functions ============//

function localStorageTest(){

    var uid = new Date, storage, result;
    try {
        storage = window.localStorage;
        storage.setItem(uid, uid);
        result = storage.getItem(uid) === uid;
        storage.removeItem(uid);
        return result && storage;
    } catch(e) {
        alert('This application will not function correctly as local storage is disabled or not supported.');
        //exit;
    }
};

function setObject(key, value) {
// puts an object into localstorage
    window.localStorage.setItem(key, JSON.stringify(value));
};

function getObject(key) {
// gets an object from localstorage
    var storage = window.localStorage;
    var value = storage.getItem(key);
    return value && JSON.parse(value);
};

function clearObject(o) {
// removes an object from localstorage
    window.localStorage.clear(o);
};

function clearStorage() {
// removes everything placed in localstorage
    window.localStorage.clear();
};
