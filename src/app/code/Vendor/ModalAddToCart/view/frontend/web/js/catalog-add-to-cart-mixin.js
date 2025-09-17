define([
    "jquery",
    "Magento_Catalog/js/product/view/product-ids-resolver",
], function ($, idsResolver) {
    "use strict";
    return function (widget) {
        $.widget("mage.catalogAddToCart", widget, {
            /**
             * Handler for the form 'submit' event
             *
             * @param {Object} form
             */
            ajaxSubmit: function (form) {
                var self = this,
                    productIds = idsResolver(form),
                    productInfo = self.options.productInfoResolver(form),
                    formData;

                $(self.options.minicartSelector).trigger("contentLoading");
                self.disableAddToCartButton(form);
                formData = new FormData(form[0]);

                $.ajax({
                    url: form.prop("action"),
                    data: formData,
                    type: "post",
                    dataType: "json",
                    cache: false,
                    contentType: false,
                    processData: false,

                    /** @inheritdoc */
                    beforeSend: function () {
                        if (self.isLoaderEnabled()) {
                            $("body").trigger(self.options.processStart);
                        }
                    },

                    /** @inheritdoc */
                    success: function (res) {
                        var eventData, parameters;

                        $(document).trigger("ajax:addToCart", {
                            sku: form.data().productSku,
                            productIds: productIds,
                            productInfo: productInfo,
                            form: form,
                            response: res,
                        });
                        console.log(self);
                console.log(productInfo);
                console.log(formData);

                        if (self.isLoaderEnabled()) {
                            $("body").trigger(self.options.processStop);
                        }

                        self.openAddToCartModal(form);

                        if (res.backUrl) {
                            eventData = {
                                form: form,
                                redirectParameters: [],
                            };
                            // trigger global event, so other modules will be able add parameters to redirect url
                            $("body").trigger(
                                "catalogCategoryAddToCartRedirect",
                                eventData
                            );

                            if (
                                eventData.redirectParameters.length > 0 &&
                                window.location.href.split(/[?#]/)[0] ===
                                    res.backUrl
                            ) {
                                parameters = res.backUrl.split("#");
                                parameters.push(
                                    eventData.redirectParameters.join("&")
                                );
                                res.backUrl = parameters.join("#");
                            }

                            self._redirect(res.backUrl);

                            return;
                        }

                        if (res.messages) {
                            $(self.options.messagesSelector).html(res.messages);
                        }

                        if (res.minicart) {
                            $(self.options.minicartSelector).replaceWith(
                                res.minicart
                            );
                            $(self.options.minicartSelector).trigger(
                                "contentUpdated"
                            );
                        }

                        if (res.product && res.product.statusText) {
                            $(self.options.productStatusSelector)
                                .removeClass("available")
                                .addClass("unavailable")
                                .find("span")
                                .html(res.product.statusText);
                        }
                        self.enableAddToCartButton(form);
                    },

                    /** @inheritdoc */
                    error: function (res) {
                        $(document).trigger("ajax:addToCart:error", {
                            sku: form.data().productSku,
                            productIds: productIds,
                            productInfo: productInfo,
                            form: form,
                            response: res,
                        });
                    },

                    /** @inheritdoc */
                    complete: function (res) {
                        if (res.state() === "rejected") {
                            location.reload();
                        }
                    },
                });
            },

            openAddToCartModal: function (form) {
                const productName = form.data('product-name');
                console.log(form.find("button").data("name"))
                debugger
                $(document).trigger('custom:addToCartModal', { product: form });
            },
        });
        return $.mage.catalogAddToCart;
    };
});
