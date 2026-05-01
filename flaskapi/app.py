import os
from flask import Flask, request, jsonify
from dotenv import load_dotenv

import core.converter as converter
import core.trainer as trainer
import core.inference as inference

load_dotenv()

app = Flask(__name__)

@app.route('/flask/convert_images', methods=['POST'])
def convert_images():
    """Converts uploaded images to .pgm and saves them."""
    data = request.json
    if not data or 'student_id' not in data or 'image_paths' not in data:
        return jsonify({"error": "Missing student_id or image_paths"}), 400
        
    student_id = data['student_id']
    image_paths = data['image_paths'] # Expected to be absolute paths to temp files
    
    try:
        dataset_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'Dataset'))
        saved_paths = converter.save_as_pgm(student_id, image_paths, dataset_dir)
        return jsonify({"message": "Images converted successfully", "paths": saved_paths}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/flask/train', methods=['POST'])
def train():
    """Trains the KNN classifier using the current Dataset."""
    try:
        dataset_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'Dataset'))
        models_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'models'))
        trainer.train_models(dataset_dir, models_dir)
        return jsonify({"message": "Training completed successfully"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/flask/process_video', methods=['POST'])
def process_video():
    """Processes a video and makes a webhook call to Node.js when done."""
    data = request.json
    if not data or 'videoPath' not in data or 'sessionId' not in data:
        return jsonify({"error": "Missing videoPath or sessionId"}), 400
        
    video_path = data['videoPath']
    session_id = data['sessionId']
    
    # We can run inference asynchronously using a thread so Flask responds immediately,
    # but since Node.js already handles async by returning to the frontend immediately,
    # Flask can process synchronously if preferred. However, to prevent Flask from
    # tying up workers for 5 minutes, we'll spawn a thread.
    import threading
    thread = threading.Thread(target=inference.run_inference_and_notify, args=(video_path, session_id))
    thread.daemon = True
    thread.start()
    
    return jsonify({"message": "Video processing started"}), 202

if __name__ == '__main__':
    port = int(os.environ.get("PORT", 5001))
    app.run(host='127.0.0.1', port=port, debug=True)
