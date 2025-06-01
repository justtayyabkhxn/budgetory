# 💰 MyBudgetory – Your Smart Budget Tracker

**MyBudgetory** is a sleek and intuitive budget tracking web application that empowers users to manage income and expenses with ease. Built using **Next.js** and **MongoDB**, it provides intelligent insights through visual dashboards, allowing users to make informed financial decisions.

## 🚀 Features

* 🔐 **User Authentication** – Secure signup/login to manage your financial records.
* 🧾 **Daily Entry System** – Add and view categorized expenses and inflows with notes.
* 📊 **Stats Dashboard**

  * 💸 Most spending day
  * 💰 Most inflow day
  * 📆 Average monthly spending
  * 🏆 Highest inflow & spending months
  * 🧩 Top & least spent categories
* 📅 **Timeframe Filters** – Toggle views by week, month, or year.
* 📈 **Interactive Charts** – Bar and pie charts for visual breakdowns.
* 🧠 **Smart Suggestions** (Coming Soon)

  * Overspending alerts
  * Irregular inflow detection
* 📤 **Exporting Features** (Planned)

  * Download data as CSV
* 🧑‍🤝‍🧑 **Multi-User Collaboration** (Planned)
* 📱 **Mobile Optimized & PWA Support** (Planned)

## 🛠️ Tech Stack

* **Frontend**: [Next.js](https://nextjs.org/), [Tailwind CSS](https://tailwindcss.com)
* **Backend**: \[Next.js API Routes], \[Node.js]
* **Database**: [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
* **Authentication**: \[NextAuth.js] or custom JWT-based system

## 📦 Installation

```bash
git clone https://github.com/justtayyabkhxn/mybudgetory.git
cd budgetory
npm install
```

### 📄 Configure `.env.local`

Create a `.env.local` file in the root directory with the following content:

```env
MONGODB_URI=your_mongodb_connection_string
NEXTAUTH_SECRET=your_secret
NEXTAUTH_URL=http://localhost:3000
```

## 💻 Start Development Server

```bash
npm run dev
```

Then open [http://localhost:3000](http://localhost:3000) in your browser.

## 📁 Folder Structure

```
/pages
  ├── /api          → API endpoints for auth, transactions, stats
  ├── /auth         → Login and signup pages
  └── index.tsx     → Main dashboard

/components         → Reusable UI components
/lib                → MongoDB connection, utility functions
/styles             → Tailwind and global styles
```

## 🧠 Future Roadmap

* 🔔 Budget limit notifications
* 📆 Recurring income/expenses
* 📤 Import/export functionality (CSV/JSON)
* 🧑‍🤝‍🧑 Shared budget management (households or teams)
* 📱 PWA support for offline and mobile-first use
* 🧠 AI-based financial tips and pattern detection

## 🤝 Contributing

Contributions and suggestions are welcome!
Feel free to fork the repository and submit a pull request.



