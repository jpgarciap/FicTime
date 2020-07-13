import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:cloud_firestore_mocks/cloud_firestore_mocks.dart';
import 'package:fictime/pages/home_page.dart';
import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:fictime/services/firestoreService.dart';
import 'package:fictime/repository/firestoreRepository.dart';
import 'package:mockito/mockito.dart';
import 'package:fictime/services/authentication.dart';
import 'package:intl/intl.dart';


class MockBaseAuth extends Mock implements BaseAuth{}
const String email = "j.p.garciap@udc.es";
const String userDocId = "userDoc1234";

void main(){
  MockBaseAuth mockBaseAuth = MockBaseAuth();
  when(mockBaseAuth.getEmail()).thenAnswer((_) => Future<String>.value(email));


  testWidgets('all buttons disables when has end today regist', (WidgetTester tester) async {
    final firestore = MockFirestoreInstance();
    await firestore.collection("users").document(userDocId).setData(({
      'email': email
    }));
    await firestore.collection("historicals").document().setData({"date": getDate(), "user": userDocId, "end": getHour()});
    FirestoreService firestoreService = new FirestoreServiceImpl(new FirestoreRepositoryImpl(firestore));
    await tester.pumpWidget(MaterialApp(
        title: 'Firestore Example', home: new HomePage(auth: mockBaseAuth, firestoreService: firestoreService)));

    await tester.idle();
    await tester.pump(Duration(milliseconds: 200));

    expect(tester.widget<RaisedButton>(find.byKey(Key("startBtn"))).enabled, isFalse);
    expect(tester.widget<RaisedButton>(find.byKey(Key("endBtn"))).enabled, isFalse);
  });

  testWidgets('load data in table on start widget', (WidgetTester tester) async {
    final firestore = MockFirestoreInstance();
    await firestore.collection("users").document(userDocId).setData(({
      'email': email
    }));
    await firestore.collection("historicals").document().setData({"date": getDate(), "user": userDocId, "end": "13:00"});
    await firestore.collection("historicals").document().setData({"date": getDate(), "user": userDocId, "start": "11:00"});
    FirestoreService firestoreService = new FirestoreServiceImpl(new FirestoreRepositoryImpl(firestore));
    await tester.pumpWidget(MaterialApp(
        title: 'Firestore Example', home: new HomePage(auth: mockBaseAuth, firestoreService: firestoreService)));

    await tester.idle();
    await tester.pump(Duration(milliseconds: 200));

    expect(find.text("11:00"), findsOneWidget);
    expect(find.text("13:00"), findsOneWidget);
  });

  testWidgets('start button disable when has start today regist', (WidgetTester tester) async {
    final firestore = MockFirestoreInstance();
    await firestore.collection("users").document(userDocId).setData(({
      'email': email
    }));
    await firestore.collection("historicals").document().setData({"date": getDate(), "user": userDocId, "start": getHour()});
    FirestoreService firestoreService = new FirestoreServiceImpl(new FirestoreRepositoryImpl(firestore));
    await tester.pumpWidget(MaterialApp(
        title: 'Firestore Example', home: new HomePage(auth: mockBaseAuth, firestoreService: firestoreService)));

    await tester.idle();
    await tester.pump(Duration(milliseconds: 200));

    expect(tester.widget<RaisedButton>(find.byKey(Key("startBtn"))).enabled, isFalse);
    expect(tester.widget<RaisedButton>(find.byKey(Key("endBtn"))).enabled, isTrue);
  });


  testWidgets('all buttons enabled when not register today', (WidgetTester tester) async {
    final firestore = MockFirestoreInstance();
    await firestore.collection("users").document(userDocId).setData(({
      'email': email
    }));
    FirestoreService firestoreService = new FirestoreServiceImpl(new FirestoreRepositoryImpl(firestore));
    await tester.pumpWidget(MaterialApp(
        title: 'Firestore Example', home: new HomePage(auth: mockBaseAuth, firestoreService: firestoreService)));

    await tester.idle();
    await tester.pump(Duration(milliseconds: 200));

    expect(tester.widget<RaisedButton>(find.byKey(Key("startBtn"))).enabled, isTrue);
    expect(tester.widget<RaisedButton>(find.byKey(Key("endBtn"))).enabled, isTrue);
  });

  testWidgets('store start regist when click on start button', (WidgetTester tester) async {
    final firestore = MockFirestoreInstance();
    await firestore.collection("users").document(userDocId).setData(({
      'email': email
    }));
    FirestoreService firestoreService = new FirestoreServiceImpl(new FirestoreRepositoryImpl(firestore));
    await tester.pumpWidget(MaterialApp(
        title: 'Firestore Example', home: new HomePage(auth: mockBaseAuth, firestoreService: firestoreService)));
    await tester.idle();
    await tester.pump(Duration(milliseconds: 200));
    var startBtn = find.byKey(Key("startBtn"));
    await tester.tap(startBtn);
    await tester.pump(Duration(milliseconds: 100)); // add delay

    await firestore.collection("historicals").getDocuments()
        .then((QuerySnapshot snapshot) => {
      snapshot.documents.forEach((f) {
        expect(f.data["user"], userDocId);
        expect(f.data["start"], getHour());
        expect(f.data["end"], null);
      })
    });
  });

  testWidgets('store end regist when click on end button', (WidgetTester tester) async {
    final firestore = MockFirestoreInstance();
    await firestore.collection("users").document(userDocId).setData(({
      'email': email
    }));
    FirestoreService firestoreService = new FirestoreServiceImpl(new FirestoreRepositoryImpl(firestore));
    await tester.pumpWidget(MaterialApp(
        title: 'Firestore Example', home: new HomePage(auth: mockBaseAuth, firestoreService: firestoreService)));
    await tester.idle();
    await tester.pump(Duration(milliseconds: 200));
    var endBtn = find.byKey(Key("endBtn"));
    await tester.tap(endBtn);
    await tester.pump(Duration(milliseconds: 100)); // add delay


    await firestore.collection("historicals").getDocuments()
        .then((QuerySnapshot snapshot) => {
      snapshot.documents.forEach((f) {
        expect(f.data["user"], userDocId);
        expect(f.data["start"], null);
        expect(f.data["end"], getHour());
      })
    });
  });

}


String getHour(){
  return DateFormat('HH:mm').format(DateTime.now());
}

DateTime getDate(){
  DateTime now = DateTime.now();
  return DateTime(now.year, now.month, now.day);
}
