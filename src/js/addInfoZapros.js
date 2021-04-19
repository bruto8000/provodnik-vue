// setTimeout(()=>location.reload(), 3000) 


 Vue.component('addInfoZapros',{

    data(){return {
  
 
infozapros: {


        inicatior:'',
        fdate:'',
        sdate:'',
        nazvanie:'',
        otvetstveniy:'',
        otchot:'',
        statuses:'',
        classification:'',
        problema:'',
        produkt:'',
        otvetfrom:'',
        days:''
},
    projectNameErrors: {
        fdate: "Дата спуска",
        sdate: "Дата запуска",
        nazvanie: "Название",
        bizness: "Вид бизнеса",
        opisanie: "Описание",  
        zapusk: "Тип запуска",
        soprovod: "Сопровождающий",
        status: "Статус",
        zakazchik: "Заказчик",
        difficulty: "Сложность",
     

    }

    }
    },
    mounted: function () {




    },
    methods: {


       
        addProj: function (event) {
            event.target.classList.toggle('is-loading')
            if (!this.validateMainRows()) {


setTimeout(() => {
    event.target.classList.toggle('is-loading');
}, 400);
return;
            } 
this.project.opisanieBody = this.editor.html.get().replace(/'/ig, '"');
     
            axios.post('../vendor/addProj.php', JSON.stringify(this.project))
                .then((r) => {
     setTimeout(() => {
        event.target.classList.toggle('is-loading')
     }, 400);
                    console.log(r.data);
                    if (r.data == "OK") {
                        M.toast({
                            html: "Активность добавлена"
                        });
                        for (prop in this.project) {
                            if (prop == 'flags') {
                                this.project[prop] = [];
                                continue;
                            }

                            this.project[prop] = '';

                        };
                
                        this.editor.html.set(' ');
                        delete this.project["opisanieBody"];

                    } else {
                        throw new Error(r.data)
                    }

                })
                .catch(e => {
                    M.toast({
                        html: "Активность НЕ добавлена " + e
                    });
                })


        },
        undateZapusk: function () {
            this.undate = !this.undate;
            this.project.sdate = this.undate ? "Не определена" : "";
        },
        validateMainRows() {
            try {


                for (prop in this.project) {
                    if (!this.project[prop]) {

                        throw new Error("Пусто, чего-то не хватает: " + this.projectNameErrors[prop]);
                    }
                }

console.log('validateMainRows')
                if (this.editor.html.get().length < 50) {

                    throw new Error("Описание слишком короткое.");
                }
                return true;

            } catch (e) {

                M.toast({
                    html: e.message
                });

                return false;

            }
        }

    },
 
    watch: {
       
    },
    template: 
    /*html*/`
    
    
    <div  class="container">


    <h1 class="center title is-1">Добавление активности</h1>
    <div class="columns">
        <div class="column is-3 ">
            <div class="center">Дата спуска</div> <input v-model.lazy="project.fdate" id="fdate" type="text"
                class="datepicker center input" value="" placeholder="Выберите дату">
        </div>
        <div class="column is-3">
            <div class="center" @click="undateZapusk" ref='sdate'>Дата запуска</div> <input :disabled="undate"
                v-model.lazy="project.sdate" id="sdate" type="text" class="datepicker center input" value=""
                placeholder="Выберите дату">
        </div>
        <div class="column is-6 center ">
            <div class="  ">Название</div>
            <input placeholder="Введите Название" v-model="project.nazvanie" id="nazvanie" type="text"
                class="validate input">
        </div>
    </div>
    <div class="columns">
        <div class="column is-3 p-1 center ">
            <div class="  ">Вид бизнеса</div>
            <div class="">
                <select v-model="project.bizness" id="bizness">
                    <option value="" disabled selected>Вид бизнеса</option>
                    <option value="FMC">FMC</option>
                    <option value="B2B">B2B</option>
                    <option value="B2C">B2C</option>
                    <option value="ПК">ПК</option>
                    <option value="FTTB">FTTB</option>
                    <option value="FMC/FTTB">FMC/FTTB</option>
                    <option value="BTB/BTC">BTB/BTC</option>
                    <option value="FMC/B2C">FMC/B2C</option>
                </select>
            </div>
        </div>
        <div class="column is-3  p-1 center">
            <div class="  ">Тип запуска</div>
            <div class="">
                <select v-model="project.zapusk" id="zapusk">
                    <option value="" disabled selected>Тип запуска</option>
                    <option value="Запуск ТП">Запуск ТП</option>
                    <option value="Перезапуск ТП">Перезапуск ТП</option>
                    <option value="Закрытие ТП">Закрытие ТП</option>
                    <option value="Офсет">Офсет</option>
                    <option value="Симплификация/Репайсинг">Симплификация/Репайсинг</option>
                    <option value="Запуск Услуги">Запуск Услуги</option>
                    <option value="Изменение условий услиги">Изменение условий услиги</option>
                    <option value="Закрытие условий">Закрытие условий</option>
                    <option value="Запуск акции">Запуск акции</option>
                    <option value="Закрытие акции">Закрытие акции</option>
                    <option value="SMS/push/email рассылка">SMS/push/email рассылка</option>
                    <option value="Запуск Города">Запуск Города</option>
                    <option value="Оборудование">Оборудование</option>
                </select>
            </div>
        </div>

        <div class="column is-3 center p-1">
            <div class="  ">Сложность</div>
            <select v-model="project.difficulty"  id="difficulty">
<option value="1">1</option>
<option value="1.5">1.5</option>
<option value="2">2</option>
<option value="2.5">2.5</option>
<option value="3">3</option>
<option value="3.5">3.5</option>
<option value="ДПП">ДПП</option>


            </select>
      
        </div>

        <div class="column is-3 center ">
            <div class="  ">Заказчик</div>
            <input placeholder="Введите заказчика"  v-model="project.zakazchik" id="zakazchik" type="text"
                class="validate input">
        </div>
    </div>
    <div class="columns">
        <div class="column is-6 p-1">
            <div class="   center">Сопровождающий</div>
            <div class="">

                <select v-model="project.soprovod" id="soprovod">
                    
                    <option value="" selected>Сопровождающий</option>
                    <option v-for="employee in employees" :value="employee['full_name']">{{employee['full_name']}}
                    </option>
                    
                </select>
            </div>


        </div>



        <div class="column is-3  p-1 center ">
            <div class="">Статус</div>
            <div class="">
                <select v-model="project.status" id="status">
                    <option value="" disabled selected>Статус</option>
                    <option value="В работе">В работе </option>
                    <option value="Выполнено">Выполнено </option>
                    <option value="Отложено">Отложено</option>
                    <option value="Отменено">Отменено</option>
                    <option value="ДПП актив">ДПП актив</option>
                    <option value="ДПП пассив">ДПП пассив</option>


                </select>

            </div>
        </div>


   

        <div class="column is-3 center  p-1 ">
            <div class="  ">Флаги</div>
            <select placeholder="Флаги" v-model="project.flags" id="zakazchik" type="text"
                class="validate"
                multiple>
               
            <option disabled value="">Выбор</option>
            <option value="Влияние">Влияние</option>
            <option value="Экстренный запуск">Экстренный запуск</option>
   
            <option value="Конфиденциальность">Конфиденциальность</option>
            
            
            </select>

        </div>

    </div>
    <div class="columns">

        <div class="column is-12">

            <div class="froala">
                <label for="pbody">Описание</label>
                <textarea class="form-control" columnss="7" wrap="hard" id="pbody" name="pbody"></textarea>
            </div>
        </div>
    </div>
    <div class="columns">
        <div @click="addProj" class="button has-text-white is-large is-primary column is-12 black-text title is-3">
Добавить активность
        </div>
    </div>





</div>
    
    `
})












//КАЛЕНДАРИ