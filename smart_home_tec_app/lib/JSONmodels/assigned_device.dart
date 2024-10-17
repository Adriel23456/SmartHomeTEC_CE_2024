import 'dart:convert';

AssignedDevice assignedDeviceFromJson(String str) => AssignedDevice.fromJson(json.decode(str));

String assignedDeviceToJson(AssignedDevice data) => json.encode(data.toJson());

class AssignedDevice {
    int? assignedId;
    final int serialNumberDevice;
    final String clientEmail;
    final String state;

    AssignedDevice({
        this.assignedId,
        required this.serialNumberDevice,
        required this.clientEmail,
        required this.state,
    });

    factory AssignedDevice.fromJson(Map<String, dynamic> json) => AssignedDevice(
        assignedId: json["assignedID"],
        serialNumberDevice: json["serialNumberDevice"],
        clientEmail: json["clientEmail"],
        state: json["state"],
    );

    Map<String, dynamic> toJson() => {
        "assignedID": assignedId,
        "serialNumberDevice": serialNumberDevice,
        "clientEmail": clientEmail,
        "state": state,
    };
}