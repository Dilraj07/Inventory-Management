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
    # Seed Synthetic Data (30 Products)
    import random
    from datetime import datetime, timedelta

    categories = {
        'Electronics': ['Mouse', 'Keyboard', 'Monitor', 'Cable', 'Charger', 'Headset', 'Webcam', 'Microphone', 'Laptop Stand', 'USB Hub'],
        'Office': ['Paper', 'Pen', 'Stapler', 'Binder', 'Folder', 'Notepad', 'Desk Lamp', 'Chair', 'Whiteboard', 'Marker'],
        'Kitchen': ['Mug', 'Plate', 'Fork', 'Spoon', 'Knife', 'Bowl', 'Glass', 'Napkin', 'Towel', 'Soap']
    }
    
    products_data = []
    sales_data = []
    
    sku_counter = 1
    for cat, items in categories.items():
        for item in items:
            sku = f"SKU{sku_counter:03d}"
            name = f"{item} ({cat})"
            
            # Randomize stats to create "Critical", "Stable", and "Overstocked" scenarios
            stock = random.randint(5, 200) 
            lead = random.randint(2, 14)
            cost = round(random.uniform(400.0, 12000.0), 2)
            
            products_data.append((sku, name, stock, lead, cost))
            
            # Generate sales history (last 30 days)
            # Create patterns: High demand vs Low demand
            daily_demand = random.randint(0, 5) if stock > 50 else random.randint(1, 10) # Inverse logic to force some criticals
            
            start_date = datetime.now()
            for i in range(10): # Last 10 days output
                date_str = (start_date - timedelta(days=i)).strftime('%Y-%m-%d')
                qty = max(0, daily_demand + random.randint(-2, 2)) # Variance
                if qty > 0:
                    sales_data.append((sku, qty, date_str))
            
            sku_counter += 1

    cursor.executemany('INSERT OR IGNORE INTO products VALUES (?,?,?,?,?)', products_data)
    cursor.executemany('INSERT INTO sales_history (sku, qty_sold, sale_date) VALUES (?,?,?)', sales_data)

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