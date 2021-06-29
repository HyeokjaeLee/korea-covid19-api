export const convert_date_format = (
    input_date: Date | string,
    form: string
  ) => {
    const num2str = (num: number) => (num < 10 ? "0" + num : String(num)),
      date = new Date(input_date),
      year: number = date.getFullYear(), //yyyy
      month: string = num2str(1 + date.getMonth()), //M
      day: string = num2str(date.getDate());
    return year + form + month + form + day;
  },
  string2date = (string_date: string) => {
    const strArr: string[] = string_date.split("-");
    const numArr: number[] = [];
    for (let i = 0; i < 3; i++) {
      numArr[i] = Number(strArr[i]);
    }
    const date: Date = new Date(numArr[0], numArr[1] - 1, numArr[2]);
    return date;
  },
  //queryString으로 받은 값과 비교하기 위한 형식으로변환 ex:20210326
  date2query_form = (date: Date | string) =>
    Number(convert_date_format(date, ""));
