import json
with open("hisn_almuslim.json", "r") as f:
    data = json.load(f)
key = list(data.keys())[2]
print(f"Text:")
for t in data[key]['text']:
    print(t)
print(f"\nFootnotes:")
for f in data[key]['footnote']:
    print(f)
