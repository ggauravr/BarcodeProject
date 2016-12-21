'use strict';

const datastore = require('@google-cloud/datastore')({
    projectId: 'barcodes-152422'
});

exports.get = (callback) => {
    let query = datastore.createQuery('Barcode');

    query.order('product_name');

    datastore.runQuery(query, (err, entities) => {
        callback(err, entities);
    });
};

exports.find = (barcode, callback) => {
    let key = datastore.key(['Barcode', barcode]);

    datastore.get(key, (err, entity) => {
        callback(err, entity);
    });
};

exports.add = (product, callback) => {
    const key = datastore.key(['Barcode', product.upc]);
    let data = {
        upc: product.upc,
        product_name: product.product_name
    };

    datastore.save({
        key: key,
        data: data
    }, (err) => {
        console.log('error', err);
        callback(err);
    });
};
