import sqlite3

def setup_database():
    # Connect to (or create) the database file
    conn = sqlite3.connect('pirs_warehouse.db')
    cursor = conn.cursor()

    # 1. Product Master Table (For Hash Table & BST)
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS products (
            sku TEXT PRIMARY KEY,
            name TEXT NOT NULL,
            current_stock INTEGER DEFAULT 0,
            lead_time_days INTEGER DEFAULT 7,
            unit_cost REAL
        )
    ''')

    # 2. Sales History Table (For Dynamic Array/Prediction)
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS sales_history (
            txn_id INTEGER PRIMARY KEY AUTOINCREMENT,
            sku TEXT,
            qty_sold INTEGER,
            sale_date DATE,
            FOREIGN KEY (sku) REFERENCES products(sku)
        )
    ''')

    # 3. Lot Tracking Table (For Set/Safety Checks)
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS inventory_lots (
            lot_id TEXT PRIMARY KEY,
            sku TEXT,
            expiry_date DATE,
            is_recalled INTEGER DEFAULT 0,
            FOREIGN KEY (sku) REFERENCES products(sku)
        )
    ''')

    # Seed initial product data
    sample_products = [
        ('SKU001', 'Organic Milk', 150, 2, 3.50),
        ('SKU002', 'Smartphone Case', 45, 5, 12.00),
        ('SKU003', 'Pain Reliever', 300, 7, 8.50)
    ]
    
    cursor.executemany('INSERT OR IGNORE INTO products VALUES (?,?,?,?,?)', sample_products)

    # Seed initial sales data (to test prediction)
    # SKU001 (Milk): High sales (10/day), huge stock (150). Days left = 15.
    # SKU002 (Case): Low sales (1/day), low stock (45). Days left = 45.
    # SKU003 (Meds): High sales (20/day), med stock (300). Days left = 15.
    sample_sales = [
        ('SKU001', 10, '2023-10-01'), ('SKU001', 10, '2023-10-02'),
        ('SKU002', 1, '2023-10-01'), ('SKU002', 1, '2023-10-02'),
        ('SKU003', 20, '2023-10-01'), ('SKU003', 20, '2023-10-02')
    ]
    cursor.executemany('INSERT INTO sales_history (sku, qty_sold, sale_date) VALUES (?,?,?)', sample_sales)

    conn.commit()
    conn.close()
    print("Database 'pirs_warehouse.db' initialized successfully!")

if __name__ == "__main__":
    setup_database()