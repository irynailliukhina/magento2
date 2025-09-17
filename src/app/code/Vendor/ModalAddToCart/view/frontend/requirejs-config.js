var config = {
    deps: [
        'Vendor_ModalAddToCart/js/add-to-cart-modal'
    ],
    config: {
        mixins: {
            "Magento_Catalog/js/catalog-add-to-cart": {
                "Vendor_ModalAddToCart/js/catalog-add-to-cart-mixin": true,
            },
        },
    },
};
