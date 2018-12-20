require('@babel/polyfill');

import axios from 'axios';
import guid from 'guid';
import {stringify} from 'query-string'
import formDataToJson from './formDataToJson';

axios.defaults.responseType = 'json';

let _config;

function setConfig(config) {
    _config = config;
}

async function pay(formData, errorHandler = null) {
    
    try {
        if(!_config)
            throw new Error('setConfig is not called correctly');
        
        const TOKEN = (await axios.post(
            'https://api-cs.eduzz.com/ecommerce/v2/token/secret', {
                'secret': _config.secret
            }
        )).data.token;


        let requestData = {
            'config': {
              'lang': 'pt'
            },
            'transaction': {
              'order_id': guid.raw(),
              'return_url': _config.returnUrl,
              'postback_url': _config.postbackUrl,
              'installments': 1,
              'items': [
                {
                  'product_id': _config.productId,
                  'checkout_product_id': _config.checkoutProductId,
                  'description': _config.description,
                  'price': formData.price || null,
                  'amount': 1
                }
              ]
            }
        }
        
        if (!!formData.name || !!formData.name || !!formData.cellphone || !!formData.document) {
            requestData.transaction = {
                ...requestData.transaction,
                'customer': {
                    'name': formData.name || null,
                    'email': formData.email || null,
                    'document': formData.document || null,
                    'cellphone': formData.cellphone || null,
                    'person_type': formData.personType || 'F'
                }
            }
        }

        const transaction = await axios.post(
            'https://api-cs.eduzz.com/ecommerce/transaction',
            requestData,
            {
                headers: {
                    Authorization: `Bearer ${TOKEN}`
                }
            }
        );

        // Replace will be removed
        window.location.href = transaction.data.payment_url + '?' + stringify(_config.queryParams);
    } catch (err) {
        typeof errorHandler === 'function' ? 
            errorHandler(err.response || err.message) : 
            console.error(err.response || err.message);
    }
};


export const eduzzPayment = {
    formDataToJson,
    pay,
    setConfig
};