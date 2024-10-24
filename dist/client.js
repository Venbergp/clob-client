"use strict";
// ClobClient.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClobClient = void 0;
const tslib_1 = require("tslib");
const types_1 = require("./types");
const headers_1 = require("./headers");
const http_helpers_1 = require("./http-helpers");
const errors_1 = require("./errors");
const utilities_1 = require("./utilities");
const endpoints_1 = require("./endpoints");
const builder_1 = require("./order-builder/builder");
const constants_1 = require("./constants");
const helpers_1 = require("./order-builder/helpers");
const axios_1 = tslib_1.__importDefault(require("axios")); // Добавлен импорт axios
class ClobClient {
    // eslint-disable-next-line max-params
    constructor(host, chainId, signer, creds, signatureType, funderAddress, geoBlockToken, useServerTime, axiosInstance // Добавлен параметр axiosInstance
    ) {
        this.host = host.endsWith("/") ? host.slice(0, -1) : host;
        this.chainId = chainId;
        if (signer !== undefined) {
            this.signer = signer;
        }
        if (creds !== undefined) {
            this.creds = creds;
        }
        this.orderBuilder = new builder_1.OrderBuilder(signer, chainId, signatureType, funderAddress);
        this.tickSizes = {};
        this.negRisk = {};
        this.geoBlockToken = geoBlockToken;
        this.useServerTime = useServerTime;
        this.axiosInstance = axiosInstance || axios_1.default.create(); // Инициализация axiosInstance
    }
    // Public endpoints
    getOk() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            return this.get(`${this.host}/`);
        });
    }
    getServerTime() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            return this.get(`${this.host}${endpoints_1.TIME}`);
        });
    }
    getSamplingSimplifiedMarkets(next_cursor = constants_1.INITIAL_CURSOR) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            return this.get(`${this.host}${endpoints_1.GET_SAMPLING_SIMPLIFIED_MARKETS}`, {
                params: { next_cursor },
            });
        });
    }
    getSamplingMarkets(next_cursor = constants_1.INITIAL_CURSOR) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            return this.get(`${this.host}${endpoints_1.GET_SAMPLING_MARKETS}`, {
                params: { next_cursor },
            });
        });
    }
    getSimplifiedMarkets(next_cursor = constants_1.INITIAL_CURSOR) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            return this.get(`${this.host}${endpoints_1.GET_SIMPLIFIED_MARKETS}`, {
                params: { next_cursor },
            });
        });
    }
    getMarkets(next_cursor = constants_1.INITIAL_CURSOR) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            return this.get(`${this.host}${endpoints_1.GET_MARKETS}`, {
                params: { next_cursor },
            });
        });
    }
    getMarket(conditionID) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            return this.get(`${this.host}${endpoints_1.GET_MARKET}${conditionID}`);
        });
    }
    getOrderBook(tokenID) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            return this.get(`${this.host}${endpoints_1.GET_ORDER_BOOK}`, {
                params: { token_id: tokenID },
            });
        });
    }
    getOrderBooks(params) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            return this.post(`${this.host}${endpoints_1.GET_ORDER_BOOKS}`, {
                data: params,
            });
        });
    }
    getTickSize(tokenID) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            if (tokenID in this.tickSizes) {
                return this.tickSizes[tokenID];
            }
            const result = yield this.get(`${this.host}${endpoints_1.GET_TICK_SIZE}`, {
                params: { token_id: tokenID },
            });
            this.tickSizes[tokenID] = result.minimum_tick_size.toString();
            return this.tickSizes[tokenID];
        });
    }
    getNegRisk(tokenID) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            if (tokenID in this.negRisk) {
                return this.negRisk[tokenID];
            }
            const result = yield this.get(`${this.host}${endpoints_1.GET_NEG_RISK}`, {
                params: { token_id: tokenID },
            });
            this.negRisk[tokenID] = result.neg_risk;
            return this.negRisk[tokenID];
        });
    }
    /**
     * Calculates the hash for the given orderbook
     * @param orderbook
     * @returns
     */
    getOrderBookHash(orderbook) {
        return (0, utilities_1.generateOrderBookSummaryHash)(orderbook);
    }
    getMidpoint(tokenID) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            return this.get(`${this.host}${endpoints_1.GET_MIDPOINT}`, {
                params: { token_id: tokenID },
            });
        });
    }
    getMidpoints(params) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            return this.post(`${this.host}${endpoints_1.GET_MIDPOINTS}`, {
                data: params,
            });
        });
    }
    getPrice(tokenID, side) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            return this.get(`${this.host}${endpoints_1.GET_PRICE}`, {
                params: { token_id: tokenID, side: side },
            });
        });
    }
    getPrices(params) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            return this.post(`${this.host}${endpoints_1.GET_PRICES}`, {
                data: params,
            });
        });
    }
    getSpread(tokenID) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            return this.get(`${this.host}${endpoints_1.GET_SPREAD}`, {
                params: { token_id: tokenID },
            });
        });
    }
    getSpreads(params) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            return this.post(`${this.host}${endpoints_1.GET_SPREADS}`, {
                data: params,
            });
        });
    }
    getLastTradePrice(tokenID) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            return this.get(`${this.host}${endpoints_1.GET_LAST_TRADE_PRICE}`, {
                params: { token_id: tokenID },
            });
        });
    }
    getLastTradesPrices(params) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            return this.post(`${this.host}${endpoints_1.GET_LAST_TRADES_PRICES}`, {
                data: params,
            });
        });
    }
    getPricesHistory(params) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            return this.get(`${this.host}${endpoints_1.GET_PRICES_HISTORY}`, {
                params,
            });
        });
    }
    // L1 Authed
    /**
     * Creates a new API key for a user
     * @param nonce
     * @returns ApiKeyCreds
     */
    createApiKey(nonce) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            this.canL1Auth();
            const endpoint = `${this.host}${endpoints_1.CREATE_API_KEY}`;
            const headers = yield (0, headers_1.createL1Headers)(this.signer, this.chainId, nonce, this.useServerTime ? yield this.getServerTime() : undefined);
            return yield this.post(endpoint, { headers }).then((apiKeyRaw) => {
                const apiKey = {
                    key: apiKeyRaw.apiKey,
                    secret: apiKeyRaw.secret,
                    passphrase: apiKeyRaw.passphrase,
                };
                return apiKey;
            });
        });
    }
    /**
     * Derives an existing API key for a user
     * @param nonce
     * @returns ApiKeyCreds
     */
    deriveApiKey(nonce) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            this.canL1Auth();
            const endpoint = `${this.host}${endpoints_1.DERIVE_API_KEY}`;
            const headers = yield (0, headers_1.createL1Headers)(this.signer, this.chainId, nonce, this.useServerTime ? yield this.getServerTime() : undefined);
            return yield this.get(endpoint, { headers }).then((apiKeyRaw) => {
                const apiKey = {
                    key: apiKeyRaw.apiKey,
                    secret: apiKeyRaw.secret,
                    passphrase: apiKeyRaw.passphrase,
                };
                return apiKey;
            });
        });
    }
    createOrDeriveApiKey(nonce) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            return this.createApiKey(nonce).then(response => {
                if (!response.key) {
                    return this.deriveApiKey(nonce);
                }
                return response;
            });
        });
    }
    getApiKeys() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            this.canL2Auth();
            const endpoint = endpoints_1.GET_API_KEYS;
            const headerArgs = {
                method: http_helpers_1.GET,
                requestPath: endpoint,
            };
            const headers = yield (0, headers_1.createL2Headers)(this.signer, this.creds, headerArgs, this.useServerTime ? yield this.getServerTime() : undefined);
            return this.get(`${this.host}${endpoint}`, { headers });
        });
    }
    deleteApiKey() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            this.canL2Auth();
            const endpoint = endpoints_1.DELETE_API_KEY;
            const headerArgs = {
                method: http_helpers_1.DELETE,
                requestPath: endpoint,
            };
            const headers = yield (0, headers_1.createL2Headers)(this.signer, this.creds, headerArgs, this.useServerTime ? yield this.getServerTime() : undefined);
            return this.del(`${this.host}${endpoint}`, { headers });
        });
    }
    getOrder(orderID) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            this.canL2Auth();
            const endpoint = `${endpoints_1.GET_ORDER}${orderID}`;
            const headerArgs = {
                method: http_helpers_1.GET,
                requestPath: endpoint,
            };
            const headers = yield (0, headers_1.createL2Headers)(this.signer, this.creds, headerArgs, this.useServerTime ? yield this.getServerTime() : undefined);
            return this.get(`${this.host}${endpoint}`, { headers });
        });
    }
    getTrades(params, only_first_page = false, next_cursor) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            this.canL2Auth();
            const endpoint = endpoints_1.GET_TRADES;
            const headerArgs = {
                method: http_helpers_1.GET,
                requestPath: endpoint,
            };
            const headers = yield (0, headers_1.createL2Headers)(this.signer, this.creds, headerArgs, this.useServerTime ? yield this.getServerTime() : undefined);
            let results = [];
            next_cursor = next_cursor || constants_1.INITIAL_CURSOR;
            while (next_cursor != constants_1.END_CURSOR && (next_cursor === constants_1.INITIAL_CURSOR || !only_first_page)) {
                const _params = Object.assign(Object.assign({}, params), { next_cursor });
                const response = yield this.get(`${this.host}${endpoint}`, {
                    headers,
                    params: _params,
                });
                next_cursor = response.next_cursor;
                results = [...results, ...response.data];
            }
            return results;
        });
    }
    getNotifications() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            this.canL2Auth();
            const endpoint = endpoints_1.GET_NOTIFICATIONS;
            const headerArgs = {
                method: http_helpers_1.GET,
                requestPath: endpoint,
            };
            const headers = yield (0, headers_1.createL2Headers)(this.signer, this.creds, headerArgs, this.useServerTime ? yield this.getServerTime() : undefined);
            return this.get(`${this.host}${endpoint}`, {
                headers,
                params: { signature_type: this.orderBuilder.signatureType },
            });
        });
    }
    dropNotifications(params) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            this.canL2Auth();
            const endpoint = endpoints_1.DROP_NOTIFICATIONS;
            const l2HeaderArgs = {
                method: http_helpers_1.DELETE,
                requestPath: endpoint,
            };
            const headers = yield (0, headers_1.createL2Headers)(this.signer, this.creds, l2HeaderArgs, this.useServerTime ? yield this.getServerTime() : undefined);
            return this.del(`${this.host}${endpoint}`, {
                headers,
                params: (0, http_helpers_1.parseDropNotificationParams)(params),
            });
        });
    }
    getBalanceAllowance(params) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            this.canL2Auth();
            const endpoint = endpoints_1.GET_BALANCE_ALLOWANCE;
            const headerArgs = {
                method: http_helpers_1.GET,
                requestPath: endpoint,
            };
            const headers = yield (0, headers_1.createL2Headers)(this.signer, this.creds, headerArgs, this.useServerTime ? yield this.getServerTime() : undefined);
            const _params = Object.assign(Object.assign({}, params), { signature_type: this.orderBuilder.signatureType });
            return this.get(`${this.host}${endpoint}`, { headers, params: _params });
        });
    }
    updateBalanceAllowance(params) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            this.canL2Auth();
            const endpoint = endpoints_1.UPDATE_BALANCE_ALLOWANCE;
            const headerArgs = {
                method: http_helpers_1.GET,
                requestPath: endpoint,
            };
            const headers = yield (0, headers_1.createL2Headers)(this.signer, this.creds, headerArgs, this.useServerTime ? yield this.getServerTime() : undefined);
            const _params = Object.assign(Object.assign({}, params), { signature_type: this.orderBuilder.signatureType });
            return this.get(`${this.host}${endpoint}`, { headers, params: _params });
        });
    }
    createOrder(userOrder, options) {
        var _a;
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            this.canL1Auth();
            const { tokenID } = userOrder;
            const tickSize = yield this._resolveTickSize(tokenID, options === null || options === void 0 ? void 0 : options.tickSize);
            if (!(0, utilities_1.priceValid)(userOrder.price, tickSize)) {
                throw new Error(`invalid price (${userOrder.price}), min: ${parseFloat(tickSize)} - max: ${1 - parseFloat(tickSize)}`);
            }
            const negRisk = (_a = options === null || options === void 0 ? void 0 : options.negRisk) !== null && _a !== void 0 ? _a : (yield this.getNegRisk(tokenID));
            return this.orderBuilder.buildOrder(userOrder, {
                tickSize,
                negRisk,
            });
        });
    }
    createMarketBuyOrder(userMarketOrder, options) {
        var _a;
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            this.canL1Auth();
            const { tokenID } = userMarketOrder;
            const tickSize = yield this._resolveTickSize(tokenID, options === null || options === void 0 ? void 0 : options.tickSize);
            if (!userMarketOrder.price) {
                userMarketOrder.price = yield this.calculateMarketPrice(tokenID, types_1.Side.BUY, userMarketOrder.amount);
            }
            if (!(0, utilities_1.priceValid)(userMarketOrder.price, tickSize)) {
                throw new Error(`invalid price (${userMarketOrder.price}), min: ${parseFloat(tickSize)} - max: ${1 - parseFloat(tickSize)}`);
            }
            const negRisk = (_a = options === null || options === void 0 ? void 0 : options.negRisk) !== null && _a !== void 0 ? _a : (yield this.getNegRisk(tokenID));
            return this.orderBuilder.buildMarketOrder(userMarketOrder, {
                tickSize,
                negRisk,
            });
        });
    }
    getOpenOrders(params, only_first_page = false, next_cursor) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            this.canL2Auth();
            const endpoint = endpoints_1.GET_OPEN_ORDERS;
            const l2HeaderArgs = {
                method: http_helpers_1.GET,
                requestPath: endpoint,
            };
            const headers = yield (0, headers_1.createL2Headers)(this.signer, this.creds, l2HeaderArgs, this.useServerTime ? yield this.getServerTime() : undefined);
            let results = [];
            next_cursor = next_cursor || constants_1.INITIAL_CURSOR;
            while (next_cursor != constants_1.END_CURSOR && (next_cursor === constants_1.INITIAL_CURSOR || !only_first_page)) {
                const _params = Object.assign(Object.assign({}, params), { next_cursor });
                const response = yield this.get(`${this.host}${endpoint}`, {
                    headers,
                    params: _params,
                });
                next_cursor = response.next_cursor;
                results = [...results, ...response.data];
            }
            return results;
        });
    }
    postOrder(order, orderType = types_1.OrderType.GTC) {
        var _a;
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            this.canL2Auth();
            const endpoint = endpoints_1.POST_ORDER;
            const orderPayload = (0, utilities_1.orderToJson)(order, ((_a = this.creds) === null || _a === void 0 ? void 0 : _a.key) || "", orderType);
            const l2HeaderArgs = {
                method: http_helpers_1.POST,
                requestPath: endpoint,
                body: JSON.stringify(orderPayload),
            };
            const headers = yield (0, headers_1.createL2Headers)(this.signer, this.creds, l2HeaderArgs, this.useServerTime ? yield this.getServerTime() : undefined);
            return this.post(`${this.host}${endpoint}`, { headers, data: orderPayload });
        });
    }
    cancelOrder(payload) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            this.canL2Auth();
            const endpoint = endpoints_1.CANCEL_ORDER;
            const l2HeaderArgs = {
                method: http_helpers_1.DELETE,
                requestPath: endpoint,
                body: JSON.stringify(payload),
            };
            const headers = yield (0, headers_1.createL2Headers)(this.signer, this.creds, l2HeaderArgs, this.useServerTime ? yield this.getServerTime() : undefined);
            return this.del(`${this.host}${endpoint}`, { headers, data: payload });
        });
    }
    cancelOrders(ordersHashes) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            this.canL2Auth();
            const endpoint = endpoints_1.CANCEL_ORDERS;
            const l2HeaderArgs = {
                method: http_helpers_1.DELETE,
                requestPath: endpoint,
                body: JSON.stringify(ordersHashes),
            };
            const headers = yield (0, headers_1.createL2Headers)(this.signer, this.creds, l2HeaderArgs, this.useServerTime ? yield this.getServerTime() : undefined);
            return this.del(`${this.host}${endpoint}`, { headers, data: ordersHashes });
        });
    }
    cancelAll() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            this.canL2Auth();
            const endpoint = endpoints_1.CANCEL_ALL;
            const l2HeaderArgs = {
                method: http_helpers_1.DELETE,
                requestPath: endpoint,
            };
            const headers = yield (0, headers_1.createL2Headers)(this.signer, this.creds, l2HeaderArgs, this.useServerTime ? yield this.getServerTime() : undefined);
            return this.del(`${this.host}${endpoint}`, { headers });
        });
    }
    cancelMarketOrders(payload) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            this.canL2Auth();
            const endpoint = endpoints_1.CANCEL_MARKET_ORDERS;
            const l2HeaderArgs = {
                method: http_helpers_1.DELETE,
                requestPath: endpoint,
                body: JSON.stringify(payload),
            };
            const headers = yield (0, headers_1.createL2Headers)(this.signer, this.creds, l2HeaderArgs, this.useServerTime ? yield this.getServerTime() : undefined);
            return this.del(`${this.host}${endpoint}`, { headers, data: payload });
        });
    }
    isOrderScoring(params) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            this.canL2Auth();
            const endpoint = endpoints_1.IS_ORDER_SCORING;
            const headerArgs = {
                method: http_helpers_1.GET,
                requestPath: endpoint,
            };
            const headers = yield (0, headers_1.createL2Headers)(this.signer, this.creds, headerArgs, this.useServerTime ? yield this.getServerTime() : undefined);
            return this.get(`${this.host}${endpoint}`, { headers, params });
        });
    }
    areOrdersScoring(params) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            this.canL2Auth();
            const endpoint = endpoints_1.ARE_ORDERS_SCORING;
            const payload = JSON.stringify(params === null || params === void 0 ? void 0 : params.orderIds);
            const headerArgs = {
                method: http_helpers_1.POST,
                requestPath: endpoint,
                body: payload,
            };
            const headers = yield (0, headers_1.createL2Headers)(this.signer, this.creds, headerArgs, this.useServerTime ? yield this.getServerTime() : undefined);
            return this.post(`${this.host}${endpoint}`, {
                headers,
                data: payload,
            });
        });
    }
    // Rewards
    getEarningsForUserForDay(date) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            this.canL2Auth();
            const endpoint = endpoints_1.GET_EARNINGS_FOR_USER_FOR_DAY;
            const headerArgs = {
                method: http_helpers_1.GET,
                requestPath: endpoint,
            };
            const headers = yield (0, headers_1.createL2Headers)(this.signer, this.creds, headerArgs, this.useServerTime ? yield this.getServerTime() : undefined);
            let results = [];
            let next_cursor = constants_1.INITIAL_CURSOR;
            while (next_cursor != constants_1.END_CURSOR) {
                const params = {
                    date,
                    signature_type: this.orderBuilder.signatureType,
                    next_cursor,
                };
                const response = yield this.get(`${this.host}${endpoint}`, {
                    headers,
                    params,
                });
                next_cursor = response.next_cursor;
                results = [...results, ...response.data];
            }
            return results;
        });
    }
    getTotalEarningsForUserForDay(date) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            this.canL2Auth();
            const endpoint = endpoints_1.GET_TOTAL_EARNINGS_FOR_USER_FOR_DAY;
            const headerArgs = {
                method: http_helpers_1.GET,
                requestPath: endpoint,
            };
            const headers = yield (0, headers_1.createL2Headers)(this.signer, this.creds, headerArgs, this.useServerTime ? yield this.getServerTime() : undefined);
            const params = {
                date,
                signature_type: this.orderBuilder.signatureType,
            };
            return yield this.get(`${this.host}${endpoint}`, {
                headers,
                params,
            });
        });
    }
    getUserEarningsAndMarketsConfig(date, order_by = "", position = "") {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            this.canL2Auth();
            const endpoint = endpoints_1.GET_REWARDS_EARNINGS_PERCENTAGES;
            const headerArgs = {
                method: http_helpers_1.GET,
                requestPath: endpoint,
            };
            const headers = yield (0, headers_1.createL2Headers)(this.signer, this.creds, headerArgs, this.useServerTime ? yield this.getServerTime() : undefined);
            let results = [];
            let next_cursor = constants_1.INITIAL_CURSOR;
            while (next_cursor != constants_1.END_CURSOR) {
                const params = {
                    date,
                    signature_type: this.orderBuilder.signatureType,
                    next_cursor,
                    order_by,
                    position,
                };
                const response = yield this.get(`${this.host}${endpoint}`, {
                    headers,
                    params,
                });
                next_cursor = response.next_cursor;
                results = [...results, ...response.data];
            }
            return results;
        });
    }
    getRewardPercentages() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            this.canL2Auth();
            const endpoint = endpoints_1.GET_LIQUIDITY_REWARD_PERCENTAGES;
            const headerArgs = {
                method: http_helpers_1.GET,
                requestPath: endpoint,
            };
            const headers = yield (0, headers_1.createL2Headers)(this.signer, this.creds, headerArgs, this.useServerTime ? yield this.getServerTime() : undefined);
            const _params = {
                signature_type: this.orderBuilder.signatureType,
            };
            return this.get(`${this.host}${endpoint}`, { headers, params: _params });
        });
    }
    getCurrentRewards() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            let results = [];
            let next_cursor = constants_1.INITIAL_CURSOR;
            while (next_cursor != constants_1.END_CURSOR) {
                const response = yield this.get(`${this.host}${endpoints_1.GET_REWARDS_MARKETS_CURRENT}`, {
                    params: { next_cursor },
                });
                next_cursor = response.next_cursor;
                results = [...results, ...response.data];
            }
            return results;
        });
    }
    getRawRewardsForMarket(conditionId) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            let results = [];
            let next_cursor = constants_1.INITIAL_CURSOR;
            while (next_cursor != constants_1.END_CURSOR) {
                const response = yield this.get(`${this.host}${endpoints_1.GET_REWARDS_MARKETS}${conditionId}`, {
                    params: { next_cursor },
                });
                next_cursor = response.next_cursor;
                results = [...results, ...response.data];
            }
            return results;
        });
    }
    getMarketTradesEvents(conditionID) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            return this.get(`${this.host}${endpoints_1.GET_MARKET_TRADES_EVENTS}${conditionID}`);
        });
    }
    calculateMarketPrice(tokenID, side, amount) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const book = yield this.getOrderBook(tokenID);
            if (!book) {
                throw new Error("no orderbook");
            }
            if (side === types_1.Side.BUY) {
                if (!book.asks) {
                    throw new Error("no match");
                }
                return (0, helpers_1.calculateMarketPrice)(book.asks, amount);
            }
            else {
                if (!book.bids) {
                    throw new Error("no match");
                }
                return (0, helpers_1.calculateMarketPrice)(book.bids, amount);
            }
        });
    }
    canL1Auth() {
        if (this.signer === undefined) {
            throw errors_1.L1_AUTH_UNAVAILABLE_ERROR;
        }
    }
    canL2Auth() {
        if (this.signer === undefined) {
            throw errors_1.L1_AUTH_UNAVAILABLE_ERROR;
        }
        if (this.creds === undefined) {
            throw errors_1.L2_AUTH_NOT_AVAILABLE;
        }
    }
    _resolveTickSize(tokenID, tickSize) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const minTickSize = yield this.getTickSize(tokenID);
            if (tickSize) {
                if ((0, utilities_1.isTickSizeSmaller)(tickSize, minTickSize)) {
                    throw new Error(`invalid tick size (${tickSize}), minimum for the market is ${minTickSize}`);
                }
            }
            else {
                tickSize = minTickSize;
            }
            return tickSize;
        });
    }
    get(endpoint, options) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            // Используем this.axiosInstance вместо глобальной функции get
            const response = yield this.axiosInstance.get(endpoint, Object.assign(Object.assign({}, options), { params: Object.assign(Object.assign({}, options === null || options === void 0 ? void 0 : options.params), { geo_block_token: this.geoBlockToken }), headers: options === null || options === void 0 ? void 0 : options.headers }));
            return response.data;
        });
    }
    post(endpoint, options) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            // Используем this.axiosInstance вместо глобальной функции post
            const response = yield this.axiosInstance.post(endpoint, options === null || options === void 0 ? void 0 : options.data, Object.assign(Object.assign({}, options), { params: Object.assign(Object.assign({}, options === null || options === void 0 ? void 0 : options.params), { geo_block_token: this.geoBlockToken }), headers: options === null || options === void 0 ? void 0 : options.headers }));
            return response.data;
        });
    }
    del(endpoint, options) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            // Используем this.axiosInstance вместо глобальной функции del
            const response = yield this.axiosInstance.delete(endpoint, Object.assign(Object.assign({}, options), { params: Object.assign(Object.assign({}, options === null || options === void 0 ? void 0 : options.params), { geo_block_token: this.geoBlockToken }), headers: options === null || options === void 0 ? void 0 : options.headers, data: options === null || options === void 0 ? void 0 : options.data }));
            return response.data;
        });
    }
}
exports.ClobClient = ClobClient;
//# sourceMappingURL=client.js.map