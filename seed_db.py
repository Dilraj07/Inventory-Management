import sqlite3
import random
from datetime import datetime, timedelta

DB_NAME = 'inventory.db'

def create_tables(cursor):
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS products(
            SKU TEXT PRIMARY KEY,
            name TEXT NOT NULL,
            current_stock INTEGER NOT NULL,
            price REAL NOT NULL,
            supplier_info TEXT
        )
    ''')
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS sales_history (
            transaction_id INTEGER PRIMARY KEY AUTOINCREMENT,
            SKU TEXT NOT NULL,
            quantity_sold INTEGER NOT NULL,
            sale_date TEXT NOT NULL,
            FOREIGN KEY(SKU) REFERENCES products(SKU)
        )
    ''')

    cursor.execute('''
        CREATE TABLE IF NOT EXISTS expired_lots (
            lot_number TEXT PRIMARY KEY
        )
    ''')

def seed_data(cursor):
    print("Seeding products...")
    product_list = []
    # Generate 50 mock products
    for i in range(1, 51):
        sku = f"SKU{i:03d}"
        name = f"Component {chr(65 + (i%26))}{i}"
        # Random stock between 20 and 500
        stock = random.randint(20, 500)
        price = round(random.uniform(5.0, 150.0), 2)
        supplier = f"Supplier X{i%5}"
        product_list.append((sku, name, stock, price, supplier))
    
    cursor.executemany('INSERT INTO products VALUES (?,?,?,?,?)', product_list)

    print("Seeding 6 months of sales history (this might take a moment)...")
    sales_data = []
    end_date = datetime.now()
    start_date = end_date - timedelta(days=180) # Approx 6 months

    for sku, _, _, _, _ in product_list:
        # Simulate sales for roughly 80% of the days in the last 6 months
        current_date = start_date
        while current_date <= end_date:
            if random.random() > 0.2: # 80% chance of a sale on a given day
                # Random quantity sold between 1 and 10 units
                qty = random.randint(1, 10)
                date_str = current_date.strftime("%Y-%m-%d")
                sales_data.append((sku, qty, date_str))
            current_date += timedelta(days=1)
            
    cursor.executemany('INSERT INTO sales_history (sku, quantity_sold, sale_date) VALUES (?,?,?)', sales_data)

    print("Seeding expired lots...")
    expired_data = [("LOT_B4_BAD",), ("LOT_X9_RECALL",), ("LOT_A1_EXP_JAN",)]
    cursor.executemany('INSERT INTO expired_lots VALUES (?)', expired_data)

if __name__ == '__main__':
    try:
        # Connects to file or creates it if it doesn't exist
        conn = sqlite3.connect(DB_NAME)
        cursor = conn.cursor()
        
        create_tables(cursor)
        seed_data(cursor)
        
        conn.commit()
        print(f"Successfully created and seeded {DB_NAME}")
    except Exception as e:
        print(f"An error occurred: {e}")
    finally:
        if conn:
            conn.close()
