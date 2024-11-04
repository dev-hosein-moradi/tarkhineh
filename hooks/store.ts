'use client'

import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { FLUSH, PAUSE, PERSIST, persistReducer, PURGE, REGISTER, REHYDRATE } from "redux-persist";
import storage from "./storage";
import cartReducer from './use-cart';
import authReducer from "./use-auth-modal"
import addressReducer from "./use-address-modal"
import userReducer from "./use-user"
import userAddressReducer from "./use-address"

const persistConfig = {
    key: "root",
    storage,
    blacklist: ["tracking"],
};

const RootReducer = combineReducers({
    cart: cartReducer,
    auth: authReducer,
    address: addressReducer,
    user: userReducer,
    userAddress: userAddressReducer
});

const persistedReducer = persistReducer(persistConfig, RootReducer);

export const makeStore = () => {
    return configureStore({
        reducer: persistedReducer,
        devTools: process.env.NODE_ENV !== "production",
        middleware: (getDefaultMiddleware) =>
            getDefaultMiddleware({
                serializableCheck: {
                    ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
                },
            }),
    });
};

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
