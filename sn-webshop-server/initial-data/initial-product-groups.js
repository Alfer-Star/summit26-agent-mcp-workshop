const db = require('../models');
const initialProductData = require('./initial-products');

const ProductGroup = db.productGroup;
const ProductGroupGalleryItem = db.productGroupGalleryItem;

exports.setupInitialProductGroupGalleryItems = () => {
    ProductGroupGalleryItem.create({
        id: '0',
        imageUrl: 'http://localhost:3000/images/merchandise/mer.png',
    });
    ProductGroupGalleryItem.create({
        id: '1',
        imageUrl: 'http://localhost:3000/images/gadgets/gad.png',
    });
    ProductGroupGalleryItem.create({
        id: '2',
        imageUrl: 'http://localhost:3000/images/trainings/train.png',
    });
    ProductGroupGalleryItem.create({
        id: '3',
        imageUrl: 'http://localhost:3000/images/digitals/dig.png',
    });
};
exports.setupInitialProductGroups = () => {
    ProductGroup.create({
        id: 'MER',
        name_de: 'Merchandise',
        name_en: 'Merchandise',
        imageUrl: 'http://localhost:3000/images/merchandise/mer.png',
    });
    ProductGroup.create({
        id: 'GAD',
        name_de: 'Gadgets',
        name_en: 'Gadgets',
        imageUrl: 'http://localhost:3000/images/gadgets/gad.png',
    });
    ProductGroup.create({
        id: 'TRAIN',
        name_de: 'Trainings',
        name_en: 'Trainings',
        imageUrl: 'http://localhost:3000/images/trainings/train.png',
    });
    ProductGroup.create({
        id: 'DIG',
        name_de: 'Digitale Produkte & Vorlagen',
        name_en: 'Digital products & templates',
        imageUrl: 'http://localhost:3000/images/digitals/dig.png',
    });

    initialProductData.createMerchandiseProducts();
    initialProductData.createGadgetProducts();
    initialProductData.createTrainingProducts();
    initialProductData.createDigitalProducts();
};
