# Smart Attendance Portal

## 🎯 Use Case
The **Smart Attendance Portal** is an end-to-end full-stack application designed to automate the process of taking student attendance in a classroom environment. Instead of manual roll calls, teachers can simply upload a short video clip (e.g., from a CCTV or smartphone camera). The system autonomously processes the video, detects faces, identifies students, captures visual proof, and securely logs the attendance records. 

It provides two distinct portals:
- **Admin Portal**: For adding new students, uploading their baseline photos, and triggering the machine learning training pipeline.
- **Teacher Portal**: For uploading class footage, viewing real-time asynchronous processing results, verifying captured faces, and exporting attendance history.

---

## ⚙️ How the System Works

The architecture is split into three main components that work together asynchronously:

1. **Frontend (React/Vite)**: Provides a modern, responsive UI. It handles multipart uploads for images/videos and constantly polls the backend to display real-time progress.
2. **Backend (Node.js/Express)**: Acts as the secure central hub. It manages MongoDB database transactions, authenticates users via JWT, and handles asynchronous webhooks. 
3. **Computer Vision API (Python/Flask)**: The heavy lifter. It runs a localized CV pipeline:
   - **Detection**: Uses `YOLOv8-face` to locate bounding boxes of human faces in video frames.
   - **Extraction & Alignment**: Uses `InsightFace` (ArcFace) to align faces and extract 512-dimensional facial embeddings.
   - **Classification**: Uses a `K-Nearest Neighbors (KNN)` model to match embeddings against the known student database.
   - **Verification**: Automatically crops and saves the specific face used for identification and sends it back to the frontend for manual human verification.

---

## 🚀 Setup & Installation

Because this repository deals with massive AI models and sensitive datasets, certain files are **ignored** by Git. Follow these steps to restore the environment and run the application.

### Prerequisites
- Node.js (v18+)
- Python (v3.10+)
- MongoDB (running locally on `localhost:27017`)

### 1. Restore Ignored Files
You must manually place the following folders/files in the root of the `webapp/` directory:

*   **`models/`**: Create a `models/` directory in the root. It must contain your trained weights:
    *   `yolov8n-face.pt`
    *   `classifier.pkl`
    *   `arcface_embeddings.npy`
    *   `labels.npy`
    *   `insightface_cache/` (containing `buffalo_l` models)
*   **`Dataset/`**: Create a `Dataset/` folder. This is where student images will be stored (e.g., `Dataset/s1/`, `Dataset/s2/`).
*   **`.env`**: Create an environment variable file inside `webapp/backend/` with the following:
    ```env
    MONGO_URI=mongodb://localhost:27017/student-attendance
    PORT=5050
    FLASK_API_URL=http://127.0.0.1:5001
    JWT_SECRET=your_super_secret_key_here
    STORAGE_PATHS_DATASET=../Dataset
    STORAGE_PATHS_INPUTS=../inputs
    ```

### 2. Start the Node.js Backend
```bash
cd backend
npm install
npm start
# Server will start on http://localhost:5050
```

### 3. Start the Flask Computer Vision API
```bash
cd flaskapi
python -m venv venv
source venv/bin/activate  # Or `venv\Scripts\activate` on Windows
pip install -r requirements.txt
python app.py
# Server will start on http://127.0.0.1:5001
```

### 4. Start the React Frontend
```bash
cd frontend
npm install
npm run dev
# Server will start on http://localhost:5173
```

---

## 📊 How to Get the Output

1. **Login**: Navigate to `http://localhost:5173`. Use the default admin credentials (`admin@test.com` / `admin123`) or sign up as a Teacher.
2. **Train the Model (Admin)**: If you've just added new students, go to the Admin Dashboard -> "Train Model" to ensure the AI knows the new faces.
3. **Upload Footage (Teacher)**: Go to the Teacher Dashboard -> "Upload Video". Select your subject and class footage. 
4. **View Results**: You will be redirected to the Results page. The video is processed asynchronously. Once finished, the UI will populate with:
   - A count of total students present.
   - A list of identified students.
   - **Visual Proof**: Expand any student's card to see the exact, high-quality face crop the AI used to mark them present!
5. **Export**: Visit the "History" tab to export the attendance record.
