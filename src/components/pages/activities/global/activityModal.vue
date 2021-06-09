<template>
  <vs-popup
    class="date-show-popup holamundo"
    :active.sync="active"
    :title="activity.nazvanie"
  >
    <div class="p-4">
      <div>
        <h1 class="title is-1">{{ activity.nazvanie }}</h1>

        <div class="dates is-flex box is-justify-content-space-around">
          <div class="" v-if="activity.fdate">
            <div class="is-size-4">Дата спуска</div>
            <div class="is-size-4">{{ activity.fdate }}</div>
          </div>
          <div class="" v-if="activity.sdate && !isGuest">
            <div class="is-size-4">Дата запуска</div>
            <div class="is-size-4">{{ activity.sdate }}</div>
          </div>
        </div>

        <div class="other-rows">
          <ul>
            <li class="is-size-4">Вид бизнеса : {{ activity.bizness }}</li>
            <li class="is-size-4" v-if="!isGuest">
              Тип запуска : {{ activity.zapusk }}
            </li>
            <li class="is-size-4">Сопровождающий : {{ activity.soprovod }}</li>
            <li class="is-size-4" v-if="!isGuest">
              Статус : {{ activity.status }}
            </li>
            <li class="is-size-4" v-if="!isGuest">
              Заказчик : {{ activity.zakazchik }}
            </li>
            <li class="is-size-4" v-if="!isGuest">
              Сложность : {{ activity.difficulty }}
            </li>
            <template
              v-if="!isGuest && activity.flags && activity.flags.length"
            >
              <li>
                <span class="is-size-4">Флаги:</span>
                <span class="is-size-5"> {{ activity.flags.join(",") }} </span>
              </li>
            </template>
          </ul>
        </div>

        <div class="box description">
          <p class="is-size-4">Описание:</p>
          <div
            class="is-size-5"
            style="word-break: break-all"
            v-html="activity.opisanieBody"
          ></div>
        </div>

        <ul class="collapsible p-0 popout" :id="collapsibleRandomId">
          <li v-show="activity.zamenas && activity.zamenas.length">
            <div class="collapsible-header is-size-4">
              {{ role != "guest" ? "Замещающие" : "Замещающий" }}
            </div>
            <div class="collapsible-body">
              <template v-if="activity.zamenas && activity.zamenas.length">
                <template v-if="isGuest">
                  <div
                    :key="idx"
                    v-for="(zamena, idx) in activity.zamenas"
                    class="columns is-size-4"
                  >
                    <div class="column is-8">{{ zamena.employee }}</div>
                    <div class="column is-2">{{ zamena.fdate }}</div>
                    <div class="column is-2">{{ zamena.sdate }}</div>
                  </div>
                </template>
                <template>
                  <div class="columns is-size-4">
                    <div class="column is-8">
                      {{
                        activity.zamenas[activity.zamenas.length - 1].employee
                      }}
                    </div>
                    <div class="column is-2">
                      {{ activity.zamenas[activity.zamenas.length - 1].fdate }}
                    </div>
                    <div class="column is-2">
                      {{ activity.zamenas[activity.zamenas.length - 1].sdate }}
                    </div>
                  </div>
                </template>
              </template>
            </div>
          </li>

          <li v-show="activity.AB && activity.AB.length">
            <div class="collapsible-header is-size-4">Абоненская база</div>
            <div class="collapsible-body">
              <div class="AB">
                <div class="box" v-for="(table, idx) in activity.AB" :key="idx">
                  <div v-if="table.type == 'big'" class="columns">
                    <lineGrafik :table="table" />
                  </div>
                  <div v-else>
                    <ul class="has-text-centered">
                      <li class="is-size-4" v-if="table.B2B">
                        B2B: {{ table.B2B }}
                      </li>
                      <li class="is-size-4" v-if="table.B2C">
                        B2C: {{ table.B2C }}
                      </li>
                      <li class="is-size-4" v-if="table.FIX">
                        FIX: {{ table.FIX }}
                      </li>
                      <li class="is-size-4" v-if="table.FMC">
                        FMC: {{ table.FMC }}
                      </li>
                      <li class="is-size-4" v-if="table.FTTB">
                        FTTB: {{ table.FTTB }}
                      </li>
                      <li class="is-size-4" v-if="table.PC">
                        PC: {{ table.PC }}
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </li>
          <li v-show="activity.statusZapusk && activity.statusZapusk.length">
            <div class="collapsible-header is-size-4">Статус по запуску</div>
            <div class="collapsible-body">
              <div class="columns">
                <div class="column is-8 is-size-4">
                  <div>Описание</div>
                </div>
                <div class="column is-4 is-size-4">
                  <div>Срок</div>
                </div>
              </div>

              <div
                class="columns"
                v-for="(statusZapusk, idx) in activity.statusZapusk"
                :key="idx"
              >
                <div class="column is-8 is-size-4">
                  <div>
                    {{ statusZapusk.opisanie }}
                  </div>
                </div>
                <div class="column is-4 is-size-4">
                  <div>
                    {{ statusZapusk.srok }}
                  </div>
                </div>
              </div>
            </div>
          </li>
          <li v-show="activity.risks && activity.risks.length">
            <div class="collapsible-header is-size-4">Риски по запуску</div>

            <div class="collapsible-body">
              <div class="columns">
                <div class="column is-4 is-size-4">
                  <div>Описание</div>
                </div>
                <div class="column is-4 is-size-4">
                  <div>Прогноз</div>
                </div>
                <div class="column is-4 is-size-4">
                  <div>Вероятность реализации риска</div>
                </div>
              </div>

              <div
                class="columns"
                v-for="(risk, idx) in activity.risks"
                :key="idx"
              >
                <div class="column is-4 is-size-4">
                  <div>
                    {{ risk.opisanie }}
                  </div>
                </div>
                <div class="column is-4 is-size-4">
                  <div>
                    {{ risk.prognoz }}
                  </div>
                </div>
                <div class="column is-4 is-size-4">
                  <div>
                    {{ risk.status }}
                  </div>
                </div>
              </div>
            </div>
          </li>

          <li v-show="activity.audits && activity.audits.length">
            <div class="collapsible-header is-size-4">
              Доп.информация (Аудит)
            </div>
            <div class="collapsible-body">
              <div class="audits">
                <div
                  :class="{ box: !isGuest }"
                  v-for="(audit, idx) in activity.audits"
                  :key="idx"
                >
                  <template v-if="!isGuest || audit.type == 'public'">
                    <h4 class="center fluid-text title is-4">
                      {{ audit.name }}
                    </h4>
                    <div class="columns">
                      <div
                        v-if="!isGuest"
                        class="
                          column
                          is-6 is-offset-3
                          title-is-5
                          has-text-centered
                        "
                      >
                        Тип: {{ activityTypes[audit.type] }}
                      </div>
                    </div>

                    <div class="columns">
                      <div class="column is-6">
                        <table class="table centered is-hoverable is-fullwidth">
                          <thead>
                            <tr>
                              <th class="cut-to-20-ch">{{ audit.subname }}</th>
                              <th>Кол-во</th>
                            </tr>
                          </thead>

                          <tbody>
                            <tr
                              v-for="(row, rowIdx) in audit.rows"
                              :key="rowIdx"
                            >
                              <td
                                class="truncate cut-to-20-ch"
                                :id="idx + rowIdx"
                              >
                                {{ row.propName }}
                              </td>
                              <td>{{ row.propInt }}</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>

                      <div class="column is-6">
                        <audit :audit="audit" />
                      </div>
                    </div>
                  </template>
                </div>
              </div>
            </div>
          </li>
          <li v-show="activity.bugs && activity.bugs.length">
            <div class="collapsible-header is-size-4">Баги</div>
            <div class="collapsible-body">
              <div class="columns is-size-5">
                <div class="column is-2">
                  <div>Описание</div>
                </div>
                <div class="column is-4">
                  <div>Ответственный за исполнение</div>
                </div>
                <div class="column is-2">
                  <div>Срок решения</div>
                </div>

                <div class="column is-2">
                  <div>Комментарий</div>
                </div>

                <div class="column is-2">
                  <div>Статус</div>
                </div>
              </div>
              <div
                class="columns is-size-5"
                v-for="(bug, idx) in activity.bugs"
                :key="idx"
              >
                <div class="column is-2">
                  <div>
                    {{ bug.opisanie }}
                  </div>
                </div>
                <div class="column is-4">
                  <div>
                    {{ bug.soprovod }}
                  </div>
                </div>
                <div class="column is-2">
                  <div>
                    {{ bug.srok }}
                  </div>
                </div>

                <div class="column is-2">
                  <div>
                    {{ bug.comment }}
                  </div>
                </div>

                <div class="column is-2">
                  <div>
                    {{ bug.status }}
                  </div>
                </div>
              </div>
            </div>
          </li>
          <li v-show="activity.dopinfo">
            <div class="collapsible-header is-size-4">Доп. информация</div>
            <div
              class="collapsible-body is-size-4"
              v-html="activity.dopinfo"
            ></div>
          </li>
          <li v-show="activity.eGrafiks && activity.eGrafiks.length">
            <div class="collapsible-header is-size-4">
              Прогноз по запускам/План Факт
            </div>
            <div class="collapsible-body p-0">
              <div class="p-0 m-0 has-text-centered">
                <eGrafiks
                  class="p-0 m-0"
                  :showOnly="true"
                  :eGrafiks="activity.eGrafiks"
                ></eGrafiks>
              </div>
            </div>
          </li>

          <li v-show="!isGuest && activity.tags && activity.tags.length">
            <div class="collapsible-header is-size-4">Теги</div>
            <div class="collapsible-body">
              <tags-for-activity-modal :tags="activity.tags" />
            </div>
          </li>
        </ul>

        <div
          class="rating is-flex is-justify-content-flex-end"
          v-if="activity.ocenka && !isGuest"
        >
          <div>
            <vs-select
              v-if="role == 'admin'"
              label="Оценка"
              v-model="currentOcenkaType"
            >
              <vs-select-item value="" text="Без оценки" />
              <vs-select-item value="Успешно" text="Успешно" />
              <vs-select-item value="С ошибкой" text="С ошибкой" />
            </vs-select>

            <div v-else>
              <h4 class="title is-4 m-0">Оценка :</h4>
              <p class="mx-2">{{ currentOcenkaType || "Не оценена" }}</p>
            </div>
            <div
              v-if="
                currentOcenkaType == 'С ошибкой' && currentOcenkaReason != ''
              "
              class="ocenkaReason has-text-centered"
            >
              <vs-tooltip position="bottom" :text="currentOcenkaReason"
                >Причина<span>
                  <vs-icon icon="touch_app" size="small" round></vs-icon>
                </span>
              </vs-tooltip>
            </div>
          </div>
        </div>
      </div>

      <div class="modal-footer">
        <vs-button
          v-if="['moderator', 'admin'].includes(role)"
          class="m-3"
          @click="editActivity()"
          size="large"
          >Изменить</vs-button
        >
        <vs-button class="m-3" @click="hideMe" size="large">Закрыть</vs-button>
      </div>
    </div>

    <vs-popup title="Выберите причину:" :active.sync="needReasonModal">
      <vs-select width="100%" v-model="currentOcenkaReason">
        <vs-select-item
          v-for="(item, idx) in ocenkaReasons"
          :key="idx"
          :text="item"
          :value="item"
          @click="$vs.notify({ title: 'sik' })"
        />
      </vs-select>
    </vs-popup>
  </vs-popup>
