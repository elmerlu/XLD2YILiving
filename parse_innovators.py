import json
import csv
import os

def parse_innovators(input_file, output_file):
    data = []
    
    # Read as CSV with tab delimiter
    with open(input_file, 'r', encoding='utf-8') as f:
        # Using csv.reader to handle quoted multiline fields correctly
        reader = csv.reader(f, delimiter='\t')
        
        for row in reader:
            if not row:
                continue
                
            # Expected columns: ID, ProjectName, Name, Nickname, Description, Activity
            # Handle cases where columns might be missing or empty
            
            # Clean up whitespace
            row = [cell.strip() for cell in row]
            
            # Basic mapping based on observed structure
            item = {}
            if len(row) >= 6:
                # Create directory for this ID
                target_dir = os.path.join("public", "innovators", row[0])
                os.makedirs(target_dir, exist_ok=True)
                
                # Find image with any extension
                image_path = f"/innovators/{row[0]}/{row[0]}.jpg" # Default fallback
                found = False
                for ext in ['.jpg', '.jpeg', '.png', '.gif']:
                    check_path = os.path.join(target_dir, f"{row[0]}{ext}")
                    # print(f"Checking: {check_path}") # Debug
                    if os.path.exists(check_path):
                        image_path = f"/innovators/{row[0]}/{row[0]}{ext}"
                        # print(f"Found: {image_path}") # Debug
                        found = True
                        break
                if not found:
                    print(f"Warning: No image found for {row[0]}")
                
                item = {
                    "id": row[0],
                    "project_name": row[1],
                    "name": row[2],
                    "nickname": row[3],
                    "description": row[4],
                    "activity": row[5],
                    "image": image_path
                }
            elif len(row) == 5:
                 # Check if maybe Nickname is merged or missing
                 # Heuristic: if row[3] looks like a description (long), maybe nickname is missing
                 
                 # Create directory for this ID
                 target_dir = os.path.join("public", "innovators", row[0])
                 os.makedirs(target_dir, exist_ok=True)
                 
                 # Find image with any extension
                 image_path = f"/innovators/{row[0]}/{row[0]}.jpg" # Default fallback
                 found = False
                 for ext in ['.jpg', '.jpeg', '.png', '.gif']:
                     check_path = os.path.join(target_dir, f"{row[0]}{ext}")
                     if os.path.exists(check_path):
                         image_path = f"/innovators/{row[0]}/{row[0]}{ext}"
                         found = True
                         break
                 if not found:
                    print(f"Warning: No image found for {row[0]}")
                 
                 item = {
                    "id": row[0],
                    "project_name": row[1],
                    "name": row[2],
                    "description": row[3],
                    "activity": row[4],
                    "image": image_path
                 }
            
            if item:
                data.append(item)
    
    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=2)
    
    print(f"Converted {len(data)} items to {output_file}")

if __name__ == "__main__":
    parse_innovators('raw_innovators.txt', 'src/data/innovators.json')
