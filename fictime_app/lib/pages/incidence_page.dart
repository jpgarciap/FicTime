import 'package:flutter/material.dart';
import 'package:fictime/services/firestoreService.dart';
import 'package:flutter_datetime_picker/flutter_datetime_picker.dart';
import 'package:intl/intl.dart';
import 'package:grouped_buttons/grouped_buttons.dart';
import 'package:fictime/utils/colors.dart';
import 'package:fictime/model/historicalEntry.dart';

class IncidencePage extends StatefulWidget {
  IncidencePage({Key key, this.userDocId, this.firestoreService});

  final FirestoreService firestoreService;
  final String userDocId;

  @override
  State<StatefulWidget> createState() => new _IncidencePageState();
}

class _IncidencePageState extends State<IncidencePage> {
  final GlobalKey<FormState> _formKey = GlobalKey<FormState>();
  String _errorMessage;
  bool _isLoading;
  String selectedDateStr;
  DateTime selectedDate;
  String selectedCheckBox;

  @override
  void initState() {
    super.initState();
    _errorMessage = "";
    _isLoading = false;
  }

  @override
  Widget build(BuildContext context) {
    return new Scaffold(
        appBar: new AppBar(
          title: new Text("FicTime"),
        ),
        body: Stack(children: <Widget>[_showForm()]));
  }

  Widget _showForm() {
    return new Container(
        padding: EdgeInsets.all(16.0),
        child: new Form(
          key: _formKey,
          child: new ListView(
            shrinkWrap: true,
            children: <Widget>[
              _showDatePicker(),
              _showCheckBoxs(),
              _showCircularProgress(),
              registIncidenceButton(),
              showErrorMessage()
            ],
          ),
        ));
  }

  Widget _showDatePicker() {
    return new Padding(
        padding: EdgeInsets.fromLTRB(0.0, 45.0, 0.0, 0.0),
        child: SizedBox(
          height: 50.0,
          child: new RaisedButton(
            key: Key('dateBtn'),
            elevation: 5.0,
            shape: new RoundedRectangleBorder(
                borderRadius: new BorderRadius.circular(10.0)),
            color: Colors.blueGrey,
            child: Row(
                mainAxisAlignment: MainAxisAlignment.center,
                children: <Widget>[
                  Icon(Icons.date_range, color: Colors.black, size: 36.0),
                  Text(selectedDateStr == null ? " Select date" : selectedDateStr,
                      style: new TextStyle(fontSize: 25.0, color: Colors.black))
                ]),
            onPressed: () {
              DatePicker.showDateTimePicker(context,
                  showTitleActions: true,
                  minTime: DateTime(2018, 3, 5),
                  maxTime: DateTime(2019, 6, 7), onChanged: (date) {
                    setState(() {
                      selectedDateStr = DateFormat('dd/MM/yyyy - HH:mm').format(date);
                      selectedDate = date;
                    });
                  }, currentTime: DateTime.now(), locale: LocaleType.en);
            },
          ),
        ));
  }

  Widget _showCheckBoxs() {
    return new Padding(
        padding: EdgeInsets.fromLTRB(0.0, 45.0, 0.0, 0.0),
        child: SizedBox(
            child: RadioButtonGroup(
                orientation: GroupedButtonsOrientation.HORIZONTAL,
                margin: const EdgeInsets.only(left: 12.0),
                labels: <String>[
                  "Start",
                  "End",
                ],
                onSelected: (String selected) => selectedCheckBox = selected)
        )
    );
  }

  Widget _showCircularProgress() {
    if (_isLoading) {
      return Center(child: CircularProgressIndicator());
    }
    return Container(
      height: 0.0,
      width: 0.0,
    );
  }

  Widget showErrorMessage() {
    if (_errorMessage.length > 0 && _errorMessage != null) {
      return new Text(
        _errorMessage,
        style: TextStyle(
            fontSize: 13.0,
            color: Colors.red,
            height: 1.0,
            fontWeight: FontWeight.w300),
      );
    } else {
      return new Container(
        height: 0.0,
      );
    }
  }

  Widget registIncidenceButton() {
    return new Padding(
        padding: EdgeInsets.fromLTRB(0.0, 45.0, 0.0, 30.0),
        child: SizedBox(
          height: 50.0,
          child: new RaisedButton(
            elevation: 5.0,
            shape: new RoundedRectangleBorder(
                borderRadius: new BorderRadius.circular(30.0)),
            color: WatermelonColor.getColor(),
            child: new Text('Regist Incidence',
                style: new TextStyle(fontSize: 20.0, color: Colors.white)),
            onPressed: validateAndSubmit,
          ),
        ));
  }

  void validateAndSubmit() {
    if (selectedDate == null) {
      setState(() {
        _errorMessage = "You must select a date";
      });
    } else if (selectedDate.isAfter(DateTime.now())) {
      setState(() {
        _errorMessage = "The date cannot be later than today";
      });
    } else if (selectedCheckBox == "") {
      setState(() {
        _errorMessage = "You must select start/end";
      });
    } else{
      trySubmit();
    }
  }

  void trySubmit() async {
    setState(() {
      _isLoading = true;
    });
    HistoricalEntry entry = await widget.firestoreService.getRegistByDate(widget.userDocId, selectedDate);
    if (entry == null) {
      addnewRegist();
      successRegist();
    } else {
      updateRegist(entry);
    }
    setState(() {
      _isLoading = false;
    });
  }

  void successRegist(){
    selectedDate = null;
    selectedDateStr = null;
    _showAlert("The incidence was registered");
  }

  void updateRegist(HistoricalEntry entry) async {
    if ((selectedCheckBox == "Start" && entry.getStart().isNotEmpty) ||
        selectedCheckBox == "End" && entry.getEnd().isNotEmpty) {
      _errorMessage = "You already have a registration for this day";
    } else {
      if (selectedCheckBox == "Start") {
        await widget.firestoreService.updateRegistWithStart(
            entry.getDocId(), getSelectedHour());
      } else {
        await widget.firestoreService.updateRegistWithEnd(
            entry.getDocId(), getSelectedHour());
      }
      successRegist();
    }
  }

  String getSelectedHour() {
    return DateFormat('HH:mm').format(selectedDate);
  }

  void addnewRegist() async {
    if (selectedCheckBox == "Start") {
      await widget.firestoreService.addNewStartWithDate(
          widget.userDocId, selectedDate);
    } else {
      await widget.firestoreService.addNewEndWithDate(widget.userDocId, selectedDate);
    }
  }

  void _showAlert(String value){
    showDialog(
        context: context,
        builder: (_) => new AlertDialog(
          title: new Text('Alert!'),
          content: new Text(value,
            style: new TextStyle(fontSize: 15.0),),
          actions: <Widget>[
            new FlatButton(onPressed: () {Navigator.pop(context);}, child: new Text('Ok')),
          ],
        )
    );
  }
}
