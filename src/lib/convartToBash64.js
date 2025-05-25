const toBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const base64 = reader.result;
      console.log("📄 File converted to Base64, length:", base64.length);
      resolve(base64);
    };
    reader.onerror = (error) => {
      console.error("❌ Error converting file to Base64:", error);
      reject(error);
    };
  });
