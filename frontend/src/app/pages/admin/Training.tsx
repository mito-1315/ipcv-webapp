import { useState } from 'react';
import { useNavigate } from 'react-router';
import TrainingProgress from '../../components/TrainingProgress';

export default function AdminTraining() {
  const navigate = useNavigate();
  const [showConfirmation, setShowConfirmation] = useState(true);
  const [isTraining, setIsTraining] = useState(false);
  const [progress, setProgress] = useState(0);
  const [imagesProcessed, setImagesProcessed] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  const totalImages = 1000;
  const studentsCount = 100;

  const handleProceed = async () => {
    setShowConfirmation(false);
    setIsTraining(true);

    try {
      // Start fake progress since API doesn't stream progress easily
      const interval = setInterval(() => {
        setProgress((prev) => Math.min(prev + 5, 95));
      }, 1000);

      const { default: api } = await import('../../api');
      await api.post('/admin/train');
      
      clearInterval(interval);
      setProgress(100);
      setIsComplete(true);
    } catch (error: any) {
      alert(error.response?.data?.message || 'Training failed');
      setIsTraining(false);
      setShowConfirmation(true);
    }
  };

  const handleComplete = () => {
    navigate('/admin/add-student');
  };

  if (showConfirmation) {
    return (
      <div className="p-8 flex items-center justify-center min-h-screen">
        <div className="bg-white rounded-xl shadow-lg p-8 max-w-md">
          <div className="text-center mb-6">
            <div className="text-5xl mb-4">⚠️</div>
            <h2 className="text-2xl mb-4 text-gray-800">Confirmation</h2>
            <p className="text-gray-600">
              Are you sure you don't want to add more students?
            </p>
          </div>

          <div className="flex gap-4">
            <button
              onClick={() => navigate('/admin/add-student')}
              className="flex-1 px-6 py-3 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleProceed}
              className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Proceed
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (isTraining || isComplete) {
    return (
      <div className="p-8 flex items-center justify-center min-h-screen">
        <TrainingProgress
          progress={progress}
          imagesProcessed={imagesProcessed}
          totalImages={totalImages}
          studentsCount={studentsCount}
          isComplete={isComplete}
          onComplete={handleComplete}
        />
      </div>
    );
  }

  return null;
}
