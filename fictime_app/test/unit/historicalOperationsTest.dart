import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:fictime/model/historicalEntry.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:fictime/utils/historicaUtils.dart';


const String userDocId = "AUSSASASDA";
const String start = "08:30";
const String end = "15:30";

void main(){
 String _numberWithTwoDecimals(int number){
  return number < 10 ? '0' + number.toString() : number.toString();
 }

 DateTime getYesterday(){
  DateTime now = DateTime.now();
  return now.subtract(Duration(days: 1));
 }

 test('check parser Date Format', (){
  DateTime now = DateTime.now();
  String result = now.day.toString() + '/' + _numberWithTwoDecimals(now.month) + '/' + _numberWithTwoDecimals(now.year);
  HistoricalEntry entry = new HistoricalEntry(userDocId, Timestamp.now(), start, end);
  expect(entry.getDateFormat(), result);
 });
 
 test('check today date', (){
  HistoricalEntry entry = new HistoricalEntry(userDocId, Timestamp.now(), start, end);
  expect(entry.isToday(), true);
 });

 test('check not today date', (){
  HistoricalEntry entry = new HistoricalEntry(userDocId, Timestamp.fromDate(getYesterday()), start, end);
  expect(entry.isToday(), false);
 });

 test('has today start', (){
  HistoricalEntry yesterdayEntry = new HistoricalEntry(userDocId, Timestamp.fromDate(getYesterday()), start, end);
  HistoricalEntry todayEntry = new HistoricalEntry(userDocId, Timestamp.fromDate(DateTime.now()), start, end);
  List<HistoricalEntry> historicals = List<HistoricalEntry>();
  historicals.addAll([yesterdayEntry, todayEntry]);
  expect(HistoricalUtils.hasStartToday(historicals), true);
 });

 test('has not today start', (){
  HistoricalEntry yesterdayEntry = new HistoricalEntry(userDocId, Timestamp.fromDate(getYesterday()), start, end);
  HistoricalEntry todayEntry = new HistoricalEntry(userDocId, Timestamp.fromDate(DateTime.now()), "", end);
  List<HistoricalEntry> historicals = List<HistoricalEntry>();
  historicals.addAll([yesterdayEntry, todayEntry]);
  expect(HistoricalUtils.hasStartToday(historicals), false);
 });

 test('has today end', (){
  HistoricalEntry yesterdayEntry = new HistoricalEntry(userDocId, Timestamp.fromDate(getYesterday()), start, end);
  HistoricalEntry todayEntry = new HistoricalEntry(userDocId, Timestamp.fromDate(DateTime.now()), start, end);
  List<HistoricalEntry> historicals = List<HistoricalEntry>();
  historicals.addAll([yesterdayEntry, todayEntry]);
  expect(HistoricalUtils.hasEndToday(historicals), true);
 });

 test('has not today end', (){
  HistoricalEntry yesterdayEntry = new HistoricalEntry(userDocId, Timestamp.fromDate(getYesterday()), start, end);
  HistoricalEntry todayEntry = new HistoricalEntry(userDocId, Timestamp.fromDate(DateTime.now()), start, "");
  List<HistoricalEntry> historicals = List<HistoricalEntry>();
  historicals.addAll([yesterdayEntry, todayEntry]);
  expect(HistoricalUtils.hasEndToday(historicals), false);
 });

}