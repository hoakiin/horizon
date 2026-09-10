## Banking App

Full-stack banking application built with **Next.js, TypeScript, Appwrite, Plaid and Dwolla**. The project provides a secure banking experience with authentication, multiple connected bank accounts, transaction history, analytics and money transfers.

### Tech Stack

* **Next.js** — application framework, routing and SSR
* **TypeScript** — static typing
* **Appwrite** — authentication and database
* **Plaid** — bank account integration and financial data
* **Dwolla** — money transfers
* **React Hook Form** — form management
* **Zod** — schema validation
* **Tailwind CSS** — styling
* **Chart.js** — financial data visualization
* **ShadCN UI** — reusable UI components

### Features

* **Authentication** — secure server-side authentication with validation and authorization
* **Bank Connections** — connecting and managing multiple bank accounts through Plaid
* **Dashboard** — overview of total balance, recent transactions, spending categories and connected accounts
* **My Banks** — list of connected bank accounts with balances and account details
* **Transaction History** — paginated and filtered transaction history for connected accounts
* **Real-time Updates** — automatic UI updates after connecting new bank accounts
* **Funds Transfer** — transferring funds through Dwolla using recipient and bank information
* **Responsive Design** — adaptive interface for desktop, tablet and mobile devices

### Environment Variables

Create a new file named `.env` in the root of your project and add the following content:

```env
# NEXT
NEXT_PUBLIC_SITE_URL=http://localhost:3000

# APPWRITE
NEXT_PUBLIC_APPWRITE_ENDPOINT=https://cloud.appwrite.io/v1
NEXT_PUBLIC_APPWRITE_PROJECT=
APPWRITE_DATABASE_ID=
APPWRITE_USER_COLLECTION_ID=
APPWRITE_BANK_COLLECTION_ID=
APPWRITE_TRANSACTION_COLLECTION_ID=
APPWRITE_SECRET=

# PLAID
PLAID_CLIENT_ID=
PLAID_SECRET=
PLAID_ENV=
PLAID_PRODUCTS=
PLAID_COUNTRY_CODES=

# DWOLLA
DWOLLA_KEY=
DWOLLA_SECRET=
DWOLLA_BASE_URL=https://api-sandbox.dwolla.com
DWOLLA_ENV=sandbox
```
Replace the placeholder values with your actual respective account credentials. You can obtain these credentials by signing up on the [Appwrite](https://appwrite.io/?utm_source=youtube&utm_content=reactnative&ref=JSmastery), [Plaid](https://plaid.com/) and [Dwolla](https://www.dwolla.com/)

### Getting Started

```bash
git clone https://github.com/adrianhajdin/banking.git
cd banking
npm install
npm run dev
```

The application will be available at:

```text
http://localhost:3000
```
