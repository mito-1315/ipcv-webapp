import os
import cv2

def save_as_pgm(student_id, image_paths, dataset_dir):
    """
    Reads images from `image_paths` (temp files), converts them to grayscale,
    resizes to 92x112 (standard ORL size), and saves as .pgm in Dataset/student_id/
    """
    student_dir = os.path.join(dataset_dir, student_id)
    os.makedirs(student_dir, exist_ok=True)
    
    saved_paths = []
    
    for idx, path in enumerate(image_paths):
        img = cv2.imread(path)
        if img is None:
            continue
            
        gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
        resized = cv2.resize(gray, (92, 112))
        
        out_path = os.path.join(student_dir, f"{idx+1}.pgm")
        cv2.imwrite(out_path, resized)
        saved_paths.append(out_path)
        
        # Optionally remove the temp file
        try:
            os.remove(path)
        except OSError:
            pass
            
    return saved_paths
