const createWebp = (imageFile: File) => {
  return new Promise<string>((resolve) => {
    const imageFileReader = new FileReader();
    imageFileReader.onload = (e) => {
      const image = new Image();
      image.src = (<string>e.target?.result);
      image.onload = () => {
        const canvas = document.createElement("canvas");
        canvas.width = image.width;
        canvas.height = image.height;
        (<CanvasRenderingContext2D>canvas.getContext("2d")).drawImage(image, 0, 0);
        resolve(canvas.toDataURL("image/webp"))
      }
    }
    imageFileReader.readAsDataURL(imageFile)
  });
}