import 'package:flutter/material.dart';
import 'package:smart_home_tec_app/JSONmodels/clientes.dart';
import 'package:smart_home_tec_app/SQLite/database_service.dart';
import 'package:smart_home_tec_app/pages/created_objects/button.dart';
import 'package:smart_home_tec_app/pages/created_objects/constantes.dart';
import 'package:smart_home_tec_app/pages/created_objects/textentry.dart';

class UserDeviceTransfer extends StatefulWidget {
  final Clientes clienteData;
  final int deviceToTransfer; //serialNumberDevice
  const UserDeviceTransfer(
      {super.key, required this.clienteData, required this.deviceToTransfer});

  @override
  State<UserDeviceTransfer> createState() => _UserDeviceTransfer();
}

class _UserDeviceTransfer extends State<UserDeviceTransfer> {
  final newUserEmail = TextEditingController();
  final userEmail = TextEditingController();
  final db = DatabaseService();

  bool nonExistenteTarget = false;
  bool wrongDevice = false;
  bool emptySpaces = false;
  bool wrongUser = false;

  _resetDeviceTransferVariables() {
    setState(() {
      nonExistenteTarget = false;
    });
    setState(() {
      wrongDevice = false;
    });
    setState(() {
      emptySpaces = false;
    });
    setState(() {
      wrongUser = false;
    });
  }

  bool _allFieldsFilled() {
    if (newUserEmail.text.isNotEmpty && userEmail.text.isNotEmpty) {
      return true;
    }
    return false;
  }

  //check if the the tarjet exists
  Future<bool> _targetExists() async {
    bool state = await db.clienteExists(widget.clienteData.email);
    return state;
  }

  //device availabe
  //checks if the device is off and belongsto the user
  Future<bool> _deviceAvailable() async {
    return await db.assignedDeviceEligibleTransfer(
        widget.clienteData.email, widget.deviceToTransfer);
  }

  _transferDevice() async {
    _resetDeviceTransferVariables();
    if (_allFieldsFilled()) {
      if (await _targetExists()) {
        if (userEmail.text == widget.clienteData.email) {
          if (await _deviceAvailable()) {
            //calls the database to transfer the device between the users
            var result = await db.transferDeviceInDB(widget.deviceToTransfer,
                newUserEmail.text, widget.clienteData.email);
            if (result > 0) {
              if (!mounted) return;
              int count = 0;
              Navigator.popUntil(context, (route) {
                return count++ == 1;
              });
            }
            return;
          } else {
            setState(() {
              wrongDevice = true;
            });
          }
        } else {
          setState(() {
            wrongUser = true;
          });
        }
      } else {
        setState(() {
          nonExistenteTarget = true;
        });
      }
    } else {
      setState(() {
        emptySpaces = true;
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
        backgroundColor: colorFondo,
        body: SafeArea(
            child: Center(
          child: SingleChildScrollView(
            child: Padding(
              padding: constantPadding,
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  TextEntry(
                      writtenText: "Usuario destino",
                      icon: Icons.person,
                      controller: newUserEmail),
                  TextEntry(
                      writtenText: "Usuario Actual",
                      icon: Icons.person,
                      controller: userEmail),
                  Button(
                      texto: "Transferir dispositivo",
                      funcion: () {
                        _transferDevice();
                      }),
                  nonExistenteTarget
                      ? Text(
                          nonExistentTargetText,
                          style: TextStyle(
                            color: Colors.red.shade900,
                          ),
                        )
                      : const SizedBox(),
                  wrongDevice
                      ? Text(
                          wrongDeviceText,
                          style: TextStyle(
                            color: Colors.red.shade900,
                          ),
                        )
                      : const SizedBox(),
                  emptySpaces
                      ? Text(
                          emptySpacesText,
                          style: TextStyle(
                            color: Colors.red.shade900,
                          ),
                        )
                      : const SizedBox(),
                  wrongUser
                      ? Text(
                          wrongUserText,
                          style: TextStyle(
                            color: Colors.red.shade900,
                          ),
                        )
                      : const SizedBox(),
                ],
              ),
            ),
          ),
        )));
  }
}
