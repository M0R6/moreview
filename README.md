# Moreview

Moreview is an application developed by Morgan for movies & tv-shows enthusiasts to give their thoughts about movies they'd watched. This application is built using **Nuxt.js** for the frontend and **Nuxt.js Server** for the backend, with **MySQL** as the database. Originally this project is for a a test, UKK (Uji Kompetensi Keahlian). 

This project is hosted at [https://moreview.social/](https://moreview.social/).

## 📌 Installation & Configuration

### 1️⃣ Software Requirements
Before running MoreView, ensure you have installed the following software:
- **Node.js v20.12.2 or later**
- **NPM/Yarn/Bun (choose one you like for the Package Manager)**
- **Database Server: MySQL**
- **Git** (if you clone it from this GitHub repository)

### 2️⃣ Clone Repository
```bash
git clone https://github.com/M0R6/moreview.git
cd moreview
```

### 3️⃣ Install Dependencies
```bash
npm install
```

### 4️⃣ Configure Environment
Copy the `.env.sample` file to `.env` in the project root folder, then adjust the configurations as needed.

### 5️⃣ Import Database
1. Navigate to the database folder.
2. Import the SQL file using the following command (example for MySQL):
   ```bash
   mysql -u username -p database_name < database/moreview.sql
   ```

### 6️⃣ Run the Application
```bash
npm run dev
```
The application will run on `http://localhost:3000/` (default Nuxt.js).

## 📞 Contact
For any questions or suggestions, please contact [halomrgn@gmail.com](mailto:halomrgn@gmail.com).

---
Hope this helps! 🚀

