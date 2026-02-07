import sqlite3

def setup_database():
    # Connect to (or create) the database file
    # Connect to (or create) the database file
    conn = sqlite3.connect('pirs_warehouse.db')
    cursor = conn.cursor()

    # Reset tables to clean slate
    cursor.execute("DROP TABLE IF EXISTS sales_history")
    cursor.execute("DROP TABLE IF EXISTS inventory_lots")
    cursor.execute("DROP TABLE IF EXISTS customer_orders")
    cursor.execute("DROP TABLE IF EXISTS products") # Drop master last or verify FK constraints? SQLite defaults usually lax, but better safe.

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
    # Seed Synthetic Data (100+ Products)
    import random
    from datetime import datetime, timedelta

    # Simplified Product Catalog - Only 6 items for better visualization
    products_catalog = [
        ('SKU001', 'Mouse (Electronics)', 349.00),
        ('SKU002', 'Keyboard (Electronics)', 599.00),
        ('SKU003', 'Monitor (Electronics)', 7499.00),
        ('SKU004', 'Paper (Office)', 260.00),
        ('SKU005', 'Pen (Office)', 50.00),
        ('SKU006', 'Bowl (Kitchen)', 99.00),
    ]

    products_data = []
    sales_data = []
    
    for sku, name, cost in products_catalog:
        # Set stock to 1 for all products
        stock = 1
        lead = random.randint(2, 21)
        
        products_data.append((sku, name, stock, lead, cost))
        
        # Generate sales history
        daily_demand = random.randint(0, 10)
        start_date = datetime.now()
        for i in range(15): 
            date_str = (start_date - timedelta(days=i)).strftime('%Y-%m-%d')
            qty = max(0, daily_demand + random.randint(-3, 5)) 
            if qty > 0:
                sales_data.append((sku, qty, date_str))

    cursor.executemany('INSERT OR IGNORE INTO products VALUES (?,?,?,?,?)', products_data)
    cursor.executemany('INSERT INTO sales_history (sku, qty_sold, sale_date) VALUES (?,?,?)', sales_data)

    # Seed initial sales data (to test prediction)
    # SKU001 (Milk): High sales (10/day), huge stock (150). Days left = 15.
    sample_sales = [
        ('SKU001', 10, '2023-10-01'), ('SKU001', 10, '2023-10-02'),
        ('SKU002', 1, '2023-10-01'), ('SKU002', 1, '2023-10-02')
    ]
    cursor.executemany('INSERT INTO sales_history (sku, qty_sold, sale_date) VALUES (?,?,?)', sample_sales)

    # 4. Customer Orders Table (For Priority Queue/Heap)
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS customer_orders (
            order_id TEXT PRIMARY KEY,
            customer_tier INTEGER,
            order_date DATE,
            sku TEXT,
            product_name TEXT,
            qty_requested INTEGER,
            total_amount REAL,
            status TEXT,
            FOREIGN KEY (sku) REFERENCES products(sku)
        )
    ''')
    
    # Seed Customer Orders
    orders_data = []
    statuses = ['PENDING', 'SHIPPED', 'BLOCKED']
    # Weighted statuses: mostly SHIPPED
    status_weights = [0.2, 0.7, 0.1] 
    
    order_counter = 1001
    for sku, name, _, _, cost in products_data:
        # Generate 5-20 orders per product
        num_orders = random.randint(5, 20)
        for _ in range(num_orders):
            order_id = f"ORD-{order_counter}"
            tier = random.choices([1, 2, 3], weights=[0.6, 0.3, 0.1])[0] 
            
            days_ago = random.randint(0, 30)
            order_date = (datetime.now() - timedelta(days=days_ago)).strftime('%Y-%m-%d')
            
            qty = random.randint(1, 10)
            total_amount = round(qty * cost, 2)
            status = random.choices(statuses, weights=status_weights)[0]
            
            # Now inserting 'total_amount' as well
            orders_data.append((order_id, tier, order_date, sku, name, qty, total_amount, status))
            order_counter += 1
            
    cursor.executemany('INSERT OR IGNORE INTO customer_orders VALUES (?,?,?,?,?,?,?,?)', orders_data)

    conn.commit()
    conn.close()
    print("Database 'pirs_warehouse.db' initialized successfully!")

if __name__ == "__main__":
    setup_database()