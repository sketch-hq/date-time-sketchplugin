const sketch = require('sketch')
const { DataSupplier } = sketch
const util = require('util')

const locale = currentLocale()

const dateFormats = {
  dayMonthYear: 'd/M/YYYY',
  dayShortMonth: 'd MMM',
  dayMonth: 'd MMMM'
};

const timeFormats = {
  hour12: 'hh:mm a',
  hour24: 'HH:mm'
}

export function onStartup () {
  DataSupplier.registerDataSupplier('public.text', 'Date: Day Month Year', 'SupplyDateDayMonthYear')
  DataSupplier.registerDataSupplier('public.text', 'Date: Day Month (Short)', 'SupplyDateDayShortMonth')
  DataSupplier.registerDataSupplier('public.text', 'Date: Day Month', 'SupplyDateDayMonth')
  DataSupplier.registerDataSupplier('public.text', 'Time: 12 Hour', 'SupplyTime12Hour')
  DataSupplier.registerDataSupplier('public.text', 'Time: 24 Hour', 'SupplyTime24Hour')
}

export function onShutdown () {
  DataSupplier.deregisterDataSuppliers()
}

export function onSupplyDateDayMonthYear(context) {
  supplyDate(dateFormats.dayMonthYear, context)
}

export function onSupplyDateDayShortMonth(context) {
  supplyDate(dateFormats.dayShortMonth, context)
}

export function onSupplyDateDayMonth(context) {
  supplyDate(dateFormats.dayMonth, context)
}

export function onSupplyTime12Hour(context) {
  supplyTime(timeFormats.hour12, context)
}

export function onSupplyTime24Hour(context) {
  supplyTime(timeFormats.hour24, context)
}

function supplyDate(format, context) {
  const dataKey = context.data.key
  const items = util.toArray(context.data.items).map(sketch.fromNative)
  items.forEach((item, index) => {
    const dateString = localizedDateString(format, randomDate())
    DataSupplier.supplyDataAtIndex(dataKey, dateString, index)
  })
}

function supplyTime(format, context) {
  const dataKey = context.data.key
  const items = util.toArray(context.data.items).map(sketch.fromNative)
  items.forEach((item, index) => {
    const timeString = localizedDateString(format, randomTime())
    DataSupplier.supplyDataAtIndex(dataKey, timeString, index)
  })
}

function localizedDateString(format, date) {
  const dateFormatter = NSDateFormatter.new()
  dateFormatter.locale = locale
  dateFormatter.dateFormat = NSDateFormatter.dateFormatFromTemplate_options_locale(format, 0, locale);
  return dateFormatter.stringFromDate(date)
}

function randomDate() {
  const dateComponents = NSDateComponents.new()
  dateComponents.month = randomInteger(1, 12)
  const range = NSCalendar.currentCalendar().rangeOfUnit_inUnit_forDate(NSDayCalendarUnit, NSMonthCalendarUnit, startOfMonth(dateComponents.month()))
  dateComponents.day = randomInteger(range.location, range.length)
  dateComponents.year = currentYear()
  return NSCalendar.currentCalendar().dateFromComponents(dateComponents)
}

function randomTime() {
  const dateComponents = NSDateComponents.new()
  dateComponents.hour = randomInteger(0, 23)
  dateComponents.minute = randomInteger(0, 59)
  return NSCalendar.currentCalendar().dateFromComponents(dateComponents)
}

function randomInteger(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function startOfMonth(month) {
  const dateComponents = NSDateComponents.new()
  dateComponents.day = 1
  dateComponents.month = month
  dateComponents.year = currentYear()
  return NSCalendar.currentCalendar().dateFromComponents(dateComponents)
}

function currentYear() {
  return NSCalendar.currentCalendar().component_fromDate(NSCalendarUnitYear, NSDate.date())
}

function currentLocale() {
  // NSLocale.currentLocale() only returns the language that is supported by the host application
  const regionCode = NSLocale.currentLocale().localeIdentifier().split('_')[1]
  let languageCode = NSLocale.preferredLanguages()[0].split('-')[0]
  return NSLocale.alloc().initWithLocaleIdentifier(`${languageCode}_${regionCode}`)
}