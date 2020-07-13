import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:cloud_firestore_mocks/cloud_firestore_mocks.dart';
import 'package:fictime/pages/request_account_page.dart';
import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:fictime/services/firestoreService.dart';
import 'package:fictime/repository/firestoreRepository.dart';

void main(){

  testWidgets('form elements are found', (WidgetTester tester) async {
    final firestore = MockFirestoreInstance();
    FirestoreService firestoreService = new FirestoreServiceImpl(new FirestoreRepositoryImpl(firestore));

    await tester.pumpWidget(MaterialApp(
        title: 'Firestore Example', home: RequestAccountPage(firestoreService: firestoreService)));

    await tester.idle();
    await tester.pump();
    expect(find.byKey(Key("email-field")), findsOneWidget);
    expect(find.byKey(Key("description-field")), findsOneWidget);
    expect(find.text("Send Request"), findsOneWidget);
  });

  testWidgets('store an Account Request', (WidgetTester tester) async {
    final firestore = MockFirestoreInstance();
    FirestoreService firestoreService = new FirestoreServiceImpl(new FirestoreRepositoryImpl(firestore));

    await tester.pumpWidget(MaterialApp(
        title: 'Firestore Example', home: RequestAccountPage(firestoreService: firestoreService)));

    await tester.idle();
    await tester.pump();

    var emailInput = find.byKey(Key("email-field"));
    var descriptionInput = find.byKey(Key("description-field"));
    var button = find.text("Send Request");

    await tester.enterText(emailInput, "j.p.garciap@udc.es");
    await tester.enterText(descriptionInput, "please, I need an Account");
    await tester.tap(button);

    await firestore.collection("accounts").getDocuments()
        .then((QuerySnapshot snapshot) => {
      snapshot.documents.forEach((f) {
        expect(f.data["email"], "j.p.garciap@udc.es");
        expect(f.data["description"], "please, I need an Account");
      })
    });
  });

  testWidgets('show error message when no complete email field', (WidgetTester tester) async {
    final firestore = MockFirestoreInstance();
    FirestoreService firestoreService = new FirestoreServiceImpl(new FirestoreRepositoryImpl(firestore));

    await tester.pumpWidget(MaterialApp(
        title: 'Firestore Example', home: RequestAccountPage(firestoreService: firestoreService)));

    await tester.idle();
    await tester.pump();
    var button = find.text("Send Request");
    await tester.tap(button);
    await tester.pump(const Duration(milliseconds: 100)); // add delay
    var errorMessage = find.text("Email can't be empty");
    expect(errorMessage, findsOneWidget);

  });

}

