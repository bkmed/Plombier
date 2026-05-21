# Plombier Wallet

**Plombier** is a cross-platform personal finance wallet for Web, iOS, and Android. It helps users track daily spending, manage accounts, monitor recurring bills, review financial reports, and follow savings goals from one shared React Native codebase.

## Key Features

### Wallet Core

- **Accounts**: Cash, bank, credit card, and savings balances.
- **Transactions**: Expenses, income, transfers, notes, tags, status, and categories.
- **Quick Log**: One-tap shortcuts for frequent expenses.
- **Recurring Bills**: Due dates, reminders, pay-now flow, and overdue alerts.
- **Savings Goals**: Active goals, progress tracking, completed victories.
- **Reports**: Cash flow, spending allocation, budget cards, and CSV export.

### User Experience

- **Cross-platform UI**: Same `.tsx` screens for web and mobile.
- **Responsive Navigation**: Bottom tabs on web, drawer navigation on mobile.
- **Balance Privacy**: Hide or show balances globally.
- **Multilingual Ready**: English, French, Arabic, German, Spanish, Chinese, Hindi, Turkish, and Italian.
- **Offline-first Storage**: Web uses `localStorage`; native uses MMKV through the shared storage service.

## Documentation

- [Commercial Overview](Documents/Comercial.md)
- [Use Cases](Documents/use-cases.md)
- [Pages and Roles](Documents/pages-and-roles.md)
- [Functional Specification](Documents/cahier_des_charges_plombier_wallet.md)
- [Migration Notes](Documents/migration.md)
- [To Do](Documents/ToDo.md)

## Tech Stack

- **Framework**: React Native 0.82 + React Native Web
- **UI**: NativeWind / Tailwind tokens
- **State**: Redux Toolkit + redux-persist
- **Persistence**: `react-native-mmkv` on native, `localStorage` on web
- **Navigation**: React Navigation 7
- **Analytics & Notifications**: Firebase Analytics, Crashlytics, Notifee
- **i18n**: i18next + react-i18next
- **Testing**: Jest, Cypress, Detox

## Getting Started

### Prerequisites

- Node.js 20+
- npm
- React Native environment for iOS/Android builds

### Install

```bash
npm install
```

### Run Web

```bash
npm run start-web-dev-nossr
```

The dev server runs at `http://localhost:8002/` when the default port is available.

### Run Mobile

```bash
npm start
npm run start-ios
npm run start-android
```

## Project Structure

- `src/screens/home/`: wallet dashboard and quick log.
- `src/screens/wallet/`: history, reports, accounts, goals, and wallet modals.
- `src/screens/profile/`: profile, display, budgets, shortcuts, and data actions.
- `src/components/`: shared wallet UI such as `TopAppBar` and `TransactionRow`.
- `src/store/slices/`: Redux slices for `wallet`, `goals`, auth, notifications, messages, currencies, analytics, and users.
- `src/services/`: auth, session, storage, analytics, notifications, permissions, and RBAC.
- `src/i18n/`: locale files and i18next setup.

## Demo Accounts

| Role | Email | Password |
| :--- | :--- | :--- |
| Admin | `admin@demo.com` | `admin123` |
| User | `user@demo.com` | `user123` |

## Verification

```bash
npx tsc --noEmit
npm run start-web-dev-nossr
```

## License

MIT
