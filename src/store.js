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
  axios.get(Vue.prototype.$URL + "/vendor/showEmployees").then(
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
  setTimeout(() => {
    axios
      .all([
        axios.get(Vue.prototype.$URL + "/vendor/showTabel"),
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
          store.commit("setEditableTabel", _.cloneDeep(Tres.data));
        })
      );
  }, 2000);
};
const getActivities = (store) => {
  axios.get("./vendor/showActivities").then(
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
  axios.get("./vendor/showInfoQueries").then(
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

      // activity.sdate == "0000-00-00" && (activity.sdate = "");
      // activity.fdate == "0000-00-00" && (activity.fdate = "");
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
    currentEditingInfoQuery: {
      inicatior: "",
      fdate: "",
      sdate: "",
      nazvanie: "",
      otvetstveniy: "",
      otchot: "",
      statuses: [],
      classification: "",
      problem: "",
      produkt: "",
      otvetfrom: "",
      days: "",
    },

    infoQueriesSelectOptions: {
      classificationOptions: [
        "Прайс",
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
    projectsSelectOptions: {
       businessTypeOptions: [
         "FMC",
         "B2B",
         "ПК",
         "FTTB",
         "FMC/FTTB",
         "B2B/B2C",
         "FMC/B2C",
         "Не применимо"
       ],
       statusOptions: [   
        "В работе",
        "Выполнено",
        "Отложено",
        "Отменено"
 
      ],
      CAOptions: [
        "Группа сопровождения",
        "ДОК",
        "Клиенты",
        "Обслуживание"
      ],
      projectTypeOptions: [
        "Качественный",
        "Количественный"
      ]
    }
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
    setEditingInfoQuery(state, infoQuery) {
      state.currentEditingInfoQuery = _.cloneDeep(infoQuery);
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
    updateInfoQuery(state, infoQueryForEdit) {
      let foundedInfoQuery = state.infoQueries.find(
        (infoQuery) => infoQuery.id === infoQueryForEdit.id
      );
      if (!foundedInfoQuery) return;
      for (let prop in infoQueryForEdit) {
        foundedInfoQuery[prop] = infoQueryForEdit[prop];
      }
    },
    deleteInfoQuery(state, infoQueryForDelete) {
      state.infoQueries = state.infoQueries.filter((infoQuery) => {
        return infoQuery.id != infoQueryForDelete.id;
      });
    },
  },
  actions: {
    async editEmployee(context, editedEmployee) {
      axios.post("/vendor/editEmployee", editedEmployee).then(
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
        .post(Vue.prototype.$URL + "/vendor/deleteEmployee", deletableEmployee)
        .then(
          (result) => {
            M.toast({ html: "Сотрудник удален" });
            context.commit("deleteEmployee", deletableEmployee);
          },
          (error) => {
            M.toast({ html: "Сотрудник НЕ удален" + error });
          }
        );
    },
    addEmployee(context, newEmployee) {
      return axios
        .post("/vendor/addEmployee", newEmployee)
        .then((res) => {
          context.commit("insertItems", {
            items: [newEmployee],
            insertTo: "employees",
          });

          return Promise.resolve();
        })
        .catch((err) => {
          console.log(err);
          console.log(err.response);
          console.log(err.response.data);
          if (err.response.data == "NID") {
            return Promise.reject("Уникальный ID уже существует");
          } else {
            return Promise.reject(
              "Что-то не так. Зовите программиста" + err.response.data
            );
          }
        });
    },
    async saveTabel(context, newTabel) {
      axios
        .post(
          Vue.prototype.$URL + "/vendor/saveTabel",
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

    async changeActivityOcenka(context, { id, ocenka }) {
      return new Promise((resolve, reject) => {
        axios
          .post("./vendor/changeOcenka", {
            id: id,
            ocenka: ocenka,
          })
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
          .post("../vendor/addActivity", activity)
          .then((res) => {
            let activityId = res.data;
            activity.id = activityId;
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
      console.log("editing activity");
      await axios
        .post("../vendor/editActivity", activity)
        .then((r) => {
          commit("updateActivity", activity);
          return Promise.resolve();
        })
        .catch((e) => {
          console.log(e);
          return Promise.reject(e);
        });
    },
    async deleteActivity({ commit }, activity) {
      await axios
        .post("/vendor/deleteActivity", {
          id: activity.id,
        })
        .then((responce) => {
          commit("deleteActivity", activity);
          return Promise.resolve();
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
          .post("../vendor/addInfoQuery", JSON.stringify(infoQuery))
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
    async editInfoQuery({ commit, dispatch }, infoQuery) {
      return new Promise((resolve, reject) => {
        console.log("adding");
        axios
          .post("../vendor/editInfoQuery", infoQuery)
          .then((res) => {
            commit("updateInfoQuery", infoQuery);

            resolve();
          })
          .catch((err) => {
            reject(err);
          });
      });
    },
    async deleteInfoQuery({ commit }, infoQuery) {
      await axios
        .post("/vendor/deleteInfoQuery", {
          id: infoQuery.id,
        })
        .then((responce) => {
          if (responce.data == "OK") {
            commit("deleteInfoQuery", infoQuery);
            return Promise.resolve();
          } else {
            throw new Error(responce.data);
          }
        })
        .catch((e) => {
          return Promise.reject(e);
        });
    },
  },
  getters: {
    trueNID: (state) => state.employees.map((em) => em.nid),
    employees: (state) => state.employees.map((em) => em.full_name),
  },
  plugins: [getEmployees, getTabel, getActivities, getInfoQueries],
});

export default store;
