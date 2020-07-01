import 'package:flutter/material.dart';


class WatermelonColor {
  static Map<int, Color> colorCodes ={
    50:Color.fromRGBO(255,59,63, .1),
    100:Color.fromRGBO(255,59,63, .2),
    200:Color.fromRGBO(255,59,63, .3),
    300:Color.fromRGBO(255,59,63, .4),
    400:Color.fromRGBO(255,59,63, .5),
    500:Color.fromRGBO(255,59,63, .6),
    600:Color.fromRGBO(255,59,63, .7),
    700:Color.fromRGBO(255,59,63, .8),
    800:Color.fromRGBO(255,59,63, .9),
    900:Color.fromRGBO(255,59,63, 1),};

  static getColor(){
    return MaterialColor(0xFFFF3B3F, colorCodes);
  }
}