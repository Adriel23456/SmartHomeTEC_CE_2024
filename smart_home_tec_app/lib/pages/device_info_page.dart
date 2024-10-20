import 'package:flutter/material.dart';
import 'package:smart_home_tec_app/JSONmodels/certificate.dart';
import 'package:smart_home_tec_app/JSONmodels/clientes.dart';
import 'package:smart_home_tec_app/JSONmodels/device.dart';
import 'package:smart_home_tec_app/SQLite/database_service.dart';

class DeviceInfoPage extends StatefulWidget {
  final int serialNumer;
  final Clientes clientData;

  const DeviceInfoPage(
      {super.key, required this.clientData, required this.serialNumer});

  @override
  _DeviceInfoPageState createState() => _DeviceInfoPageState();
}

class _DeviceInfoPageState extends State<DeviceInfoPage> {
  Device? deviceToShow;
  Certificate? certificate;
  final DatabaseService db = DatabaseService();

  @override
  void initState() {
    super.initState();
    _getDeviceData();
  }

  // Fetches device and certificate data
  Future<void> _getDeviceData() async {
    var deviceData = await db.getDeviceWithCertificate(widget.serialNumer);
    setState(() {
      deviceToShow = deviceData['device'];
      certificate = deviceData['certificate'];
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.grey[100],
      body: Center(
        child: Padding(
          padding: const EdgeInsets.symmetric(vertical: 20),
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              // Avatar
              CircleAvatar(
                radius: 57,
                child: CircleAvatar(
                  radius: 55,
                  backgroundColor: Colors.blue,
                ),
              ),
              // Device Name
              ListTile(
                leading: Icon(Icons.devices, size: 30),
                title: Text("Device Name:"),
                subtitle: Text(deviceToShow?.name ?? "Loading..."),
              ),
              // Device Brand
              ListTile(
                leading: Icon(Icons.branding_watermark, size: 30),
                title: Text("Brand:"),
                subtitle: Text(deviceToShow?.brand ?? "Loading..."),
              ),
              // Device State
              ListTile(
                leading: Icon(Icons.power, size: 30),
                title: Text("State:"),
                subtitle: Text(deviceToShow?.state ?? "Loading..."),
              ),
              // Electrical Consumption
              ListTile(
                leading: Icon(Icons.electric_bolt, size: 30),
                title: Text("Electrical Consumption:"),
                subtitle:
                    Text(deviceToShow?.electricalConsumption ?? "Loading..."),
              ),
              // Price
              ListTile(
                leading: Icon(Icons.attach_money, size: 30),
                title: Text("Price:"),
                subtitle: Text(deviceToShow?.price.toString() ?? "Loading..."),
              ),
              // Warranty Information
              ListTile(
                leading: Icon(Icons.verified_user, size: 30),
                title: Text("Warranty Days:"),
                subtitle: Text(certificate?.warrantyEndDate != null
                    ? "${_calculateWarrantyDays(certificate!.warrantyStartDate, certificate!.warrantyEndDate)} days"
                    : "Loading..."),
              ),
              // Legal Number
              ListTile(
                leading: Icon(Icons.gavel, size: 30),
                title: Text("Legal Number:"),
                subtitle:
                    Text(deviceToShow?.legalNum.toString() ?? "Loading..."),
              ),
            ],
          ),
        ),
      ),
    );
  }

  // Calculate warranty days based on start and end date
  int _calculateWarrantyDays(String startDate, String endDate) {
    final start = DateTime.parse(startDate);
    final end = DateTime.parse(endDate);
    return end.difference(start).inDays;
  }
}
