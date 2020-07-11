import 'dart:async';
import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:fictime/model/historicalEntry.dart';
import 'package:intl/intl.dart';
import 'package:fictime/model/userData.dart';

abstract class FirestoreService {
  Future<List<HistoricalEntry>> getHistoricals(String userDocId);
  Future<String> getUserDocId(String email);
  Future<UserData> getUserData(String email);
  Future<void> addNewStart(String userDocId);
  Future<void> addNewEnd(String userDocId);
  Future<void> addNewStartWithDate(String userDocId, DateTime dateTime);
  Future<void> addNewEndWithDate(String userDocId,  DateTime dateTime);
  Future<void> updateTodayStart(String historicalDocId);
  Future<void> updateTodayEnd(String historicalDocId);
  Future<void> updateRegistWithEnd(String historicalDocId, String hour);
  Future<void> updateRegistWithStart(String historicalDocId, String hour);
  Future<HistoricalEntry> getRegistByDate(String userDocId, DateTime date);
}

class FirestoreServiceImpl implements FirestoreService {
  CollectionReference userRef = Firestore.instance.collection('users');
  CollectionReference historicalRef = Firestore.instance.collection('historicals');
  CollectionReference officesRef = Firestore.instance.collection('offices');
  CollectionReference workShiftRef = Firestore.instance.collection('workShifts');


  Future<List<HistoricalEntry>> getHistoricals(String userDocId) async {
    final List<HistoricalEntry> result = new List<HistoricalEntry>();
    await historicalRef.where("user", isEqualTo: userDocId)
        .orderBy("date", descending: true)
        .limit(7)
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
    await userRef.where("email", isEqualTo: email)
        .getDocuments()
        .then((QuerySnapshot snapshot) => {
      snapshot.documents.forEach((userDoc) {
        userData.updateUserDocId(userDoc.documentID);
        officeDocId = userDoc.data["office"];
        workShiftDocId = userDoc.data["workShift"];

      })
    });
    await addCoordinates(userData, officeDocId);
    await addWorkShift(userData, workShiftDocId);
    return userData;
  }

  Future<void> addCoordinates(UserData userData, String officeDocId) async{
    await officesRef.document(officeDocId).get().then((officeDoc) {
        double lat = officeDoc.data['coordinates']['lat'];
        double lng = officeDoc.data['coordinates']['lng'];
        userData.updateCoordinates(lat, lng);
    });
  }

  Future<void> addWorkShift(UserData userData, String workShiftId) async {
    await workShiftRef.document(workShiftId).get().then((workShiftDoc) =>
        userData.updateWorkShift(workShiftDoc.data["startTime"], workShiftDoc.data["endTime"])
    );
  }



  Future<String> getUserDocId(String email) async {
    String userDocId = "";
    await userRef.where("email", isEqualTo: email)
        .getDocuments()
        .then((QuerySnapshot snapshot) => {
          snapshot.documents.forEach((f) { userDocId = f.documentID; })
        });
    return userDocId;
  }

  @override
  Future<void> addNewEnd(String userDocId) async {
    return historicalRef.document().setData({"date": getDate(), "user": userDocId, "end": getHour()});
  }

  @override
  Future<void> addNewEndWithDate(String userDocId, DateTime date) async {
    DateTime dateToAdd = DateTime(date.year, date.month, date.day);
    return historicalRef.document().setData({"date": dateToAdd, "user": userDocId, "end": getHour()});
  }

  String getHour(){
    return DateFormat('HH:mm').format(DateTime.now());
  }

  DateTime getDate(){
    DateTime now = DateTime.now();
    return DateTime(now.year, now.month, now.day);
  }

  @override
  Future<void> addNewStart(String userDocId) async{
    return historicalRef.document().setData({"date": getDate(), "user": userDocId, "start": getHour()});
  }

  @override
  Future<void> addNewStartWithDate(String userDocId,  DateTime date) async{
    DateTime dateToAdd = DateTime(date.year, date.month, date.day);
    return historicalRef.document().setData({"date": dateToAdd, "user": userDocId, "start": getHour()});
  }

  @override
  Future<void> updateTodayEnd(String historicalDocId) {
    return historicalRef.document(historicalDocId).updateData({"end": getHour()});
  }

  @override
  Future<void> updateTodayStart(String historicalDocId) {
    return historicalRef.document(historicalDocId).updateData({"start": getHour()});
  }

  @override
  Future<void> updateRegistWithEnd(String historicalDocId, String hour) {
    return historicalRef.document(historicalDocId).updateData({"end": hour});
  }

  @override
  Future<void> updateRegistWithStart(String historicalDocId, String hour) {
    return historicalRef.document(historicalDocId).updateData({"start": hour});
  }

  @override
  Future<HistoricalEntry> getRegistByDate(String userDocId, DateTime date) async{
    DateTime dateToCompare = DateTime(date.year, date.month, date.day);
    HistoricalEntry result;
    await historicalRef.where("user", isEqualTo: userDocId)
    .where("date", isEqualTo: dateToCompare)
        .getDocuments()
        .then((QuerySnapshot snapshot) => {
      snapshot.documents.forEach((f) {
        result = HistoricalEntry(f.documentID, f.data["date"], f.data["start"], f.data["end"]);
      })
    });
    return result;
  }

}