</template>

<script>
import eGrafiks from "./eGrafiks";
import { nanoid } from "nanoid";
import audit from "./audit.vue";
import lineGrafik from "./lineGrafik.vue";
import TagsForActivityModal from "./tagsForActivityModal.vue";

export default {
  props: ["show", "role"],

  data() {
    return {
      collapsibleRandomId: nanoid(),
      lineRadnomId: nanoid(),
      currentOcenka: null,
      collapsible: null,
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
    show() {
      this.closeCollapsible();
    },
  },
  computed: {
    isGuest() {
      return this.role == "guest";
    },
    currentOcenkaType: {
      get() {
        return (this.activity.ocenka && this.activity.ocenka.type) || "";
      },
      set(n) {
        this.changeOcenka({
          type: n,
          reason: "",
        });
      },
    },
    currentOcenkaReason: {
      get() {
        return (this.activity.ocenka && this.activity.ocenka.reason) || "";
      },
      set(n) {
        this.changeOcenka({
          type: "С ошибкой",
          reason: n,
        });
      },
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
    },
  },
  methods: {
    initCollapsible() {
      this.collapsible = M.Collapsible.init(
        document.getElementById(this.collapsibleRandomId)
      );
    },
    closeCollapsible() {
      this.collapsible &&
        new Array(15).fill(0).forEach((el, idx) => {
          this.collapsible.close(idx + 1);
        });
    },
    editActivity() {
      this.$store.commit("setEditingActivity", this.activity);
      this.hideMe();
      this.$router.push({ path: "/edit-activity" });
    },
    changeOcenka({ type, reason }) {
      if (type == "Успешно" || type == "" || reason != "") {
        if (type == this.activity.ocenka.type) return;
        this.needReasonModal && (this.needReasonModal = false);
        this.changeOcenkaOnServ({
          type,
          reason,
        });
      } else {
        this.openReasonModal();
      }
    },
    openReasonModal() {
      this.needReasonModal = true;
    },

    changeOcenkaOnServ({ type, reason }) {
      this.$store
        .dispatch("changeActivityOcenka", {
          id: this.activity.id,
          ocenka: { type: type, reason: reason },
        })
        .then(() => {
          this.$vs.notify({ title: "Оценка изменена" });
        })
        .catch((err) => {
          this.$vs.notify({
            title: `Оценкане НЕ изменена ${err}`,
            color: "red",
          });
        });
    },
    hideMe() {
      this.$emit("update:show", false);
    },
  },
  mounted() {
    this.initCollapsible();
  },
  components: {
    eGrafiks,
    audit,
    lineGrafik,
    TagsForActivityModal,
  },
};
</script>
<style>
.date-show-popup .vs-popup {
  width: 60%;
}
</style>
