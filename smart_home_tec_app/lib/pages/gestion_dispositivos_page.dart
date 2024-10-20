import 'package:flutter/material.dart';
import 'package:smart_home_tec_app/JSONmodels/assigned_device.dart';
import 'package:smart_home_tec_app/JSONmodels/clientes.dart';
import 'package:smart_home_tec_app/SQLite/database_service.dart';
import 'package:smart_home_tec_app/pages/asociar_dispositivo_nuevo.dart';
import 'package:smart_home_tec_app/pages/created_objects/button.dart';
import 'package:smart_home_tec_app/pages/created_objects/constantes.dart';
import 'package:smart_home_tec_app/pages/device_info_page.dart';
import 'package:smart_home_tec_app/pages/transferencia_entre_usuarios_page.dart';

class GestionDispositivosPage extends StatefulWidget {
  final Clientes? clienteData;
  const GestionDispositivosPage({super.key, this.clienteData});

  @override
  State<GestionDispositivosPage> createState() => _GestionPage();
}

//en esta vista se listaran todos los dispositvos del usuario
//en cada uno se podra seleccionar si se enciende o se apaga el dispositivo
class _GestionPage extends State<GestionDispositivosPage> {
  List<AssignedDevice> devicesNames = [];
  List<bool> devicePowerStates = []; // To track the on/off state of each device
  final db = DatabaseService();
  bool errorFatal = false;

  @override
  void initState() {
    super.initState();
    _loadDevices(); // Load chambers on widget initialization
  }

  Future<void> _loadDevices() async {
    if (widget.clienteData != null) {
      List<AssignedDevice>? devices =
          await db.getAssignedDevices(widget.clienteData!.email);
      if (devices != null) {
        List<bool> tempPowerStates = [];

        // Loop over each device and check its power state
        for (AssignedDevice device in devices) {
          // Get the power state for each device (on/off) based on usage log
          bool isDeviceOn = await db.logExists(
              widget.clienteData!.email, device.serialNumberDevice);
          tempPowerStates.add(isDeviceOn);
        }

        // Update the UI state with the loaded devices and their power states
        setState(() {
          devicesNames = devices;
          devicePowerStates =
              tempPowerStates; // Update with loaded power states
        });
      } else {
        setState(() {
          errorFatal = true;
        });
      }
    }
  }

  _powerDevice(int index) async {
    //get the current device state
    bool deviceState = await db.logExists(
        widget.clienteData!.email, devicesNames[index].serialNumberDevice);
    setState(() {
      // Toggle the device power state
      devicePowerStates[index] =
          !deviceState; //switchs the state of the power button of the device
    });
    await db.devicePower(devicesNames[index].serialNumberDevice,
        widget.clienteData!, !deviceState);
    //send to database service the info that the device is on
  }

  _loadDeviceInfo(int index) {
    Navigator.push(
        context,
        MaterialPageRoute(
            builder: (context) => DeviceInfoPage(
                  clientData: widget.clienteData!,
                  serialNumer: devicesNames[index].serialNumberDevice,
                )));
  }

  _transferDevice(int index) {
    Navigator.push(
        context,
        MaterialPageRoute(
            builder: (context) => UserDeviceTransfer(
                  clienteData: widget.clienteData!,
                  deviceToTransfer: devicesNames[index].serialNumberDevice,
                )));
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
                                funcion: () {
                                  Navigator.push(
                                          context,
                                          MaterialPageRoute(
                                              builder: (context) =>
                                                  AsociarDispositivoNuevo(
                                                      clienteData:
                                                          widget.clienteData)))
                                      .then((_) => _loadDevices());
                                }),
                            const SizedBox(height: 20),
                            ListView.builder(
                              shrinkWrap:
                                  true, // To avoid infinite height in the list
                              physics: const NeverScrollableScrollPhysics(),
                              itemCount: devicesNames.length,
                              itemBuilder: (context, index) {
                                return ListTile(
                                  title: FutureBuilder<String>(
                                    future: db.getDeviceName(devicesNames[index]
                                        .serialNumberDevice), // Get the device name asynchronously
                                    builder: (context, snapshot) {
                                      if (snapshot.connectionState ==
                                          ConnectionState.waiting) {
                                        // While waiting for the future to complete, show a loading indicator or placeholder text
                                        return Text('Loading...');
                                      } else if (snapshot.hasError) {
                                        // If an error occurs, show error text
                                        return Text('Error');
                                      } else if (snapshot.hasData) {
                                        // When the future completes and has data, show the device name
                                        return Text(snapshot.data!);
                                      } else {
                                        // Handle any other case (e.g., no data)
                                        return Text('No device name');
                                      }
                                    },
                                  ),
                                  subtitle: Text(devicesNames[index]
                                      .serialNumberDevice
                                      .toString()),
                                  trailing: Row(
                                    mainAxisSize: MainAxisSize
                                        .min, // Ensures the Row takes the minimum space it needs
                                    children: <Widget>[
                                      IconButton(
                                        icon: const Icon(Icons.people_outline,
                                            color: Colors.red),
                                        onPressed: () {
                                          // transfer between users icon
                                          _transferDevice(index);
                                        },
                                      ),
                                      IconButton(
                                        icon: Icon(
                                          Icons.power_settings_new,
                                          color: devicePowerStates[index]
                                              ? Colors.green
                                              : Colors
                                                  .grey, // Change color based on state
                                        ),
                                        onPressed: () {
                                          _powerDevice(index);
                                        },
                                      ),
                                      IconButton(
                                        icon: const Icon(Icons.info,
                                            color: Colors.grey),
                                        onPressed: () {
                                          // Opens a widget that displays the device info
                                          _loadDeviceInfo(index);
                                        },
                                      ),
                                    ],
                                  ),
                                );
                              },
                            ),
                            errorFatal
                                ? Text(
                                    errorDeviceText,
                                    style: TextStyle(
                                      color: Colors.red.shade900,
                                    ),
                                  )
                                : const SizedBox(),
                          ],
                        ))))));
  }
}
