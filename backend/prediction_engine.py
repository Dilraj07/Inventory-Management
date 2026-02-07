from data_ingestion import get_product_lookup, get_sales_array

def calculate_priority_score(sku):
    products = get_product_lookup()
    sales = get_sales_array(sku)
    
    if not sales: return 999 # No sales yet, low priority
    
    # Calculate Average Daily Sales
    avg_sales = sum(sales) / len(sales)
    current_stock = products[sku]['stock']
    
    # Days Remaining = Stock / Demand
    days_remaining = current_stock / avg_sales
    return round(days_remaining, 2)