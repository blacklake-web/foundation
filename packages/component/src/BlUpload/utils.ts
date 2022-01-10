export const getBase64 = (file: any) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
};

export function modifyResponseHeader(res: Response, key: string, value: string) {
    const newHeaders = new Headers(res.headers);
    newHeaders.set(key, value);
    return (new Response(res.body, { headers: newHeaders }));
}
