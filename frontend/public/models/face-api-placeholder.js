// This is a placeholder file to prevent 404 errors
// In a production environment, you should download the actual face-api.js model files

console.log('Face API models placeholder loaded');

// Create empty model objects to prevent errors
if (typeof faceapi !== 'undefined') {
  if (!faceapi.nets) {
    faceapi.nets = {};
  }
  
  // Create placeholder methods
  if (!faceapi.nets.tinyFaceDetector) {
    faceapi.nets.tinyFaceDetector = {
      loadFromUri: async () => console.log('Placeholder: TinyFaceDetector model loaded'),
      isLoaded: true
    };
  }
  
  if (!faceapi.nets.faceLandmark68Net) {
    faceapi.nets.faceLandmark68Net = {
      loadFromUri: async () => console.log('Placeholder: FaceLandmark68 model loaded'),
      isLoaded: true
    };
  }
  
  if (!faceapi.nets.faceRecognitionNet) {
    faceapi.nets.faceRecognitionNet = {
      loadFromUri: async () => console.log('Placeholder: FaceRecognition model loaded'),
      isLoaded: true
    };
  }
}
