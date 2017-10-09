const dateformat = require('dateformat')

export default function dateFormat(date, format) {
  if (!date) {
    return 'N/A'
  }
  return dateformat(date, format || 'yyyy-mm-dd HH:MM:ss')
}
