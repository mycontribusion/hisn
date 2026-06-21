import json
import re

with open("src/data/hisn_almuslim.json", "r") as f:
    data = json.load(f)

# Check specific categories with extra footnotes
categories_to_check = ["دعاء دخول المسجد", "أذكار الأذان", "أذكار الصباح والمساء", "ما يعصم به من الدجال"]

for cat in categories_to_check:
    if cat in data:
        print(f"\n=== {cat} ===")
        print(f"Text count: {len(data[cat]['text'])}")
        print(f"Footnote count: {len(data[cat]['footnote'])}")
        print("\nTexts:")
        for i, t in enumerate(data[cat]['text']):
            print(f"  {i+1}. {t[:100]}...")
        print("\nFootnotes:")
        for i, f in enumerate(data[cat]['footnote']):
            print(f"  {i+1}. {f}")

# Also check the current duas.ts to see how it's mapped
print("\n\n=== Current duas.ts mapping for 'upon-entering-the-mosque' ===")
with open("src/data/duas.ts", "r") as f:
    content = f.read()
    
# Find entries with categoryId "upon-entering-the-mosque"
import re
matches = re.findall(r'"categoryId":\s*"upon-entering-the-mosque"[^}]*"footnoteAr":\s*"([^"]*)"', content)
for i, m in enumerate(matches):
    print(f"  Dua {i+1} footnoteAr: {m}")