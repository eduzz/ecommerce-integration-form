require('@babel/polyfill');

import axios from 'axios';
import guid from 'guid';
import { jsonQueryStringifyObjectBare } from 'json-query-string';
import formDataToJson from './formDataToJson';

axios.defaults.responseType = 'json';

let _config;

function setConfig(config) {
    _config = config;
}

async function pay(event, errorHandler = null) {
    event.preventDefault();
    
    try {
        if(!_config)
            throw new Error('setConfig is not called correctly');
        
        const jsonFormData = formDataToJson(event.target);

        
        const TOKEN = (await axios.post(
            'https://api-cs.eduzz.com/ecommerce/v2/token', {
                'email': _config.email,
                'public_key': _config.public,
                'api_key': _config.api
            }
        )).data.token;

        const transaction = await axios.post(
            'https://api-cs.eduzz.com/ecommerce/transaction',
            {
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
                      'price': jsonFormData.price || null,
                      'amount': 1
                    }
                  ],
                  'customer': {
                    'name': jsonFormData.name || null,
                    'email': jsonFormData.email || null,
                    'document': jsonFormData.document || null,
                    'cellphone': jsonFormData.cellphone || null,
                    'person_type': 'F'
                  }
                }
            },
            {
                headers: {
                    Authorization: `Bearer ${TOKEN}`
                }
            }
        );

        // Replace will be removed
        window.location.href = transaction.data.payment_url
            .replace('?templateId=17', '?' + jsonQueryStringifyObjectBare(_config.queryParams));
    } catch (err) {
        typeof errorHandler === 'function' ? 
            errorHandler(err.response || err.message) : 
            console.error(err.response || err.message);
    }
};


export const eduzzPayment = {
    pay,
    setConfig
};