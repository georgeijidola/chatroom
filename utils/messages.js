/** @format */

const moment = require('moment')

const formatMessage = ({ username, text }) => {
  return {
    username,
    text,
    time: moment().format('h:m a'),
  }
}

module.exports = formatMessage
