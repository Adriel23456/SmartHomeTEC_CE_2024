import 'package:flutter/material.dart';
import 'package:smart_home_tec_app/JSONmodels/clientes.dart';
import 'package:smart_home_tec_app/SQLite/database_service.dart';
import 'package:smart_home_tec_app/pages/asociar_dispositivo_nuevo.dart';
import 'package:smart_home_tec_app/pages/created_objects/button.dart';
import 'package:smart_home_tec_app/pages/created_objects/constantes.dart';

class GestionDispositivosPage extends StatefulWidget {
  final Clientes? clienteData;
  const GestionDispositivosPage({super.key, this.clienteData});

  @override
  State<GestionDispositivosPage> createState() => _GestionPage();
}

//en esta vista se listaran todos los dispositvos del usuario
//en cada uno se podra seleccionar si se enciende o se apaga el dispositivo
class _GestionPage extends State<GestionDispositivosPage> {
  List<String> devicesNames =[];
  List<bool> devicePowerStates = []; // To track the on/off state of each device
  final db = DatabaseService();

  @override
  void initState() {
    super.initState();
    _loadDevices(); // Load chambers on widget initialization
  }

  Future<void> _loadDevices() async {
    if (widget.clienteData != null) {
      List<String> devices = await db.getDevices(widget.clienteData!.email);
      setState(() {
        devicesNames = devices;
        devicePowerStates = List<bool>.filled(devicesNames.length, false);
      });
    }
  }

  _powerDevice(int index){
    setState(() {
      // Toggle the device power state
      devicePowerStates[index] = !devicePowerStates[index];
    });
    //send to database service the info that the device is on
  }

  _loadDeviceInfo(){

  }
  
  _transferDevice(){

  }


  @override
  Widget build(BuildContext context) {
    return Scaffold(
        backgroundColor: colorFondo,
        body: Center(
            child: SafeArea(
                child: SingleChildScrollView(
                    child: Padding(
                        padding: const EdgeInsets.symmetric(vertical: 20),
                        child: Column(
                          children: [
                            const Text(
                              "Mis Dispositivos",
                              style: TextStyle(
                                  fontSize: 40,
                                  fontWeight: FontWeight.bold,
                                  color: colorBaseBoton),
                            ),
                            Button(
                                texto: "Asociar un nuevo dispositivo",
                                funcion: () {Navigator.push(
                                  context, 
                                  MaterialPageRoute(
                                    builder: (context)=> AsociarDispositivoNuevo(clienteData: widget.clienteData)))
                                    .then((_)=> _loadDevices());
                                    }),
                            const SizedBox(height: 20),
                            ListView.builder(
                              shrinkWrap: true, // To avoid infinite height in the list
                              physics: const NeverScrollableScrollPhysics(),
                              itemCount: devicesNames.length,
                              itemBuilder: (context, index) {
                                return ListTile(
                                  title: Text(devicesNames[index]),
                                  trailing: Row(
                                    mainAxisSize: MainAxisSize.min,  // Ensures the Row takes the minimum space it needs
                                    children: <Widget>[
                                      IconButton(
                                        icon: const Icon(Icons.people_outline, color: Colors.red),
                                        onPressed: () {
                                          // transfer between users icon
                                          _transferDevice();
                                        },
                                      ),
                                      IconButton(
                                        icon: Icon(
                                          Icons.power_settings_new,
                                          color: devicePowerStates[index]
                                              ? Colors.green
                                              : Colors.grey, // Change color based on state
                                        ),
                                        onPressed: () {
                                          _powerDevice(index);
                                        },
                                      ),
                                      IconButton(
                                        icon: const Icon(Icons.info, color: Colors.grey),
                                        onPressed: () {
                                          // Opens a widget that displays the device info
                                          _loadDeviceInfo();
                                        },
                                      ),
                                    ],
                                  ),
                                );
                              },
                            ),
                          ],
                        ))))));
  }
}
