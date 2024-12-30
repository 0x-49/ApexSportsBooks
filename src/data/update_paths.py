import json

# Read the JSON file
with open('sportsbooks.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

# Update the paths
for item in data:
    if "Descriptions Local URL" in item:
        old_path = item["Descriptions Local URL"]
        if old_path:  # Only process if path exists
            # Extract the filename from the old path
            filename = old_path.split('\\')[-1]
            # Create new path
            new_path = f"SportsBooksArticles/{filename}"
            item["Descriptions Local URL"] = new_path

# Write the updated JSON back to file
with open('sportsbooks.json', 'w', encoding='utf-8') as f:
    json.dump(data, f, indent=4, ensure_ascii=False)

print("Successfully updated paths in sportsbooks.json")
