'use strict';
const db = require('./db');
const bcrypt = require('bcrypt');




// Get Products
function productsReturned(rows){
    return rows.map((row) => ({
        id: row.Id,
        farmerId: row.FarmerId,
        name: row.Name,
        description: row.Description,
        quantity: row.Quantity,
        state: row.State,
        typeId: row.TypeId,
        pricePerUnit: row.PricePerUnit,
        imagePath: row.Path,
        farmer: {
            name: row.FarmerName,
            surname: row.Surname,
        },
        ExpiringDate: row.ExpiringDate
    })
    );
}

exports.getProducts = (date) => {
    return new Promise(async (resolve, reject) => {
        var sqlQuery = 'SELECT Products.* ,ProductImages.Path,Users.Name as FarmerName ,Users.Surname  From Products,ProductImages,Users WHERE ProductImages.ProductId==Products.Id AND Users.Id=Products.FarmerId AND ProductImages.IsDefault==1 AND ExpiringDate > ?';
        //FOR PAGINATION: var sqlQuery = 'SELECT Products.* ,ProductImages.Path,Users.Name as FarmerName ,Users.Surname  From Products,ProductImages,Users WHERE ProductImages.ProductId==Products.Id AND Users.Id=Products.FarmerId AND   ProductImages.IsDefault==1 LIMIT 10  OFFSET "' + pageNumber + '"';
        db.all(sqlQuery, [date],(err, rows) => {

            if (err) {
                reject(err);
                return;
            }
            const products = productsReturned(rows);
            resolve(products);
        });

    });
};

exports.getProductsByDate = (date) => {
    return new Promise(async (resolve, reject) => {
        var sqlQuery = 'SELECT Products.* ,ProductImages.Path,Users.Name as FarmerName ,'
        +'Users.Surname  From Products,ProductImages,Users WHERE ProductImages.ProductId==Products.Id '
        +'AND Users.Id=Products.FarmerId AND ProductImages.IsDefault==1 AND ExpiringDate > ?';
        //FOR PAGINATION: var sqlQuery = 'SELECT Products.* ,ProductImages.Path,Users.Name as FarmerName ,Users.Surname  From Products,ProductImages,Users WHERE ProductImages.ProductId==Products.Id AND Users.Id=Products.FarmerId AND   ProductImages.IsDefault==1 LIMIT 10  OFFSET "' + pageNumber + '"';
        db.all(sqlQuery, [date], (err, rows) => { //NOSONAR
            if (err) {
                reject(err);
                return;
            }
            const products =  productsReturned(rows);
            resolve(products);
        });

    });
};
// Get Products Test
exports.getProducts1 = () => {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT * FROM Products';
        db.all(sql, [], (err, rows) => {
            if (err) {
                reject(err);
                return;
            }
            const products = rows.map((e) => ({ Id: e.Id, FarmerId: e.FarmerId, Name: e.Name, Description: e.Description, Quantity: e.Quantity, State: e.State, TypeId: e.TypeId, PricePerUnit: e.PricePerUnit }));
            resolve(products);
        });
    });
};
// Get Products By id
exports.getProduct = (id) => {
    var images = [];
    return new Promise((resolve, reject) => {
        const sqlImage = 'SELECT * FROM ProductImages WHERE ProductId = ?';
        db.all(sqlImage, [id], (err, rows) => {
            if (err) {
                reject(err);
                return;
            }
            images = rows.map((row) => ({
                id: row.Id,
                productId: row.ProductId,
                isDefault: row.IsDefault,
                path: row.Path,
            }));

        });
        const sqlProduct = 'SELECT * FROM Products WHERE id = ?';
        db.get(sqlProduct, [id], (err, row) => {
            if (err)
                reject(err);
            else if (row === undefined) {
                resolve(false);
            }
            else {
                const product = {
                    id: row.Id,
                    farmerId: row.FarmerId,
                    name: row.Name,
                    description: row.Description,
                    quantity: row.Quantity,
                    state: row.State,
                    typeId: row.TypeId,
                    pricePerUnit: row.PricePerUnit,
                    images: images
                };

                resolve(product);
            }
        });
    });
};
// Get Types
exports.getTypes = () => {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT Id, TypeName FROM ProductTypes'
        db.all(sql, (err, rows) => {
            if (err) {
                reject(err);
                return;
            }
            const types = rows.map((row) => ({
                id: row.Id,
                typeName: row.TypeName
            })
            );
            resolve(types);
        });
    });
}
// Get ProductByType
exports.getProductsByType = (typeId, date) => {
    return new Promise((resolve, reject) => {
        const sql = `SELECT Products.* ,ProductImages.Path,Users.Name as FarmerName ,Users.Surname  From Products,ProductImages,Users 
                    WHERE ProductImages.ProductId==Products.Id AND Users.Id=Products.FarmerId AND ProductImages.IsDefault==1 AND Products.TypeId = ? AND ExpiringDate > ?`;
        db.all(sql, [typeId, date], (err, rows) => { //NOSONAR
            if (err) {
                reject(err);
                return;
            }
            const products =  productsReturned(rows);
            resolve(products);
        });
    });
}

