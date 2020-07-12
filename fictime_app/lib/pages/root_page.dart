import 'package:flutter/material.dart';
import 'package:fictime/pages/login_signup_page.dart';
import 'package:fictime/services/authentication.dart';
import 'package:fictime/pages/home_page.dart';
import 'package:fictime/model/userData.dart';
import 'package:fictime/model/ScheduledTaskType.dart';
import 'package:workmanager/workmanager.dart';
import 'package:fictime/services/firestoreService.dart';
import 'package:fictime/repository/firestoreRepository.dart';

enum AuthStatus {
  NOT_DETERMINED,
  NOT_LOGGED_IN,
  LOGGED_IN,
}

const int taskNumber = 3;
const int periodicityInMinutes = 30;

class RootPage extends StatefulWidget {
  RootPage({this.auth});

  final BaseAuth auth;

  @override
  State<StatefulWidget> createState() => new _RootPageState();
}

class _RootPageState extends State<RootPage> {
  AuthStatus authStatus = AuthStatus.NOT_DETERMINED;
  FirestoreService firestoreService = new FirestoreServiceImpl(new FirestoreRepositoryImpl());
  String _userId = "";
  String _email = "";

  @override
  void initState() {
    super.initState();
    widget.auth.getCurrentUser().then((user) {
      setState(() {
        if (user != null) {
          _userId = user?.uid;
          _email = user?.email;
        }
        authStatus =
            user?.uid == null ? AuthStatus.NOT_LOGGED_IN : AuthStatus.LOGGED_IN;
      });
    });
  }

  void loginCallback() {
    widget.auth.getCurrentUser().then((user) {
      setState(() {
        _userId = user.uid.toString();
      });
    });
    setState(() {
      authStatus = AuthStatus.LOGGED_IN;
    });
  }

  void logoutCallback() {
    Workmanager.cancelAll();
    setState(() {
      authStatus = AuthStatus.NOT_LOGGED_IN;
      _userId = "";
      _email = "";
    });
  }

  Widget buildWaitingScreen() {
    return Scaffold(
      body: Container(
        alignment: Alignment.center,
        child: CircularProgressIndicator(),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    switch (authStatus) {
      case AuthStatus.NOT_DETERMINED:
        return buildWaitingScreen();
        break;
      case AuthStatus.NOT_LOGGED_IN:
        return new LoginSignupPage(
          auth: widget.auth,
          loginCallback: loginCallback,
          firestoreService: firestoreService,
        );
        break;
      case AuthStatus.LOGGED_IN:
        if (_userId.length > 0 && _userId != null) {
          firestoreService.getUserData(_email).then((currentUserData) {
                //initReminderStartTasks(currentUserData);
                //initReminderEndTasks(currentUserData);
          });
          return new HomePage(
            userId: _userId,
            auth: widget.auth,
            logoutCallback: logoutCallback,
            firestoreService: firestoreService,
          );
        } else
          return buildWaitingScreen();
        break;
      default:
        return buildWaitingScreen();
    }
  }

  void initReminderStartTasks(UserData userData) async{
    int taskNumber = 0;
    for (int delay
        in userData.calculateStartDelaysInSeconds(taskNumber, periodicityInMinutes)) {
      await Workmanager.registerPeriodicTask(
          "start-" + taskNumber.toString(), START_REMINDER,
          frequency: Duration(hours: 24),
          initialDelay: Duration(seconds: delay),
          constraints: Constraints(networkType: NetworkType.connected),
          inputData: <String, dynamic>{
            'userDocId': userData.getUserDocId(),
            'lat': userData.getLat(),
            'lng': userData.getLng()
          });
      taskNumber++;
    }
  }

  void initReminderEndTasks(UserData userData) async {
    int taskNumber = 0;
    for (int delay
        in userData.calculateEndDelaysInSeconds(taskNumber, periodicityInMinutes)) {
      await Workmanager.registerPeriodicTask("end-" + taskNumber.toString(), END_REMINDER,
          frequency: Duration(hours: 24),
          initialDelay: Duration(seconds: delay),
          constraints: Constraints(networkType: NetworkType.connected),
          inputData: <String, dynamic>{
            'userDocId': userData.getUserDocId(),
            'lat': userData.getLat(),
            'lng': userData.getLng()
          });
    }
  }
}
