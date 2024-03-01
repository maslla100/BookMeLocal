

const moment = require('moment');

const handlebarsHelpers = {
    formatDate: function (date, format) {
        return moment(date).format(format);
    },
    eq: function (v1, v2) {
        return v1 === v2;
    }
    // Other helpers can also be added here
};

module.exports = handlebarsHelpers;
