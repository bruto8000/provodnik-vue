import Vuex from "vuex";
import Vue from "vue";
import axios from "axios";
Vue.prototype.$URL = "";
Vue.use(Vuex);

const showReceivingError = function(err) {
  M.toast({
    html: `Упс, не удалось получить данные с сервера ${err}`,
  });
};

const getEmployees = (store) => {
  axios.get(Vue.prototype.$URL + "/vendor/showEmployees.php").then(
    (result) => {
      store.dispatch("insertItems", {
        items: result.data.reverse(),
        insertTo: "employees",
        parsingFunction: "employees",
      });
    },
    (err) => {
      showReceivingError(`[Пользователи] ${err.message}`);
    }
  );
};
const getTabel = (store) => {
  axios
    .all([
      axios.get(Vue.prototype.$URL + "/vendor/showTabel.php"),
      axios.get(
        "https://isdayoff.ru/api/getdata?year=2021&pre=0&delimeter=DAY"
      ),
    ])
    .then(
      axios.spread((Tres, Dres) => {
        let datesFromApi = Dres.data.split("DAY");

        Tres.data.forEach((dt, idxOfDay, dateArr) => {
          dt.presomes = [];
          dt.vixod = datesFromApi[idxOfDay] == 1;

          if (dt.vixod) {
            if (idxOfDay == 0) return;

            dateArr[idxOfDay - 1].isNextDayVixod = true;
          } else {
            dateArr[idxOfDay - 1].isNextDayVixod = false;
          }

          if (idxOfDay == dateArr.length - 1) {
            dt.isNextDayVixod = true;
          }

          store.state.employees.forEach((em) => {
            if (!dt.body[em.nid]) {
              dt.body[em.nid] = "";
            }
            if (dt.body[em.nid] == "" && dt.vixod) {
              dt.body[em.nid] = "В";
            }
          });
        });

        store.commit("setTabel", Tres.data);
        store.commit("setEditableTabel", JSON.parse(JSON.stringify(Tres.data)));
      })
    );
};
const getActivities = (store) => {
  axios.get("./vendor/showActivities.php").then(
    (res) => {
      store.dispatch("insertItems", {
        items: res.data.reverse(),
        insertTo: "activities",
        parsingFunction: "activities",
      });
    },
    (err) => {
      showReceivingError(`[Активности] ${err.message}`);
    }
  );
};
const getInfoQueries = (store) => {
  axios.get("./vendor/showInfoQueries.php").then(
    (res) => {
      store.dispatch("insertItems", {
        items: res.data.reverse(),
        insertTo: "infoQueries",
        parsingFunction: "infoQueries",
      });
    },
    (err) => {
      showReceivingError(`[Инфозапросы] ${err.message}`);
    }
  );
};
const parsingFunctions = {
  activities(activities) {
    activities.forEach((activity) => {
      if (!activity.ocenka) {
        activity.ocenka = {
          type: "",
          reason: "",
        };
      }
      let htmlEl = document.createElement("div");
      htmlEl.innerHTML = activity.opisanieBody;

      activity.opisanieBodyCuted =
        htmlEl.innerText.length < 50
          ? htmlEl.innerText
          : htmlEl.innerText.slice(0, 50) + "...";
      activity.opisanieBodyHTML = htmlEl;
    });
    return activities;
  },
  infoQueries(infoQueries) {
    return infoQueries;
  },
};

