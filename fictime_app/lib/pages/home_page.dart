import 'package:flutter/material.dart';
import 'package:fictime/services/authentication.dart';
import 'package:fictime/utils/colors.dart';
import 'package:fictime/services/firestoreService.dart';
import 'package:fictime/model/historicalEntry.dart';
import 'package:fictime/utils/historicaUtils.dart';
import 'package:fictime/pages/incidence_page.dart';
import 'package:pull_to_refresh/pull_to_refresh.dart';
import 'dart:async';
import 'package:geolocator/geolocator.dart';


const int taskNumber = 3;
const int periodicityInMinutes = 30;

class HomePage extends StatefulWidget {
  HomePage({Key key, this.auth, this.userId, this.logoutCallback});

  final BaseAuth auth;
  final VoidCallback logoutCallback;
  final String userId;

  @override
  State<StatefulWidget> createState() => new _HomePageState();
}

class _HomePageState extends State<HomePage> {

  final GlobalKey<FormState> _formKey = GlobalKey<FormState>();
  final FirestoreService firestoreService = new FirestoreServiceImpl();
  List<HistoricalEntry> registers = new List<HistoricalEntry>();
  RefreshController _refreshController = RefreshController(initialRefresh: false);
  String _userDocId;
  bool _isLoading;
  bool _hasStartToday;
  bool _hasEndToday;

  @override
  void initState() {
    super.initState();
    _isLoading = false;
    findHistoricals();
  }

  Future<List<HistoricalEntry>> findHistoricals() async {
    String email = await widget.auth.getEmail();
    _userDocId = await firestoreService.getUserDocId(email);
    return await firestoreService.getHistoricals(_userDocId);
  }

  @override
  Widget build(BuildContext context) {
    return FutureBuilder<List<HistoricalEntry>>(
        future: findHistoricals(),
        builder: (BuildContext context,
                AsyncSnapshot<List<HistoricalEntry>> snapshot) =>
            new Scaffold(
                appBar: new AppBar(
                  title: new Text("FicTime"),
                  actions: <Widget>[
                    IconButton(
                        icon: Icon(Icons.exit_to_app),
                        tooltip: 'Exit',
                        onPressed: signOut),
                  ],
                ),
                body: SmartRefresher(
                  child: Stack(
                    children: <Widget>[
                      snapshot.hasData
                          ? _showForm(snapshot.data)
                          : _showCircularProgress(true)
                    ],
                  ),
                  controller: _refreshController,
                  onRefresh: loadHistoricals,
                  onLoading: loadHistoricals,
                )
            )
    );
  }

  Widget _showForm(List<HistoricalEntry> historicals) {
    registers = historicals;
    _hasStartToday = HistoricalUtils.hasStartToday(historicals);
    _hasEndToday = HistoricalUtils.hasEndToday(historicals);
    _showCircularProgress(false);

    return new Container(
        padding: EdgeInsets.all(16.0),
        child: new Form(
          key: _formKey,
          child: new ListView(
            shrinkWrap: true,
            children: <Widget>[
              _registerButtons(),
              _showCircularProgress(false),
              _table(),
              _incidenceButton()
            ],
          ),
        ));
  }

