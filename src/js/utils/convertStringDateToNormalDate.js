export default function convertStringDateToNormalDate(
  stringDate,
  seperator = " "
) {
  let splitted = stringDate.split(seperator);
  if (splitted.length != 3 || !/\d\d.\d\d.\d\d\d\d/.test(splitted)) {
    throw new Error(
      "StringDate Must be in 3 parts AND format is :  dd mm yyyy"
    );
  }

  return new Date(splitted[2], splitted[1] - 1, splitted[0]);
}
