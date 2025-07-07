import { pipeline, env } from '@huggingface/transformers';

// Configure transformers.js
env.allowLocalModels = false;
env.useBrowserCache = false;

const MAX_IMAGE_DIMENSION = 1024;

function resizeImageIfNeeded(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D, image: HTMLImageElement) {
  let width = image.naturalWidth;
  let height = image.naturalHeight;

  if (width > MAX_IMAGE_DIMENSION || height > MAX_IMAGE_DIMENSION) {
    if (width > height) {
      height = Math.round((height * MAX_IMAGE_DIMENSION) / width);
      width = MAX_IMAGE_DIMENSION;
    } else {
      width = Math.round((width * MAX_IMAGE_DIMENSION) / height);
      height = MAX_IMAGE_DIMENSION;
    }

    canvas.width = width;
    canvas.height = height;
    ctx.drawImage(image, 0, 0, width, height);
    return true;
  }

  canvas.width = width;
  canvas.height = height;
  ctx.drawImage(image, 0, 0);
  return false;
}

export const removeBackground = async (imageElement: HTMLImageElement): Promise<Blob> => {
  try {
    console.log('Starting background removal process...');
    const segmenter = await pipeline('image-segmentation', 'Xenova/segformer-b0-finetuned-ade-512-512', {
      device: 'webgpu',
    });
    
    // Convert HTMLImageElement to canvas
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    if (!ctx) throw new Error('Could not get canvas context');
    
    // Resize image if needed and draw it to canvas
    const wasResized = resizeImageIfNeeded(canvas, ctx, imageElement);
    console.log(`Image ${wasResized ? 'was' : 'was not'} resized. Final dimensions: ${canvas.width}x${canvas.height}`);
    
    // Get image data as base64
    const imageData = canvas.toDataURL('image/jpeg', 0.8);
    console.log('Image converted to base64');
    
    // Process the image with the segmentation model
    console.log('Processing with segmentation model...');
    const result = await segmenter(imageData);
    
    console.log('Segmentation result:', result);
    
    if (!result || !Array.isArray(result) || result.length === 0 || !result[0].mask) {
      throw new Error('Invalid segmentation result');
    }
    
    // Create a new canvas for the masked image
    const outputCanvas = document.createElement('canvas');
    outputCanvas.width = canvas.width;
    outputCanvas.height = canvas.height;
    const outputCtx = outputCanvas.getContext('2d');
    
    if (!outputCtx) throw new Error('Could not get output canvas context');
    
    // Draw original image
    outputCtx.drawImage(canvas, 0, 0);
    
    // Apply the mask
    const outputImageData = outputCtx.getImageData(
      0, 0,
      outputCanvas.width,
      outputCanvas.height
    );
    const data = outputImageData.data;
    
    // Apply inverted mask to alpha channel
    for (let i = 0; i < result[0].mask.data.length; i++) {
      // Invert the mask value (1 - value) to keep the subject instead of the background
      const alpha = Math.round((1 - result[0].mask.data[i]) * 255);
      data[i * 4 + 3] = alpha;
    }
    
    outputCtx.putImageData(outputImageData, 0, 0);
    console.log('Mask applied successfully');
    
    // Convert canvas to blob
    return new Promise((resolve, reject) => {
      outputCanvas.toBlob(
        (blob) => {
          if (blob) {
            console.log('Successfully created final blob');
            resolve(blob);
          } else {
            reject(new Error('Failed to create blob'));
          }
        },
        'image/png',
        1.0
      );
    });
  } catch (error) {
    console.error('Error removing background:', error);
    throw error;
  }
};

export const loadImage = (file: Blob): Promise<HTMLImageElement> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = URL.createObjectURL(file);
  });
};

// Face detection for glasses positioning
export const detectFace = async (imageElement: HTMLImageElement) => {
  try {
    console.log('Starting face detection...');
    const detector = await pipeline('object-detection', 'Xenova/yolos-tiny', {
      device: 'webgpu',
    });
    
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('Could not get canvas context');
    
    resizeImageIfNeeded(canvas, ctx, imageElement);
    const imageData = canvas.toDataURL('image/jpeg', 0.8);
    
    const results = await detector(imageData);
    console.log('Face detection results:', results);
    
    // Find person/face in results
    const person = results.find((result: any) => 
      result.label.toLowerCase().includes('person') && result.score > 0.5
    );
    
    if (person) {
      // Estimate eye position (approximately 1/3 down from top of detected person)
      const eyeY = (person as any).box.ymin + ((person as any).box.ymax - (person as any).box.ymin) * 0.3;
      const eyeX = (person as any).box.xmin + ((person as any).box.xmax - (person as any).box.xmin) * 0.5;
      const faceWidth = (person as any).box.xmax - (person as any).box.xmin;
      
      return {
        detected: true,
        eyePosition: { x: eyeX, y: eyeY },
        faceWidth: faceWidth,
        confidence: (person as any).score
      };
    }
    
    return { detected: false };
  } catch (error) {
    console.error('Face detection error:', error);
    return { detected: false };
  }
};

// Pose detection for clothing positioning
export const detectPose = async (imageElement: HTMLImageElement) => {
  try {
    console.log('Starting pose detection...');
    const detector = await pipeline('object-detection', 'Xenova/yolos-tiny', {
      device: 'webgpu',
    });
    
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('Could not get canvas context');
    
    resizeImageIfNeeded(canvas, ctx, imageElement);
    const imageData = canvas.toDataURL('image/jpeg', 0.8);
    
    const results = await detector(imageData);
    console.log('Pose detection results:', results);
    
    // Find person in results
    const person = results.find((result: any) => 
      result.label.toLowerCase().includes('person') && result.score > 0.5
    );
    
    if (person) {
      // Estimate torso position
      const torsoY = (person as any).box.ymin + ((person as any).box.ymax - (person as any).box.ymin) * 0.4;
      const torsoX = (person as any).box.xmin + ((person as any).box.xmax - (person as any).box.xmin) * 0.5;
      const shoulderWidth = ((person as any).box.xmax - (person as any).box.xmin) * 0.8;
      const torsoHeight = ((person as any).box.ymax - (person as any).box.ymin) * 0.6;
      
      return {
        detected: true,
        torsoPosition: { x: torsoX, y: torsoY },
        shoulderWidth: shoulderWidth,
        torsoHeight: torsoHeight,
        confidence: (person as any).score
      };
    }
    
    return { detected: false };
  } catch (error) {
    console.error('Pose detection error:', error);
    return { detected: false };
  }
};
