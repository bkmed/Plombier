import { configureStore, combineReducers } from '@reduxjs/toolkit';
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from 'redux-persist';
import { reduxStorage } from './storage';

// Import slices
import authReducer from './slices/authSlice';
import announcementsReducer from './slices/announcementsSlice';
import notificationsReducer from './slices/notificationsSlice';
import messagesReducer from './slices/messagesSlice';
import currenciesReducer from './slices/currenciesSlice';
import analyticsReducer from './slices/analyticsSlice';
import usersReducer from './slices/usersSlice';
import walletReducer from './slices/walletSlice';
import goalsReducer from './slices/goalsSlice';
import categoriesReducer from './slices/categoriesSlice';
import partsReducer from './slices/partsSlice';
import plombierSettingsReducer from './slices/plombierSettingsSlice';
import galleryReducer from './slices/gallerySlice';
import uiReducer from './slices/uiSlice';

const rootReducer = combineReducers({
  auth: authReducer,
  announcements: announcementsReducer,
  notifications: notificationsReducer,
  messages: messagesReducer,
  currencies: currenciesReducer,
  analytics: analyticsReducer,
  users: usersReducer,
  wallet: walletReducer,
  goals: goalsReducer,
  categories: categoriesReducer,
  parts: partsReducer,
  gallery: galleryReducer,
  plombierSettings: plombierSettingsReducer,
  ui: uiReducer,
});

const persistConfig = {
  key: 'root',
  storage: reduxStorage,
  whitelist: [
    'auth',
    'announcements',
    'notifications',
    'messages',
    'currencies',
    'analytics',
    'users',
    'wallet',
    'goals',
    'categories',
    'parts',
    'gallery',
    'plombierSettings',
    'ui',
  ], // add slices here to persist
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
