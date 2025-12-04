import * as pdfjsLib from 'pdfjs-dist';

// Handle potential ESM interop issues where the library is on 'default'
// When using esm.sh, the export structure can sometimes be nested in .default
const pdf = (pdfjsLib as any).default || pdfjsLib;

if (!pdf.GlobalWorkerOptions) {
    console.error("PDF.js library not loaded correctly", pdf);
    throw new Error("PDF.js library not loaded correctly. GlobalWorkerOptions is missing.");
}

// Explicitly setting the worker source to a CDN to ensure it works without complex build step configs
pdf.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js`;

export const convertPdfToImages = async (
  file: File, 
  onProgress: (current: number, total: number) => void
): Promise<string[]> => {
  try {
    const arrayBuffer = await file.arrayBuffer();
    
    // Configure cMapUrl to ensure fonts render correctly from CDN
    // Using the same version as the worker is crucial
    // Use the 'pdf' object resolved above which guarantees access to getDocument
    const loadingTask = pdf.getDocument({ 
      data: arrayBuffer,
      cMapUrl: 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/cmaps/',
      cMapPacked: true,
    });
    
    const pdfDoc = await loadingTask.promise;
    
    const pageCount = pdfDoc.numPages;
    const images: string[] = [];

    for (let i = 1; i <= pageCount; i++) {
      const page = await pdfDoc.getPage(i);
      
      // Scale: 2.0 provides good quality for OCR without being too massive
      const viewport = page.getViewport({ scale: 2.0 }); 
      
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d');
      
      if (!context) throw new Error('Could not create canvas context');

      canvas.height = viewport.height;
      canvas.width = viewport.width;

      await page.render({
        canvasContext: context,
        viewport: viewport,
      }).promise;

      // Convert to JPEG base64 to save size compared to PNG
      // Gemini handles JPEG artifacts well for text
      const base64 = canvas.toDataURL('image/jpeg', 0.8);
      images.push(base64);
      
      onProgress(i, pageCount);
    }

    return images;
  } catch (error) {
    console.error('Error converting PDF:', error);
    // Provide a more descriptive error message
    throw new Error(`Failed to process PDF file. Details: ${(error as Error).message}`);
  }
};