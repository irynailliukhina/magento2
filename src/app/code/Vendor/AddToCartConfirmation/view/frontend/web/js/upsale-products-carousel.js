define(["jquery", "owlcarousel"], function ($) {
    "use strict";

    return {
        init: function (container) {
            $.ajax({
                url: "https://fakestoreapi.com/products?limit=10", // placeholder API
                method: "GET",
                success: function (products) {
                    products.forEach(function (product) {
                        container.append(`
                            <div class="slide-item">
                                <img src="${product.image}" alt="${product.title}" />
                                <div class="product-name">${product.title}</div>
                            </div>
                        `);
                    });

                    container.owlCarousel({
                        lazyLoad: true,
                        loop: true,
                        margin: 10,
                        nav: true,
                        dots: false,
                        responsive: {
                            0: { items: 2 },
                            768: { items: 4 },
                        },
                    });
                },
                error: function () {
                    container
                        .show()
                        .html(
                            '<div class="carousel-error">' +
                                $.mage.__("Failed to load products.") +
                                "</div>"
                        );
                },
            });
        },
    };
});
