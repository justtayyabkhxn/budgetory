# 💰 Budgetory – Your Smart Budget Tracker

**Budgetory** is a modern web application that helps users efficiently track their income and expenses. Built using **Next.js** and **MongoDB**, it offers powerful analytics and visual insights like category-based breakdowns, most spending/inflow days, and monthly summaries. Budgetory empowers users to take control of their finances with clarity and ease.

## 🚀 Features

* 🔐 **User Authentication** – Sign up/login to manage your personal data securely.
* 🧾 **Daily Entry System** – Add expenses and inflows with category and note fields.
* 📊 **Stats Dashboard** –

  * Most spending day
  * Most inflow day
  * Average spending (monthly)
  * Highest inflow and spending months
  * Top and least spent categories
* 📅 **Filter by Timeframe** – Weekly, monthly, and yearly views.
* 📈 **Charts & Visual Insights** – Interactive pie and bar charts for quick analysis.
* 💡 **Smart Suggestions** (Upcoming) – Alerts on overspending or irregular inflow patterns.

## 🛠️ Tech Stack

* **Frontend**: [Next.js](https://nextjs.org/), [Tailwind CSS](https://tailwindcss.com/)
* **Backend**: \[Next.js API Routes], \[Node.js], \[Express (optional)]
* **Database**: [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
* **Authentication**: \[NextAuth.js] (or your preferred method)

## 📦 Installation

```bash
git clone https://github.com/yourusername/budgetory.git
cd budgetory
npm install
```

### Set up `.env.local`

Create a `.env.local` file in the root directory and add your environment variables:

```env
MONGODB_URI=your_mongodb_connection_string
NEXTAUTH_SECRET=your_secret
NEXTAUTH_URL=http://localhost:3000
```

## 💻 Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the app.

## 📁 Folder Structure

```
/pages
  - /api         → API routes (add transaction, get stats)
  - /auth        → Auth-related pages
  - index.tsx    → Dashboard home
/components      → Reusable UI components
/lib             → DB connection, utilities
/styles          → Global styles
```

## 🧠 Future Roadmap

* 🔔 Notifications for budget limits
* 📆 Recurring transactions
* 📥 Import/export CSV
* 🧑‍🤝‍🧑 Shared budgets (multi-user support)
* 📱 PWA support for mobile usage

## 🤝 Contributing

Contributions are welcome! Please fork the repo and submit a pull request.

## 📄 License

This project is licensed under the [MIT License](LICENSE).

---

