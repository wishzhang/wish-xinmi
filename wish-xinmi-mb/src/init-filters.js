import {dateFromNow, datePastLong} from "./util/datetime";
import moment from 'moment';

export function initFilters(Vue) {
    Vue.filter('dateFromNow', function (value) {
        if (!value) return ''
        return dateFromNow(value);
    })

    Vue.filter('dateYear', function (value) {
        if (!value) return ''
        return moment(value).year();
    })

    Vue.filter('dateMonth', function (value) {
        if (!value) return ''
        return moment(value).format('MM');
    })

    Vue.filter('dateDay', function (value) {
        if (!value) return ''
        return moment(value).format('DD');
    })

    Vue.filter('datePastLong', function (value) {
        if (!value) return ''
        return datePastLong(value);
    })

    // 默认头像
    Vue.filter('imageAvatar', function (value) {
        return value || '/img/default-avatar.png'
    })
}