const store = new Vuex.Store({
  state: {
    activities: [],
    infoQueries: [],
    employees: [],
    tabel: [],
    editableTabel: [],
    currentDisplayingActivity: {},
    currentEditingActivity: {
      id: null,
      fdate: "",
      sdate: "",
      nazvanie: "",
      bizness: "",

      zapusk: "",
      soprovod: "",
      status: "",
      zakazchik: "",
      flags: [],
      ocenka: {
        type: "",
        reason: "",
      },
      AB: [],

      statusZapusk: [],
      risks: [],
      audits: [],
      difficulty: "",
      bugs: [],
      dopinfo: "",
      //  opisanieBody: "", Will added Automaticly
      //   opisanie: "", OLD
    },

    infoQueriesSelectOptions: {
      classificationOptions: [
        " Прайс",
        "Инструменты СУЗ",
        "Услуги",
        "Акции",
        "Сайт",
        "МП",
        "ЛК",
        "IVR/UIVR",
        "Смс поддержка ЦПК/навигатор ТП",
        "Рассылки",
        "Нотификации внутри продукта",
        "Процедура",
        "Диагностика/BPM",
        "ТП",
        "Бэк-офисы",
        "СФ",
        "Оборудование",
        "Ошибочный запрос",
        "FAQ",
        "Прочее",
      ],
      problemOptions: [
        "Отсутствует информация",
        "Некорректная информация",
        "Предложение по доработке продукта",
        "Непонятность контента",
        "Другое",
      ],
      statusOptions: [
        "Назначено",
        "В работе",
        "Возвращено на доработку инициатору",
        "Дан промежуточный ответ инициатору",
        "Отказ. Ошибка в п/я",
        "Отказ. Правки не требуются",
        "Отказано",
        "Удовлетворено",
        "Уже в реализации",
      ],
    },
  },
  mutations: {
    setTabel(state, tabel) {
      state.tabel = tabel;
    },
    setEditableTabel(state, tabel) {
      state.editableTabel = tabel;
    },
    editEmployee(state, editedEmployee) {
      state.employees.forEach((employee) => {
        if (employee.nid == editedEmployee.nid) {
          employee.full_name = editedEmployee.full_name;
          employee.login = editedEmployee.login;
        }
      });
    },
    deleteEmployee(state, deletableEmployee) {
      state.employees = state.employees.filter((e) => {
        return e.nid != deletableEmployee.nid;
      });
    },

    insertItems(state, { items, insertTo }) {
      console.log("adding", items, insertTo);
      state[insertTo] = items.concat(state[insertTo]);
    },
    editItem(context, { item, editTo }) {
      context.state["currentEditing" + editTo] = item;
    },
    displayItem(context, { item, displayTo }) {
      context.state["currentDisplaying" + displayTo] = item;
    },
    setDisplayingActivity(state, activity) {
      state.currentDisplayingActivity = activity;
    },
    changeActivityOcenka(state, { id, ocenka }) {
      let foundedActivity = state.activities.find(
        (activity) => activity.id == id
      );
      if (foundedActivity) foundedActivity.ocenka = ocenka;
      //.ocenka = ocenka;
    },
    setEditingActivity(state, activity) {
      if (state.currentEditingActivity.id === activity.id) return;
      state.currentEditingActivity = _.cloneDeep(activity);
    },
    deleteActivity(state, activityForDelete) {
      state.activities = state.activities.filter((activity) => {
        return activity.id != activityForDelete.id;
      });
    },
    updateActivity(state, activityForEdit) {
      let foundedActivity = state.activities.find(
        (activity) => activity.id === activityForEdit.id
      );
      if (!foundedActivity) return;
      for (let prop in activityForEdit) {
        foundedActivity[prop] = activityForEdit[prop];
      }
    },
  },
  actions: {
    async editEmployee(context, editedEmployee) {
      axios
        .post(
          Vue.prototype.$URL + "/vendor/editEmployee.php",
          JSON.stringify(editedEmployee)
        )
        .then(
          (result) => {
            M.toast({ html: "Сотрудник изменен" });

            context.commit("editEmployee", editedEmployee);
          },
          (error) => {
            M.toast({ html: "Сотрудник НЕ изменен" + error });
          }
        );
    },
    // setEmployees(context, employees) {
    //   employees.forEach((employee) => {
    //     context.commit("addEmployee", employee);
    //   });
    // },
    async deleteEmployee(context, deletableEmployee) {
      axios
        .post(
          Vue.prototype.$URL + "/vendor/deleteEmployee.php",
          JSON.stringify(deletableEmployee)
        )
        .then(
          (result) => {
            M.toast({ html: "Сотрудник удален" });
            context.commit("deleteEmployee", deletableEmployee);
          },
          (error) => {
            M.toast({ html: "Сотрудник НЕ удален" + error });
          }
        )
        .then(() => {});
    },
    async addEmployee(context, newEmployee) {
      await axios
        .post(
          Vue.prototype.$URL + "/vendor/addEmployee.php",
          JSON.stringify(newEmployee)
        )
        .then((res) => {
          if (res.data == "OK") {
            M.toast({ html: "Сотрудник добавлен" });
            context.commit("insertItems", {
              items: [newEmployee],
              insertTo: "employees",
            });
          } else if (res.data == "NID") {
            M.toast({ html: "Уникальный ID уже существует" });
          } else {
            M.toast({ html: "Что-то не так. Зовите программиста" + res.data });
          }
        });
    },
    async saveTabel(context, newTabel) {
      axios
        .post(
          Vue.prototype.$URL + "/vendor/saveTabel.php",
          JSON.stringify(newTabel)
        )
        .then((res) => {
          if (res.data == "OK") {
            M.toast({
              html: "Данные сохранены.",
            });
            context.commit("setTabel", JSON.parse(JSON.stringify(newTabel)));
          } else {
            M.toast({
              html: "Синхронизация не удалась" + res.data,
            });
          }
        });
    },
    insertItems(context, { items, insertTo, parsingFunction }) {
      console.log("inserting", insertTo);
      parsingFunctions[parsingFunction] &&
        (items = parsingFunctions[parsingFunction](items));

      context.commit("insertItems", { items, insertTo });
    },

    // insertInfoQueries(context, { infoQueries }) {
    //   infoQueries.forEach((infoQuery) => {

    //   });
    //   context.commit("insertInfoQueries", { infoQueries });
    // },
    async changeActivityOcenka(context, { id, ocenka }) {
      console.log(id, "suka id");
      return new Promise((resolve, reject) => {
        axios
          .post(
            "./vendor/changeOcenka.php",
            JSON.stringify({
              id: id,
              ocenka: ocenka,
            })
          )
          .then(
            () => {
              context.commit("changeActivityOcenka", {
                id,
                ocenka,
              });
              resolve();
            },
            (err) => reject(err)
          );
      });
    },
    //ACTIVITIES////
    async addActivity({ commit, dispatch }, activity) {
      return new Promise((resolve, reject) => {
        axios
          .post("../vendor/addActivity.php", JSON.stringify(activity))
          .then((res) => {
            let activity = res.data;
            dispatch("insertItems", {
              items: [activity],
              insertTo: "activities",
              parsingFunction: parsingFunctions["activities"],
            });

            resolve();
          })
          .catch((err) => {
            reject(err);
          });
      });
    },
    async editActivity({ commit }, activity) {
      await axios
        .post("../vendor/editActivity.php", JSON.stringify(activity))
        .then((r) => {
          if (r.data == "OK") {
            commit("updateActivity", activity);
            return Promise.resolve();
          } else {
            throw new Error(r.data);
          }
        })
        .catch((e) => {
          return Promise.reject();
        });
    },
    async deleteActivity({ commit }, activity) {
      await axios
        .post(
          "/vendor/deleteActivity.php",
          JSON.stringify({
            id: activity.id,
          })
        )
        .then((responce) => {
          console.log(responce);
          if (responce.data == "OK") {
            commit("deleteActivity", activity);
            return Promise.resolve();
          } else {
            throw new Error(responce.data);
          }
        })
        .catch((e) => {
          return Promise.reject(e);
        });
    },
    async archiveActivity({ commit }, activity) {
      await axios
        .post(
          "/vendor/archiveActivity.php",
          JSON.stringify({
            id: activity.id,
          })
        )
        .then((responce) => {
          console.log(responce);
          if (responce.data == "OK") {
            commit("deleteActivity", activity);
            return Promise.resolve();
          } else {
            throw new Error(responce.data);
          }
        })
        .catch((e) => {
          return Promise.reject(e);
        });
    },
    /////// INFO QUERIES /////

    async addInfoQuery({ commit, dispatch }, infoQuery) {
      return new Promise((resolve, reject) => {
        console.log("adding");
        axios
          .post("../vendor/addInfoQuery.php", JSON.stringify(infoQuery))
          .then((res) => {
            let infoQuery = res.data;
            dispatch("insertItems", {
              items: [infoQuery],
              insertTo: "infoQueries",
              parsingFunction: "infoQueries",
            });

            resolve();
          })
          .catch((err) => {
            console.log(err);
            console.log(err.responce);
            console.log(err.data);
            reject(err);
          });
      });
    },
  },
  getters: {
    trueNID: (state) => state.employees.map((em) => em.nid),
  },
  plugins: [getEmployees, getTabel, getActivities, getInfoQueries],
});

export default store;
