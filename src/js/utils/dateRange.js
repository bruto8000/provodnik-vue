function dateRange(date1, date2, seperator = " ", yearLength = 4) {
  ///DATE
  let parts = date1.split(" ");

  let startDate;
  let endDate;
  if (parts.length === 3) {
    startDate = new Date(parts[2], parts[1] - 1, parts[0]);

    parts = date2.split(" ");

    endDate = new Date(parts[2], parts[1] - 1, parts[0]);
  } else if (parts.length == 2) {
    if (isNaN(Number(parts[0]))) {
      switch (parts[0]) {
        case "I":
          startDate = new Date(parts[1], "0", "1");
          endDate = new Date(parts[1], "3", "0");
          break;
        case "II":
          startDate = new Date(parts[1], "3", "1");
          endDate = new Date(parts[1], "6", "0");
          break;
        case "III":
          startDate = new Date(parts[1], "6", "1");
          endDate = new Date(parts[1], "9", "0");
          break;
        case "IV":
          startDate = new Date(parts[1], "9", "1");
          endDate = new Date(parts[1], "11", "31");
          break;
      }
    } else {
      //MONTH SELECTED

      startDate = new Date(parts[1], parts[0] - 1, "1");
      endDate = new Date(parts[1], parts[0], "0");
    }
  } else {
    startDate = new Date(parts[0], 0, 1);
    endDate = new Date(parts[0], 11, 31);
  }

  if (endDate < startDate) {
    let y;
    y = startDate;
    startDate = endDate;
    endDate = y;
  }

  let dates = [];
  //to avoid modifying the original date
  const theDate = new Date(startDate);

  while (theDate < endDate) {
    let dateForPush = "";

    if (theDate.getDate() < 10) {
      dateForPush += "0" + theDate.getDate() + seperator;
    } else {
      dateForPush += theDate.getDate() + seperator;
    }

    if (theDate.getMonth() < 9) {
      dateForPush += "0" + (theDate.getMonth() + 1) + seperator;
    } else {
      dateForPush += theDate.getMonth() + 1 + seperator;
    }
    if (yearLength == 4) {
      dateForPush += theDate.getFullYear();
    } else {
      dateForPush += theDate
        .getFullYear()
        .toString()
        .slice(2, 4);
    }
    dates.push(dateForPush);
    theDate.setDate(theDate.getDate() + 1);
  }

  let dateForPush = "";

  if (theDate.getDate() < 10) {
    dateForPush += "0" + theDate.getDate() + seperator;
  } else {
    dateForPush += theDate.getDate() + seperator;
  }

  if (theDate.getMonth() < 9) {
    dateForPush += "0" + (theDate.getMonth() + 1) + seperator;
  } else {
    dateForPush += theDate.getMonth() + 1 + seperator;
  }
  if (yearLength == 4) {
    dateForPush += theDate.getFullYear();
  } else {
    dateForPush += theDate
      .getFullYear()
      .toString()
      .slice(2, 4);
  }
  dates.push(dateForPush);

  // dates //

  return dates;
}
export default dateRange;
