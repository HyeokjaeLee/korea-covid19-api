export const get_json = async (url: string) => {
  const data = await fetch(url);
  console.log("test" + data);
  return data.json();
};

export const object2array = (object: any) => Object.entries(object.total_info).map((data: any) => data[1]);
