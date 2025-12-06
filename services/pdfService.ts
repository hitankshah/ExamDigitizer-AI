import * as pdfjsLib from 'pdfjs-dist';

// Robustly determine the correct PDF.js object
// Some bundlers/CDNs put the library on .default, others on the namespace root
// We check for GlobalWorkerOptions to confirm we have the correct object
const pdf: any = (pdfjsLib as any).GlobalWorkerOptions ? pdfjsLib : (pdfjsLib as any).default;

if (!pdf || !pdf.GlobalWorkerOptions) {
    console.error("PDF.js library not loaded correctly. structure:", pdfjsLib);
    throw new Error("PDF.js library not loaded correctly. GlobalWorkerOptions is missing.");
}

// Explicitly setting the worker source to a CDN to ensure it works without complex build step configs
pdf.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js`;

export const convertPdfToImages = async (
  file: File, 
  onProgress: (current: number, total: number) => void
): Promise<string[]> => {
  if (!file) throw new Error("No file provided.");
  if (file.type !== 'application/pdf') throw new Error("Invalid file type. Please upload a PDF.");
  
  // Safety check for extremely large files (e.g., > 100MB)
  if (file.size > 100 * 1024 * 1024) {
    throw new Error("File is too large (>100MB). Please upload a smaller optimized PDF.");
  }

  try {
    const arrayBuffer = await file.arrayBuffer();
    
    // Configure cMapUrl to ensure fonts render correctly from CDN
    const loadingTask = pdf.getDocument({ 
      data: arrayBuffer,
      cMapUrl: 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/cmaps/',
      cMapPacked: true,
    });
    
    const pdfDoc = await loadingTask.promise;
    
    const pageCount = pdfDoc.numPages;
    if (pageCount === 0) throw new Error("The PDF appears to be empty.");
    // Soft limit to prevent browser memory crashes
    if (pageCount > 100) throw new Error("PDF has too many pages (>100). Please split the document or upload a shorter exam.");

    const images: string[] = [];

    for (let i = 1; i <= pageCount; i++) {
      try {
        const page = await pdfDoc.getPage(i);
        
        // Scale: 2.0 provides good quality for OCR without being too massive
        const viewport = page.getViewport({ scale: 2.0 }); 
        
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        
        if (!context) throw new Error(`Could not create canvas context for page ${i}`);

        canvas.height = viewport.height;
        canvas.width = viewport.width;

        await page.render({
          canvasContext: context,
          viewport: viewport,
        }).promise;

        // Convert to JPEG base64 to save size compared to PNG
        const base64 = canvas.toDataURL('image/jpeg', 0.8);
        images.push(base64);
        
        onProgress(i, pageCount);
      } catch (pageErr) {
        console.error(`Error rendering page ${i}:`, pageErr);
        throw new Error(`Failed to render page ${i}. The PDF page might be corrupted or contains unsupported features.`);
      }
    }

    return images;
  } catch (error: any) {
    console.error('Error converting PDF:', error);
    
    if (error.name === 'PasswordException') {
        throw new Error("The PDF is password protected. Please unlock it and try again.");
    }
    if (error.name === 'InvalidPDFException') {
        throw new Error("The file does not appear to be a valid PDF.");
    }
    if (error.message && (error.message.includes('too large') || error.message.includes('too many pages'))) {
        throw error;
    }

    throw new Error(`Failed to process PDF file. ${error.message || ''}`);
  }
};