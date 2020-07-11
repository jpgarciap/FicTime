import 'dart:async';
import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:flutter_local_notifications/flutter_local_notifications.dart';
import 'package:rxdart/subjects.dart';

final BehaviorSubject<ReminderNotification> didReceiveLocalNotificationSubject =
BehaviorSubject<ReminderNotification>();

final BehaviorSubject<String> selectNotificationSubject =
BehaviorSubject<String>();

class ReminderNotification {
  final int id;
  final String title;
  final String body;
  final String payload;

  ReminderNotification({
    @required this.id,
    @required this.title,
    @required this.body,
    @required this.payload,
  });
}
Future<void> initNotifications(
    FlutterLocalNotificationsPlugin flutterLocalNotificationsPlugin) async {
  var initializationSettingsAndroid = AndroidInitializationSettings('fictime_icon');
  var initializationSettingsIOS = IOSInitializationSettings(
      requestAlertPermission: false,
      requestBadgePermission: false,
      requestSoundPermission: false
      );
  var initializationSettings = InitializationSettings(
      initializationSettingsAndroid, initializationSettingsIOS);

  await flutterLocalNotificationsPlugin.initialize(initializationSettings,
      onSelectNotification: (String payload) async {
        selectNotificationSubject.add(payload);
      });
}

Future endNotification(FlutterLocalNotificationsPlugin flutterLocalNotificationsPlugin, String userDocId) async {
  var androidPlatformChannelSpecifics = new AndroidNotificationDetails(
      'your channel id', 'your channel name', 'your channel description',
      playSound: false, importance: Importance.Max, priority: Priority.High);
  var iOSPlatformChannelSpecifics =
  new IOSNotificationDetails(presentSound: false);
  var platformChannelSpecifics = new NotificationDetails(
      androidPlatformChannelSpecifics, iOSPlatformChannelSpecifics);
  await flutterLocalNotificationsPlugin.show(
    1,
    'You are leaving the office...',
    'Tap to register end',
    platformChannelSpecifics,
    payload: 'End',
  );
}

Future startNotification(FlutterLocalNotificationsPlugin flutterLocalNotificationsPlugin, String userDocId) async {
  var androidPlatformChannelSpecifics = new AndroidNotificationDetails(
      'your channel id', 'your channel name', 'your channel description',
      playSound: true, importance: Importance.Max, priority: Priority.High);
  var iOSPlatformChannelSpecifics =
  new IOSNotificationDetails(presentSound: false);
  var platformChannelSpecifics = new NotificationDetails(
      androidPlatformChannelSpecifics, iOSPlatformChannelSpecifics);

  await flutterLocalNotificationsPlugin.show(
    0,
    'You are in the office...',
    'Tap to register start',
    platformChannelSpecifics,
    payload: 'Start',
  );
}