  Widget _registerButtons(){
    return new Padding(
        padding: EdgeInsets.fromLTRB(0.0, 45.0, 0.0, 0.0),
        child: SizedBox(
          child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: <Widget>[
                startButton(),
                endButton()
              ]
          )
        )
    );
  }

  Widget startButton(){
    return ButtonTheme(
        minWidth: 160.0,
        height: 50.0,
      child: RaisedButton(
          elevation: 5.0,
          shape: new RoundedRectangleBorder(
              borderRadius: new BorderRadius.circular(10.0)),
          color: Colors.green,
          child:
            Text(' Start', style: new TextStyle(fontSize: 25.0, color: Colors.black)),
          onPressed: !_hasStartToday && !_hasEndToday ? registStart : null
      )
    );
  }

  void registStart() async{
   HistoricalEntry todayEntry = HistoricalUtils.todayEntry(registers);
   setState(() {
     _isLoading = true;
   });
   if (todayEntry == null) {
     await firestoreService.addNewStart(_userDocId);
   } else{
     await firestoreService.updateTodayStart(todayEntry.getDocId());
   }
   setState(() {
     _isLoading = false;
   });
  }

  void registEnd() async{
    HistoricalEntry todayEntry = HistoricalUtils.todayEntry(registers);
    setState(() {
      _isLoading = true;
    });
    if (todayEntry == null) {
      await firestoreService.addNewEnd(_userDocId);
    } else{
      await firestoreService.updateTodayEnd(todayEntry.getDocId());
    }
    setState(() {
      _isLoading = false;
    });
  }

  Widget endButton(){
    return ButtonTheme(
        minWidth: 160.0,
        height: 50.0,
        child: RaisedButton(
            elevation: 5.0,
            shape: new RoundedRectangleBorder(
                borderRadius: new BorderRadius.circular(10.0)),
            color: WatermelonColor.getColor(),
            child: new Text('End',
                style: new TextStyle(fontSize: 25.0, color: Colors.white)),
            onPressed: !_hasEndToday ? registEnd : null
        )
    );
  }

  Widget _table() {
    return new Padding(
      padding: EdgeInsets.fromLTRB(0.0, 40.0, 0.0, 0.0),
      child: DataTable(columns: const <DataColumn>[
        DataColumn(
          label: Text(
            'Date',
            style: TextStyle(fontStyle: FontStyle.italic),
          ),
        ),
        DataColumn(
          label: Text(
            'Start',
            style: TextStyle(fontStyle: FontStyle.italic),
          ),
        ),
        DataColumn(
          label: Text(
            'End',
            style: TextStyle(fontStyle: FontStyle.italic),
          ),
        ),
      ], rows: getRows()
      )
    );
  }

  List<DataRow> getRows(){
    List<DataRow> rows = new List<DataRow>();
    for (HistoricalEntry entry in registers){
      DataRow row = DataRow(cells: [
        DataCell(Text(entry.getDateFormat())),
        DataCell(Text(entry.getStart())),
        DataCell(Text(entry.getEnd())),
      ]);
      rows.add(row);
    }
    return rows;
  }

  Widget _incidenceButton(){
    return new Padding(
        padding: EdgeInsets.fromLTRB(0.0, 45.0, 0.0, 0.0),
        child: SizedBox(
          height: 50.0,
          child: new RaisedButton(
            elevation: 5.0,
            shape: new RoundedRectangleBorder(
                borderRadius: new BorderRadius.circular(10.0)),
            color: Colors.yellow,
            child: Row(
                mainAxisAlignment: MainAxisAlignment.center,
                children: <Widget>[
                  Icon(Icons.notifications, color: Colors.black, size: 36.0),
                  Text(' Incidence', style: new TextStyle(fontSize: 25.0, color: Colors.black))
                ]
            ),
            onPressed: pushIncidence,
          ),
        )
    );
  }

  void pushIncidence() {
    Navigator.push(
      context,
      MaterialPageRoute(builder: (context) => new IncidencePage(userDocId: _userDocId)));
  }

  void loadHistoricals() async {
    setState(() {
      _isLoading = true;
    });

    registers = await findHistoricals();
    _hasStartToday = HistoricalUtils.hasStartToday(registers);
    _hasEndToday = HistoricalUtils.hasEndToday(registers);
    setState(() {
      _isLoading = false;
    });
    _refreshController.refreshCompleted();
  }

  signOut() async {
    try {
      await widget.auth.signOut();
      widget.logoutCallback();
    } catch (e) {
      print(e);
    }
  }

  Widget _showCircularProgress(bool force) {
    if (_isLoading || force) {
      return Center(child: CircularProgressIndicator());
    }
    return Container(
      height: 0.0,
      width: 0.0,
    );
  }

}