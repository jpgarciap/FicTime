import 'dart:async';
import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:fictime/model/historicalEntry.dart';

abstract class FirestoreService {
  Future<List<HistoricalEntry>> getHistoricals(String userDocId);
  Future<String> getUserDocId(String email);
  Future<void> addNewStart();
  Future<void> addNewEnd();
  Future<void> updateTodayStart(String historicalDocId);
  Future<void> updateTodayEnd(String historicalDocId);
}

class FirestoreServiceImpl implements FirestoreService {
  CollectionReference userRef = Firestore.instance.collection('users');
  CollectionReference historicalRef = Firestore.instance.collection('historicals');

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
  Future<void> addNewEnd() {
    // TODO: implement addNewEnd
    throw UnimplementedError();
  }

  @override
  Future<void> addNewStart() {
    // TODO: implement addNewStart
    throw UnimplementedError();
  }

  @override
  Future<void> updateTodayEnd(String historicalDocId) {
    // TODO: implement updateTodayEnd
    throw UnimplementedError();
  }

  @override
  Future<void> updateTodayStart(String historicalDocId) {
    // TODO: implement updateTodayStart
    throw UnimplementedError();
  }
}