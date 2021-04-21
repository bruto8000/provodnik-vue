import Vuex from "vuex";
import Vue from "vue";
import axios from 'axios'
URL = 'http://192.168.0.104' 
Vue.use(Vuex);
console.log(URL)



const getEmployees = store => {
 axios.get(URL + '/vendor/showEmployees.php').then((result)=>{
store.commit("setEmployees", result.data)
     }, (err)=>{
       M.toast({html: "Упс, не удалось получить данные с сервера [Данные о пользователях]"})
     }); 
}
const getTabel = store =>{
  axios
  .all([
    axios.get(URL + "/vendor/showTabel.php"),
    axios.get(
      "https://isdayoff.ru/api/getdata?year=2021&pre=0&delimeter=DAY"
    ),
  ])
  .then(
    axios.spread(( Tres, Dres) => {
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
  

      store.commit('setTabel', Tres.data)
      // this.tabel = Tres.data;
      // this.employees = Eres.data;
      //  this.changeOnServer();
    })
  );
}







const store = new Vuex.Store({
  state: {
    activities: [],
    employees: [],
    tabel: []
  },
  mutations: {
    setEmployees(state, employees) {
      state.employees = employees;
    },
    setTabel(state,tabel){

 state.tabel = tabel;   

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
    addEmployee(state, newEmployee){
      state.employees.unshift({
        full_name: newEmployee.full_name,
        nid: newEmployee.nid,
        login: newEmployee.login,
      });
    }
  },
  actions: {
    async  editEmployee(context, editedEmployee) {
      axios
        .post(
          URL + "/vendor/editEmployee.php",
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
    async  deleteEmployee(context, deletableEmployee) {
      axios
        .post(
          URL + "/vendor/deleteEmployee.php",
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
  async  addEmployee(context,newEmployee){
   await   axios
      .post(
        URL + "/vendor/addEmployee.php",
        JSON.stringify(newEmployee)
      )
      .then((res) => {
        console.log(res.data);
        if (res.data == "OK") {
          M.toast({ html: "Сотрудник добавлен" });
        context.commit('addEmployee', newEmployee)
          
        } else if (res.data == "NID") {
          M.toast({ html: "Уникальный ID уже существует" });
        } else {
          M.toast({ html: "Что-то не так. Зовите программиста" + res.data });
        }
      });
    }
  },
  getters: {
   trueNID : (state) => state.employees.map((em) =>em.nid)
  
},
  plugins: [getEmployees,getTabel]
});

export default store;
