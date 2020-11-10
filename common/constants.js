const optionsSocket = {
  /* socket.io options */
  reconnection: true,
  reconnectionDelay: 1000,
  reconnectionDelayMax: 5000,
  reconnectionAttempts: Infinity
}

const sendGridId = {
  resetPassword: 'd-6600ae71c5324523b12ade29e081c815',
  signUp: 'd-6bbac4cb42d14c338c3504599ebb8bf0',
  contactUs: 'd-61a468ea9e5d41d88827f49f02699584'

}

const reactionType = {
  follow: 'follow',
  like: 'like',
  bad: 'bad',
  good: 'good'
}

const typeDevice = {
  LIGHT: 'LIGHT',
  FAN: 'FAN'
}

const timeType = {
  oneTime: 'oneTime',
  loop: 'loop'
}

const providerType = {
  facebook: 'facebook',
  google: 'google',
  null: null
}

const categoryType = {
  normal: 'normal'
}

const userRole = {
  admin: 'admin',
  member: 'member',
}

const gender = {
  male: 'MALE',
  female: 'FEMALE',
  other: 'OTHER'
}

const statusActive = {
  inactive: 'INACTIVE',
  active: 'ACTIVE',
  deleted: 'DELETED'
}

const defaultModel = {
  date: { type: Date },
  string: { type: String, default: '' },
  stringUnique: { type: String, required: true, unique: true },
  array: { type: Array, default: [] },
  number: { type: Number, default: 0 },
  boolean: { type: Boolean, default: true },
  booleanFalse: { type: Boolean, default: false },
  object: { type: Object, default: {} }
}

const optionsCcxt = {
  apiKey: process.env.FMX_API_KEY,
  secret: process.env.FMX_SECRET_KEY
}


module.exports = { 
  sendGridId,
  reactionType,
  typeDevice,
  timeType,
  providerType,
  categoryType,
  userRole,
  gender,
  statusActive,
  defaultModel,
  optionsCcxt,
}