<template>
  <div class="table-wrap">
    <v-progress-linear indeterminate height="2" color="pointblue" v-if="loading"></v-progress-linear>
    <v-simple-table>
      <template v-slot:default>
        <thead>
          <tr>
            <th>Rank</th>
            <th>ID</th>
            <th>CP</th>
            <th>Score</th>
            <th>Win / Lose</th>
            <th>Daily Tickets Used</th>
            <th>Seasonal Ticket Purchases</th>
          </tr>
        </thead>
        <tbody v-if="loading">
          <tr>
            <td colspan="100" style="height: 400px;background-color: white">
              <v-progress-circular color="pointblue" width="2" indeterminate></v-progress-circular>
            </td>
          </tr>
        </tbody>
        <tbody v-else>
        <!-- <transition-group name="list-complete" tag="tbody" v-if="participants"> -->
          <tr v-for="participant in participants" class="row-item">
            <td>{{ participant.ranking }}</td>
            <td class="profile">
              <img :src="participant.imageUrl">
              <div class="profile-info">
                <p class="name">{{ participant.name }}#{{ formatAddress(participant.avatarAddress).slice(2, 6).toUpperCase() }}</p>
                <p class="level">Lv. {{ participant.avatarLevel }}</p>
              </div>
            </td>
            <td>{{ participant.cp }}</td>
            <td>{{ participant.score }}</td>
            <td>{{ participant.winCount }} / {{ participant.lossCount }}</td>
            <td>-</td>
            <td>{{ participant.purchasedTicketCount }} / 40</td>
          </tr>
        <!-- </transition-group> -->
        </tbody>
      </template>
    </v-simple-table>
  </div>
</template>

<script>
export default {
  name: 'ArenaParticipantsTable',
  components: {},
  props: {
    loading: {
      type: Boolean,
      default: false
    },
    participants: {
      type: Array,
      default: []
    },
    detail: {
      type: Boolean,
      default: false
    }
  },
  async created() {
  }
}
</script>

<style scoped lang="scss">
.table-wrap {
  padding-bottom: 1rem;
  background-color: white;
}
.row-item {
  transition: all 0.5s;
}
.list-complete-enter, .list-complete-leave-to {
  transform: translateY(-40px);
  opacity: 0.6;
  background-color: #f5f5fa;
}
.list-complete-leave-active {
  transition: none;
  position: absolute;
  opacity: 0;
}
.profile {
  display: flex;
  gap: 0.75rem;
  align-items: center;
  height: 4rem !important;

  img {
    border: 1px solid #e0e0e0;
    border-radius: 0.5rem;
    height: 3rem;
  }

  &-info {
    display: flex;
    flex-direction: column;
    
    p {
      text-align: left;
      margin: 0;
      padding: 0;
      &.name {
        font-weight: bold;
      }
    }
  }
}
</style>
