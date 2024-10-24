"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.calculateMarketPrice = exports.createMarketBuyOrder = exports.buildMarketBuyOrderCreationArgs = exports.getMarketBuyOrderRawAmounts = exports.createOrder = exports.buildOrderCreationArgs = exports.getOrderRawAmounts = exports.buildOrder = exports.ROUNDING_CONFIG = void 0;
const tslib_1 = require("tslib");
const units_1 = require("@ethersproject/units");
const order_utils_1 = require("@polymarket/order-utils");
const types_1 = require("../types");
const utilities_1 = require("../utilities");
const config_1 = require("../config");
exports.ROUNDING_CONFIG = {
    "0.1": {
        price: 1,
        size: 2,
        amount: 3,
    },
    "0.01": {
        price: 2,
        size: 2,
        amount: 4,
    },
    "0.001": {
        price: 3,
        size: 2,
        amount: 5,
    },
    "0.0001": {
        price: 4,
        size: 2,
        amount: 6,
    },
};
/**
 * Generate and sign a order
 *
 * @param signer
 * @param exchangeAddress ctf exchange contract address
 * @param chainId
 * @param OrderData
 * @returns SignedOrder
 */
const buildOrder = (signer, exchangeAddress, chainId, orderData) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
    const cTFExchangeOrderBuilder = new order_utils_1.ExchangeOrderBuilder(exchangeAddress, chainId, signer);
    return cTFExchangeOrderBuilder.buildSignedOrder(orderData);
});
exports.buildOrder = buildOrder;
const getOrderRawAmounts = (side, size, price, roundConfig) => {
    const rawPrice = (0, utilities_1.roundNormal)(price, roundConfig.price);
    if (side === types_1.Side.BUY) {
        // force 2 decimals places
        const rawTakerAmt = (0, utilities_1.roundDown)(size, roundConfig.size);
        let rawMakerAmt = rawTakerAmt * rawPrice;
        if ((0, utilities_1.decimalPlaces)(rawMakerAmt) > roundConfig.amount) {
            rawMakerAmt = (0, utilities_1.roundUp)(rawMakerAmt, roundConfig.amount + 4);
            if ((0, utilities_1.decimalPlaces)(rawMakerAmt) > roundConfig.amount) {
                rawMakerAmt = (0, utilities_1.roundDown)(rawMakerAmt, roundConfig.amount);
            }
        }
        return {
            side: order_utils_1.Side.BUY,
            rawMakerAmt,
            rawTakerAmt,
        };
    }
    else {
        const rawMakerAmt = (0, utilities_1.roundDown)(size, roundConfig.size);
        let rawTakerAmt = rawMakerAmt * rawPrice;
        if ((0, utilities_1.decimalPlaces)(rawTakerAmt) > roundConfig.amount) {
            rawTakerAmt = (0, utilities_1.roundUp)(rawTakerAmt, roundConfig.amount + 4);
            if ((0, utilities_1.decimalPlaces)(rawTakerAmt) > roundConfig.amount) {
                rawTakerAmt = (0, utilities_1.roundDown)(rawTakerAmt, roundConfig.amount);
            }
        }
        return {
            side: order_utils_1.Side.SELL,
            rawMakerAmt,
            rawTakerAmt,
        };
    }
};
exports.getOrderRawAmounts = getOrderRawAmounts;
/**
 * Translate simple user order to args used to generate Orders
 */
