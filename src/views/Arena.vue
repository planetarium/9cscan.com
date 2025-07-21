<!-- <template>
  <v-container fluid class="px-0 py-0">
    <div class="page-wide-wrap detail-page px-md-12">
      <h1 class="page-title px-4 px-md-0">Arenas</h1>
      <v-row>
        <v-col class="px-0">
          <page-list-wrapper title=""
                             :acceptFilter="['arena']"
                             :items="participants"
                             @loadItems="loadParticipants"
                             :before="before"
                             :loading="loading"
          >
            <template v-slot:title-after>
              <arena-select ref="arenaSelectRef" @change="changeArenaFilter" />
            </template>
            <template v-slot:default="{items, loading}">
              <arena-participants-table :participants="items" detail :loading="loading" />
            </template>
          </page-list-wrapper>
        </v-col>
      </v-row>
    </div>
  </v-container>
</template>

<script>
import {mapGetters} from "vuex"
import PageListWrapper from "@/components/PageListWrapper";
import ArenaParticipantsTable from "@/components/ArenaParticipantsTable";
import ArenaSelect from "@/components/form/ArenaSelect";
import api from "@/api";

export default {
  name: 'ArenaList',
  components: {PageListWrapper, ArenaParticipantsTable, ArenaSelect},
  data() {
    return {
      participants: [],
      loading: false,
      before: null,
    };
  },
  computed: {
    ...mapGetters('Block', ['size']),
  },
  methods: {
    async loadParticipants(payload) {
      this.loading = true;

      const params = payload ?? this.$route.query;
      const [championshipId, round] = params.arena.split('-');
      const { page } = params;

      const query = [
        page ? `page=${page}` : null,
        this.size ? `limit=${this.size}` : null,
      ]
        .filter((item) => item)
        .join('&');

      const result = await api.getArena(championshipId, round, query);

      this.participants = result;
      this.before = result[result.length - 1].avatarAddress;

      this.loading = false;
    },
    changeArenaFilter(arena) {
      if (this.$route.query.arena !== arena.id) {
        this.$router.push({query: {arena: arena.id}});
      }

      this.loadParticipants();
    }
  },
}
</script>

<style scoped lang="scss">
</style> -->