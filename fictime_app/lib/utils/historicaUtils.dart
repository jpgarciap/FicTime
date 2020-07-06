import 'package:fictime/model/historicalEntry.dart';

class HistoricalUtils {


  static bool hasStartToday(List<HistoricalEntry> historicals){
    for (HistoricalEntry entry in historicals){
      if (entry.isToday() && entry.getStart().isNotEmpty){
        return true;
      }
    }
    return false;
  }

  static bool hasEndToday(List<HistoricalEntry> historicals){
    for (HistoricalEntry entry in historicals){
      if (entry.isToday() && entry.getEnd().isNotEmpty){
        return true;
      }
    }
    return false;
  }

  static HistoricalEntry todayEntry(List<HistoricalEntry> historicals){
    for (HistoricalEntry entry in historicals){
      if (entry.isToday()) {
        return entry;
      }
    }
    return null;
  }

}