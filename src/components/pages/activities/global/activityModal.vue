<template>
  <vs-popup :active.sync="active" class="holamundo" :title="activity.nazvanie">
    <div class="">
      <div class="right" v-if="activity.ocenka">
        <vs-select v-if="admin"  label="Оценка" v-model="currentOcenkaType">
          <vs-select-item @click="console.log('sik')" value="" text="Без оценки" />
          <vs-select-item value="Успешно" text="Успешно" />
          <vs-select-item value="С ошибкой" text="С ошибкой" />
        </vs-select>

<div v-else>
  <h4 class="title is-4 m-0">
    Оценка :
  </h4>
   <p class="mx-2">{{currentOcenkaType || "Не оценена"}}</p>
</div>
        <div
          v-if="
            currentOcenkaType == 'С ошибкой' && currentOcenkaReason != ''
          "
          class="ocenkaReason  has-text-centered"
        >
          <vs-tooltip position="bottom" :text="currentOcenkaReason"
            >Причина<span>
              <vs-icon icon="touch_app" size="small" round></vs-icon>
            </span>
          </vs-tooltip>
        </div>
      </div>
      <h1 class="title is-2">{{ activity.nazvanie }}</h1>
      <p>{{ activity.opisanie }}</p>
      <div v-html="activity.opisanieBody"></div>

      <div class="audits " v-show="activity.audits && activity.audits.length">
        <h3 class="center fluid-text title is-2">
          Доп.информация (Аудит)
        </h3>

        <div class="box" v-for="(audit, idx) in activity.audits" :key="idx">
          <h4 class="center fluid-text title is-4">{{ audit.name }}</h4>
          <div class="columns">
            <div class="column is-6 is-offset-3 title-is-5 has-text-centered">
              Тип: {{ activityTypes[audit.type] }}
            </div>
          </div>

          <div class="columns">
            <div class="column is-6">
              <table class="table  centered is-hoverable is-fullwidth">
                <thead>
                  <tr>
                    <th class="cut-to-20-ch">{{ audit.subname }}</th>
                    <th>Кол-во</th>
                  </tr>
                </thead>

                <tbody>
                  <tr v-for="(row, rowIdx) in audit.rows" :key="rowIdx">
                    <td class="truncate cut-to-20-ch" :id="idx + rowIdx">
                      {{ row.propName }}
                    </td>
                    <td>{{ row.propInt }}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div class="column is-6">
              <canvas class="" :id="'modalDONUT' + idx" width="400" height="400">
              </canvas>
            </div>
          </div>
        </div>
      </div>

      <div class="AB" v-show="activity.AB && activity.AB.length">
        <h3 class="center fluid-text title is-2">
          Абонентская База
        </h3>

        <div class="box" v-for="(table, idx) in activity.AB" :key="idx">
          <div v-if='table.type == "big"' class="columns">
            <canvas :id="'modalLine' + idx"> </canvas>
          </div>
  <div v-else>
<ul class="has-text-centered">
  <li class="is-size-4" v-if="table.B2B">B2B: {{table.B2B}}</li>
  <li class="is-size-4" v-if="table.B2C">B2C: {{table.B2C}}</li>
  <li class="is-size-4" v-if="table.FIX">FIX: {{table.FIX}}</li>
  <li class="is-size-4" v-if="table.FMC">FMC: {{table.FMC}}</li>
  <li class="is-size-4" v-if="table.FTTB">FTTB: {{table.FTTB}}</li>
  <li class="is-size-4" v-if="table.PC">PC: {{table.PC}}</li>
</ul>


  </div>
          
        </div>
      </div>

      <div class="modal-footer">
    
    
       
        <vs-button v-if='admin' class="mx-3" @click="editActivity()" size="large">Изменить</vs-button>
    <vs-button class="mx-3" @click='hideMe' size="large">Закрыть</vs-button>
      </div>
    </div>

    <vs-popup title="Выберите причину:"  :active.sync="needReasonModal">
      <vs-select      width="100%" v-model='currentOcenkaReason'>
        <vs-select-item
     
          v-for="(item, idx) in ocenkaReasons"
          :key="idx"
         :text="item"
         :value="item"
          @click="$vs.notify({title:'sik'})"
        />
      </vs-select>
    </vs-popup>
  </vs-popup>
</template>

