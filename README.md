# PIRS: Predictive Inventory & Reorder System

## 🚀 Project Overview

**PIRS (Predictive Inventory & Reorder System)** is a full-stack warehouse management solution designed to demonstrate the practical application of **Data Structures & Algorithms (DSA)** in real-world scenarios.

Unlike traditional inventory dashboards, PIRS relies on specific data structures to optimized key warehouse operations:
*   **Min-Heaps** for emergency restock prioritization.
*   **Binary Search Trees (BST)** for stability analysis.
*   **Queues** for shipment processing.
*   **Hash Tables** for instant SKU lookup.

## 🛠️ Tech Stack

### Frontend
*   **React + Vite**: Fast, modern UI framework.
*   **Tailwind CSS**: Utility-first styling with custom "Premium SaaS" aesthetics.
*   **Lucide React**: Clean, modern iconography.
*   **Axios**: API communication.

### Backend
*   **Python (FastAPI)**: High-performance API handling.
*   **Pandas**: Data manipulation and ingestion.
*   **Scikit-Learn**: Simple Linear Regression for stock depletion forecasting.
*   **SQLite**: Lightweight relational database for persistent storage.

## 🧠 Data Structures & Algorithms

Everything in PIRS is built showing *why* a specific data structure is chosen for a task.

| Feature | Data Structure | Why? |
| :--- | :--- | :--- |
| **Prioritization** | **Min-Heap** | Instantly access the item with the *lowest* days remaining ($O(1)$) without sorting the whole list. |
| **Inventory Lookup** | **Hash Table** | Access product details by SKU in constant time ($O(1)$). |
| **Stability Sorting** | **Binary Search Tree** | Maintains an ordered list of products by stability score, supporting efficient range queries. |
| **Shipments** | **Queue (FIFO)** | Ensures orders are processed strictly in the order they were received (First-In, First-Out). |
| **Audit Schedule** | **Circular Linked List** | Rotates through warehouse sections indefinitely for continuous auditing cycles. |
| **Safety Checks** | **Set** | $O(1)$ membership checking to strictly block restricted or quarantined lots. |

## 🔄 Data Workflow

1.  **Ingestion Phase**:
    *   Raw data is pulled from `inventory_system.db`.
    *   Sales history is loaded into **Hash Maps** for quick aggregation.

2.  **Prediction Phase**:
    *   The `PredictionEngine` runs a Linear Regression on sales history to calculate the **Burn Rate** (units/day).
    *   *Days Remaining* is calculated: $\text{Current Stock} / \text{Burn Rate}$.

3.  **Prioritization Phase**:
    *   Products are pushed into a **Min-Heap**.
    *   The system automatically surfaces the item with the closest stockout date as the "Critical Priority".

4.  **Action Phase**:
    *   **Dashboard**: Displays the Heap Root as the "Hero" alert.
    *   **Shipments**: User actions enqueue orders into the **FIFO Queue**.

## 📂 Project Structure

```bash
PIRS/
├── api.py                 # FastAPI backend entry point
├── database_setup.py      # Seeds SQLite DB with mock data
├── data_ingestion.py      # Handles DB extraction & Hash Table creation
├── prediction_engine.py   # Forecasting logic
├── prioritization.py      # Min-Heap implementation
├── floor_operations.py    # Queue & Set logic
├── reporting.py           # BST & Linked List implementation
└── frontend/              # React Application
    ├── src/
    │   ├── components/    # Reusable UI components (Sidebar, Cards)
    │   └── App.jsx        # Main Dashboard View
```

## ⚡ Getting Started

### Prerequisites
*   Node.js & npm
*   Python 3.8+

### Installation

1.  **Clone the Repository**
    ```bash
    git clone https://github.com/Dilraj07/PIRS-Predictive-Inventory-and-Reorder-System.git
    cd PIRS-Predictive-Inventory-and-Reorder-System
    ```

2.  **Backend Setup**
    ```bash
    # Install dependencies
    pip install fastapi uvicorn pandas scikit-learn

    # Initialize Database
    python database_setup.py

    # Start Server
    python -m uvicorn api:app --reload
    ```

3.  **Frontend Setup**
    ```bash
    cd frontend
    npm install
    npm run dev
    ```

4.  **Access the Dashboard**
    *   Open `http://localhost:5173` in your browser.

## 📸 visualizaton

*   **Dashboard**: Shows real-time priority alerts using Heap logic.
*   **Inventory**: Customizable table for stock management.
*   **Reports**: Visualizes the audit rotation cycle.
