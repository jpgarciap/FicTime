import 'package:fictime/pages/forget_password.dart';
import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:fictime/services/authentication.dart';
import 'package:mockito/mockito.dart';

class MockBaseAuth extends Mock implements BaseAuth{}

MockBaseAuth mockBaseAuth = MockBaseAuth();

void main() {
  testWidgets('show error message when no complete email field', (WidgetTester tester) async {
    await tester.pumpWidget(MaterialApp(
        title: 'Firestore Example', home: new ForgetPasswordPage(auth: mockBaseAuth)));

    await tester.idle();
    await tester.pump();
    var button = find.text("Send Email");
    await tester.tap(button);
    await tester.pump(const Duration(milliseconds: 100)); // add delay
    var errorMessage = find.text("Email can't be empty");
    expect(errorMessage, findsOneWidget);
    verifyNever(mockBaseAuth.sendPasswordResetEmail(""));
  });

  testWidgets('send Email when fill form', (WidgetTester tester) async {

    await tester.pumpWidget(MaterialApp(
        title: 'Firestore Example', home: new ForgetPasswordPage(auth: mockBaseAuth)));

    await tester.idle();
    await tester.pump();
    var emailInput = find.byKey(Key("email-field"));
    var button = find.text("Send Email");
    await tester.enterText(emailInput, "j.p.garciap@udc.es");
    await tester.tap(button);
    await tester.pump(const Duration(milliseconds: 100)); // add delay

    verify(mockBaseAuth.sendPasswordResetEmail("j.p.garciap@udc.es"));

  });
}