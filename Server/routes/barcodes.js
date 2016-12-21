'use strict';

const express = require('express');
const router = express.Router();
const barcodeModel = require('../models/barcode');


router.get('/pages/add', (req, res) => {
    res.render('add', {
        title: 'Add a product barcode'
    });
});

router.get('/pages/success', (req, res) => {
    res.render('success', {
        title: 'Product successfully added'
    });
});

router.get('/pages/error', (req, res) => {
    res.status(500).render('error', {
        message: 'Something wrong happened',
        error: {
            status: 'Internal Error'
        }
    });
});

router.get('/pages/list', (req, res) => {
    barcodeModel.get((err, entities) => {
        if (!err) {
            return res.render('list', {
                products: entities
            });
        }

        res.redirect('/barcodes/pages/error');
    });
});

router.get('/', (req, res) => {
    barcodeModel.get((err, entities) => {
        if (!err) {
            return res.json({ products: entities });
        }

        res.redirect('/barcodes/pages/error');
    });

});

router.get('/find/:barcode', (req, res) => {
    barcodeModel.find(req.params.barcode, (err, entity) => {
        console.log('err, entity', err, entity);
        if (!err) {
            return res.json(entity);
        }

        res.json(null);
    });
});

router.post('/', (req, res) => {
    let body = req.body;
    if (body.product_name && body.upc) {
        barcodeModel.add(body, (err) => {
            if (!err) {
                return res.redirect('/barcodes/pages/success');
            }

            res.redirect('/barcodes/pages/error');
        });
    }
    else {
        res.redirect('/barcodes/pages/error');
    }
});

module.exports = router;
