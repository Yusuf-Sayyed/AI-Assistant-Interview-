import { configureStore, combineReducers } from '@reduxjs/toolkit';
    import { persistStore, persistReducer } from 'redux-persist';
    import localForage from 'localforage';
    import interviewReducer from '../features/interviewSlice';
    import candidatesReducer from '../features/candidatesSlice';

    const rootReducer = combineReducers({
    interview: interviewReducer,
    candidates: candidatesReducer, // Make sure this is included
    });

    const persistConfig = {
    key: 'root',
    storage: localForage,
    whitelist: ['interview', 'candidates'],
    };

    const persistedReducer = persistReducer(persistConfig, rootReducer);

    export const store = configureStore({
        reducer: persistedReducer,
        middleware: (getDefaultMiddleware) =>
            getDefaultMiddleware({
                serializableCheck: false,
            }),
        });

    export const persistor = persistStore(store);

    export type RootState = ReturnType<typeof store.getState>;
    export type AppDispatch = typeof store.dispatch;