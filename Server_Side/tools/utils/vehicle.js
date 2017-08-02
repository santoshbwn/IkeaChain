'use strict';

const Util = require('./util.js');
const hfc = require('hfc');

class Vehicle {

    constructor(usersToSecurityContext) {
        this.usersToSecurityContext = usersToSecurityContext;
        this.chain = hfc.getChain('myChain'); //TODO: Make this a config param?
    }

    create(userId) {
        let securityContext = this.usersToSecurityContext[userId];
        let skuID = Vehicle.newSkuID();

        return this.doesSkuIDExist(userId, skuID)
        .then(function() {
            return Util.invokeChaincode(securityContext, 'create_Sku', [ skuID ])
            .then(function() {
                return skuID;
            });
        });
    }

    transfer(userId, buyer, functionName, skuID) {
        return this.updateAttribute(userId, functionName , buyer, skuID);
    }

    updateAttribute(userId, functionName, value, skuID) {
        let securityContext = this.usersToSecurityContext[userId];
        return Util.invokeChaincode(securityContext, functionName, [ value, skuID ]);
    }

    doesSkuIDExist(userId, skuID) {
        let securityContext = this.usersToSecurityContext[userId];
        return Util.queryChaincode(securityContext, 'check_unique_v5c', [ skuID ]);
    }

    static newSkuID() {
        let numbers = '1234567890';
        let characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        let skuID = '';
        for(let i = 0; i < 7; i++)
            {
            skuID += numbers.charAt(Math.floor(Math.random() * numbers.length));
        }
        skuID = characters.charAt(Math.floor(Math.random() * characters.length)) + skuID;
        skuID = characters.charAt(Math.floor(Math.random() * characters.length)) + skuID;
        return skuID;
    }
}

module.exports = Vehicle;
