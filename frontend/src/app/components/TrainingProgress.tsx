interface TrainingProgressProps {
  progress: number;
  imagesProcessed: number;
  totalImages: number;
  studentsCount: number;
  isComplete: boolean;
  onComplete?: () => void;
}

export default function TrainingProgress({
  progress,
  imagesProcessed,
  totalImages,
  studentsCount,
  isComplete,
  onComplete,
}: TrainingProgressProps) {
  return (
    <div className="bg-white rounded-lg shadow-lg p-8 max-w-2xl mx-auto">
      {!isComplete ? (
        <>
          <h2 className="text-2xl mb-6 text-center text-gray-800">Training Model...</h2>

          <div className="mb-6">
            <div className="w-full bg-gray-200 rounded-full h-8 overflow-hidden">
              <div
                className="bg-blue-600 h-full transition-all duration-300 flex items-center justify-center text-white text-sm"
                style={{ width: `${progress}%` }}
              >
                {progress}%
              </div>
            </div>
          </div>

          <div className="space-y-3 text-gray-700">
            <div className="flex justify-between">
              <span>Images:</span>
              <span className="font-medium">{imagesProcessed} / {totalImages}</span>
            </div>
            <div className="flex justify-between">
              <span>Students:</span>
              <span className="font-medium">{studentsCount}</span>
            </div>
          </div>
        </>
      ) : (
        <div className="text-center">
          <div className="text-6xl mb-4">✅</div>
          <h2 className="text-2xl mb-6 text-green-600">Model Trained Successfully</h2>
          {onComplete && (
            <button
              onClick={onComplete}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Return to Add Student
            </button>
          )}
        </div>
      )}
    </div>
  );
}
