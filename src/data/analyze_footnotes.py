import json
import re

with open("src/data/hisn_almuslim.json", "r") as f:
    data = json.load(f)

# Analyze each category
for category_name, category_data in data.items():
    text_count = len(category_data.get('text', []))
    footnote_count = len(category_data.get('footnote', []))
    
    # Count footnotes that contain numbers (actual references)
    numeric_footnotes = [f for f in category_data.get('footnote', []) if re.search(r'\d', f)]
    numeric_count = len(numeric_footnotes)
    
    if text_count != numeric_count:
        print(f"\n{category_name}:")
        print(f"  Text count: {text_count}")
        print(f"  Total footnotes: {footnote_count}")
        print(f"  Numeric footnotes: {numeric_count}")
        print(f"  Difference: {footnote_count - numeric_count} non-numeric footnotes")
        
        # Show non-numeric footnotes
        non_numeric = [f for f in category_data.get('footnote', []) if not re.search(r'\d', f)]
        if non_numeric:
            print(f"  Non-numeric footnotes (explanatory):")
            for f in non_numeric:
                print(f"    - {f[:80]}...")

print("\n\n=== Categories with matching counts ===")
for category_name, category_data in data.items():
    text_count = len(category_data.get('text', []))
    numeric_footnotes = [f for f in category_data.get('footnote', []) if re.search(r'\d', f)]
    numeric_count = len(numeric_footnotes)
    
    if text_count == numeric_count:
        print(f"{category_name}: {text_count} texts, {numeric_count} numeric footnotes - OK")