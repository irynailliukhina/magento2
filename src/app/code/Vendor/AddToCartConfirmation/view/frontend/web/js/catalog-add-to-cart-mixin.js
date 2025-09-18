define(["jquery"], function ($) {
    "use strict";
    return function (widget) {
        return $.widget("mage.catalogAddToCart", widget, {
            options: {
                popupContent: `
                                        <div class="add-to-cart-modal-content">
                                            <div class="modal-subtitle">${$.mage.__(
                                                "You might also like"
                                            )}</div>
                                            <div class="upsale-carousel owl-carousel">
                                                <!-- placeholder -->
                                            </div>
                                        </div>
                                        `,
            },
            /**
             * Handler for the form 'submit' event
             *
             * @param {Object} form
             */
            submitForm: function (form) {
                var self = this;

                let productName = this._getProductName(form);
                //Popup that triggers just before submitting form and requires confirmation to proceed further
                var popup = $('<div class="add-to-cart-modal-popup"/>')
                    .html(this.options.popupContent)
                    .modal({
                        modalClass: "add-to-cart-modal",
                        type: "slide",
                        title: $.mage
                            .__("You added %1 to your shopping cart")
                            .replace("%1", productName),
                        buttons: [
                            {
                                text: $.mage.__("Add to Cart"),
                                class: "action-primary action-accept",
                                click: function () {
                                    this.closeModal();
                                    self._submitFormConfirmed(form);
                                },
                            },
                        ],
                    });

                popup.modal("openModal");
                // Initialize Owl Carousel after modal is open
                require([
                    "Vendor_AddToCartConfirmation/js/upsale-products-carousel",
                ], function (upsaleProductsCarousel) {
                    upsaleProductsCarousel.init(popup.find(".upsale-carousel"));
                });
            },

            _getProductName: function (form) {
                if (document.body.classList.contains("catalog-category-view")) {
                    return form.data("productName");
                } //For product its another fast solution
                if (document.body.classList.contains("catalog-product-view")) {
                    const meta = document.querySelector('meta[name="title"]');
                    return meta ? meta.content.trim() : "";
                }
                return '';
            },

            _submitFormConfirmed: function (form) {
                // 2) Call original submitForm implementation on THIS instance
                // This is equivalent to the original logic that would run if submitForm were invoked normally.
                return widget.prototype.submitForm.call(this, form);
            },
        });
    };
});
