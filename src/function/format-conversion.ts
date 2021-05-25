export const convertDateFormat = (input_date: Date, form: string) => {
    const date = new Date(input_date);
    const num2str = (num: number) => {
      let result;
      if (num < 10) {
        result = "0" + num;
      } else {
        result = String(num);
      }
      return result;
    };
    let year: number = date.getFullYear(); //yyyy
    let month: string = num2str(1 + date.getMonth()); //M
    let day: string = num2str(date.getDate());

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
  date2query_form = (date: Date) => Number(convertDateFormat(date, ""));
