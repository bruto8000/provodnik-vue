let Kalendar = (() => {
  function initDateInput(properties, querySelector) {
    return M.Datepicker.init(
      document.querySelectorAll(querySelector || ".datepicker"),

      {


        i18n: {
          months: [
            "Январь",
            "Февраль",
            "Март",
            "Апрель",
            "Май",
            "Июнь",
            "Июль",
            "Август",
            "Сентябрь",
            "Октябрь",
            "Ноябрь",
            "Декабрь",
          ],

          monthsShort: [
            "Январь",
            "Февраль",
            "Март",
            "Апрель",
            "Май",
            "Июнь",
            "Июль",
            "Август",
            "Сентябрь",
            "Октябрь",
            "Ноябрь",
            "Декабрь",
          ],
          weekdays: [
            "Понедельник",
            "Вторник",
            "Среда",
            "Четверг",
            "Пятница",
            "Суббота",
            "Воскресенье",
          ],
          weekdaysShort: ["Вс", "Пн", "Вт", "Ср", "Чт", "Пт ", "Сб "],
          weekdaysAbbrev: ["Вс", "Пн", "Вт", "Ср", "Чт", "Пт ", "Сб "],
          cancel: "Отмена",
          clear: "Очистить",
          done: "ОК",
        },
        firstDay: 1,
        format: "dd mm yyyy",
        showDaysInNextAndPreviousMonths: true,
        autoClose: true,
        ...properties,
      }
    );

  }

  return {
    set: initDateInput,
  };
})();

export default Kalendar;
