import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:intl/intl.dart';

class HistoricalEntry {
  String docId;
  Timestamp date;
  String start;
  String end;

  HistoricalEntry(String docId, Timestamp date, String start, String end){
    this.docId = docId;
    this.date = date;
    this.start = start;
    this.end = end;
  }

  String getDateFormat(){
    final DateTime date = new DateTime.fromMillisecondsSinceEpoch(this.date.seconds * 1000);
    return DateFormat('dd/MM/yyyy').format(date);
  }

  bool isToday(){
    final DateTime dateTime = new DateTime.fromMillisecondsSinceEpoch(this.date.seconds * 1000);
    final DateTime dateToCheck = DateTime(dateTime.year, dateTime.month, dateTime.day);
    final DateTime now = DateTime.now();
    final DateTime today = DateTime(now.year, now.month, now.day);
    return dateToCheck == today;
  }

  String getStart(){
    return this.start == null ? "" : this.start;
  }

  String getEnd(){
    return this.end == null ? "" : this.end;
  }

  String getDocId(){
    return this.docId;
  }
}