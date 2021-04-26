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
      store.dispatch("setEmployees", result.data.reverse());
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
        // this.tabel = Tres.data;
        // this.employees = Eres.data;
        //  this.changeOnServer();
      })
    );
};
const getActivities = (store) => {
  axios.get("./vendor/showActivities.php").then(
    (res) => {
      store.dispatch("insertActivities", {
        activities: res.data.reverse(),
      });
    },
    (err) => {
      showReceivingError(`[Активности] ${err.message}`);
    }
  );
};

const store = new Vuex.Store({
  state: {
    activities: [],
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
      AB: [
     
        
      ],

      statusZapusk: [],
      risks: [],
      audits: [],
      difficulty: "",
      bugs: [],
      dopinfo: "",
      //  opisanieBody: "", Will added Automaticly
      //   opisanie: "", OLD
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
    addEmployee(state, newEmployee) {
      state.employees.unshift({
        full_name: newEmployee.full_name,
        nid: newEmployee.nid,
        login: newEmployee.login,
      });
    },
    insertActivities(state, { activities }) {
      state.activities = state.activities.concat(activities);
    },
    setDisplayingActivity(state, activity) {
      state.currentDisplayingActivity = activity;
    },
    changeActivityOcenka(state, { id, ocenka }) {
      console.log("id", id);
      console.log("ocenka", ocenka);
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
      console.log('activity for delete es,', activityForDelete)
      state.activities = state.activities.filter((activity) => {
        return activity.id != activityForDelete.id;
      });
    },
    updateActivity(state,activityForEdit){
    let foundedActivity =  state.activities.find((activity)=>activity.id === activityForEdit.id);
    if(!foundedActivity) return;
   for(let prop in activityForEdit) {
    foundedActivity[prop] = activityForEdit[prop]
   }
 
    }
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
    setEmployees(context, employees) {
      employees.forEach((employee) => {
        context.commit("addEmployee", employee);
      });
    },
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
            context.commit("addEmployee", newEmployee);
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
    insertActivities(context, { activities }) {
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
      context.commit("insertActivities", { activities });
    },
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

    async addActivity({ commit }, activity) {
      return new Promise((resolve, reject) => {
        axios
          .post("../vendor/addActivity.php", JSON.stringify(activity))
          .then((res) => {
            console.log(res.data);

            ///BUG because cant get Id of inserted activity
            //  commit('addActivities',{
            //   activities : [activity]})
            resolve();
          })
          .catch((err) => {
            reject(err);
          });
      });
    },
   async editActivity({ commit }, activity) {

  await  axios
    .post("../vendor/editActivity.php", JSON.stringify(activity))
    .then((r) => {
    

      if (r.data == "OK") {
        commit('updateActivity', activity)
     return Promise.resolve()
       
      } else {
        throw new Error(r.data);
      }
    })
    .catch((e) => {
      return Promise.reject()
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
          console.log(responce)
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
        console.log(responce)
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

 },
  getters: {
    trueNID: (state) => state.employees.map((em) => em.nid),
  },
  plugins: [getEmployees, getTabel, getActivities],
});

export default store;
