import 'dart:async';
import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:fictime/model/historicalEntry.dart';
import 'package:intl/intl.dart';
import 'package:fictime/model/userData.dart';

abstract class FirestoreRepository {
  Future<List<HistoricalEntry>> getHistoricals(String userDocId);
  Future<String> getUserDocId(String email);
  Future<UserData> getUserData(String email);
  Future<void> addNewStart(String userDocId, String comment);
  Future<void> addNewEnd(String userDocId, String comment,);
  Future<void> addNewStartWithDate(String userDocId, DateTime dateTime);
  Future<void> addNewEndWithDate(String userDocId,  DateTime dateTime);
  Future<void> updateTodayStart(String historicalDocId, String comment);
  Future<void> updateTodayEnd(String historicalDocId, String comment,);
  Future<void> updateRegistWithEnd(String historicalDocId, String hour);
  Future<void> updateRegistWithStart(String historicalDocId, String hour);
  Future<HistoricalEntry> getRegistByDate(String userDocId, DateTime date);
  Future<void> addRequestAccount(String email, String description);
}

class FirestoreRepositoryImpl implements FirestoreRepository {
  FirestoreRepositoryImpl(this.firestore);
  final Firestore firestore;

  Future<List<HistoricalEntry>> getHistoricals(String userDocId) async {
    final List<HistoricalEntry> result = new List<HistoricalEntry>();
    await firestore.collection('historicals').where("user", isEqualTo: userDocId)
        .orderBy("date", descending: true)
        .limit(5)
        .getDocuments()
        .then((QuerySnapshot snapshot) => {
      snapshot.documents.forEach((f) {
        result.add(new HistoricalEntry(f.documentID, f.data["date"], f.data["start"], f.data["end"]));
      })
    });
    return result;
  }

  Future<UserData> getUserData(String email) async{
    UserData userData = new UserData();
    String officeDocId;
    String workShiftDocId;
    await firestore.collection('users').where("email", isEqualTo: email)
        .getDocuments()
        .then((QuerySnapshot snapshot) => {
      snapshot.documents.forEach((userDoc) {
        userData.updateUserDocId(userDoc.documentID);
        officeDocId = userDoc.data["office"];
        workShiftDocId = userDoc.data["workShift"];

      })
    });
    await _addWorkShift(userData, workShiftDocId);
    await _addCoordinates(userData, officeDocId);
    return userData;
  }

  Future<void> _addCoordinates(UserData userData, String officeDocId) async{
    var document = firestore.collection('offices').document(officeDocId);
    await document.get().then((officeDoc) {
      if (officeDoc.exists){
        userData.updateCoordinates(officeDoc.data["coordinates"]["lat"], officeDoc.data["coordinates"]["lng"]);
      }
    }).catchError((onError) {
      print("ERROR " + onError);
    });
  }

  Future<void> _addWorkShift(UserData userData, String workShiftId) async {
    var document = firestore.collection('workShifts').document(workShiftId);
    await document.get().then((workShiftDoc) {
      if (workShiftDoc.exists){
        userData.updateWorkShift(workShiftDoc.data["startTime"], workShiftDoc.data["endTime"]);
      }
    }).catchError((onError) {
      print("ERROR " + onError);
    });
  }

  Future<String> getUserDocId(String email) async {
    String userDocId = "";
    await firestore.collection('users').where("email", isEqualTo: email)
        .getDocuments()
        .then((QuerySnapshot snapshot) => {
      snapshot.documents.forEach((f) { userDocId = f.documentID; })
    });
    return userDocId;
  }

  @override
  Future<void> addNewEnd(String userDocId, String comment) async {
    return firestore.collection('historicals').document().setData({"date": getDate(), "user": userDocId, "end": getHour(), "commentEnd": comment});
  }

  @override
  Future<void> addNewEndWithDate(String userDocId, DateTime date) async {
    DateTime dateToAdd = DateTime(date.year, date.month, date.day);
    return firestore.collection('historicals').document().setData({"date": dateToAdd, "user": userDocId, "end": getHour()});
  }

  String getHour(){
    return DateFormat('HH:mm').format(DateTime.now());
  }

  DateTime getDate(){
    DateTime now = DateTime.now();
    return DateTime(now.year, now.month, now.day);
  }

  @override
  Future<void> addNewStart(String userDocId, String comment) async{
    return firestore.collection('historicals').document().setData({"date": getDate(), "user": userDocId, "start": getHour(), "commentStart": comment});
  }

  @override
  Future<void> addNewStartWithDate(String userDocId,  DateTime date) async{
    DateTime dateToAdd = DateTime(date.year, date.month, date.day);
    return firestore.collection('historicals').document().setData({"date": dateToAdd, "user": userDocId, "start": getHour()});
  }

  @override
  Future<void> updateTodayEnd(String historicalDocId, String comment) {
    return firestore.collection('historicals').document(historicalDocId).updateData({"end": getHour(), "commentEnd": comment});
  }

  @override
  Future<void> updateTodayStart(String historicalDocId, String comment) {
    return firestore.collection('historicals').document(historicalDocId).updateData({"start": getHour(), "commentStart" : comment});
  }

  @override
  Future<void> updateRegistWithEnd(String historicalDocId, String hour) {
    return firestore.collection('historicals').document(historicalDocId).updateData({"end": hour});
  }

  @override
  Future<void> updateRegistWithStart(String historicalDocId, String hour) {
    return firestore.collection('historicals').document(historicalDocId).updateData({"start": hour});
  }

  @override
  Future<HistoricalEntry> getRegistByDate(String userDocId, DateTime date) async{
    DateTime startDate = DateTime(date.year, date.month, date.day);
    DateTime endDate = DateTime(date.year, date.month, date.day, 23, 59, 59);
    HistoricalEntry result;
    await firestore.collection('historicals').where("user", isEqualTo: userDocId)
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

  @override
  Future<void> addRequestAccount(String email, String description) async {
    return await firestore.collection('accounts').document().setData({"email": email, "description": description, "date": new DateTime.now()});
  }

}