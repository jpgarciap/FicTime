import 'package:flutter/material.dart';
import 'package:fictime/pages/root_page.dart';
import 'package:fictime/services/authentication.dart';
import 'package:fictime/utils/colors.dart';
import 'package:workmanager/workmanager.dart';
import 'package:flutter_local_notifications/flutter_local_notifications.dart';
import 'package:fictime/services/scheduledTasksExecutors.dart';
import 'package:fictime/helpers/notificationHelper.dart';
import 'package:fictime/model/ScheduledTaskType.dart';
import 'package:fictime/services/firestoreService.dart';
import 'package:fictime/repository/firestoreRepository.dart';
import 'package:permission_handler/permission_handler.dart';
import 'package:cloud_firestore/cloud_firestore.dart';


final FlutterLocalNotificationsPlugin flutterLocalNotificationsPlugin =
FlutterLocalNotificationsPlugin();
NotificationAppLaunchDetails notificationAppLaunchDetails;

void callbackDispatcher() {
  Workmanager.executeTask((task, inputData) async{
    switch (task) {
      case START_REMINDER:
        await startReminder(flutterLocalNotificationsPlugin, inputData);
        break;
      case END_REMINDER:
        await endReminder(flutterLocalNotificationsPlugin, inputData);
        break;
    }
    return Future.value(true);
  });
}

void main() async{
  WidgetsFlutterBinding.ensureInitialized();
  notificationAppLaunchDetails =
  await flutterLocalNotificationsPlugin.getNotificationAppLaunchDetails();
  await initNotifications(flutterLocalNotificationsPlugin);
  Workmanager.initialize(callbackDispatcher);
  runApp(MyApp());
}

class MyApp extends StatefulWidget{

  @override
  _MyApp createState() => _MyApp();
}

class _MyApp extends State<MyApp> {
  FirestoreService firestoreService = new FirestoreServiceImpl(new FirestoreRepositoryImpl(Firestore.instance));

  @override
  void initState(){
    super.initState();
    _askPermission();
  }

  @override
  Widget build(BuildContext context) {
    return new MaterialApp(
        title: 'FicTime',
        debugShowCheckedModeBanner: false,
        theme: new ThemeData(
          primarySwatch: WatermelonColor.getColor(),
        ),
        home: new RootPage(auth: new Auth(), firestoreService: firestoreService)
    );
  }

  _askPermission() async {
    Permission permission = Permission.locationAlways;
    PermissionStatus status = await permission.status;
    if (status.isUndetermined) {
        await permission.request();
    }
  }

}
