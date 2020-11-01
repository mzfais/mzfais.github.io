const idbPromised = idb.open("football-pocket", 1, function (upgradedDb) {
    if (!upgradedDb.objectStoreNames.contains('fav_clubs')) {
        upgradedDb.createObjectStore("fav_clubs", { keyPath: "id" });
    }
});

const addToFavourite = team => {
    return new Promise((resolve, reject) => {
        idbPromised.then(db => {
            const transaction = db.transaction("fav_clubs", `readwrite`);
            transaction.objectStore("fav_clubs").put(team);
            return transaction;
        }).then(transaction => {
            if (transaction.complete) {
                resolve(true)
            } else {
                reject(new Error(transaction.onerror))
            }
        })
    })
}

const getAll = () => {
    return new Promise((resolve, reject) => {
        idbPromised.then(db => {
            const transaction = db.transaction("fav_clubs", `readonly`);
            return transaction.objectStore("fav_clubs").getAll();
        }).then(data => {
            if (data !== undefined) {
                resolve(data)
            } else {
                reject(new Error("Klub Favorit tidak ditemukann"))
            }
        })
    })
}

const getById = id => {
    return new Promise((resolve, reject) => {
        idbPromised.then(db => {
            const transaction = db.transaction("fav_clubs", `readonly`);
            return transaction.objectStore("fav_clubs").get(id);
        }).then(data => {
            if (data !== undefined) {
                resolve(data)
            } else {
                reject(new Error("Klub Favorit tidak ditemukann"))
            }
        })
    })
}

const deleteFav = clubId => {
    return new Promise((resolve, reject) => {
        idbPromised.then(db => {
            const transaction = db.transaction("fav_clubs", `readwrite`);
            transaction.objectStore("fav_clubs").delete(clubId);
            return transaction;
        }).then(transaction => {
            if (transaction.complete) {
                resolve(true)
            } else {
                reject(new Error(transaction.onerror))
            }
        })
    })
};