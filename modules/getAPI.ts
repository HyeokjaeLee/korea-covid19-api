export const getJSON_Array = async (url: string) => {
  const data = await fetch(url);
  console.log(data);
  const test_ = await data.json();
  console.log(test_);
  return test_;
};
