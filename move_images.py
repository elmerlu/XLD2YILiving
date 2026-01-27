import os
import shutil
import glob

def move_images():
    # Source directory: public/images
    source_dir = os.path.join("public", "images")
    # Target base: public/images/innovators
    target_base = os.path.join("public", "images", "innovators")
    
    # Find all files starting with XL in source dir
    # We look for XL*.* to capture any extension
    files = glob.glob(os.path.join(source_dir, "XL*.*"))
    
    moved_count = 0
    for file_path in files:
        filename = os.path.basename(file_path)
        # Assuming filename is like XL01.jpg, XL02.png
        # ID is the part before the extension
        name_part, ext = os.path.splitext(filename)
        
        # Check if name_part is a valid ID (starts with XL)
        if not name_part.startswith("XL"):
            continue
            
        innovator_id = name_part
        
        # Target directory
        target_dir = os.path.join(target_base, innovator_id)
        
        # Ensure target directory exists (it should from previous step, but safe to check)
        os.makedirs(target_dir, exist_ok=True)
        
        # Target path
        target_path = os.path.join(target_dir, filename)
        
        # Move file
        try:
            shutil.move(file_path, target_path)
            print(f"Moved {filename} -> {target_dir}")
            moved_count += 1
        except Exception as e:
            print(f"Error moving {filename}: {e}")
            
    print(f"Total moved: {moved_count}")

if __name__ == "__main__":
    move_images()
