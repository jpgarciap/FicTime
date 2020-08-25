import 'package:fictime/model/historicalEntry.dart';
import 'package:geolocator/geolocator.dart';
import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:fictime/helpers/notificationHelper.dart';
import 'package:flutter_local_notifications/flutter_local_notifications.dart';

const String userDocIdField = 'userDocId';
const String latField = 'lat';
const String _lngField = 'lng';
const int _distanceAreaInMeters = 800;

Future<HistoricalEntry> _getRegistByDate(String userDocId, DateTime date) async{
  DateTime startDate = DateTime(date.year, date.month, date.day);
  DateTime endDate = DateTime(date.year, date.month, date.day, 23, 59, 59);
  HistoricalEntry result;
  await Firestore.instance.collection('historicals').where("user", isEqualTo: userDocId)
      .where("date", isGreaterThanOrEqualTo: startDate)
      .where("date", isLessThan: endDate)
      .getDocuments()
      .then((QuerySnapshot snapshot) => {
    snapshot.documents.forEach((f) {
      result = HistoricalEntry(f.documentID, f.data["date"], f.data["start"], f.data["end"]);
    })
  });
  return result;
}

  Future<void> startReminder(FlutterLocalNotificationsPlugin flutterLocalNotificationsPlugin, Map<String, dynamic> inputData) async {
    if (!_hasNecessaryData(inputData)){
      return;
    }
    String userDocId = inputData[userDocIdField];
    HistoricalEntry todayRegist = await _getRegistByDate(userDocId, DateTime.now());
    bool canRegistStart = todayRegist == null || (todayRegist.getStart().isEmpty && todayRegist.getEnd().isEmpty);
    bool isInsideArea = await _isInsideArea(inputData[latField], inputData[_lngField]);
    if (canRegistStart && isInsideArea) {
      startNotification(flutterLocalNotificationsPlugin, userDocId);
    }
  }

  bool _hasNecessaryData(Map<String, dynamic> inputData) {
    return inputData.containsKey(userDocIdField) && inputData.containsKey(latField) && inputData.containsKey(_lngField);
  }

Future<bool> _isInsideArea(double officeLat, double officeLng) async {
  Position currentPos = await Geolocator().getCurrentPosition();
  if (currentPos == null) {
    return false;
  }
  double distance = await Geolocator().distanceBetween(
      currentPos.latitude, currentPos.longitude, officeLat, officeLng);
  return distance < _distanceAreaInMeters;
}

Future<void> endReminder(FlutterLocalNotificationsPlugin flutterLocalNotificationsPlugin, Map<String, dynamic> inputData) async{
    if (!_hasNecessaryData(inputData)){
      return;
    }
    String userDocId = inputData[userDocIdField];
    HistoricalEntry todayRegist = await _getRegistByDate(userDocId, DateTime.now());
    bool canRegistEnd = todayRegist != null && (todayRegist.getStart().isNotEmpty && todayRegist.getEnd().isEmpty);
    bool isOutsideArea = await _isOutsideArea(inputData[latField], inputData[_lngField]);
    if (canRegistEnd && isOutsideArea) {
      endNotification(flutterLocalNotificationsPlugin, userDocId);
    }
  }

  Future<bool> _isOutsideArea(double officeLat, double officeLng) async {
    Position currentPos = await Geolocator().getCurrentPosition();
    if (currentPos == null){
      return false;
    }
    double distance = await Geolocator().distanceBetween(currentPos.latitude, currentPos.longitude, officeLat, officeLng);
    return distance > _distanceAreaInMeters;
  }
  
