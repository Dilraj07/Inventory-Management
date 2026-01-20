from reportlab.lib.pagesizes import letter, landscape
from reportlab.lib import colors
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, PageBreak
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.enums import TA_JUSTIFY, TA_LEFT, TA_CENTER

def generate_pdf():
    # Use Landscape for better table width
    doc = SimpleDocTemplate("Detailed_DSA_Analysis_Report.pdf", pagesize=landscape(letter),
                            rightMargin=30, leftMargin=30,
                            topMargin=40, bottomMargin=40)
    
    styles = getSampleStyleSheet()
    
    # --- Custom Styles ---
    # Normal text for paragraphs
    style_normal = ParagraphStyle(
        name='NormalCustom',
        parent=styles['Normal'],
        fontSize=10,
        leading=14,
        alignment=TA_JUSTIFY,
        spaceAfter=6
    )
    
    # Cell text (smaller, left aligned)
    style_cell = ParagraphStyle(
        name='CellCustom',
        parent=styles['Normal'],
        fontSize=9,
        leading=11,
        alignment=TA_LEFT
    )
    
    # Header cells (bold, centered)
    style_header_cell = ParagraphStyle(
        name='HeaderCell',
        parent=styles['Normal'],
        fontSize=10,
        leading=12,
        alignment=TA_CENTER,
        textColor=colors.white,
        fontName='Helvetica-Bold'
    )

    style_title = ParagraphStyle(
        name='TitleCustom',
        parent=styles['Title'],
        fontSize=24,
        spaceAfter=20,
        textColor=colors.darkblue
    )
    
    style_h1 = ParagraphStyle(
        name='H1Custom',
        parent=styles['Heading1'],
        fontSize=16,
        spaceBefore=15,
        spaceAfter=10,
        textColor=colors.darkslategray,
        borderPadding=5,
        borderColor=colors.lightgrey,
        borderWidth=0,
        backColor=None
    )

    story = []

    # ==========================
    # TITLE SECTION
    # ==========================
    story.append(Paragraph("Project Saaman: Detailed DSA Analysis & Flow Report", style_title))
    story.append(Paragraph("<b>Technical Breakdown of Data Structures used in the Inventory Management System</b>", style_normal))
    story.append(Spacer(1, 20))
    story.append(Paragraph("This report details the internal architecture of the Saaman system, focusing on <b>how</b> and <b>why</b> specific data structures were chosen to optimize logistical operations. It includes specific test case flows for Low Stock, Urgent Orders, and Standard Operations.", style_normal))
    story.append(Spacer(1, 20))


    # ==========================
    # SECTION 1: DATA STRUCTURE INVENTORY
    # ==========================
    story.append(Paragraph("1. Data Structure Inventory & Rationale", style_h1))
    
    ds_data = [
        [
            Paragraph("Data Structure", style_header_cell), 
            Paragraph("Primary Use Case", style_header_cell), 
            Paragraph("Why this structure?", style_header_cell),
            Paragraph("Complexity", style_header_cell)
        ],
        [
            Paragraph("<b>Hash Map</b><br/>(Dictionary)", style_cell),
            Paragraph("<b>Product Lookup</b><br/>Storage of SKU details (Price, Name, Stock).", style_cell),
            Paragraph("Real-world warehouses handle millions of SKUs. Scanning a barcode must be instant. A List would be O(N) (too slow). A Hash Map is O(1).", style_cell),
            Paragraph("Access: <b>O(1)</b>", style_cell)
        ],
        [
            Paragraph("<b>Min-Heap</b><br/>(Priority Queue)", style_cell),
            Paragraph("<b>Reorder Alerts</b><br/>Tracking items running out of stock.", style_cell),
            Paragraph("We only care about the <i>lowest</i> stock items. Sorting a list is O(N log N). A Heap keeps the minimum element at the top automatically.", style_cell),
            Paragraph("Peek: <b>O(1)</b><br/>Insert: <b>O(log N)</b>", style_cell)
        ],
        [
            Paragraph("<b>Max-Heap</b><br/>(Priority Queue)", style_cell),
            Paragraph("<b>Shipping Lane</b><br/>Dispatching orders.", style_cell),
            Paragraph("First-In-First-Out (FIFO) is bad if a VIP orders or food expires. Max-Heap allows 'Urgent' items to jump the queue dynamically.", style_cell),
            Paragraph("Pop Max: <b>O(log N)</b>", style_cell)
        ],
        [
            Paragraph("<b>Binary Search Tree</b><br/>(BST)", style_cell),
            Paragraph("<b>Stability Reporting</b><br/>Organizing inventory by 'Days Remaining'.", style_cell),
            Paragraph("Allows efficient range queries (e.g., 'Show me all items with > 15 days stock'). Keeps data sorted for reports.", style_cell),
            Paragraph("Search: <b>O(log N)</b>", style_cell)
        ],
        [
            Paragraph("<b>Circular Linked List</b>", style_cell),
            Paragraph("<b>Audit Schedule</b><br/>Worker shelf assignments.", style_cell),
            Paragraph("Audits never end. When the list ends, it must loop back to the start. A circular list models this infinite loop perfectly.", style_cell),
            Paragraph("Next: <b>O(1)</b>", style_cell)
        ]
    ]

    t_ds = Table(ds_data, colWidths=[100, 150, 250, 80])
    t_ds.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), colors.darkblue),
        ('GRID', (0,0), (-1,-1), 0.5, colors.grey),
        ('VALIGN', (0,0), (-1,-1), 'TOP'),
        ('BOTTOMPADDING', (0,0), (-1,-1), 8),
        ('TOPPADDING', (0,0), (-1,-1), 8),
        ('BACKGROUND', (0,1), (-1,-1), colors.aliceblue),
    ]))
    story.append(t_ds)
    story.append(PageBreak())


    # ==========================
    # SECTION 2: DETAILED SCENARIO FLOWS
    # ==========================
    story.append(Paragraph("2. Detailed Scenario Flow Analysis", style_h1))
    story.append(Paragraph("The following tables trace the exact path of data through the system for specific edge cases requested.", style_normal))
    story.append(Spacer(1, 15))


    # --- TEST CASE 1: LOW STOCK ---
    story.append(Paragraph("Test Case A: The 'Low Stock' Crisis", style_h1))
    story.append(Paragraph("<b>Scenario:</b> A customer orders 5 units of 'Gaming Mouse', but the warehouse only has 2 units.<br/>", style_normal))
    
    flow_a = [
        [Paragraph("Step", style_header_cell), Paragraph("System Action", style_header_cell), Paragraph("Data Structure Interaction & Logic", style_header_cell)],
        
        [Paragraph("1", style_cell), Paragraph("Order Entry", style_cell), 
         Paragraph("<b>Hash Map Lookup:</b> System queries `products['MOUSE-001']`.<br/>Result: `{'stock': 2}`.", style_cell)],
        
        [Paragraph("2", style_cell), Paragraph("Validation", style_cell), 
         Paragraph("<b>Logic Check:</b> `Request(5) > Stock(2)`.<br/>Result: <b>Insufficient Stock</b>. Order cannot proceed to Shipping Queue.", style_cell)],
        
        [Paragraph("3", style_cell), Paragraph("Handling", style_cell), 
         Paragraph("<b>Shortage Queue (List/DB):</b> Order is flagged as 'PENDING RESTOCK'. It does <b>NOT</b> enter the Shipment Max-Heap yet.", style_cell)],
        
        [Paragraph("4", style_cell), Paragraph("Reorder Trigger", style_cell), 
         Paragraph("<b>Min-Heap Update:</b> Since stock is effectively 0 (all reserved), the 'Days Remaining' score drops to 0.<br/><b>Heapify:</b> This SKU 'bubbles up' to the root of the Min-Heap.", style_cell)],
        
        [Paragraph("5", style_cell), Paragraph("Alert", style_cell), 
         Paragraph("<b>Dashboard Alert:</b> The dashboard polls `heap[0]`. It sees 'Gaming Mouse' and triggers a visual Red Alert for the manager.", style_cell)]
    ]
    
    t_a = Table(flow_a, colWidths=[40, 150, 500])
    t_a.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), colors.firebrick),  # Red header
        ('GRID', (0,0), (-1,-1), 0.5, colors.black),
        ('VALIGN', (0,0), (-1,-1), 'TOP'),
        ('BACKGROUND', (0,1), (-1,-1), colors.mistyrose),
    ]))
    story.append(t_a)
    story.append(Spacer(1, 25))


    # --- TEST CASE 2: URGENT / DUE DATE ---
    story.append(Paragraph("Test Case B: The 'Expiring / V.I.P' Order", style_h1))
    story.append(Paragraph("<b>Scenario:</b> A VIP Customer orders 'Fresh Milk' which expires in 2 days. 50 other orders are already waiting.", style_normal))

    flow_b = [
        [Paragraph("Step", style_header_cell), Paragraph("System Action", style_header_cell), Paragraph("Data Structure Interaction & Logic", style_header_cell)],
        
        [Paragraph("1", style_cell), Paragraph("Scoring", style_cell), 
         Paragraph("<b>Score Calculation:</b><br/>Base Score: 10<br/>VIP Bonus: +50<br/>Expiry (<7 days): +500<br/><b>Total Priority Score: 560</b>.", style_cell)],
        
        [Paragraph("2", style_cell), Paragraph("Queue Entry", style_cell), 
         Paragraph("<b>Max-Heap Push:</b> The order is pushed into the `ShippingQueue`.<br/>Standard orders have scores around 10-20.", style_cell)],
        
        [Paragraph("3", style_cell), Paragraph("Rebalancing", style_cell), 
         Paragraph("<b>Heapify (Bubble Up):</b> Because 560 is massively larger than 20, this node swaps with its parents until it reaches the <b>Top (Root)</b> of the heap.", style_cell)],
        
        [Paragraph("4", style_cell), Paragraph("Dispatch", style_cell), 
         Paragraph("<b>Pop Max:</b> The Warehouse Packer requests the next task. The Heap pops the Root (Score 560).<br/><b>Outcome:</b> This order is processed <b>immediately</b>, skipping the 50 pending orders.", style_cell)]
    ]
    
    t_b = Table(flow_b, colWidths=[40, 150, 500])
    t_b.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), colors.purple), # Purple header
        ('GRID', (0,0), (-1,-1), 0.5, colors.black),
        ('VALIGN', (0,0), (-1,-1), 'TOP'),
        ('BACKGROUND', (0,1), (-1,-1), colors.lavender),
    ]))
    story.append(t_b)
    story.append(Spacer(1, 25))


    # --- TEST CASE 3: NORMAL ORDER ---
    story.append(Paragraph("Test Case C: The 'Normal' Order", style_h1))
    story.append(Paragraph("<b>Scenario:</b> A Standard Customer orders a non-perishable item (e.g., 'USB Cable'). Plenty of stock.", style_normal))

    flow_c = [
        [Paragraph("Step", style_header_cell), Paragraph("System Action", style_header_cell), Paragraph("Data Structure Interaction & Logic", style_header_cell)],
        
        [Paragraph("1", style_cell), Paragraph("Scoring", style_cell), 
         Paragraph("<b>Score Calculation:</b><br/>Base Score: 10<br/>VIP Bonus: 0<br/>Expiry Bonus: 0<br/><b>Total Priority Score: 10</b>.", style_cell)],
        
        [Paragraph("2", style_cell), Paragraph("Queue Entry", style_cell), 
         Paragraph("<b>Max-Heap Push:</b> Order pushed with Score 10.", style_cell)],
        
        [Paragraph("3", style_cell), Paragraph("Rebalancing", style_cell), 
         Paragraph("<b>Heapify (Sink):</b> Since 10 is lower than the VIP orders (Score 560) and Expiring orders (Score 500), it remains near the <b>bottom</b> or leaves of the tree.", style_cell)],
        
        [Paragraph("4", style_cell), Paragraph("Processing", style_cell), 
         Paragraph("<b>Wait State:</b> The system will not pop this order until all High Priority items are cleared.<br/>It ensures VIPs and Expiry risks are handled first.", style_cell)]
    ]
    
    t_c = Table(flow_c, colWidths=[40, 150, 500])
    t_c.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), colors.forestgreen), # Green header
        ('GRID', (0,0), (-1,-1), 0.5, colors.black),
        ('VALIGN', (0,0), (-1,-1), 'TOP'),
        ('BACKGROUND', (0,1), (-1,-1), colors.honeydew),
    ]))
    story.append(t_c)


    doc.build(story)
    print("PDF Generated: Detailed_DSA_Analysis_Report.pdf")

if __name__ == "__main__":
    generate_pdf()
