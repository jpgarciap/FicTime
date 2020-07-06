import 'dart:async';
import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:fictime/model/historicalEntry.dart';
import 'package:flutter/material.dart';
import 'package:intl/intl.dart';

abstract class FirestoreService {
  Future<List<HistoricalEntry>> getHistoricals(String userDocId);
  Future<String> getUserDocId(String email);
  Future<void> addNewStart(String userDocId);
  Future<void> addNewEnd(String userDocId);
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
  Future<void> addNewEnd(String userDocId) async {
    return historicalRef.document().setData({"date": DateTime.now(), "user": userDocId, "end": getHour()});
  }

  String getHour(){
    return DateFormat('HH:mm').format(DateTime.now());
  }

  @override
  Future<void> addNewStart(String userDocId) {
    return historicalRef.document().setData({"date": DateTime.now(), "user": userDocId, "start": getHour()});
  }

  @override
  Future<void> updateTodayEnd(String historicalDocId) {
    return historicalRef.document(historicalDocId).updateData({"end": getHour()});
  }

  @override
  Future<void> updateTodayStart(String historicalDocId) {
    return historicalRef.document(historicalDocId).updateData({"start": getHour()});
  }
}