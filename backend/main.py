import heapq
import time
from database_setup import setup_database
from data_ingestion import get_product_lookup
from prioritization import build_reorder_heap
from floor_operations import ShippingQueue, SafetyCheck
from reporting import InventoryBST, AuditList
from prediction_engine import calculate_priority_score

def main_simulation():
    print("Welcome to PIRS - Inventory Management & Reorder System")
    print("=====================================================")
    
    # 1. Initialize System
    print("\n[PHASE 1] System Initialization...")
    setup_database()
    
    # 2. Check Predictions & Prioritize (Min-Heap)
    print("\n[PHASE 2] Analyzing Stockouts & Prioritizing Reorders...")
    reorder_heap = build_reorder_heap()
    
    if reorder_heap:
        print(f" > Found {len(reorder_heap)} items to track.")
        top_priority_score, top_priority_sku = reorder_heap[0] # Peek min
        print(f" > [ALERT] Most Urgent Reorder: {top_priority_sku} (Days Remaining: {top_priority_score})")
    else:
        print(" > No products found requiring analysis.")

    # 3. Floor Operations (Queue & Set)
    print("\n[PHASE 3] Floor Operations (Shipping & Safety)...")
    
    # Shipping Queue Simulation
    shipping_line = ShippingQueue()
    shipping_line.add_order({'order_id': 'ORD-101', 'customer': 'Alice', 'item': 'SKU001'})
    shipping_line.add_order({'order_id': 'ORD-102', 'customer': 'Bob', 'item': 'SKU002'})
    
    # Safety Check Simulation
    safety_officer = SafetyCheck()
    safety_officer.add_blocked_lot("LOT-EXP-202X") # Simulating a recall
    
    # Processing Order
    current_order = shipping_line.process_next_order()
    if current_order:
        # Check a hypothetical lot number for this order
        sample_lot = "LOT-EXP-202X" if current_order['item'] == 'SKU001' else "LOT-FRESH-2025"
        print(f" > Checking Lot {sample_lot} for {current_order['item']}...")
        if safety_officer.is_lot_safe(sample_lot):
            print(" > Shipment Approved.")
        else:
            print(" > Shipment HALTED.")

    # 4. Manager Reporting (BST & Linked List)
    print("\n[PHASE 4] Generating Manager Reports...")
    
    # Build BST
    products = get_product_lookup()
    bst_report = InventoryBST()
    print(" > Building Stability Tree...")
    for sku in products:
        score = calculate_priority_score(sku)
        bst_report.insert(score, sku, products[sku]['name'])
        
    bst_report.get_stability_report()
    
    # Audit Rotation
    print("\n[AUDIT] Daily Audit Rotation Task:")
    audit_rotation = AuditList()
    for sku in products:
        audit_rotation.add_product(sku)
        
    next_item = audit_rotation.get_next_to_audit()
    print(f" > Please audit shelf for: {next_item}")
    print(f" > After that, audit: {audit_rotation.get_next_to_audit()}")

if __name__ == "__main__":
    main_simulation()
