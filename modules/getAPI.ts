export const getJSON_Array = async (url: string) => {
  const data = await fetch(url);
  return data.json();
};
