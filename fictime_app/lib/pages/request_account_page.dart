import 'package:flutter/material.dart';
import 'package:fictime/utils/colors.dart';
import 'package:cloud_firestore/cloud_firestore.dart';

class RequestAccountPage extends StatefulWidget{

  State<StatefulWidget> createState() => new _RequestAccountPage();
}

class _RequestAccountPage extends State<RequestAccountPage>{
  final _formKey = new GlobalKey<FormState>();
  String _email;
  String _description;
  bool _isLoading;
  String _errorMessage;

  @override
  void initState() {
    _errorMessage = "";
    _description = "";
    _isLoading = false;
    super.initState();
  }


  @override
  Widget build(BuildContext context) {
    return new Scaffold(
        appBar: new AppBar(
          title: new Text('Request an Account'),
        ),
        body: Stack(
          children: <Widget>[
            _showForm(),
            _showCircularProgress(),
          ],
        )
    );
  }

  Widget _showForm() {
    return new Container(
        padding: EdgeInsets.all(16.0),
        child: new Form(
          key: _formKey,
          child: new ListView(
            shrinkWrap: true,
            children: <Widget>[
              showEmailInput(),
              showDescriptionInput(),
              showPrimaryButton(),
              showErrorMessage(),
            ],
          ),
        ));
  }

  Widget showPrimaryButton() {
    return new Padding(
        padding: EdgeInsets.fromLTRB(0.0, 45.0, 0.0, 0.0),
        child: SizedBox(
          height: 40.0,
          child: new RaisedButton(
            elevation: 5.0,
            shape: new RoundedRectangleBorder(
                borderRadius: new BorderRadius.circular(30.0)),
            color: WatermelonColor.getColor(),
            child: new Text('Send Request',
                style: new TextStyle(fontSize: 20.0, color: Colors.white)),
            onPressed: validateAndSubmit,
          ),
        ));
  }

  void validateAndSubmit() async {
    setState(() {
      _errorMessage = "";
    });
    if (validateAndSave()) {
      try {
        setState(() {
          _isLoading = true;
        });
        Firestore.instance.collection('accounts').document().setData({"email": _email, "description": _description, "date": new DateTime.now()});
        setState(() {
          _isLoading = false;
        });
        _showAlert("Your request has been sent");
      } catch (e) {
        print('Error: $e');
        setState(() {
          _isLoading = false;
          _errorMessage = e.message;
          _formKey.currentState.reset();
        });
      }
    }
  }

  bool validateAndSave() {
    final form = _formKey.currentState;
    if (form.validate()) {
      form.save();
      return true;
    }
    return false;
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

  Widget showEmailInput() {
    return Padding(
      padding: const EdgeInsets.fromLTRB(0.0, 100.0, 0.0, 0.0),
      child: new TextFormField(
        maxLines: 1,
        keyboardType: TextInputType.emailAddress,
        autofocus: false,
        decoration: new InputDecoration(
            hintText: 'Email',
            icon: new Icon(
              Icons.mail,
              color: Colors.grey,
            )),
        validator: (value) => value.isEmpty ? 'Email can\'t be empty' : null,
        onSaved: (value) => _email = value.trim(),
      ),
    );
  }

  Widget showDescriptionInput() {
    return Padding(
      padding: const EdgeInsets.fromLTRB(0.0, 15.0, 0.0, 0.0),
      child: new TextFormField(
        maxLines: 2,
        keyboardType: TextInputType.text,
        autofocus: false,
        decoration: new InputDecoration(
            hintText: 'Description',
            icon: new Icon(
              Icons.description,
              color: Colors.grey,
            )),
        onSaved: (value) => _description = value.trim(),
      ),
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

}