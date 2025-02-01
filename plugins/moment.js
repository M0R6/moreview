import moment from 'moment';
import 'moment-timezone';
import 'moment/locale/id';

export default defineNuxtPlugin((nuxtApp) => {
   moment.locale('id');
   nuxtApp.provide('moment', moment);
});