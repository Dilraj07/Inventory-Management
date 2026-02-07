from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import heapq

# Import PIRS modules
from database_setup import setup_database
from data_ingestion import get_product_lookup
from prediction_engine import calculate_priority_score
from prioritization import build_reorder_heap
from reporting import InventoryBST, AuditList
from floor_operations import ShippingQueue, SafetyCheck

app = FastAPI(title="PIRS API", description="Predictive Inventory & Reorder System API")

# Enable CORS for React Frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # In production, replace with specific domain
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize DB on startup
setup_database()

# --- Data Models ---
class Order(BaseModel):
    order_id: str
    customer: str
    item_sku: str

class StockUpdate(BaseModel):
    sku: str
    new_stock: int

# --- Global State (Simulation) ---
# In a real app, these would be in a proper DB or persistent store
shipping_queue = ShippingQueue()
safety_officer = SafetyCheck()
safety_officer.add_blocked_lot("LOT-EXP-202X") # Sample blocked lot

@app.get("/")
def read_root():
    return {"status": "PIRS System Online"}

@app.get("/api/dashboard/summary")
def get_dashboard_summary():
    products = get_product_lookup()
    total_products = len(products)
    
    # Calculate critical items
    heap = build_reorder_heap()
    critical_count = 0
    if heap:
        # Count items with < 7 days stock
        critical_count = sum(1 for score, _ in heap if score < 7)
        
    return {
        "total_sku_count": total_products,
        "critical_stock_alert": critical_count,
        "system_status": "Operational"
    }

@app.get("/api/priority/top")
def get_top_priority():
    heap = build_reorder_heap()
    if not heap:
        return {"message": "All stock levels are healthy."}
    
    days_left, sku = heap[0] # Peek min
    products = get_product_lookup()
    details = products.get(sku, {})
    
    return {
        "sku": sku,
        "name": details.get('name', 'Unknown'),
        "days_remaining": days_left,
        "current_stock": details.get('stock', 0),
        "lead_time": details.get('lead', 0)
    }

@app.get("/api/inventory/stability")
def get_inventory_report():
    products = get_product_lookup()
    bst = InventoryBST()
    
    for sku in products:
        score = calculate_priority_score(sku)
        # Hacky: storing stock in name or modifying BST node to hold extra data
        # Let's cleanly modify BST insert if possible, or just pass a dict as 'product_name'
        # Actually, let's update BSTNode in reporting.py OR just return a richer object here.
        
        # NOTE: To avoid breaking reporting.py right now, I will modify what we pass as 'product_name' 
        # OR I can just build a list since we are re-calculating sort anyway? 
        # Ideally reporting.py logic handles the BST. Let's patch reporting.py to accept stock.
        bst.insert(score, sku, {'name': products[sku]['name'], 'stock': products[sku]['stock']})
        
    report = bst.in_order_traversal(bst.root)
    return report

@app.get("/api/audit/next")
def get_next_audit():
    # Re-create list each time for stateless API simplicity (or use global if persistent process)
    # Ideally, we'd store the "last audited" index in DB.
    # For simulation, we return a random or sequential list.
    products = get_product_lookup()
    audit_list = []
    rotation = AuditList()
    for sku in products:
        rotation.add_product(sku)
        audit_list.append(sku)
        
    # Just returning the list order for the UI to display "Upcoming Audits"
    return {"audit_sequence": audit_list}

@app.post("/api/orders/enqueue")
def enqueue_order(order: Order):
    shipping_queue.add_order({
        'order_id': order.order_id,
        'customer': order.customer,
        'item': order.item_sku
    })
    return {"status": "queued", "message": f"Order {order.order_id} added to shipping queue."}

@app.get("/api/shipping/queue")
def view_queue():
    return shipping_queue.view_queue()

# --- Inventory Management (CRUD) ---

class ProductCreate(BaseModel):
    sku: str
    name: str
    current_stock: int
    lead_time_days: int
    unit_cost: float

@app.post("/api/products")
def create_product(prod: ProductCreate):
    import sqlite3
    try:
        conn = sqlite3.connect('pirs_warehouse.db')
        cursor = conn.cursor()
        cursor.execute(
            "INSERT INTO products (sku, name, current_stock, lead_time_days, unit_cost) VALUES (?, ?, ?, ?, ?)",
            (prod.sku, prod.name, prod.current_stock, prod.lead_time_days, prod.unit_cost)
        )
        conn.commit()
        conn.close()
        return {"message": f"Product {prod.sku} created successfully."}
    except sqlite3.IntegrityError:
        raise HTTPException(status_code=400, detail="SKU already exists.")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.put("/api/products/{sku}/stock")
def update_stock(sku: str, update: StockUpdate):
    import sqlite3
    try:
        conn = sqlite3.connect('pirs_warehouse.db')
        cursor = conn.cursor()
        cursor.execute("UPDATE products SET current_stock = ? WHERE sku = ?", (update.new_stock, sku))
        if cursor.rowcount == 0:
            raise HTTPException(status_code=404, detail="Product not found.")
        conn.commit()
        conn.close()
        return {"message": f"Stock for {sku} updated to {update.new_stock}"}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.delete("/api/products/{sku}")
def delete_product(sku: str):
    import sqlite3
    try:
        conn = sqlite3.connect('pirs_warehouse.db')
        cursor = conn.cursor()
        cursor.execute("DELETE FROM products WHERE sku = ?", (sku,))
        if cursor.rowcount == 0:
            raise HTTPException(status_code=404, detail="Product not found.")
        conn.commit()
        conn.close()
        return {"message": f"Product {sku} deleted."}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
