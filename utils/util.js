const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return `${[year, month, day].map(formatNumber).join('/')} ${[hour, minute, second].map(formatNumber).join(':')}`
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : `0${n}`
}

function unique (fn) {
  let p = null
  return async function () {
    try {
      if (p) {
        return await p
      }
      p = fn.apply(this, arguments)
      return await p
    } finally {
      p = null
    }
  }
}

module.exports = {
  formatTime,
  unique
}