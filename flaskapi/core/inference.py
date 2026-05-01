import os
import cv2
import numpy as np
import requests
import joblib
from insightface.app import FaceAnalysis
from ultralytics import YOLO

def run_inference_and_notify(video_path, session_id):
    """
    Runs video inference and posts results back to Node.js webhook.
    """
    try:
        # Resolve paths
        models_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..', 'models'))
        yolo_path = os.path.join(models_dir, 'yolov8n-face.pt')
        clf_path = os.path.join(models_dir, 'classifier.pkl')
        embs_path = os.path.join(models_dir, 'arcface_embeddings.npy')
        
        # Load Models
        yolo_model = YOLO(yolo_path)
        app = FaceAnalysis(name="buffalo_l", root=os.path.join(models_dir, 'insightface_cache'), providers=['CPUExecutionProvider'])
        app.prepare(ctx_id=0, det_size=(160, 160))
        
        clf = joblib.load(clf_path)
        train_embs = np.load(embs_path)
        
        # Video parsing logic
        cap = cv2.VideoCapture(video_path)
        fps = cap.get(cv2.CAP_PROP_FPS)
        frame_interval = max(1, int(fps * 1.5)) # Sample every 1.5 seconds
        
        detected_students = {}
        frame_idx = 0
        
        while True:
            ret, frame = cap.read()
            if not ret:
                break
                
            if frame_idx % frame_interval == 0:
                # 1. Detect faces
                results = yolo_model(frame, conf=0.5, verbose=False)
                for r in results:
                    boxes = r.boxes.xyxy.cpu().numpy()
                    for box in boxes:
                        x1, y1, x2, y2 = map(int, box[:4])
                        # Crop face
                        face_crop = frame[y1:y2, x1:x2]
                        if face_crop.size == 0:
                            continue
                            
                        # 2. Extract embedding
                        rgb_crop = cv2.cvtColor(face_crop, cv2.COLOR_BGR2RGB)
                        faces = app.get(rgb_crop)
                        if len(faces) == 0:
                            continue
                            
                        # Use largest face
                        faces = sorted(faces, key=lambda f: (f.bbox[2]-f.bbox[0])*(f.bbox[3]-f.bbox[1]), reverse=True)
                        emb = faces[0].normed_embedding
                        
                        # 3. Classify
                        pred_raw = clf.predict(emb.reshape(1, -1))
                        pred_idx = int(np.asarray(pred_raw).flat[0])
                        
                        # Confidence check
                        norms = np.linalg.norm(train_embs, axis=1, keepdims=True)
                        X_norm = train_embs / (norms + 1e-8)
                        sims = X_norm @ emb
                        confidence = float(sims.max())
                        
                        if confidence >= 0.45:
                            student_id = f"s{pred_idx}"
                            if student_id not in detected_students:
                                # Save the best/first crop to outputs/{sessionId}/faces/{studentId}.jpg
                                faces_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..', 'outputs', session_id, 'faces'))
                                os.makedirs(faces_dir, exist_ok=True)
                                face_path = os.path.join(faces_dir, f"{student_id}.jpg")
                                cv2.imwrite(face_path, face_crop)
                                detected_students[student_id] = f"/outputs/{session_id}/faces/{student_id}.jpg"
                            
            frame_idx += 1
            
        cap.release()
        
        # Report success back to Node.js
        webhook_url = "http://127.0.0.1:5050/api/internal/attendance/complete"
        payload = {
            "sessionId": session_id,
            "status": "completed",
            "presentStudents": list(detected_students.keys()),
            "faceUrls": detected_students
        }
        requests.post(webhook_url, json=payload)
        
    except Exception as e:
        print(f"Error processing video {session_id}: {e}")
        # Report failure back to Node.js
        webhook_url = "http://127.0.0.1:5050/api/internal/attendance/complete"
        payload = {
            "sessionId": session_id,
            "status": "failed",
            "presentStudents": []
        }
        try:
            requests.post(webhook_url, json=payload)
        except:
            pass
