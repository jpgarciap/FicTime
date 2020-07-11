import 'package:flutter/material.dart';
import 'package:fictime/pages/root_page.dart';
import 'package:fictime/services/authentication.dart';
import 'package:fictime/utils/colors.dart';
import 'package:workmanager/workmanager.dart';
import 'package:flutter_local_notifications/flutter_local_notifications.dart';
import 'package:fictime/services/scheduledTasksExecutors.dart';
import 'package:fictime/helpers/notificationHelper.dart';
import 'package:fictime/model/ScheduledTaskType.dart';


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

class MyApp extends StatelessWidget {


  @override
  Widget build(BuildContext context) {
    return new MaterialApp(
        title: 'FicTime',
        debugShowCheckedModeBanner: false,
        theme: new ThemeData(
          primarySwatch: WatermelonColor.getColor(),
        ),
        home: new RootPage(auth: new Auth())
    );
  }

}
