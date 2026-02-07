
import requests
import time
import sys

BASE_URL = "http://127.0.0.1:8000/api"

def print_result(test_name, success, message=""):
    status = "PASS" if success else "FAIL"
    print(f"[{status}] {test_name}")
    if message:
        print(f"       Details: {message}")

def ensure_product(sku, name="Test Product", stock=100, lead=5, cost=10.0):
    payload = {
        "sku": sku,
        "name": name,
        "current_stock": stock,
        "lead_time_days": lead,
        "unit_cost": cost
    }
    try:
        res = requests.post(f"{BASE_URL}/products", json=payload)
        if res.status_code not in (200, 201):
            print(f"[INFO] Product {sku} creation returned {res.status_code}: {res.text}")
    except Exception as e:
        print(f"[WARN] Could not create product {sku}: {e}")

def run_integration_tests():
    print("="*60)
    print("STARTING API INTEGRATION TESTS")
    print("Check if server is running at localhost:8000...")
    print("="*60)

    # Health check
    try:
        r = requests.get("http://127.0.0.1:8000/")
        if r.status_code != 200:
            print("Server not accessible. Please start the backend.")
            sys.exit(1)
    except Exception as e:
        print(f"Connection Failed: {e}")
        print("Please run 'python api.py' in a separate terminal.")
        sys.exit(1)

    # Ensure test products exist
    ensure_product("SKU_001")
    ensure_product("SKU_002")

    # --- TEST 1: Create Order ---
    payload = {
        "customer": "Integration Test Bot",
        "customer_tier": 1,
        "sku": "SKU_001",
        "qty_requested": 5
    }
    res = requests.post(f"{BASE_URL}/orders", json=payload)
    if res.status_code == 200:
        order_id = res.json().get('order_id')
        print_result("Create Order API", True, f"Created Order ID: {order_id}")
        # Verify in queue
        q_res = requests.get(f"{BASE_URL}/shipping/queue")
        found = any(item.get('order_id') == order_id for item in q_res.json())
        print_result("Verify Order in Queue", found, f"Order {order_id} present in in-memory Heap.")
    else:
        print_result("Create Order API", False, f"Status: {res.status_code} - {res.text}")
        order_id = None

    # --- TEST 2: Inventory BST Report ---
    try:
        bst_res = requests.get(f"{BASE_URL}/inventory/stability")
        if bst_res.status_code == 200:
            data = bst_res.json()
            is_sorted = True
            prev = -1
            for item in data:
                if item['days_remaining'] < prev:
                    is_sorted = False
                    break
                prev = item['days_remaining']
            print_result("Inventory BST Report", is_sorted and len(data) > 0, "API returned sorted list from BST traversal.")
        else:
            print_result("Inventory BST Report", False, f"Status: {bst_res.status_code}")
    except Exception as e:
        print_result("Inventory BST Report", False, str(e))

    # --- TEST 3: Dispatch Cycle ---
    payload_disp = {
        "customer": "Dispatch Bot",
        "customer_tier": 2,
        "sku": "SKU_002",
        "qty_requested": 1
    }
    create_res = requests.post(f"{BASE_URL}/orders", json=payload_disp)
    if create_res.status_code == 200:
        disp_order_id = create_res.json().get('order_id')
        time.sleep(0.5)
        dispatch_res = requests.post(f"{BASE_URL}/orders/{disp_order_id}/dispatch")
        if dispatch_res.status_code == 200:
            print_result("Dispatch API", True, f"Dispatched {disp_order_id}")
            hist_res = requests.get(f"{BASE_URL}/orders/history")
            shipped = any(o['order_id'] == disp_order_id and o['status'] == 'SHIPPED' for o in hist_res.json())
            print_result("Verify DB Update", shipped, f"Order {disp_order_id} status is now SHIPPED in DB.")
        else:
            print_result("Dispatch API", False, f"Status: {dispatch_res.status_code} - {dispatch_res.text}")
    else:
        print_result("Dispatch Setup", False, f"Create order failed: {create_res.status_code} - {create_res.text}")

if __name__ == "__main__":
    run_integration_tests()
