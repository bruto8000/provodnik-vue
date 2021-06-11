import Vuex from "vuex";
import Vue from "vue";
import axios from "axios";

import config from "../public/config";
let APIUrl = config.APIUrl;
Vue.use(Vuex);

const showReceivingError = function(err) {
  M.toast({
    html: `Упс, не удалось получить данные с сервера ${err}`,
  });
};

const getEmployees = (store) => {
  axios.get(APIUrl + "/vendor/showEmployees").then(
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
        axios.get(APIUrl + "/vendor/showTabel"),
        axios.get(APIUrl + "/vendor/showHolidays"),
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
  axios.get(APIUrl + "/vendor/showActivities").then(
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
  axios.get(APIUrl + "/vendor/showInfoQueries").then(
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
const getProjects = (store) => {
  axios.get(APIUrl + "/vendor/showProjects").then(
    (res) => {
      store.dispatch("insertItems", {
        items: res.data.reverse(),
        insertTo: "projects",
        parsingFunction: null,
      });
    },
    (err) => {
      showReceivingError(`[Проекты] ${err.message}`);
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
    role: "guest",
    activities: [],
    infoQueries: [],
    projects: [],
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
    currentEditingProject: {
      accompanying: "",
      fdate: "",
      sdate: "",
      title: "",
      description: "",
      businessType: "",
      workGroup: "",
      status: "",
      CA: "",

      projectType: "",
      efficiency: {
        title: "",
        rows: [],
      },
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
        "Не применимо",
      ],
      statusOptions: ["В работе", "Выполнено", "Отложено", "Отменено"],
      CAOptions: ["Группа сопровождения", "ДОК", "Клиенты", "Обслуживание"],
      projectTypeOptions: ["Качественный", "Количественный"],
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
    insertItems(state, { items, insertTo, filterForUnique }) {
      if (!filterForUnique) {
        state[insertTo] = items.concat(state[insertTo]);
      } else {
        state[insertTo] = items
          .filter(
            (item) =>
              !state[insertTo].find((itemInState) => itemInState.id == item.id)
          )
          .concat(state[insertTo]);
      }
    },
    setEditingInfoQuery(state, infoQuery) {
      state.currentEditingInfoQuery = _.cloneDeep(infoQuery);
    },
    setEditingProject(state, project) {
      state.currentEditingProject = _.cloneDeep(project);
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
    updateProject(state, projectForEdit) {
      let foundedProject = state.projects.find(
        (project) => project.id === projectForEdit.id
      );
      if (!foundedProject) return;
      for (let prop in projectForEdit) {
        foundedProject[prop] = projectForEdit[prop];
      }
    },
    deleteInfoQuery(state, infoQueryForDelete) {
      state.infoQueries = state.infoQueries.filter((infoQuery) => {
        return infoQuery.id != infoQueryForDelete.id;
      });
    },
    deleteProject(state, projectForDelete) {
      state.projects = state.projects.filter((project) => {
        return project.id != projectForDelete.id;
      });
    },
    setRole(state, role) {
      state.role = role;
    },
  },
  actions: {
    async editEmployee(context, editedEmployee) {
      axios.post(APIUrl + "/vendor/editEmployee", editedEmployee).then(
        (result) => {
          M.toast({ html: "Сотрудник изменен" });

          context.commit("editEmployee", editedEmployee);
        },
        (error) => {
          M.toast({ html: "Сотрудник НЕ изменен" + error });
        }
      );
    },
    async deleteEmployee(context, deletableEmployee) {
      axios.post(APIUrl + "/vendor/deleteEmployee", deletableEmployee).then(
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
        .post(APIUrl + "/vendor/addEmployee", newEmployee)
        .then((res) => {
          context.commit("insertItems", {
            items: [newEmployee],
            insertTo: "employees",
          });

          return Promise.resolve();
        })
        .catch((err) => {
          if (err.response.data == "NID") {
            return Promise.reject("Уникальный ID или Логин уже существует");
          } else {
            return Promise.reject(
              "Что-то не так. Зовите программиста" + err.response.data
            );
          }
        });
    },
    async saveTabel(context, newTabel) {
      axios.post(APIUrl + "/vendor/saveTabel", newTabel).then(
        (res) => {
          M.toast({
            html: "Данные сохранены.",
          });
          context.commit("setTabel", JSON.parse(JSON.stringify(newTabel)));
        },
        (err) => {
          M.toast({
            html: "Синхронизация не удалась" + err.message,
          });
        }
      );
    },
    insertItems(
      context,
      { items, insertTo, parsingFunction, filterForUnique }
    ) {
      parsingFunction &&
        parsingFunctions[parsingFunction] &&
        (items = parsingFunctions[parsingFunction](items));

      context.commit("insertItems", { items, insertTo, filterForUnique });
    },

    //ACTIVITIES////
    async changeActivityOcenka(context, { id, ocenka }) {
      return new Promise((resolve, reject) => {
        axios
          .post(APIUrl + "/vendor/changeOcenka", {
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
    async addActivity({ commit, dispatch }, activity) {
      return new Promise((resolve, reject) => {
        axios
          .post(APIUrl + "/vendor/addActivity", activity)
          .then((res) => {
            let id = res.data;
            let newActivity = Object.assign(_.cloneDeep(activity), { id });
            dispatch("insertItems", {
              items: [newActivity],
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
        .post(APIUrl + "/vendor/editActivity", activity)
        .then((r) => {
          commit("updateActivity", activity);
          return Promise.resolve();
        })
        .catch((e) => {
          return Promise.reject(e);
        });
    },
    async deleteActivity({ commit }, activity) {
      await axios
        .post(APIUrl + "/vendor/deleteActivity", {
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

    // INFO QUERIES ///

    async addInfoQuery({ commit, dispatch }, infoQuery) {
      return new Promise((resolve, reject) => {
        axios
          .post(APIUrl + "/vendor/addInfoQuery", infoQuery)
          .then((res) => {
            let id = res.data;
            let newInfoQuery = Object.assign(_.cloneDeep(infoQuery), { id });
            dispatch("insertItems", {
              items: [newInfoQuery],
              insertTo: "infoQueries",
              parsingFunction: "infoQueries",
            });

            resolve();
          })
          .catch((err) => {
            reject(err);
          });
      });
    },
    async editInfoQuery({ commit, dispatch }, infoQuery) {
      return new Promise((resolve, reject) => {
        axios
          .post(APIUrl + "/vendor/editInfoQuery", infoQuery)
          .then((res) => {
            commit("updateInfoQuery", _.cloneDeep(infoQuery));

            resolve();
          })
          .catch((err) => {
            reject(err);
          });
      });
    },
    async deleteInfoQuery({ commit }, infoQuery) {
      await axios
        .post(APIUrl + "/vendor/deleteInfoQuery", {
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

    /// PROJECTS ////
    async addProject({ commit, dispatch }, project) {
      return new Promise((resolve, reject) => {
        axios
          .post(APIUrl + "/vendor/addProject", project)
          .then((res) => {
            let id = res.data;
            let newProject = Object.assign(_.cloneDeep(project), { id });
            dispatch("insertItems", {
              items: [newProject],
              insertTo: "projects",
              parsingFunction: null,
            });
            resolve();
          })
          .catch((err) => {
            reject(err);
          });
      });
    },
    async editProject({ commit, dispatch }, project) {
      return new Promise((resolve, reject) => {
        axios
          .post(APIUrl + "/vendor/editProject", project)
          .then((res) => {
            commit("updateProject", _.cloneDeep(project));

            resolve();
          })
          .catch((err) => {
            reject(err);
          });
      });
    },
    async deleteProject({ commit }, project) {
      await axios
        .post(APIUrl + "/vendor/deleteProject", {
          id: project.id,
        })
        .then((responce) => {
          commit("deleteProject", project);
          return Promise.resolve();
        })
        .catch((e) => {
          return Promise.reject(e);
        });
    },

    /// Archive ///
    async getArchived({ commit }, options) {
      return new Promise((resolve, reject) => {
        axios(APIUrl + "/vendor/archived", {
          method: "GET",
          params: options,
        }).then(
          (res) => {
            store.dispatch("insertItems", {
              items: res.data.reverse(),
              insertTo: options.dataType,
              parsingFunction: options.dataType,
              filterForUnique: true,
            });
            resolve();
          },
          (err) => {
            reject(err);
          }
        );
      });
    },
    /// ROLE ///
    async getRole({ commit }) {
      return new Promise((resolve, reject) => {
        axios
          .get(APIUrl + "/vendor/auth/role")
          .then((res) => {
            console.log(res);
            let role = res.data.role;
            commit("setRole", role || "guest");
            resolve();
          })
          .catch((err) => {
            resolve(err);
          });
      });
    },
  },
  getters: {
    trueNID: (state) => state.employees.map((em) => em.nid),
    employees: (state) => state.employees.map((em) => em.full_name),
  },
  plugins: [getEmployees, getActivities, getInfoQueries, getProjects, getTabel],
});

export default store;
