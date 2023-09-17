'use strict';

/**
 * order controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::order.order', ({ strapi }) => ({

    // Override controller order
    async create(ctx) {
        // Buat request add order
        const result = await super.create(ctx)
        console.log('Result', result)
        const midtransClient = require('midtrans-client');
        // Create Snap API instance
        let snap = new midtransClient.Snap({
            isProduction: false,
            serverKey: 'SB-Mid-server-cOnxQEShvhViCkiHifthrQ9o',
            clientKey: 'SB-Mid-client-4r7aDewIEtkSVgL6'
        });

        let parameter = {
            "transaction_details": {
                "order_id": result.data.id,
                "gross_amount": result.data.attributes.total_price
            }, "credit_card": {
                "secure": true
            }
        };


        let response = await snap.createTransaction(parameter)

        // const midtransClient = require('midtrans-client');
        // // Create Core API instance
        // let core = new midtransClient.CoreApi({
        //     isProduction: false,
        //     serverKey: 'SB-Mid-server-cOnxQEShvhViCkiHifthrQ9o',
        //     clientKey: 'SB-Mid-client-4r7aDewIEtkSVgL6'
        // });

        // let parameter = {
        //     "payment_type": "bank_transfer",
        //     "transaction_details": {
        //         "gross_amount": result.data.attributes.total_price,
        //         "order_id": result.data.id,
        //     },
        //     "bank_transfer": {
        //         "bank": "bca"
        //     }
        // };

        // // charge transaction
        // let response = core.charge(parameter)

        return response
    }
}));
