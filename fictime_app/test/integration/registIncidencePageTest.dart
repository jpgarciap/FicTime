import 'package:cloud_firestore_mocks/cloud_firestore_mocks.dart';
import 'package:fictime/pages/incidence_page.dart';
import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:fictime/services/firestoreService.dart';
import 'package:fictime/repository/firestoreRepository.dart';


const String email = "j.p.garciap@udc.es";
const String userDocId = "userDoc1234";

void main(){

  testWidgets('show error message when no select date', (WidgetTester tester) async {
    final firestore = MockFirestoreInstance();
    await firestore.collection("users").document(userDocId).setData(({
      'email': email
    }));
    FirestoreService firestoreService = new FirestoreServiceImpl(new FirestoreRepositoryImpl(firestore));
    await tester.pumpWidget(MaterialApp(
        title: 'Firestore Example', home: new IncidencePage(userDocId: userDocId, firestoreService: firestoreService)));
    await tester.idle();
    await tester.pump(Duration(milliseconds: 200));
    var button = find.text("Regist Incidence");
    await tester.tap(button);
    await tester.pump(Duration(milliseconds: 200));
    expect(find.text('You must select a date'), findsOneWidget);
  });


}

