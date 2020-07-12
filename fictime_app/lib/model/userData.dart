
class UserData {
  String _userDocId = "";
  double _lat;
  double _lng;
  String _start = "";
  String _end = "";

  void updateUserDocId(String userDocId){
    this._userDocId = userDocId;
  }

  void updateCoordinates(double lat, double lng){
    this._lat = lat;
    this._lng = lng;
  }

  void updateWorkShift(String start, String end){
    this._start = start;
    this._end = end;
  }

  String getUserDocId(){
    return this._userDocId;
  }

  double getLat(){
    return this._lat;
  }

  double getLng(){
    return this._lng;
  }

  String getStart(){
    return this._start == null ? "" : this._start;
  }

  String getEnd(){
    return this._end == null ? "" : this._end;
  }

  @override
  String toString() {
    return 'UserData{userDocId: $_userDocId, lat: $_lat, lng: $_lng, start: $_start, end: $_end}';
  }

  List<int> calculateStartDelaysInSeconds(int taskNumber, int periodicityInMinutes){
    if (this._start.isEmpty){
      return new List();
    }
    return _calculateDelays(_dateFromStart(), taskNumber, periodicityInMinutes);
  }

  List<int> calculateEndDelaysInSeconds(int taskNumber, int periodicityInMinutes) {
    if (this._end.isEmpty) {
      return new List();
    }
    return _calculateDelays(_dateFromEnd(), taskNumber, periodicityInMinutes);
  }

  List<int> _calculateDelays(DateTime date, int taskNumber, int periodicityInMinutes){
    List<int> result = new List();
    int periodicity = periodicityInMinutes * 60;
    int delay = _calculateFirstDelay(date, taskNumber, periodicity);
    for (int i = 0; i < taskNumber; i++){
      result.add(delay);
      delay += periodicity;
    }
    return result;
  }

  int _calculateFirstDelay(DateTime date, int taskNumber, int periodicityInMilis){
    DateTime now = DateTime.now();
    Duration diff = date.difference(now);
    int pastTasks = taskNumber ~/ 2;
    return diff.inSeconds - (pastTasks * periodicityInMilis);
  }

  DateTime _dateFromStart(){
    DateTime now = DateTime.now();
    DateTime calculatedDate = DateTime(now.year, now.month, now.day, _getHourFromString(_start), _getMinutesFromString(_start));

    return now.isBefore(calculatedDate) ? calculatedDate : calculatedDate.add(Duration( days: 1));
  }

  DateTime _dateFromEnd(){
    DateTime now = DateTime.now();
    DateTime calculatedDate = DateTime(now.year, now.month, now.day, _getHourFromString(_end), _getMinutesFromString(_end));

    return now.isBefore(calculatedDate) ? calculatedDate : calculatedDate.add(Duration( days: 1));
  }

  int _getHourFromString(String time){
    List<String> splitStr = time.split(":");
    return splitStr.length >= 0 ? int.parse(splitStr[0]) : 0;
  }

  int _getMinutesFromString(String time){
    List<String> splitStr = time.split(":");
    return splitStr.length > 0 ? int.parse(splitStr[1]) : 0;
  }

  @override
  bool operator ==(Object other) =>
      identical(this, other) ||
      other is UserData &&
          runtimeType == other.runtimeType &&
          _userDocId == other._userDocId &&
          _lat == other._lat &&
          _lng == other._lng &&
          _start == other._start &&
          _end == other._end;

  @override
  int get hashCode =>
      _userDocId.hashCode ^
      _lat.hashCode ^
      _lng.hashCode ^
      _start.hashCode ^
      _end.hashCode;
}
