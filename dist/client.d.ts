import { Wallet } from "@ethersproject/wallet";
import { JsonRpcSigner } from "@ethersproject/providers";
import { SignatureType, SignedOrder } from "@polymarket/order-utils";
import { ApiKeyCreds, ApiKeysResponse, Chain, CreateOrderOptions, MarketPrice, OpenOrderParams, OpenOrdersResponse, OrderMarketCancelParams, OrderBookSummary, OrderPayload, OrderType, Side, Trade, Notification, TradeParams, UserMarketOrder, UserOrder, BalanceAllowanceParams, BalanceAllowanceResponse, OrderScoringParams, OrderScoring, OpenOrder, TickSizes, TickSize, OrdersScoringParams, OrdersScoring, PriceHistoryFilterParams, PaginationPayload, MarketTradeEvent, DropNotificationParams, BookParams, UserEarning, RewardsPercentages, MarketReward, UserRewardsEarning, TotalUserEarning, NegRisk } from "./types";
import { RequestOptions } from "./http-helpers";
import { OrderBuilder } from "./order-builder/builder";
import { AxiosInstance } from 'axios';
export declare class ClobClient {
    readonly host: string;
    readonly chainId: Chain;
    readonly signer?: Wallet | JsonRpcSigner;
    readonly creds?: ApiKeyCreds;
    readonly orderBuilder: OrderBuilder;
    readonly tickSizes: TickSizes;
    readonly negRisk: NegRisk;
    readonly geoBlockToken?: string;
    readonly useServerTime?: boolean;
    private axiosInstance;
    constructor(host: string, chainId: Chain, signer?: Wallet | JsonRpcSigner, creds?: ApiKeyCreds, signatureType?: SignatureType, funderAddress?: string, geoBlockToken?: string, useServerTime?: boolean, axiosInstance?: AxiosInstance);
    getOk(): Promise<any>;
    getServerTime(): Promise<number>;
    getSamplingSimplifiedMarkets(next_cursor?: string): Promise<PaginationPayload>;
    getSamplingMarkets(next_cursor?: string): Promise<PaginationPayload>;
    getSimplifiedMarkets(next_cursor?: string): Promise<PaginationPayload>;
    getMarkets(next_cursor?: string): Promise<PaginationPayload>;
    getMarket(conditionID: string): Promise<any>;
    getOrderBook(tokenID: string): Promise<OrderBookSummary>;
    getOrderBooks(params: BookParams[]): Promise<OrderBookSummary[]>;
    getTickSize(tokenID: string): Promise<TickSize>;
    getNegRisk(tokenID: string): Promise<boolean>;
    /**
     * Calculates the hash for the given orderbook
     * @param orderbook
     * @returns
     */
    getOrderBookHash(orderbook: OrderBookSummary): string;
    getMidpoint(tokenID: string): Promise<any>;
    getMidpoints(params: BookParams[]): Promise<any>;
    getPrice(tokenID: string, side: string): Promise<any>;
    getPrices(params: BookParams[]): Promise<any>;
    getSpread(tokenID: string): Promise<any>;
    getSpreads(params: BookParams[]): Promise<any>;
    getLastTradePrice(tokenID: string): Promise<any>;
    getLastTradesPrices(params: BookParams[]): Promise<any>;
    getPricesHistory(params: PriceHistoryFilterParams): Promise<MarketPrice[]>;
    /**
     * Creates a new API key for a user
     * @param nonce
     * @returns ApiKeyCreds
     */
    createApiKey(nonce?: number): Promise<ApiKeyCreds>;
    /**
     * Derives an existing API key for a user
     * @param nonce
     * @returns ApiKeyCreds
     */
    deriveApiKey(nonce?: number): Promise<ApiKeyCreds>;
    createOrDeriveApiKey(nonce?: number): Promise<ApiKeyCreds>;
    getApiKeys(): Promise<ApiKeysResponse>;
    deleteApiKey(): Promise<any>;
    getOrder(orderID: string): Promise<OpenOrder>;
    getTrades(params?: TradeParams, only_first_page?: boolean, next_cursor?: string): Promise<Trade[]>;
    getNotifications(): Promise<Notification[]>;
    dropNotifications(params?: DropNotificationParams): Promise<void>;
    getBalanceAllowance(params?: BalanceAllowanceParams): Promise<BalanceAllowanceResponse>;
    updateBalanceAllowance(params?: BalanceAllowanceParams): Promise<void>;
    createOrder(userOrder: UserOrder, options?: Partial<CreateOrderOptions>): Promise<SignedOrder>;
    createMarketBuyOrder(userMarketOrder: UserMarketOrder, options?: Partial<CreateOrderOptions>): Promise<SignedOrder>;
    getOpenOrders(params?: OpenOrderParams, only_first_page?: boolean, next_cursor?: string): Promise<OpenOrdersResponse>;
    postOrder<T extends OrderType = OrderType.GTC>(order: SignedOrder, orderType?: T): Promise<any>;
    cancelOrder(payload: OrderPayload): Promise<any>;
    cancelOrders(ordersHashes: string[]): Promise<any>;
    cancelAll(): Promise<any>;
    cancelMarketOrders(payload: OrderMarketCancelParams): Promise<any>;
    isOrderScoring(params?: OrderScoringParams): Promise<OrderScoring>;
    areOrdersScoring(params?: OrdersScoringParams): Promise<OrdersScoring>;
    getEarningsForUserForDay(date: string): Promise<UserEarning[]>;
    getTotalEarningsForUserForDay(date: string): Promise<TotalUserEarning[]>;
    getUserEarningsAndMarketsConfig(date: string, order_by?: string, position?: string): Promise<UserRewardsEarning[]>;
    getRewardPercentages(): Promise<RewardsPercentages>;
    getCurrentRewards(): Promise<MarketReward[]>;
    getRawRewardsForMarket(conditionId: string): Promise<MarketReward[]>;
    getMarketTradesEvents(conditionID: string): Promise<MarketTradeEvent[]>;
    calculateMarketPrice(tokenID: string, side: Side, amount: number): Promise<number>;
    private canL1Auth;
    private canL2Auth;
    private _resolveTickSize;
    protected get(endpoint: string, options?: RequestOptions): Promise<any>;
    protected post(endpoint: string, options?: RequestOptions): Promise<any>;
    protected del(endpoint: string, options?: RequestOptions): Promise<any>;
}
