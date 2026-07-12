export type CroppedAreaPixels = {
  height: number;
  width: number;
  x: number;
  y: number;
};

type CropImageOptions = {
  croppedAreaPixels: CroppedAreaPixels;
  fileName?: string;
  imageSrc: string;
  mimeType: string;
};

const DEFAULT_FILE_NAME = "cropped-image";
const IMAGE_QUALITY = 0.92;

export async function getCroppedImageFile({
  croppedAreaPixels,
  fileName = DEFAULT_FILE_NAME,
  imageSrc,
  mimeType,
}: CropImageOptions) {
  const image = await createImage(imageSrc);
  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d");

  if (!context) {
    throw new Error("Não foi possível preparar a imagem para corte.");
  }

  const cropX = Math.max(0, Math.round(croppedAreaPixels.x));
  const cropY = Math.max(0, Math.round(croppedAreaPixels.y));
  const naturalWidth = image.naturalWidth || image.width;
  const naturalHeight = image.naturalHeight || image.height;
  const cropWidth = Math.min(
    Math.round(croppedAreaPixels.width),
    naturalWidth - cropX,
  );
  const cropHeight = Math.min(
    Math.round(croppedAreaPixels.height),
    naturalHeight - cropY,
  );

  if (cropWidth <= 0 || cropHeight <= 0) {
    throw new Error("Área de corte inválida.");
  }

  canvas.width = cropWidth;
  canvas.height = cropHeight;

  context.drawImage(
    image,
    cropX,
    cropY,
    cropWidth,
    cropHeight,
    0,
    0,
    cropWidth,
    cropHeight,
  );

  const blob = await canvasToBlob(canvas, mimeType);

  return new File([blob], fileName, {
    lastModified: Date.now(),
    type: mimeType,
  });
}

function createImage(imageSrc: string) {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const image = new Image();

    image.addEventListener("load", () => resolve(image), { once: true });
    image.addEventListener(
      "error",
      () =>
        reject(new Error("Não foi possível carregar a imagem selecionada.")),
      { once: true },
    );

    image.crossOrigin = "anonymous";
    image.src = imageSrc;
  });
}

function canvasToBlob(canvas: HTMLCanvasElement, mimeType: string) {
  return new Promise<Blob>((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (!blob) {
          reject(new Error("Não foi possível gerar a imagem ajustada."));
          return;
        }

        resolve(blob);
      },
      mimeType,
      IMAGE_QUALITY,
    );
  });
}
