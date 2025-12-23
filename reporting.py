class BSTNode:
    def __init__(self, days_remaining, sku, product_name):
        self.days_remaining = days_remaining
        self.sku = sku
        self.product_name = product_name
        self.left = None
        self.right = None

class InventoryBST:
    """
    Binary Search Tree to organize products by 'Stability' (Days Remaining).
    Allows manager to see:
    - Left side: Critical items (Low days)
    - Right side: Stable items (High days)
    """
    def __init__(self):
        self.root = None

    def insert(self, days_remaining, sku, product_name):
        new_node = BSTNode(days_remaining, sku, product_name)
        if not self.root:
            self.root = new_node
            return
        
        current = self.root
        while True:
            if days_remaining < current.days_remaining:
                if current.left is None:
                    current.left = new_node
                    break
                current = current.left
            else:
                if current.right is None:
                    current.right = new_node
                    break
                current = current.right

    def in_order_traversal(self, node, result=None):
        """Returns list of products from lowest days (critical) to highest (stable)."""
        if result is None:
            result = []
        
        if node:
            self.in_order_traversal(node.left, result)
            result.append({
                "sku": node.sku,
                "name": node.product_name,
                "days_remaining": node.days_remaining
            })
            self.in_order_traversal(node.right, result)
        
        return result

    def get_stability_report(self):
        print("\n--- INVENTORY STABILITY REPORT (BST SORTED) ---")
        items = self.in_order_traversal(self.root)
        for item in items:
            status = "CRITICAL" if item['days_remaining'] < 7 else "STABLE"
            print(f"[{status}] {item['name']} ({item['sku']}): {item['days_remaining']} days left")
        return items


class AuditNode:
    def __init__(self, sku):
        self.sku = sku
        self.next = None

class AuditList:
    """
    Circular Linked List for ongoing warehouse audits.
    Ensures no shelf is forgotten; workers just cycle through the list forever.
    """
    def __init__(self):
        self.head = None
        self.current_audit = None # Pointer to the item currently being checked

    def add_product(self, sku):
        new_node = AuditNode(sku)
        if not self.head:
            self.head = new_node
            self.head.next = self.head # Points to itself (Circular)
            self.current_audit = self.head
        else:
            temp = self.head
            while temp.next != self.head:
                temp = temp.next
            temp.next = new_node
            new_node.next = self.head

    def get_next_to_audit(self):
        """Moves the pointer to the next item and returns it."""
        if not self.current_audit:
            return None
        
        item_to_check = self.current_audit.sku
        # Move pointer
        self.current_audit = self.current_audit.next
        return item_to_check