<script>
export default {
  props: ["show",'admin'],

  data() {
    return {
currentOcenka : null,
      activityTypes: {
        public: "Публичный",
        private: "Приватный",
        secret: "Секретный",
      },
      ocenkaReasons: [
        "Нарушение регламента МИ, есть влияние на клиента/сотрудника",
        "Наличие багов (не технических), влияющих на клиента, процессы компании/департамента. Сопровождающий мог проработать самостоятельно",
        "Не инициировано изменение процедуры/продукта для улучшения сервиса для клиента",
        "Не инициирована подготовка инструментов/схем и процедур обслуживания клиента для сотрудников",
      ],
      needReasonModal: false,
    };
  },
  watch: {
    activity: function(n, o) {
      this.destroyDonuts(o);
      this.destroyGrafiks(o);
      this.initActivity();
  }
    

  },
  computed: {
      currentOcenkaType: {
          get() {return (this.activity.ocenka &&  this.activity.ocenka.type) || ""},
          set(n){
this.changeOcenka({
    type : n,
    reason: ''
})

          }
      },
         currentOcenkaReason() {
         
      },
   currentOcenkaReason: {
          get() { return (this.activity.ocenka &&  this.activity.ocenka.reason) || ""},
          set(n){
this.changeOcenka({
    type : 'С ошибкой',
    reason: n
})

          }
      },


    active: {
      get() {
        return this.show;
      },
      set(n) {
        this.$emit("update:show", n);
      },
    },
    activity() {
      return this.$store.state.currentDisplayingActivity;
    }
  },
  mounted() {

  },
  methods: {
    createDonuts(audits) {
      if (!audits) return;
      audits.forEach((audit) => {
        if (!audit || audit.donutactivityModal) {
          return;
        }
        let ctx = document
          .getElementById("modalDONUT" + this.activity.audits.indexOf(audit))
          .getContext("2d");
        let data = [];
        let labels = [];
        let colors = [];
        audit.rows.forEach((row) => {
          data.push(row.propInt);
          labels.push(
            row.propName.length > 20
              ? row.propName.slice(0, 20) + "..."
              : row.propName
          );
        });
        audit.donutactivityModal = new Chart(ctx, {
          type: "doughnut",
          data: {
            datasets: [
              {
                data: data,
                backgroundColor: [
                  "#c2185b",
                  "#3949ab",
                  "#2196f3",
                  "#00bcd",
                  "#009688",
                  "#66bb6a",
                  "#f4ff81",
                  "#f4511e",
                  "#00e676",
                  "#cddc39",
                ].sort((v) => {
                  return Math.floor(Math.random() * 10) > 5 ? 1 : -1;
                }),
              },
            ],
            labels: labels,
          },

          // These labels appear in the legend and in the tooltips when hovering different arcs
        });
      });
    },
    createGrafiks(AB) {
      if (!AB) return;
      AB.forEach((table) => {
        if (!table || table.type == "small") {
          return;
        }
        let ctx = document.getElementById(
          "modalLine" + this.activity.AB.indexOf(table)
        );

        table.lineactivityModal = new Chart(ctx, {
          type: "line",
          data: {
            labels: table.range,
            datasets: table.TRs.map((TR, idxOfTR) => {
              return {
                data: TR.inputs.map((input) => input.value),
                label: TR.type,
                fill: false,
                borderColor: table.colors[idxOfTR],
                backgroundColor: table.colors[idxOfTR],
              };
            }),
          },
        });
      });
    },
    destroyDonuts(activity) {
      if (!activity) activity = this.activity;
      if (!activity.audits) return;
      activity.audits.forEach((audit) => {
        if (audit.donutactivityModal) audit.donutactivityModal.destroy();
        audit.donutactivityModal = null;
      });
    },
    destroyGrafiks(activity) {
      if (!activity) activity = this.activity;
      if (!activity.AB) return;
      activity.AB.forEach((table) => {
        if (table.type == "big" && table.lineactivityModal) {
          table.lineactivityModal.destroy();
          table.lineactivityModal = null;
        }
      });
    },
    editActivity() {
   
    this.$store.commit('setEditingActivity',this.activity)
    this.hideMe();
     this.$router.push({path:'/edit-activity'})
    },
    initActivity() {
      this.$nextTick(() => {
        this.createDonuts(this.activity.audits);
        this.createGrafiks(this.activity.AB);

      });
    },
    changeOcenka({
        type,
        reason
    }) {

    
      if (
      type == "Успешно" ||
      type == "" ||
      reason != ""
      ) {
          if(type == this.activity.ocenka.type) return;
     (this.needReasonModal && (this.needReasonModal = false))
   this.changeOcenkaOnServ({
       type,reason
   });
      } else {
    
  this.openReasonModal();
      }
    },
    openReasonModal() {
this.needReasonModal = true

    },
 
    changeOcenkaOnServ({
        type,
        reason
    }) {
      
      this.$store.dispatch('changeActivityOcenka', {
           id: this.activity.id,
         ocenka :{ type:type,
           reason:reason } 
       }).then(()=>{
           this.$vs.notify({title:"Оценка изменена"})
       }).catch(err=>{
             this.$vs.notify({title:`Оценкане НЕ изменена ${err}`, color : 'red', })  
       })
    },
    hideMe(){
      this.$emit('update:show',false)
    }
  },
};
</script>