// get product by State and FarmerId
exports.listFarmerProd = (farmerId, state) => {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT * FROM Products WHERE FarmerId = ? AND State = ?';
        db.all(sql, [farmerId, state], (err, rows) => { //NOSONAR
            if (err) {
                reject(err);
                return;
            }

            const products = rows.map((e) => ({Id:e.Id, FarmerId: e.FarmerId, Name: e.Name, Description: e.Description,Quantity: e.Quantity,State:e.State,TypeId:e.TypeId,PricePerUnit:e.PricePerUnit}));

            resolve(products);
        });
    });
};

exports.createProduct = (product) => {
    return new Promise((resolve, reject) => {
        const sql = 'INSERT INTO Products(FarmerId, Name, Description,Quantity,State,TypeId,PricePerUnit,ExpiringDate) VALUES(?,?,?,?,?,?,?,?)';
        db.run(sql, [product.FarmerId, product.Name, product.Description,product.Quantity,product.State,product.TypeId,product.PricePerUnit,product.ExpiringDate], function (err) {
            if (err) {
                reject(err);
                return;
            }
            resolve();
        });
    });
};

// update product state
exports.updateProductState = (State, Id) => {
    return new Promise((resolve, reject) => {
        const sql = 'UPDATE Products SET State=? WHERE Id = ?';
        db.run(sql, [State, Id], function (err) { //NOSONAR
            if (err) {
                reject(err);
                return;
            }
            resolve();
        });
    });
};

// add a new product image
exports.createImage = (image) => {
    return new Promise((resolve, reject) => {
        const sql = 'INSERT INTO ProductImages(Id, ProductId, IsDefault, Path) VALUES(?, ?, ?, ?)';
        db.run(sql, [ image.id, image.id, 1, image.path], function (err) { //NOSONAR
            if (err) {
                reject(err);
                return;
            }
            resolve();
        });
    });
};
exports.updateProduct = (Quantity, Id, Name, Description, PricePerUnit, TypeId) => {
    return new Promise((resolve, reject) => {
        const sql = 'UPDATE Products SET Quantity=?, Name=?, Description=?, PricePerUnit=?, TypeId=? WHERE Id =? ';
        db.run(sql, [Quantity, Name, Description, PricePerUnit, TypeId, Id], function (err) { //NOSONAR
            if (err) {
                reject(err);
                return;
            }
            resolve();
        });
    });
};

exports.updateProductQuantity = (Quantity, Id) => {
    return new Promise((resolve, reject) => {
        const sql = 'UPDATE Products SET Quantity=? WHERE Id =? ';
        db.run(sql, [Quantity, Id], function (err) { //NOSONAR
            if (err) {
                reject(err);
                return;
            }
            resolve();
        });
    });
};