from collections import deque

class ShippingQueue:
    """
    Manages outbound shipments using a FIFO Queue.
    Ensures fairness: First Order In, First Order Out.
    """
    def __init__(self):
        self.queue = deque()

    def add_order(self, order_details):
        """Enqueue a new order."""
        self.queue.append(order_details)
        print(f"[QUEUE] Order added: {order_details['order_id']} for {order_details['customer']}")

    def process_next_order(self):
        """Dequeue the next order to be shipped."""
        if not self.queue:
            print("[QUEUE] No orders to process.")
            return None
        
        order = self.queue.popleft()
        print(f"[QUEUE] Processing Order: {order['order_id']} ({order['item']})")
        return order
    
    def view_queue(self):
        return list(self.queue)


class SafetyCheck:
    """
    Uses a Hash Set to instantly validate lot numbers.
    Prevents shipping of expired or recalled goods.
    """
    def __init__(self):
        # In a real app, this would load from a database (inventory_lots table)
        self.blocked_lots = set()

    def add_blocked_lot(self, lot_id):
        """Adds a lot number to the blacklist (recalled/expired)."""
        self.blocked_lots.add(lot_id)
        print(f"[SAFETY] Lot {lot_id} marked as BLOCKED.")

    def is_lot_safe(self, lot_id):
        """O(1) check if a lot is safe to ship."""
        if lot_id in self.blocked_lots:
            print(f"[ALERT] STOP! Lot {lot_id} is BLOCKED (Expired/Recalled).")
            return False
        print(f"[SAFETY] Lot {lot_id} is safe.")
        return True