const buildOrderCreationArgs = (signer, maker, signatureType, userOrder, roundConfig) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
    const { side, rawMakerAmt, rawTakerAmt } = (0, exports.getOrderRawAmounts)(userOrder.side, userOrder.size, userOrder.price, roundConfig);
    const makerAmount = (0, units_1.parseUnits)(rawMakerAmt.toString(), config_1.COLLATERAL_TOKEN_DECIMALS).toString();
    const takerAmount = (0, units_1.parseUnits)(rawTakerAmt.toString(), config_1.CONDITIONAL_TOKEN_DECIMALS).toString();
    let taker;
    if (typeof userOrder.taker !== "undefined" && userOrder.taker) {
        taker = userOrder.taker;
    }
    else {
        taker = "0x0000000000000000000000000000000000000000";
    }
    let feeRateBps;
    if (typeof userOrder.feeRateBps !== "undefined" && userOrder.feeRateBps) {
        feeRateBps = userOrder.feeRateBps.toString();
    }
    else {
        feeRateBps = "0";
    }
    let nonce;
    if (typeof userOrder.nonce !== "undefined" && userOrder.nonce) {
        nonce = userOrder.nonce.toString();
    }
    else {
        nonce = "0";
    }
    return {
        maker,
        taker,
        tokenId: userOrder.tokenID,
        makerAmount,
        takerAmount,
        side,
        feeRateBps,
        nonce,
        signer,
        expiration: (userOrder.expiration || 0).toString(),
        signatureType,
    };
});
exports.buildOrderCreationArgs = buildOrderCreationArgs;
const createOrder = (eoaSigner, chainId, signatureType, funderAddress, userOrder, options) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
    const eoaSignerAddress = yield eoaSigner.getAddress();
    // If funder address is not given, use the signer address
    const maker = funderAddress === undefined ? eoaSignerAddress : funderAddress;
    const contractConfig = (0, config_1.getContractConfig)(chainId);
    const orderData = yield (0, exports.buildOrderCreationArgs)(eoaSignerAddress, maker, signatureType, userOrder, exports.ROUNDING_CONFIG[options.tickSize]);
    const exchangeContract = options.negRisk
        ? contractConfig.negRiskExchange
        : contractConfig.exchange;
    return (0, exports.buildOrder)(eoaSigner, exchangeContract, chainId, orderData);
});
exports.createOrder = createOrder;
const getMarketBuyOrderRawAmounts = (amount, price, roundConfig) => {
    // force 2 decimals places
    const rawMakerAmt = (0, utilities_1.roundDown)(amount, roundConfig.size);
    const rawPrice = (0, utilities_1.roundDown)(price, roundConfig.price);
    let rawTakerAmt = rawMakerAmt / rawPrice;
    if ((0, utilities_1.decimalPlaces)(rawTakerAmt) > roundConfig.amount) {
        rawTakerAmt = (0, utilities_1.roundUp)(rawTakerAmt, roundConfig.amount + 4);
        if ((0, utilities_1.decimalPlaces)(rawTakerAmt) > roundConfig.amount) {
            rawTakerAmt = (0, utilities_1.roundDown)(rawTakerAmt, roundConfig.amount);
        }
    }
    return {
        rawMakerAmt,
        rawTakerAmt,
    };
};
exports.getMarketBuyOrderRawAmounts = getMarketBuyOrderRawAmounts;
/**
 * Translate simple user market order to args used to generate Orders
 */
const buildMarketBuyOrderCreationArgs = (signer, maker, signatureType, userMarketOrder, roundConfig) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
    const { rawMakerAmt, rawTakerAmt } = (0, exports.getMarketBuyOrderRawAmounts)(userMarketOrder.amount, userMarketOrder.price || 1, roundConfig);
    const makerAmount = (0, units_1.parseUnits)(rawMakerAmt.toString(), config_1.COLLATERAL_TOKEN_DECIMALS).toString();
    const takerAmount = (0, units_1.parseUnits)(rawTakerAmt.toString(), config_1.CONDITIONAL_TOKEN_DECIMALS).toString();
    let taker;
    if (typeof userMarketOrder.taker !== "undefined" && userMarketOrder.taker) {
        taker = userMarketOrder.taker;
    }
    else {
        taker = "0x0000000000000000000000000000000000000000";
    }
    let feeRateBps;
    if (typeof userMarketOrder.feeRateBps !== "undefined" && userMarketOrder.feeRateBps) {
        feeRateBps = userMarketOrder.feeRateBps.toString();
    }
    else {
        feeRateBps = "0";
    }
    let nonce;
    if (typeof userMarketOrder.nonce !== "undefined" && userMarketOrder.nonce) {
        nonce = userMarketOrder.nonce.toString();
    }
    else {
        nonce = "0";
    }
    return {
        maker,
        taker,
        tokenId: userMarketOrder.tokenID,
        makerAmount,
        takerAmount,
        side: order_utils_1.Side.BUY,
        feeRateBps,
        nonce,
        signer,
        expiration: "0",
        signatureType,
    };
});
exports.buildMarketBuyOrderCreationArgs = buildMarketBuyOrderCreationArgs;
const createMarketBuyOrder = (eoaSigner, chainId, signatureType, funderAddress, userMarketOrder, options) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
    const eoaSignerAddress = yield eoaSigner.getAddress();
    // If funder address is not given, use the signer address
    const maker = funderAddress === undefined ? eoaSignerAddress : funderAddress;
    const contractConfig = (0, config_1.getContractConfig)(chainId);
    const orderData = yield (0, exports.buildMarketBuyOrderCreationArgs)(eoaSignerAddress, maker, signatureType, userMarketOrder, exports.ROUNDING_CONFIG[options.tickSize]);
    const exchangeContract = options.negRisk
        ? contractConfig.negRiskExchange
        : contractConfig.exchange;
    return (0, exports.buildOrder)(eoaSigner, exchangeContract, chainId, orderData);
});
exports.createMarketBuyOrder = createMarketBuyOrder;
const calculateMarketPrice = (positions, amountToMatch) => {
    let sum = 0;
    for (let i = 0; i < positions.length; i++) {
        const p = positions[i];
        sum += parseFloat(p.size) * parseFloat(p.price);
        if (sum >= amountToMatch) {
            return parseFloat(p.price);
        }
    }
    throw new Error("no match");
};
exports.calculateMarketPrice = calculateMarketPrice;
//# sourceMappingURL=helpers.js.map