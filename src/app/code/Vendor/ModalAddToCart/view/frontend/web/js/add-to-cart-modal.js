define(["jquery", "Magento_Ui/js/modal/modal", "owlcarousel"], function (
    $,
    modal
) {
    "use strict";

    // Listen to Magento AJAX add-to-cart event
    $(document).on("ajax:addToCart", function (event, data) {
        let productName = data.form.data().productName;
        openAddToCartModal(productName);
    });

    function openAddToCartModal(productName) {
        var popupContent = `
        <div class="add-to-cart-modal-content">
            <div class="modal-subtitle">${$.mage.__(
                "You might also like"
            )}</div>
            <div class="recommended-carousel owl-carousel">
                <!-- placeholder -->
            </div>
        </div>
        `;

        var popup = $('<div class="add-to-cart-modal-popup"/>')
            .html(popupContent)
            .modal({
                modalClass: "add-to-cart-modal",
                type: "slide",
                title: $.mage.__('You added %1 to your shopping cart').replace('%1', productName),
                buttons: [
                    {
                        text: "Add to Cart",
                        class: 'action-primary action-accept',
                        click: function () {
                            this.closeModal();
                        },
                    },
                ],
            });

        popup.modal("openModal");

        // Initialize Owl Carousel after content is added
        initRecommendedCarousel(popup.find(".recommended-carousel"));
    }

    function initRecommendedCarousel(container) {
        $.ajax({
            url: "https://fakestoreapi.com/products?limit=8", // or dummyjson.com
            method: "GET",
            success: function (products) {
                products.forEach(function (product) {
                    var slide = $(`
                        <div class="slide-item">
                            <img src="${product.image}" alt="${product.title}" />
                            <div class="product-name">${product.title}</div>
                        </div>
                    `);
                    container.append(slide);
                });

                container.owlCarousel({
                    lazyLoad:true,
                    loop: true,
                    margin: 10,
                    nav: true,
                    dots: false,
                    responsive: {
                        0: { items: 2 }, // mobile
                        768: { items: 4 }, // desktop
                    },
                });
            },
        });
    }
});
