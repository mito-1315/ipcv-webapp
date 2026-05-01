import os
import cv2
import numpy as np
from insightface.app import FaceAnalysis
from sklearn.neighbors import KNeighborsClassifier
import joblib
import logging

logger = logging.getLogger(__name__)

def train_models(dataset_dir, models_dir):
    """
    Standalone training logic that mimics projectV2:
    1. Loads all .pgm images from Dataset/
    2. Extracts ArcFace embeddings
    3. Trains a KNN classifier
    4. Saves classifier.pkl, arcface_embeddings.npy, labels.npy to models/
    """
    # 1. Initialize InsightFace
    app = FaceAnalysis(name="buffalo_l", root=os.path.join(models_dir, 'insightface_cache'), providers=['CPUExecutionProvider'])
    app.prepare(ctx_id=0, det_size=(160, 160))
    
    embeddings = []
    labels = []
    
    # 2. Iterate over dataset
    for person_id in os.listdir(dataset_dir):
        person_dir = os.path.join(dataset_dir, person_id)
        if not os.path.isdir(person_dir):
            continue
            
        for img_name in os.listdir(person_dir):
            if not img_name.endswith('.pgm'):
                continue
                
            img_path = os.path.join(person_dir, img_name)
            img = cv2.imread(img_path)
            if img is None:
                continue
                
            # Extract embedding
            # ArcFace expects RGB image. .pgm is grayscale, so cv2.imread loads it as BGR (all 3 channels same)
            rgb_img = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
            faces = app.get(rgb_img)
            
            if len(faces) == 0:
                # If no face detected, use the center crop as a fallback or skip.
                # Since these are cropped faces, we can just use the center 112x112 if we really need to,
                # but let's try with threshold = 0.0 like projectV2 if needed.
                # For simplicity, we just skip.
                continue
                
            # Use the largest face
            faces = sorted(faces, key=lambda f: (f.bbox[2]-f.bbox[0])*(f.bbox[3]-f.bbox[1]), reverse=True)
            emb = faces[0].normed_embedding
            
            embeddings.append(emb)
            
            # Label should be just the number for "s1", "s10"
            label = int(person_id.replace('s', ''))
            labels.append(label)
            
    if len(embeddings) == 0:
        raise ValueError("No embeddings could be extracted from the dataset.")
        
    X = np.array(embeddings)
    y = np.array(labels)
    
    # 3. Train KNN
    knn = KNeighborsClassifier(n_neighbors=1, metric='cosine')
    knn.fit(X, y)
    
    # 4. Save models
    os.makedirs(models_dir, exist_ok=True)
    joblib.dump(knn, os.path.join(models_dir, "classifier.pkl"))
    np.save(os.path.join(models_dir, "arcface_embeddings.npy"), X)
    np.save(os.path.join(models_dir, "labels.npy"), y)
    
    return True
