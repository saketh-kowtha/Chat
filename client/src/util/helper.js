const hideData = (text) => text.substring(0,2) + nx('X')(text.length / 2) + text.substring(text.length - 4,text.length)

const nx = (char) => (n) => char.repeat(n)



module.exports = {
      hideData,
      nx
}