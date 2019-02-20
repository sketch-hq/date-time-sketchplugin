const sketch = require('sketch')
const { DataSupplier } = sketch

const locale = currentLocale()

const dateFormats = {
  dayMonthYear: {day: 'numeric', month: 'numeric', year: 'numeric'},
  dayMonthYearPadded: {day: '2-digit', month: '2-digit', year: 'numeric'},
  dayShortMonthYear: {day: 'numeric', month: 'short', year: 'numeric'},
  dayMonth: {day: 'numeric', month: 'numeric'},
  dayMonthPadded: {day: '2-digit', month: '2-digit'},
  dayShortMonth: {day: 'numeric', month: 'short'},
  dayLongMonth: {day: 'numeric', month: 'long'},
  dayLongMonthYear: {day: 'numeric', month: 'long', year: 'numeric'}
}

const timeFormats = {
  hour12: {hour12: true, hour: 'numeric', minute: '2-digit'},
  hour24: {hour12: false, hour: '2-digit', minute: '2-digit'},
  hour24Seconds: {hour12: false, hour: '2-digit', minute:'2-digit', second:'2-digit'}
}

export function onStartup () {
  const names = new Set()
  registerDataSupplier(true, dateFormats.dayMonthYear, 'SupplyDateDayMonthYear', names)
  registerDataSupplier(true, dateFormats.dayMonthYearPadded, 'SupplyDateDayMonthYearPadded', names)
  registerDataSupplier(true, dateFormats.dayShortMonthYear, 'SupplyDateDayShortMonthYear', names)
  registerDataSupplier(true, dateFormats.dayMonth, 'SupplyDateDayMonth', names)
  registerDataSupplier(true, dateFormats.dayMonthPadded, 'SupplyDateDayMonthPadded', names)
  registerDataSupplier(true, dateFormats.dayShortMonth, 'SupplyDateDayShortMonth', names)
  registerDataSupplier(true, dateFormats.dayLongMonth, 'SupplyDateDayLongMonth', names)
  registerDataSupplier(true, dateFormats.dayLongMonthYear, 'SupplyDateDayLongMonthYear', names)
  registerDataSupplier(false, timeFormats.hour12, 'SupplyTime12Hour', names)
  registerDataSupplier(false, timeFormats.hour24, 'SupplyTime24Hour', names)
  registerDataSupplier(false, timeFormats.hour24Seconds, 'SupplyTime24HourSeconds', names)
}

function registerDataSupplier(isDate, format, action, names) {
  const date = new Date(currentYear(), 1, 5, 15, 30, 5)
  const dateTimeString = isDate ? date.toLocaleDateString(locale, format) : date.toLocaleTimeString(locale, format)
  const prefix = isDate ? 'Date' : 'Time'
  const name = `${prefix}: ${dateTimeString}`
  // In some locales numbers will always be padded so we want to avoid duplicates
  if (!names.has(name)) {
    DataSupplier.registerDataSupplier('public.text', name, action)
    names.add(name)
  }
}

export function onShutdown () {
  DataSupplier.deregisterDataSuppliers()
}

export function onSupplyDateDayMonthYear(context) {
  supplyDate(dateFormats.dayMonthYear, context)
}

export function onSupplyDateDayMonthYearPadded(context) {
  supplyDate(dateFormats.dayMonthYearPadded, context)
}

export function onSupplyDateDayShortMonthYear(context) {
  supplyDate(dateFormats.dayShortMonthYear, context)
}

export function onSupplyDateDayMonth(context) {
  supplyDate(dateFormats.dayMonth, context)
}

export function onSupplyDateDayMonthPadded(context) {
  supplyDate(dateFormats.dayMonthPadded, context)
}

export function onSupplyDateDayShortMonth(context) {
  supplyDate(dateFormats.dayShortMonth, context)
}

export function onSupplyDateDayLongMonth(context) {
  supplyDate(dateFormats.dayLongMonth, context)
}

export function onSupplyDateDayLongMonthYear(context) {
  supplyDate(dateFormats.dayLongMonthYear, context)
}

export function onSupplyTime12Hour(context) {
  supplyTime(timeFormats.hour12, context)
}

export function onSupplyTime24Hour(context) {
  supplyTime(timeFormats.hour24, context)
}

export function onSupplyTime24HourSeconds(context) {
  supplyTime(timeFormats.hour24Seconds, context)
}

function supplyDate(format, context) {
  const dataKey = context.data.key
  const dataCount = context.data.requestedCount
  for (let i = 0; i < dataCount; i++) {
    const dateString = randomDate().toLocaleDateString(locale, format)
    DataSupplier.supplyDataAtIndex(dataKey, dateString, i)
  }
}

function supplyTime(format, context) {
  const dataKey = context.data.key
  const dataCount = context.data.requestedCount
  for (let i = 0; i < dataCount; i++) {
    const timeString = randomTime().toLocaleTimeString(locale, format)
    DataSupplier.supplyDataAtIndex(dataKey, timeString, i)
  }
}

function randomDate() {
  const monthIndex = randomInteger(0, 11);
  const year = currentYear()
  const day = randomInteger(1, daysInMonth(monthIndex, year))
  return new Date(year, monthIndex, day)
}

function randomTime() {
  const hours = randomInteger(0, 23)
  const minutes = randomInteger(0, 59)
  const seconds = randomInteger(0, 59)
  const today = new Date()
  return new Date(today.getFullYear(), today.getMonth(), today.getDate(), hours, minutes, seconds)
}

function randomInteger(min, max) {
  min = Math.ceil(min)
  max = Math.floor(max)
  return Math.floor(Math.random() * (max - min + 1)) + min
}

function daysInMonth (monthIndex, year) {
  return new Date(year, monthIndex + 1, 0).getDate();
}

function currentYear() {
  return new Date().getFullYear()
}

function currentLocale() {
  // NSLocale.currentLocale() only returns the language that is supported by the host application
  const countryCode = NSLocale.currentLocale().localeIdentifier().split('_')[1]
  const languageCode = NSLocale.preferredLanguages()[0].split('-')[0]
  return `${languageCode}-${countryCode}`
}