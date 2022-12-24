import JSON_METHODS from '../utils/json-methods.js'

function jsonRes(data) {
  this.end(JSON_METHODS.stringify(data))
}

export default jsonRes
