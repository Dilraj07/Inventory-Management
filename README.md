# Saaman: Predictive Inventory & Reorder System

<div align="center">

![Saaman Dashboard](https://img.shields.io/badge/Status-Production%20Ready-success?style=for-the-badge)
![Python](https://img.shields.io/badge/Python-3.8+-blue?style=for-the-badge&logo=python)
![React](https://img.shields.io/badge/React-18+-61DAFB?style=for-the-badge&logo=react)
![FastAPI](https://img.shields.io/badge/FastAPI-Latest-009688?style=for-the-badge&logo=fastapi)

**A full-stack warehouse management system demonstrating practical applications of Data Structures & Algorithms**

[Features](#-key-features) • [Tech Stack](#-tech-stack) • [Installation](#-installation) • [Usage](#-usage-guide) • [DSA Implementation](#-data-structures--algorithms)

</div>

---

## 🚀 Project Overview

**Saaman** (Hindi: सामान, meaning "goods/inventory") is an intelligent warehouse management solution that showcases how **Data Structures & Algorithms** solve real-world business problems. Unlike traditional inventory systems that rely on simple database queries, Saaman uses optimized data structures for each operation.

### Why Saaman?

Traditional inventory systems often struggle with:

- **Slow priority calculations** - Scanning entire databases to find critical items
- **Inefficient lookups** - Linear searches for product information
- **Poor order processing** - Unoptimized queue management
- **Complex audit scheduling** - Manual rotation tracking

Saaman solves these problems using purpose-built data structures, achieving **O(1) and O(log n)** operations where traditional systems use **O(n)**.

---

## ✨ Key Features

### 📊 **Smart Priority Management**

- **Min-Heap based prioritization** - Instantly identifies items closest to stockout
- **Predictive analytics** - Linear regression forecasts stock depletion dates
- **Real-time alerts** - Dashboard highlights critical inventory with days remaining

### 🌐 **Multi-Language Support**

Built for diverse workforces with full localization:

- **English** - Default interface
- **Hindi (हिंदी)** - Complete UI translation
- **Kannada (ಕನ್ನಡ)** - Regional language support

### 🎯 **Intelligent Inventory Management**

- **BST-based stability sorting** - Efficiently organizes products by stability score
- **Hash table lookups** - O(1) product information retrieval by SKU
- **Visual stock indicators** - Color-coded alerts (Critical/Healthy)
- **Add/Update/Delete operations** - Full CRUD functionality

### 📦 **Shipment Queue System**

- **FIFO Queue implementation** - Fair order processing
- **Animated trolley visualization** - Real-time shipment tracking
- **Warehouse → Packing → Dispatch** - Visual workflow representation

### 📋 **Audit Scheduling**

- **Circular Linked List** - Continuous rotation through warehouse sections
- **Automated scheduling** - Never miss an audit cycle
- **Visual rotation display** - See upcoming audit sequence

### 🔒 **Safety & Compliance**

- **Set-based lot blocking** - O(1) quarantine checks
- **Restricted item management** - Prevent shipment of blocked lots
- **Audit trail** - Track all inventory changes

---

## 🛠️ Tech Stack

### Frontend

| Technology        | Purpose                                         |
| ----------------- | ----------------------------------------------- |
| **React 18+**     | Modern UI framework with hooks                  |
| **Vite**          | Lightning-fast build tool and dev server        |
| **Tailwind CSS**  | Utility-first styling with custom design system |
| **Lucide React**  | Beautiful, consistent iconography               |
| **Axios**         | HTTP client for API communication               |
| **React Context** | State management for language switching         |

### Backend

| Technology       | Purpose                                 |
| ---------------- | --------------------------------------- |
| **FastAPI**      | High-performance Python web framework   |
| **Uvicorn**      | ASGI server for async operations        |
| **SQLite**       | Lightweight, embedded database          |
| **Pandas**       | Data manipulation and analysis          |
| **Scikit-Learn** | Machine learning for stock predictions  |
| **Pydantic**     | Data validation and settings management |

---

## 🧠 Data Structures & Algorithms

Saaman demonstrates practical DSA applications in production code:

| Feature               | Data Structure           | Time Complexity                 | Why?                                                                 |
| --------------------- | ------------------------ | ------------------------------- | -------------------------------------------------------------------- |
| **Priority Queue**    | **Min-Heap**             | O(1) peek, O(log n) insert      | Instantly access the most critical item without sorting 31+ products |
| **Product Lookup**    | **Hash Table**           | O(1) average                    | Direct SKU-to-product mapping for instant retrieval                  |
| **Stability Sorting** | **Binary Search Tree**   | O(log n) insert, O(n) traversal | Maintains sorted order for efficient range queries                   |
| **Order Processing**  | **Queue (FIFO)**         | O(1) enqueue/dequeue            | Ensures fair, first-come-first-served order fulfillment              |
| **Audit Rotation**    | **Circular Linked List** | O(1) next section               | Infinite rotation through warehouse sections                         |
| **Lot Blocking**      | **Set**                  | O(1) membership test            | Fast quarantine checks before shipment                               |

### 📈 Data Flow Architecture

```
┌─────────────────┐
│  SQLite Database│
└────────┬────────┘
         │
         ▼
┌─────────────────────────────────────────────┐
│         Data Ingestion Layer                │
│  • Hash Table: SKU → Product mapping        │
│  • Sales history aggregation                │
└────────┬────────────────────────────────────┘
         │
         ▼
┌─────────────────────────────────────────────┐
│       Prediction Engine (ML)                │
│  • Linear Regression: Burn Rate calculation │
│  • Formula: Days = Stock / Burn Rate        │
└────────┬────────────────────────────────────┘
         │
         ▼
┌─────────────────────────────────────────────┐
│      Prioritization Layer                   │
│  • Min-Heap: Priority queue construction    │
│  • BST: Stability score sorting             │
└────────┬────────────────────────────────────┘
         │
         ▼
┌─────────────────────────────────────────────┐
│         Action Layer (UI)                   │
│  • Dashboard: Heap root as hero alert       │
│  • Shipments: FIFO queue visualization      │
│  • Reporting: Circular list audit schedule  │
└─────────────────────────────────────────────┘
```

---

## 📂 Project Structure

```
PIRS-Predictive-Inventory-and-Reorder-System/
│
├── backend/                      # Python Backend
│   ├── api.py                   # FastAPI routes & endpoints
│   ├── database_setup.py        # SQLite schema & initialization
│   ├── data_ingestion.py        # Hash table creation from DB
│   ├── data_manager.py          # CRUD operations
│   ├── prediction_engine.py     # ML forecasting logic
│   ├── prioritization.py        # Min-Heap implementation
│   ├── floor_operations.py      # Queue & Set logic
│   ├── reporting.py             # BST & Circular Linked List
│   ├── seed_db.py               # Mock data generation
│   ├── main.py                  # CLI demo script
│   ├── requirements.txt         # Python dependencies
│   └── pirs_warehouse.db        # SQLite database file
│
└── frontend/                     # React Application
    ├── src/
    │   ├── components/          # Reusable UI components
    │   │   ├── Sidebar.jsx      # Navigation sidebar
    │   │   ├── Card.jsx         # Metric cards
    │   │   ├── InventoryTable.jsx
    │   │   ├── ShipmentQueueViewer.jsx
    │   │   ├── TrolleyAnimation.jsx
    │   │   ├── AddProductForm.jsx
    │   │   └── LanguageSelector.jsx
    │   ├── contexts/
    │   │   └── LanguageContext.jsx  # i18n state management
    │   ├── locales/
    │   │   └── translations.js      # English/Hindi/Kannada
    │   ├── App.jsx              # Main application
    │   └── main.jsx             # React entry point
    ├── public/                  # Static assets
    ├── package.json
    └── vite.config.js
```

---

## ⚡ Installation

### Prerequisites

- **Node.js** 16+ and npm
- **Python** 3.8+
- **Git**

### Step 1: Clone the Repository

```bash
git clone https://github.com/Dilraj07/PIRS-Predictive-Inventory-and-Reorder-System.git
cd PIRS-Predictive-Inventory-and-Reorder-System
```

### Step 2: Backend Setup

```bash
cd backend

# Install Python dependencies
pip install -r requirements.txt

# Initialize database with mock data
python database_setup.py

# Start FastAPI server
python -m uvicorn api:app --reload
```

**Backend will run on:** `http://localhost:8000`

### Step 3: Frontend Setup

```bash
cd frontend

# Install Node dependencies
npm install

# Start Vite dev server
npm run dev
```

**Frontend will run on:** `http://localhost:5173`

### Step 4: Access the Application

Open your browser and navigate to:

```
http://localhost:5173
```

---

## 📖 Usage Guide

### Dashboard View

The main dashboard displays:

- **Priority #1 Alert** - Min-Heap root showing the most critical item
- **SKUs Tracked** - Total products in inventory
- **Critical Alerts** - Count of items with <7 days stock remaining
- **Quick Inventory Table** - Recent items with stability scores

### Inventory Management

**View Inventory:**

- Click "Inventory" in sidebar
- Products sorted by BST stability score
- Color-coded status indicators (Critical/Healthy)

**Add New Product:**

1. Click "+ Add Product" button
2. Fill in: SKU, Name, Stock, Lead Time, Unit Cost
3. Submit - Product added to hash table and database

**Update Stock:**

- Click settings icon on any product
- Modify stock level
- Changes reflect immediately in priority calculations

**Delete Product:**

- Click delete icon
- Confirm removal
- Product removed from all data structures

### Shipment Processing

**Enqueue Order:**

1. Navigate to "Shipments" section
2. View FIFO queue visualization
3. Add order to queue
4. Watch animated trolley move through stages

**Queue Stages:**

- **Warehouse** - Order received
- **Packing** - Being prepared
- **Dispatch** - Ready for shipment

### Reporting & Audits

**Audit Schedule:**

- View circular linked list rotation
- See upcoming audit sections
- Track audit history

### Language Switching

1. Click language selector (bottom left)
2. Choose: English / हिंदी / ಕನ್ನಡ
3. Entire UI updates instantly

---

## 🔌 API Endpoints

### Dashboard

- `GET /api/dashboard/summary` - Get SKU count and critical alerts
- `GET /api/priority/top` - Get min-heap root (most critical item)

### Inventory

- `GET /api/inventory/stability` - Get BST-sorted inventory
- `POST /api/products` - Add new product
- `PUT /api/products/{sku}/stock` - Update stock level
- `DELETE /api/products/{sku}` - Delete product

### Shipments

- `POST /api/orders/enqueue` - Add order to FIFO queue
- `GET /api/shipping/queue` - View current queue

### Reporting

- `GET /api/audit/next` - Get audit rotation schedule

---

## 🎓 Educational Value

This project demonstrates:

### 1. **Heap Operations**

```python
# prioritization.py
def build_reorder_heap():
    heap = []
    for sku, product in products.items():
        days_left = calculate_priority_score(sku)
        heapq.heappush(heap, (days_left, sku))
    return heap
```

### 2. **BST Traversal**

```python
# reporting.py
def in_order_traversal(node):
    if not node:
        return []
    return (in_order_traversal(node.left) +
            [node.to_dict()] +
            in_order_traversal(node.right))
```

### 3. **Queue Implementation**

```python
# floor_operations.py
class ShippingQueue:
    def add_order(self, order):
        self.queue.append(order)  # O(1) enqueue

    def process_order(self):
        return self.queue.pop(0)  # O(1) dequeue
```

### 4. **Circular Linked List**

```python
# reporting.py
class AuditList:
    def get_next_audit(self):
        current = self.current.next
        self.current = current
        return current.section
```

---

## 🌟 Screenshots

### English Dashboard

![Dashboard](https://via.placeholder.com/800x400?text=Dashboard+View)

### Hindi Localization

![Hindi Dashboard](https://via.placeholder.com/800x400?text=Hindi+Dashboard)

### Inventory Management

![Inventory](https://via.placeholder.com/800x400?text=Inventory+Table)

### Shipment Queue

![Shipments](https://via.placeholder.com/800x400?text=FIFO+Queue+Visualization)

---

## 🚀 Future Enhancements

- [ ] **Graph Algorithms** - Shortest path for warehouse navigation
- [ ] **Trie Structure** - Autocomplete for product search
- [ ] **Bloom Filter** - Fast duplicate SKU detection
- [ ] **Redis Cache** - Distributed caching layer
- [ ] **WebSocket** - Real-time multi-user updates
- [ ] **Docker** - Containerized deployment
- [ ] **PostgreSQL** - Production-grade database
- [ ] **JWT Auth** - User authentication system

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

## 👥 Authors

- **Dilraj Singh** - [@Dilraj07](https://github.com/Dilraj07)

---

## 🙏 Acknowledgments

- **FastAPI** - For the amazing Python web framework
- **React Team** - For the powerful UI library
- **Tailwind CSS** - For the utility-first CSS framework
- **Lucide** - For beautiful open-source icons

---

<div align="center">

**Built with ❤️ to demonstrate practical DSA applications**

[⬆ Back to Top](#saaman-predictive-inventory--reorder-system)

</div>
