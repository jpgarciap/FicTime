import 'dart:async';
import 'package:fictime/model/historicalEntry.dart';
import 'package:fictime/model/userData.dart';
import 'package:fictime/repository/firestoreRepository.dart';
import 'package:fictime/utils/historicaUtils.dart';

abstract class FirestoreService {
  Future<List<HistoricalEntry>> getHistoricals(String userDocId);
  Future<String> getUserDocId(String email);
  Future<UserData> getUserData(String email);
  Future<void> registStart(String userDocId, List<HistoricalEntry> historicals);
  Future<void> registEnd(String userDocId, List<HistoricalEntry> historicals);
  Future<void> addNewStartWithDate(String userDocId, DateTime dateTime);
  Future<void> addNewEndWithDate(String userDocId,  DateTime dateTime);
  Future<void> updateRegistWithEnd(String historicalDocId, String hour);
  Future<void> updateRegistWithStart(String historicalDocId, String hour);
  Future<HistoricalEntry> getRegistByDate(String userDocId, DateTime date);
  Future<void> addRequestAccount(String email, String description);
}

class FirestoreServiceImpl implements FirestoreService {
  FirestoreRepository repository;
  FirestoreServiceImpl(this.repository);

  @override
  Future<List<HistoricalEntry>> getHistoricals(String userDocId) async {
    return await repository.getHistoricals(userDocId);
  }

  @override
  Future<UserData> getUserData(String email) async{
    return await repository.getUserData(email);
  }

  @override
  Future<String> getUserDocId(String email) async {
    return await repository.getUserDocId(email);
  }

  @override
  Future<void> registStart(String userDocId, List<HistoricalEntry> historicals) async {
    HistoricalEntry todayEntry = HistoricalUtils.todayEntry(historicals);
    if (todayEntry == null) {
      await repository.addNewStart(userDocId);
    } else{
      await repository.updateTodayStart(todayEntry.getDocId());
    }
  }

  @override
  Future<void> registEnd(String userDocId, List<HistoricalEntry> historicals) async {
    HistoricalEntry todayEntry = HistoricalUtils.todayEntry(historicals);
    if (todayEntry == null) {
      await repository.addNewEnd(userDocId);
    } else{
      await repository.updateTodayEnd(todayEntry.getDocId());
    }
  }

  @override
  Future<void> addNewEndWithDate(String userDocId, DateTime date) async {
    return repository.addNewEndWithDate(userDocId, date);
  }

  @override
  Future<void> addNewStartWithDate(String userDocId,  DateTime date) async{
    return repository.addNewStartWithDate(userDocId, date);
  }

  @override
  Future<void> updateRegistWithEnd(String historicalDocId, String hour) {
    return repository.updateRegistWithEnd(historicalDocId, hour);
  }

  @override
  Future<void> updateRegistWithStart(String historicalDocId, String hour) {
    return repository.updateRegistWithStart(historicalDocId, hour);
  }

  @override
  Future<HistoricalEntry> getRegistByDate(String userDocId, DateTime date) async{
    return await repository.getRegistByDate(userDocId, date);
  }

  @override
  Future<void> addRequestAccount(String email, String description){
    return repository.addRequestAccount(email, description);
  }

}