const storage = {};

storage.set = (key, object) => {
    sessionStorage[key] = (typeof object) === 'string' ? object : JSON.stringify(object);
}

storage.get = (key) => {
    if (!sessionStorage[key]) {
        return null;
    }

    try {
        const parsed = JSON.parse(sessionStorage[key]);
        return parsed;
    } catch(e) {
        return sessionStorage[key];
    }
}

storage.remove = (key) => {
    if (sessionStorage[key]) {
        sessionStorage.removeItem(key);
    }    
}

export default storage;