import heapq
from data_ingestion import get_product_lookup
from prediction_engine import calculate_priority_score

def build_reorder_heap():
    products = get_product_lookup()
    priority_heap = []
    
    for sku in products.keys():
        score = calculate_priority_score(sku)
        # We push (score, sku) so the Heap sorts by the lowest score (most urgent)
        heapq.heappush(priority_heap, (score, sku))
        
    return priority_heap