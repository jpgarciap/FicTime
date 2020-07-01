import 'package:flutter/material.dart';
import 'package:fictime/pages/root_page.dart';
import 'package:fictime/services/authentication.dart';
import 'package:fictime/utils/colors.dart';

void main() => runApp(new MyApp());

class MyApp extends StatelessWidget {

  @override
  Widget build(BuildContext context) {
    return new MaterialApp(
        title: 'FicTime',
        debugShowCheckedModeBanner: false,
        theme: new ThemeData(
          primarySwatch: WatermelonColor.getColor(),
        ),
        home: new RootPage(auth: new Auth()));
  }

}
